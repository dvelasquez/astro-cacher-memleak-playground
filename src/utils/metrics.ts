import { promises as fs } from "node:fs";
import * as path from "node:path";
import * as os from "node:os";
import { monitorEventLoopDelay } from "node:perf_hooks";
import * as v8 from "node:v8";

interface MetricsSamplerOptions {
  filePath: string;
  intervalMs: number;
  maxFileBytes: number;
  cgroupBasePath: string;
}

interface CpuStatSnapshot {
  usageUsec: number | null;
  throttledUsec: number | null;
  timestampMs: number;
}

const defaultOptions: MetricsSamplerOptions = {
  filePath: process.env.METRICS_FILE || "/app/metrics/app-metrics.ndjson",
  intervalMs: Number(process.env.METRICS_INTERVAL_MS || 1000),
  maxFileBytes: Number(process.env.METRICS_MAX_BYTES || 50 * 1024 * 1024),
  cgroupBasePath: process.env.METRICS_CGROUP_BASE || "/sys/fs/cgroup",
};

const GLOBAL_FLAG_KEY = Symbol.for("astro-cacher-memleak-playground.metrics.started");

/**
 * Start a lightweight NDJSON metrics sampler that logs process and cgroup stats at a fixed interval.
 * The sampler is idempotent and will start only once per process.
 */
export function startMetricsSampler(options: Partial<MetricsSamplerOptions> = {}): void {
  const merged: MetricsSamplerOptions = { ...defaultOptions, ...options };

  // Avoid duplicate initialization
  const globalAny = globalThis as any;
  if (globalAny[GLOBAL_FLAG_KEY]) {
    return;
  }
  globalAny[GLOBAL_FLAG_KEY] = true;

  // Ensure directory exists (best-effort)
  void ensureDirectory(path.dirname(merged.filePath));

  const loop = monitorEventLoopDelay({ resolution: 20 });
  loop.enable();

  let prevCpu: CpuStatSnapshot | null = null;
  let writeCountSinceLastStatCheck = 0;

  const timer = setInterval(async () => {
    try {
      const ts = new Date().toISOString();

      const procMem = process.memoryUsage();
      const v8Stats = v8.getHeapStatistics();

      // Event loop delay in ms
      const evloopP50 = nsToMs(loop.percentile(50));
      const evloopP95 = nsToMs(loop.percentile(95));
      const evloopMax = nsToMs(loop.max);
      loop.reset();

      // Cgroup v2 stats
      const cgBase = merged.cgroupBasePath;

      const [memCurrentStr, memMaxStr, pidsCurrentStr, pidsMaxStr, cpuStatStr, cpuMaxStr] = await Promise.all([
        readFirstLineSafe(path.join(cgBase, "memory.current")),
        readFirstLineSafe(path.join(cgBase, "memory.max")),
        readFirstLineSafe(path.join(cgBase, "pids.current")),
        readFirstLineSafe(path.join(cgBase, "pids.max")),
        readFileSafe(path.join(cgBase, "cpu.stat")),
        readFirstLineSafe(path.join(cgBase, "cpu.max")),
      ]);

      const memCurrent = parseNumber(memCurrentStr);
      const memMax = parseMemoryMax(memMaxStr);
      const pidsCurrent = parseNumber(pidsCurrentStr);
      const pidsMax = parsePidsMax(pidsMaxStr);
      const cpu = parseCpuStat(cpuStatStr);
      const cpuMax = parseCpuMax(cpuMaxStr);

      const nowMs = Date.now();
      const cpuPct = computeCpuPercent(prevCpu, { usageUsec: cpu.usageUsec, throttledUsec: cpu.throttledUsec, timestampMs: nowMs }, cpuMax);
      prevCpu = { usageUsec: cpu.usageUsec, throttledUsec: cpu.throttledUsec, timestampMs: nowMs };

      const record = {
        ts,
        container: {
          mem_current: memCurrent,
          mem_max: memMax,
          cpu_pct: cpuPct,
          cpu_usage_usec: cpu.usageUsec,
          cpu_throttled_usec: cpu.throttledUsec,
          cpu_effective_cores: cpuMax.effectiveCores,
          pids_current: pidsCurrent,
          pids_max: pidsMax,
        },
        process: {
          rss: procMem.rss,
          heap_used: procMem.heapUsed,
          heap_total: procMem.heapTotal,
          external: procMem.external,
          array_buffers: (procMem as any).arrayBuffers ?? undefined,
          heap_limit: v8Stats.heap_size_limit,
          evloop_ms_p50: evloopP50,
          evloop_ms_p95: evloopP95,
          evloop_ms_max: evloopMax,
        },
      };

      await fs.appendFile(merged.filePath, JSON.stringify(record) + "\n", "utf8");

      // Very simple log rotation: check periodically and roll if too big
      writeCountSinceLastStatCheck++;
      if (writeCountSinceLastStatCheck >= 15) {
        writeCountSinceLastStatCheck = 0;
        await rotateIfTooLarge(merged.filePath, merged.maxFileBytes);
      }
    } catch {
      // Intentionally ignore errors to avoid impacting the app
    }
  }, merged.intervalMs);

  // Do not keep the event loop alive solely for metrics
  if (typeof timer.unref === "function") {
    timer.unref();
  }
}

