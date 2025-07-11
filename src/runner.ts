#!/usr/bin/env bun

import { spawn } from 'child_process';
import autocannon from 'autocannon';

interface BenchmarkConfig {
  name: string;
  port: number;
  serverFile: string;
}

interface BenchmarkScenario {
  name: string;
  path: string;
  method?: string;
  body?: object;
  headers?: Record<string, string>;
}

const frameworks: BenchmarkConfig[] = [
  { name: 'Verb', port: 3001, serverFile: 'src/servers/verb.ts' },
  { name: 'Express (Node)', port: 3002, serverFile: 'src/servers/express.ts' },
  { name: 'Fastify (Node)', port: 3003, serverFile: 'src/servers/fastify.ts' },
  { name: 'Hono (Node)', port: 3004, serverFile: 'src/servers/hono.ts' },
  { name: 'Express (Bun)', port: 3005, serverFile: 'src/servers/express-bun.ts' },
  { name: 'Fastify (Bun)', port: 3006, serverFile: 'src/servers/fastify-bun.ts' },
  { name: 'Hono (Bun)', port: 3007, serverFile: 'src/servers/hono-bun.ts' }
];

const scenarios: Record<string, BenchmarkScenario> = {
  simple: {
    name: 'Simple "Hello World"',
    path: '/'
  },
  json: {
    name: 'JSON Response',
    path: '/json'
  },
  params: {
    name: 'Route Parameters',
    path: '/user/123'
  },
  middleware: {
    name: 'Middleware Chain',
    path: '/middleware'
  },
  echo: {
    name: 'POST with Body',
    path: '/echo',
    method: 'POST',
    body: { test: 'data', timestamp: Date.now() },
    headers: { 'Content-Type': 'application/json' }
  }
};

class BenchmarkRunner {
  private servers: Map<string, any> = new Map();
  private results: Map<string, any> = new Map();

  async startServer(config: BenchmarkConfig): Promise<void> {
    return new Promise((resolve, reject) => {
      console.log(`Starting ${config.name} server on port ${config.port}...`);
      
      const server = spawn('bun', [config.serverFile], {
        env: { ...process.env, PORT: config.port.toString() },
        stdio: ['pipe', 'pipe', 'pipe']
      });

      server.stdout?.on('data', (data) => {
        const output = data.toString();
        if (output.includes(`running on port ${config.port}`)) {
          console.log(`✅ ${config.name} server started`);
          resolve();
        }
      });

      server.stderr?.on('data', (data) => {
        console.error(`${config.name} stderr:`, data.toString());
      });

      server.on('error', (error) => {
        console.error(`Failed to start ${config.name}:`, error);
        reject(error);
      });

      this.servers.set(config.name, server);

      // Give server time to start
      setTimeout(resolve, 2000);
    });
  }

  async stopAllServers(): Promise<void> {
    console.log('\\nStopping all servers...');
    for (const [name, server] of this.servers) {
      console.log(`Stopping ${name}...`);
      server.kill('SIGINT');
    }
    this.servers.clear();
  }

  async runBenchmark(config: BenchmarkConfig, scenario: BenchmarkScenario): Promise<any> {
    const url = `http://localhost:${config.port}${scenario.path}`;
    
    console.log(`\\nBenchmarking ${config.name} - ${scenario.name}`);
    console.log(`URL: ${url}`);

    const options: any = {
      url,
      connections: 100,
      duration: 10,
      headers: scenario.headers || {}
    };

    if (scenario.method === 'POST' && scenario.body) {
      options.method = 'POST';
      options.body = JSON.stringify(scenario.body);
    }

    try {
      const result = await autocannon(options);
      
      // Clean up the result for easier processing
      const summary = {
        framework: config.name,
        scenario: scenario.name,
        requests: {
          total: result.requests.total,
          average: Math.round(result.requests.average),
          mean: Math.round(result.requests.mean),
          stddev: Math.round(result.requests.stddev),
          min: result.requests.min,
          max: result.requests.max
        },
        latency: {
          average: result.latency.average,
          mean: result.latency.mean,
          stddev: result.latency.stddev,
          min: result.latency.min,
          max: result.latency.max,
          p50: result.latency.p50,
          p90: result.latency.p90,
          p99: result.latency.p99
        },
        throughput: {
          average: Math.round(result.throughput.average),
          mean: Math.round(result.throughput.mean),
          stddev: Math.round(result.throughput.stddev),
          min: result.throughput.min,
          max: result.throughput.max
        },
        errors: result.errors,
        timeouts: result.timeouts,
        duration: result.duration
      };

      return summary;
    } catch (error) {
      console.error(`❌ Benchmark failed for ${config.name}:`, error);
      return null;
    }
  }

