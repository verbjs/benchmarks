#!/usr/bin/env bun

// Simple test to verify all servers can start and respond

import { spawn } from 'child_process';

const frameworks = [
  { name: 'Verb', port: 3001, file: 'src/servers/verb.ts' },
  { name: 'Express', port: 3002, file: 'src/servers/express.ts' },
  { name: 'Fastify', port: 3003, file: 'src/servers/fastify.ts' },
  { name: 'Hono', port: 3004, file: 'src/servers/hono.ts' }
];

async function testServer(framework: any): Promise<boolean> {
  return new Promise((resolve) => {
    console.log(`Testing ${framework.name}...`);
    
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
              console.log(`✅ ${framework.name} - working`);
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
  console.log('🧪 Testing all framework servers...\n');
  
  let allPassed = true;
  
  for (const framework of frameworks) {
    const passed = await testServer(framework);
    if (!passed) allPassed = false;
    
    // Wait between tests
    await new Promise(resolve => setTimeout(resolve, 1000));
  }
  
  console.log(allPassed ? '\n✅ All tests passed!' : '\n❌ Some tests failed!');
  process.exit(allPassed ? 0 : 1);
}

runTests();