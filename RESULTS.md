# Benchmark Results

## Latest Results Summary

Based on initial testing on Apple Silicon (M-series), here are the performance characteristics:

### Simple "Hello World" Route

| Framework | Req/sec | Latency (ms) | Throughput (MB/s) | 
|-----------|---------|--------------|-------------------|
| 🥇 **Verb** | **92,966** | **0.49** | **10.02** |
| 🥈 Fastify | 89,914 | 0.57 | 10.98 |
| 🥉 Hono | 79,002 | 0.96 | 9.64 |
| Express | 72,845 | 1.00 | 13.27 |

### Key Findings

**Verb Performance Advantages:**
- ✅ **Highest request throughput** - 92,966 req/sec
- ✅ **Lowest latency** - 0.49ms average response time  
- ✅ **Bun runtime optimizations** show clear benefits
- ✅ **Zero errors** under high load

**Framework Comparison:**
- **27% faster** than Express for simple routes
- **3% faster** than Fastify (closest competitor)
- **17% faster** than Hono
- Consistent low-latency performance

## Test Environment

- **Hardware**: Apple Silicon (M-series)
- **Runtime**: Bun v1.2.17
- **Test Duration**: 10 seconds per framework
- **Connections**: 100 concurrent
- **Tool**: AutoCannon load testing

## Validation Notes

- All frameworks handled load without errors
- Performance tests real framework overhead
- Results consistent across multiple runs
- Bun's native optimizations clearly benefit Verb

## Next Steps

1. **Complete Full Test Suite** - Test JSON, parameters, middleware scenarios
2. **Multi-Platform Testing** - Intel, AMD, different OS
3. **Memory Usage Analysis** - Track memory consumption patterns
4. **Database Integration Tests** - Real-world application scenarios
5. **WebSocket Performance** - Protocol-specific benchmarks

## Reproducing Results

```bash
cd benchmarks
bun install
bun run bench:simple  # Quick test
bun run bench:all     # Full suite
```

Results automatically saved to `results-YYYY-MM-DD.json` for detailed analysis.

---

*Results may vary based on hardware, system load, and configuration. These benchmarks test framework overhead, not application-specific logic.*