  formatResults(results: any[]): void {
    console.log('\\n' + '='.repeat(120));
    console.log('BENCHMARK RESULTS');
    console.log('='.repeat(120));

    // Group results by scenario
    const byScenario = results.reduce((acc, result) => {
      if (!acc[result.scenario]) acc[result.scenario] = [];
      acc[result.scenario].push(result);
      return acc;
    }, {});

    Object.entries(byScenario).forEach(([scenario, scenarioResults]: [string, any[]]) => {
      console.log(`\\n📊 ${scenario}`);
      console.log('-'.repeat(80));
      
      // Sort by requests per second (descending)
      scenarioResults.sort((a, b) => b.requests.mean - a.requests.mean);
      
      console.log('Framework      | Req/sec  | Latency (ms) | Throughput (MB/s) | Errors');
      console.log('-'.repeat(80));
      
      scenarioResults.forEach((result, index) => {
        const rank = index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : '  ';
        const reqSec = result.requests.mean.toLocaleString().padEnd(8);
        const latency = `${result.latency.mean.toFixed(2)}`.padEnd(12);
        const throughput = `${(result.throughput.mean / 1024 / 1024).toFixed(2)}`.padEnd(17);
        const errors = result.errors || 0;
        
        console.log(`${rank} ${result.framework.padEnd(12)} | ${reqSec} | ${latency} | ${throughput} | ${errors}`);
      });
    });

    // Overall performance summary
    console.log('\\n🏆 OVERALL PERFORMANCE RANKING');
    console.log('-'.repeat(80));
    
    const overallScores = frameworks.map(framework => {
      const frameworkResults = results.filter(r => r.framework === framework.name);
      const avgScore = frameworkResults.reduce((sum, r) => sum + r.requests.mean, 0) / frameworkResults.length;
      return { name: framework.name, score: avgScore };
    }).sort((a, b) => b.score - a.score);

    overallScores.forEach((framework, index) => {
      const rank = index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : '  ';
      const score = Math.round(framework.score).toLocaleString();
      console.log(`${rank} ${framework.name}: ${score} req/sec (average)`);
    });
  }

  async run(scenarioFilter?: string): Promise<void> {
    const scenariosToRun = scenarioFilter && scenarioFilter !== 'all' 
      ? { [scenarioFilter]: scenarios[scenarioFilter] }
      : scenarios;

    if (!scenariosToRun || Object.keys(scenariosToRun).length === 0) {
      console.error(`❌ Unknown scenario: ${scenarioFilter}`);
      console.log('Available scenarios:', Object.keys(scenarios).join(', '));
      process.exit(1);
    }

    console.log('🚀 Starting Verb Framework Benchmarks');
    console.log(`Scenarios: ${Object.keys(scenariosToRun).join(', ')}`);
    console.log(`Frameworks: ${frameworks.map(f => f.name).join(', ')}`);

    try {
      // Start all servers
      for (const framework of frameworks) {
        await this.startServer(framework);
      }

      // Wait for servers to be ready
      await new Promise(resolve => setTimeout(resolve, 3000));

      const allResults: any[] = [];

      // Run benchmarks for each scenario
      for (const [scenarioKey, scenario] of Object.entries(scenariosToRun)) {
        console.log(`\\n🔥 Running scenario: ${scenario.name}`);
        
        for (const framework of frameworks) {
          const result = await this.runBenchmark(framework, scenario);
          if (result) {
            allResults.push(result);
          }
          
          // Brief pause between framework tests
          await new Promise(resolve => setTimeout(resolve, 1000));
        }
      }

      // Display results
      this.formatResults(allResults);

      // Save detailed results
      await Bun.write(
        `results-${new Date().toISOString().split('T')[0]}.json`,
        JSON.stringify(allResults, null, 2)
      );

    } finally {
      await this.stopAllServers();
    }
  }
}

// Main execution
const runner = new BenchmarkRunner();
const scenario = process.argv[2];

runner.run(scenario).catch(error => {
  console.error('❌ Benchmark failed:', error);
  process.exit(1);
});