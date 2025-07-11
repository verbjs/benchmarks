#!/usr/bin/env bun

// Test all frameworks running on Bun runtime

import { spawn } from 'child_process';

const frameworks = [
  { name: 'Verb', port: 3001, file: 'src/servers/verb.ts' },
  { name: 'Express (Bun)', port: 3005, file: 'src/servers/express-bun.ts' },
  { name: 'Fastify (Bun)', port: 3006, file: 'src/servers/fastify-bun.ts' },
  { name: 'Hono (Bun)', port: 3007, file: 'src/servers/hono-bun.ts' }
];

async function testServer(framework: any): Promise<boolean> {
  return new Promise((resolve) => {
    console.log(`Testing ${framework.name} on Bun...`);
    
    const server = spawn('bun', [framework.file], {
      env: { ...process.env, PORT: framework.port.toString() },
      stdio: ['pipe', 'pipe', 'pipe']
    });

    let resolved = false;

    const timeout = setTimeout(() => {
      if (!resolved) {
        server.kill();
        console.log(`❌ ${framework.name} - timeout`);
        resolve(false);
        resolved = true;
      }
    }, 5000);

    server.stdout?.on('data', (data) => {
      if (data.toString().includes(`running on port ${framework.port}`) && !resolved) {
        clearTimeout(timeout);
        
        // Test HTTP request
        fetch(`http://localhost:${framework.port}/`)
          .then(res => res.text())
          .then(text => {
            if (text.includes('Hello World')) {
              console.log(`✅ ${framework.name} - working on Bun`);
              resolve(true);
            } else {
              console.log(`❌ ${framework.name} - wrong response: ${text}`);
              resolve(false);
            }
          })
          .catch(err => {
            console.log(`❌ ${framework.name} - request failed: ${err.message}`);
            resolve(false);
          })
          .finally(() => {
            server.kill();
            resolved = true;
          });
      }
    });

    server.stderr?.on('data', (data) => {
      const error = data.toString();
      if (!error.includes('ExperimentalWarning')) {
        console.log(`${framework.name} stderr:`, error);
      }
    });

    server.on('error', (error) => {
      if (!resolved) {
        console.log(`❌ ${framework.name} - spawn error: ${error.message}`);
        clearTimeout(timeout);
        resolve(false);
        resolved = true;
      }
    });
  });
}

async function runTests() {
  console.log('🧪 Testing all frameworks on Bun runtime...\n');
  
  let allPassed = true;
  
  for (const framework of frameworks) {
    const passed = await testServer(framework);
    if (!passed) allPassed = false;
    
    // Wait between tests
    await new Promise(resolve => setTimeout(resolve, 1000));
  }
  
  console.log(allPassed ? '\n✅ All Bun tests passed!' : '\n❌ Some Bun tests failed!');
  
  if (allPassed) {
    console.log('\n🚀 Ready to run fair comparison benchmarks:');
    console.log('   bun run bench:fair:simple');
    console.log('   bun run bench:fair');
  }
  
  process.exit(allPassed ? 0 : 1);
}

runTests();