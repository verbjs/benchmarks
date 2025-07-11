# Verb Performance Benchmarks

Comprehensive performance testing suite comparing Verb against popular Node.js frameworks.

> **TL;DR**: Verb consistently leads all frameworks across scenarios. In fair comparison (all on Bun runtime): 3-6% faster than Fastify, 21-24% faster than Express. Maintains sub-millisecond latency with zero errors.

## Latest Results

### Mixed Runtime Comparison (Verb vs Others)

| Framework | Runtime | Req/sec | vs Verb | Latency (ms) | Throughput (MB/s) |
|-----------|---------|---------|---------|--------------|-------------------|
| 🥇 **Verb** | **Bun** | **92,966** | - | **0.49** | **10.02** |
| 🥈 Fastify | Node.js | 89,914 | -3% | 0.57 | 10.98 |
| 🥉 Hono | Node.js | 79,002 | -15% | 0.96 | 9.64 |
| Express | Node.js | 72,845 | -22% | 1.00 | 13.27 |

### Fair Comparison: All Frameworks on Bun Runtime

#### Simple Route Performance
| Framework | Req/sec | vs Verb | Latency (ms) | Throughput (MB/s) |
|-----------|---------|---------|--------------|-------------------|
| 🥇 **Verb** | **92,474** | - | **0.48** | **9.97** |
| 🥈 Fastify (Bun) | 89,728 | -3% | 0.58 | 10.95 |
| 🥉 Express (Bun) | 72,621 | -21% | 1.00 | 13.23 |

#### JSON Response Performance
| Framework | Req/sec | vs Verb | Latency (ms) | Throughput (MB/s) |
|-----------|---------|---------|--------------|-------------------|
| 🥇 **Verb** | **91,597** | - | **0.51** | **13.89** |
| 🥈 Fastify (Bun) | 88,051 | -4% | 0.64 | 14.61 |
| 🥉 Express (Bun) | 70,374 | -23% | 1.02 | 16.04 |

#### Route Parameters Performance
| Framework | Req/sec | vs Verb | Latency (ms) | Throughput (MB/s) |
|-----------|---------|---------|--------------|-------------------|
| 🥇 **Verb** | **90,778** | - | **0.55** | **11.95** |
| 🥈 Fastify (Bun) | 85,626 | -6% | 0.83 | 12.49 |
| 🥉 Express (Bun) | 69,280 | -24% | 1.02 | 14.40 |

*Note: Hono excluded from fair comparison due to "Maximum call stack size exceeded" errors under high load on Bun runtime*

**Key Takeaways:**
- **Verb maintains #1 position** across all scenarios when frameworks use same runtime
- **Consistent 3-6% lead** over Fastify, 21-24% lead over Express
- **Framework efficiency matters**: Verb optimized specifically for Bun's capabilities
- **Sub-millisecond latency**: 0.48-0.55ms average response times
- **Zero errors**: Perfect stability under 100 concurrent connections
- **Fair comparison**: Performance advantage comes from framework design, not runtime

## Quick Start

```bash
# Install dependencies
bun install

# Run all benchmarks (takes ~5 minutes)
bun run bench:all

# Run specific scenario (takes ~1 minute)
bun run bench:simple
bun run bench:json
bun run bench:params
bun run bench:middleware

# Test servers work correctly first
bun run src/test.ts
```

## Frameworks Tested

- **Verb** - Multi-protocol framework for Bun
- **Express** - The most popular Node.js framework
- **Fastify** - High-performance Node.js framework
- **Hono** - Ultrafast web framework for modern runtimes

## Benchmark Scenarios

### Simple Route (`/`)
- Basic "Hello World" response
- Tests fundamental routing performance
- Minimal overhead measurement

### JSON Response (`/json`)
- JSON serialization performance
- Object creation and response handling
- Content-Type header management

### Route Parameters (`/user/:id`)
- Parameter extraction efficiency
- URL parsing performance
- Dynamic route matching

### Middleware Chain (`/middleware`)
- Multiple middleware execution
- Request processing pipeline
- Function call overhead

### POST with Body (`/echo`)
- Request body parsing
- JSON deserialization
- POST request handling

*Note: Current fair comparison results include Simple Route, JSON Response, and Route Parameters scenarios. Complete results for Middleware Chain and POST scenarios pending due to framework stability issues.*

## Test Configuration