async function ensureDirectory(dir: string): Promise<void> {
  try {
    await fs.mkdir(dir, { recursive: true });
  } catch {
    // best-effort
  }
}

function nsToMs(value: number): number {
  if (!Number.isFinite(value)) {
    return 0;
  }
  return Math.round((value / 1e6) * 100) / 100;
}

async function readFirstLineSafe(file: string): Promise<string | null> {
  try {
    const data = await fs.readFile(file, "utf8");
    const idx = data.indexOf("\n");
    return (idx === -1 ? data : data.slice(0, idx)).trim();
  } catch {
    return null;
  }
}

async function readFileSafe(file: string): Promise<string | null> {
  try {
    return await fs.readFile(file, "utf8");
  } catch {
    return null;
  }
}

function parseNumber(text: string | null): number | null {
  if (text == null) {
    return null;
  }
  const n = Number(text);
  return Number.isFinite(n) ? n : null;
}

function parseMemoryMax(text: string | null): number | null {
  if (!text) {
    return null;
  }
  if (text === "max") {
    return null;
  }
  return parseNumber(text);
}

function parsePidsMax(text: string | null): number | null {
  if (!text) {
    return null;
  }
  if (text === "max") {
    return null;
  }
  return parseNumber(text);
}

function parseCpuStat(content: string | null): { usageUsec: number | null; throttledUsec: number | null } {
  if (!content) {
    return { usageUsec: null, throttledUsec: null };
  }
  let usageUsec: number | null = null;
  let throttledUsec: number | null = null;
  const lines = content.split(/\r?\n/);
  for (const line of lines) {
    // Example: usage_usec 1234567
    const parts = line.trim().split(/\s+/);
    if (parts.length !== 2) {
      continue;
    }
    if (parts[0] === "usage_usec") {
      usageUsec = parseNumber(parts[1]);
    } else if (parts[0] === "throttled_usec") {
      throttledUsec = parseNumber(parts[1]);
    }
  }
  return { usageUsec, throttledUsec };
}

function parseCpuMax(text: string | null): { quota: number | null; period: number | null; effectiveCores: number } {
  if (!text) {
    return { quota: null, period: null, effectiveCores: os.cpus().length };
  }
  const parts = text.trim().split(/\s+/);
  if (parts[0] === "max") {
    return { quota: null, period: null, effectiveCores: os.cpus().length };
  }
  const quota = Number(parts[0]);
  const period = Number(parts[1] || 100000);
  if (!Number.isFinite(quota) || !Number.isFinite(period) || period <= 0) {
    return { quota: null, period: null, effectiveCores: os.cpus().length };
  }
  const effectiveCores = Math.max(1, Math.floor(quota / period));
  return { quota, period, effectiveCores };
}

function computeCpuPercent(prev: CpuStatSnapshot | null, next: CpuStatSnapshot, cpuMax: { effectiveCores: number }): number | null {
  if (!prev || next.usageUsec == null || prev.usageUsec == null) {
    return null;
  }
  const deltaUsec = next.usageUsec - prev.usageUsec;
  const deltaMs = next.timestampMs - prev.timestampMs;
  if (deltaUsec <= 0 || deltaMs <= 0) {
    return 0;
  }
  const denom = (deltaMs / 1000) * cpuMax.effectiveCores * 1e6; // elapsed_sec * cores * 1e6
  const pct = (deltaUsec / denom) * 100;
  return Math.max(0, Math.min(100 * cpuMax.effectiveCores, Math.round(pct * 10) / 10));
}

async function rotateIfTooLarge(file: string, maxBytes: number): Promise<void> {
  try {
    const st = await fs.stat(file);
    if (st.size > maxBytes) {
      const rotated = file + ".1";
      // Best-effort: replace rotated file
      try {
        await fs.unlink(rotated);
      } catch {}
      try {
        await fs.rename(file, rotated);
      } catch {
        // If rename fails, truncate instead
        await fs.truncate(file, 0);
        return;
      }
    }
  } catch {
    // Ignore if file doesn't exist yet
  }
}

// Auto-start if env flag is set
if (process.env.METRICS_SAMPLER_ENABLED === "1" || process.env.METRICS_SAMPLER_ENABLED === "true") {
  startMetricsSampler();
}


