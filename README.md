# Astro Cacher Memory Leak Playground

Purpose-built Astro app to reproduce and analyze a suspected memory leak when combining the `cacheable` library with the current `CacherComponent` implementation.

The goal is to run under constrained resources (container memory/CPU) while driving traffic against cached routes, and then observe memory behavior, GC activity, and performance.

## Why this exists

- The project renders intentionally heavy UI trees and wraps them with a HTML-fragment cache.
- It uses `cacheable` for server-side caching and `@cacheable/utils` to hash props into cache keys.
- Under load, memory may grow unexpectedly and not return to a steady state, suggesting a leak or excessive retention.

## Key files

- `src/utils/CacherComponent.astro` — wraps slotted content, builds a cache key from a `key` and either `props` (hashed) or an explicit `hash`, stores rendered HTML for a TTL.
- `src/utils/cache.ts` — initializes a global `Cacheable` instance with a default TTL.
- `src/pages/cacher/only-astro.astro` — heavy Astro component wrapped in the cacher (short TTL, large data).
- `src/pages/cacher/only-react.astro` — heavy React component wrapped in the cacher (short TTL, large data).
- `src/pages/health.ts` — simple health endpoint used by Docker healthcheck.

## Routes to test

- `http://localhost:4321/cacher/only-astro`
- `http://localhost:4321/cacher/only-react`
- `http://localhost:4321/` (landing page with links)
- `http://localhost:4321/health`

## What makes it heavy

- Complex component tree with lots of nodes, gradients, grids, and mapped children.
- Synthetic data created via `createFixture` (see `src/data/fixtureType.ts`), defaulted to large payloads in the cached routes (e.g., 200 KB).
- Short TTL (e.g., `2s`) to exercise cache churn under load.

## Quick start (local)

```bash
npm install
npm run dev
# Visit http://localhost:4321
```

## Run in a container (production build)

Build the multi-stage image and run with resource limits to amplify memory issues.

```bash
# Build
docker build -t astro-cacher-leak:latest .

# Run with strict limits and Node diagnostics
docker run \
  --rm \
  -p 4321:4321 \
  -m 256m --cpus=1 \
  -e NODE_ENV=production \
  -e PORT=4321 \
  -e NODE_OPTIONS="--max-old-space-size=192 --heapsnapshot-near-heap-limit=3 --trace-gc --trace_gc_verbose --report-on-fatalerror" \
  --name astro-cacher-leak \
  astro-cacher-leak:latest

# Alternatively, use docker-compose (then add limits on the CLI)
docker compose up --build astro-app
```

Notes:

- The `Dockerfile` builds with Node 22 and serves `dist/server/entry.mjs` on port 4321.
- You can also use `docker stats` to observe memory in real time.

## Driving load

Use any HTTP load tool; examples below use `hey` (install from your package manager) and `ab` as a fallback.

```bash
# Only-Astro cached route (spiky churn due to low TTL)
hey -z 2m -c 50 http://localhost:4321/cacher/only-astro

# Only-React cached route
hey -z 2m -c 50 http://localhost:4321/cacher/only-react

# ApacheBench alternative
ab -n 20000 -c 50 http://localhost:4321/cacher/only-astro/
```

## What to observe

- Container RSS and Node heap growth (does it stabilize?).
- GC traces emitted by `--trace-gc` in logs.
- Response latency and any 5xx spikes.
- Cache hit/miss logs from `CacherComponent.astro` (`console.debug({ key, cached })`).

Helpful commands:

```bash
# Live container resource usage
docker stats astro-cacher-leak

# Stream logs with GC traces and cache hit/miss
docker logs -f astro-cacher-leak

# One-shot health check
curl -s http://localhost:4321/health | jq
```

## Tuning the repro

- Increase payload: edit `createFixture({ sizeInKB: 200 })` in `src/pages/cacher/*`.
- Decrease TTL: `ttl="2s"` in `Cacher` usage to force re-renders and churn.
- Raise concurrency in the load tool.
- Try both routes to compare Astro vs React rendering under the same caching layer.

## Suspected area

The interaction between:

- `cacheable` retaining values and metadata under churn, and
- `CacherComponent.astro` caching large HTML strings and key hashes

may lead to memory retention that does not return to baseline after GC. This repo provides an isolated harness to demonstrate and measure that behavior.

## Project scripts

```bash
npm run dev       # dev server at localhost:4321
npm run build     # build to ./dist
npm run preview   # preview the production build locally
```

## Environment

- Node: 22 (container), configurable locally
- Port: 4321
- Health: `/health`

## Troubleshooting

- Port busy: change host port mapping (`-p 3000:4321`).
- Not seeing memory growth: increase payload size, raise concurrency, lower TTL, or reduce memory limit.
- Crashes under OOM: keep logs; Node will attempt near-heap-limit snapshots when enabled.