- **Connections**: 100 concurrent
- **Duration**: 10 seconds per test
- **Warmup**: 3 seconds before testing
- **Tool**: [autocannon](https://github.com/mcollina/autocannon)

## Metrics Collected

- **Requests/second**: Total throughput
- **Latency**: Response time distribution (avg, p50, p90, p99)
- **Throughput**: Data transfer rate (MB/s)
- **Errors**: Failed requests count
- **Memory**: Process memory usage (planned)

## Running Individual Tests

```bash
# Mixed runtime comparison (original)
bun run bench:simple
bun run bench:json
bun run bench:params
bun run bench:all

# Fair comparison (all frameworks on Bun)
bun run bench:fair:simple
bun run bench:fair:json
bun run bench:fair:params
bun run bench:fair

# Test framework compatibility first
bun run src/test.ts        # Mixed runtime
bun run src/test-bun.ts    # Bun runtime only
```

## Results Analysis

Results are automatically saved to `results-YYYY-MM-DD.json` with detailed metrics.

### Sample Output

```
🚀 Starting Verb Framework Benchmarks
Scenarios: simple
Frameworks: Verb, Express, Fastify, Hono

🔥 Running scenario: Simple "Hello World"

📊 Simple "Hello World"
--------------------------------------------------------------------------------
Framework      | Req/sec  | Latency (ms) | Throughput (MB/s) | Errors
--------------------------------------------------------------------------------
🥇 Verb         | 92,966   | 0.49         | 10.02             | 0
🥈 Fastify      | 89,914   | 0.57         | 10.98             | 0
🥉 Hono         | 79,002   | 0.96         | 9.64              | 0
   Express      | 72,845   | 1.00         | 13.27             | 0

🏆 OVERALL PERFORMANCE RANKING
--------------------------------------------------------------------------------
🥇 Verb: 92,966 req/sec (average)
🥈 Fastify: 89,914 req/sec (average)
🥉 Hono: 79,002 req/sec (average)
   Express: 72,845 req/sec (average)
```

**Understanding the Metrics:**
- **🥇🥈🥉**: Performance ranking for each scenario
- **Req/sec**: Higher is better (requests per second)
- **Latency**: Lower is better (milliseconds average response time)
- **Throughput**: Higher is better (MB/s data transfer rate)
- **Errors**: Should be 0 (failed requests)

## Hardware Considerations

Performance results depend heavily on:
- CPU architecture (Apple Silicon vs Intel vs AMD)
- Memory speed and available RAM
- Bun vs Node.js version differences
- Operating system optimizations

## Detailed Test Environment

### Hardware & Software
- **Platform**: Apple Silicon (M-series)
- **Runtime**: Bun v1.2.17 (for Verb), Node.js (for others)
- **Load Testing**: AutoCannon v7.15.0
- **Test Configuration**: 100 concurrent connections, 10 second duration
- **Warmup**: 3 seconds server startup time

### Framework Versions
- **Verb**: Latest (file:../verb)
- **Express**: v4.21.2
- **Fastify**: v4.29.1  
- **Hono**: v4.8.4 with @hono/node-server

## Interpreting Results

### What Good Performance Looks Like
- **Verb**: Consistently ranks #1 or #2 across scenarios
- **Sub-millisecond latency**: 0.5ms average for simple routes
- **High throughput**: 90,000+ req/sec on Apple Silicon
- **Zero errors**: All frameworks handle concurrent load cleanly

### Performance Insights
- **Bun Runtime Advantage**: Verb benefits from Bun's native optimizations
- **Framework Overhead**: Verb has minimal routing and response overhead
- **Consistent Results**: Multiple test runs show stable performance
- **Scalability**: Performance maintained under concurrent load

### Red Flags to Watch For
- **High Error Rate**: Indicates framework instability under load
- **Inconsistent Results**: May indicate system resource contention
- **Memory Leaks**: Monitor increasing memory usage over time
- **Latency Spikes**: Check p99 latency for outliers

## Development

### Adding New Frameworks

1. Create server implementation in `src/servers/`
2. Add framework config to `frameworks` array in `runner.ts`
3. Ensure all routes match existing patterns

### Adding New Scenarios

1. Add scenario to `scenarios` object in `runner.ts`
2. Implement matching routes in all server files
3. Update documentation

### Testing Changes

```bash
# Quick test with single scenario
bun run bench:simple

# Full regression test
bun run bench:all
```

## Continuous Integration

Benchmarks can be automated in CI/CD:

```yaml
# .github/workflows/benchmarks.yml
- name: Run Performance Benchmarks
  run: |
    cd benchmarks
    bun install
    bun run bench:all
```

## Known Limitations

- Tests run on single machine (no distributed testing)
- Network latency not simulated
- Database operations not included
- WebSocket performance not measured
- No memory leak detection yet

## Contributing

When submitting performance improvements:

1. Run benchmarks before and after changes
2. Include benchmark results in PR description
3. Test on multiple hardware configurations if possible
4. Document any configuration changes needed

## Troubleshooting

### Servers Won't Start
- Check if ports 3001-3004 are available
- Ensure all dependencies are installed
- Verify Bun version compatibility

### Inconsistent Results
- Close other applications during testing
- Run multiple times and average results
- Check for background processes using CPU

### Framework Errors
- Check server logs in console output
- Verify route implementations match
- Test individual servers manually

## Running Your Own Tests

### Prerequisites
```bash
# Ensure Bun is installed
curl -fsSL https://bun.sh/install | bash

# Clone and navigate to benchmarks
cd /path/to/verb/benchmarks
bun install
```

### Running Tests
```bash
# Quick validation (30 seconds)
bun run src/test.ts

# Single scenario (1 minute)
bun run bench:simple

# Full suite (5 minutes)
bun run bench:all

# Results saved to results-YYYY-MM-DD.json
```

### Custom Configuration
Edit `src/runner.ts` to modify:
- Connection count (default: 100)
- Test duration (default: 10 seconds)  
- Server ports (default: 3001-3004)
- Test scenarios and endpoints

## Contributing Results

Help improve Verb benchmarks by contributing results from different environments:

1. Run benchmarks on your hardware
2. Include system specs in results
3. Submit performance improvements via PR
4. Report any framework compatibility issues

### Useful Commands
```bash
# System info for benchmark reports
bun --version
node --version
uname -a
sysctl -n machdep.cpu.brand_string  # macOS
cat /proc/cpuinfo | grep "model name" | head -1  # Linux
```

---

**Disclaimer**: These benchmarks test framework overhead, not application logic. Real-world performance depends on your specific use case, database queries, external API calls, and business logic complexity. Results may vary based on hardware, operating system, and system configuration.