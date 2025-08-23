import autocannon from 'autocannon';

// Shared configuration for both Astro and React tests
const sharedConfig = {
  url: 'http://localhost:4321',
  connections: 10,
  duration: 30,
  pipelining: 1,
  timeout: 10,
  headers: {
    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
    'Accept-Encoding': 'gzip, deflate',
    'Connection': 'keep-alive'
  }
};

/**
 * Test the Astro cacher route with autocannon
 */
async function testAstroCacher() {
  console.log('🚀 Starting Astro Cacher load test...');
  
  const result = await autocannon({
    ...sharedConfig,
    url: `${sharedConfig.url}/cacher/only-astro`
  });
  
  console.log('📊 Astro Cacher Test Results:');
  console.log(`  Requests/sec: ${result.requests.average}`);
  console.log(`  Latency (avg): ${result.latency.average}ms`);
  console.log(`  Latency (p99): ${result.latency.p99}ms`);
  console.log(`  Total requests: ${result.requests.total}`);
  console.log(`  Total errors: ${result.errors}`);
  console.log(`  Timeout errors: ${result.timeouts}`);
  
  return result;
}

/**
 * Test the React cacher route with autocannon
 */
async function testReactCacher() {
  console.log('⚛️  Starting React Cacher load test...');
  
  const result = await autocannon({
    ...sharedConfig,
    url: `${sharedConfig.url}/cacher/only-react`
  });
  
  console.log('📊 React Cacher Test Results:');
  console.log(`  Requests/sec: ${result.requests.average}`);
  console.log(`  Latency (avg): ${result.latency.average}ms`);
  console.log(`  Latency (p99): ${result.latency.p99}ms`);
  console.log(`  Total requests: ${result.requests.total}`);
  console.log(`  Total errors: ${result.errors}`);
  console.log(`  Timeout errors: ${result.timeouts}`);
  
  return result;
}

// CLI argument parsing
if (import.meta.url === `file://${process.argv[1]}`) {
  const command = process.argv[2];
  
  switch (command) {
    case 'astro':
      testAstroCacher().catch(error => {
        console.error('❌ Astro test failed:', error);
        process.exit(1);
      });
      break;
      
    case 'react':
      testReactCacher().catch(error => {
        console.error('❌ React test failed:', error);
        process.exit(1);
      });
      break;
      
    default:
      console.log('Usage:');
      console.log('  npx tsx scripts/test-load.ts astro   # Test Astro cacher');
      console.log('  npx tsx scripts/test-load.ts react  # Test React cacher');
      process.exit(1);
  }
}

export { testAstroCacher, testReactCacher, sharedConfig };
