# Benchmarks Documentation

Performance testing suite comparing Verb against other frameworks.

## Quick Start

```bash
cd benchmarks
bun install
bun run bench:all
```

## Documentation

- [Running Benchmarks](./running.md) - How to run tests
- [Methodology](./methodology.md) - Testing methodology
- [Adding Frameworks](./adding-frameworks.md) - Add new frameworks
- [Results Analysis](./results.md) - Understanding results

## Latest Results

### Fair Comparison (All on Bun)

| Framework | Req/sec | Latency | vs Verb |
|-----------|---------|---------|---------|
| **Verb** | 92,474 | 0.48ms | - |
| Fastify | 89,728 | 0.58ms | -3% |
| Express | 72,621 | 1.00ms | -21% |

## Benchmark Scenarios

| Scenario | Description |
|----------|-------------|
| Simple Route | Basic "Hello World" |
| JSON Response | JSON serialization |
| Route Params | Parameter extraction |
| Middleware | Multiple middleware |
| POST Body | Request body parsing |

## Available Commands

```bash
# All benchmarks
bun run bench:all

# Specific scenarios
bun run bench:simple
bun run bench:json
bun run bench:params
bun run bench:middleware

# Fair comparison (all on Bun)
bun run bench:fair
bun run bench:fair:simple
bun run bench:fair:json
bun run bench:fair:params

# Test servers first
bun run src/test.ts
```

## Test Configuration

- **Connections**: 100 concurrent
- **Duration**: 10 seconds
- **Warmup**: 3 seconds
- **Tool**: autocannon

## Frameworks Tested

- **Verb** - Multi-protocol framework for Bun
- **Express** - Popular Node.js framework
- **Fastify** - High-performance framework
- **Hono** - Ultrafast web framework
