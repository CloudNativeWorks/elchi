export const SERVER_WORKER_MISS_METRICS_DESCRIPTION = `**⚠️ Server Worker Watchdog Miss**

Tracks instances where one or more worker threads fail to process events within expected time frames. This includes both moderate and severe delays:

- \`miss\`: Regular watchdog misses — the thread was delayed but eventually responsive.
- \`mega_miss\`: Severe delays — the thread was blocked or unresponsive for a significant duration (e.g., over 2 seconds).

**What to watch for:**
- Increasing \`miss\` counts may point to scheduling contention, high CPU load, or resource exhaustion.
- \`mega_miss\` events indicate thread starvation or synchronous/blocking operations within the worker thread.
- High values can result in delayed downstream processing, connection stalls, or health check failures.

**Tips:**
- Monitor CPU/memory usage to detect overload conditions.
- Check filter chains and extensions for any long-running synchronous tasks.
- Use \`concurrency\` settings wisely — too few workers can overload threads under high traffic.`;

export const MAIN_THREAD_MISS_METRICS_DESCRIPTION = `**⚠️ Main Thread Watchdog Miss**

Tracks instances where the main thread fails to complete its event loop within expected time frames. This includes both standard and severe delays:

- \`miss\`: Regular watchdog misses due to delays.
- \`mega_miss\`: Severe delays indicating critical responsiveness issues (e.g., the main thread is blocked for over 2 seconds).

**What to watch for:**
- Elevated \`miss\` counts may indicate CPU pressure, large config pushes, or blocking operations.
- \`mega_miss\` events are critical — they suggest the main thread is heavily delayed or blocked.
- Frequent occurrences can lead to service degradation, dropped connections, or timeouts.

**Tips:**
- Profile CPU usage and evaluate the main thread for blocking calls.
- Check for synchronous operations during config updates or logging.
- Consider tuning thread pool or worker concurrency.`;

export const SERVER_MAIN_THREAD_MISS_METRICS_DESCRIPTION = `**⚠️ Server Main Thread Watchdog Miss**

Represents delays detected by the watchdog on the Envoy **main thread** (not worker threads). Includes both normal and critical delays:

- \`miss\`: The main thread took too long to respond but eventually recovered.
- \`mega_miss\`: Critical delay — the main thread was unresponsive for an extended period (e.g., >2s), potentially affecting the entire process.

**What to watch for:**
- A rising number of \`miss\` events may suggest heavy load, blocking operations, or excessive processing in the main thread.
- \`mega_miss\` events are particularly dangerous as they can signal deadlocks or thread starvation.
- Delays in the main thread can impact management operations, config updates, and administrative interfaces.

**Tips:**
- Avoid synchronous/blocking operations in main-thread-only code paths.
- Profile memory allocations and initialization logic.
- Investigate admin handlers, config subscriptions, or dynamic extension loading.`;

export const WORKERS_WATCHDOG_MISS_METRICS_DESCRIPTION = `**⚠️ Workers Watchdog Miss**

Tracks delays in **worker threads** where the watchdog detects missed execution windows. These metrics help diagnose thread starvation or performance bottlenecks in Envoy's worker pool:

- \`miss\`: Indicates that a worker thread failed to respond in a timely manner.
- \`mega_miss\`: Indicates a severe miss, where the thread is likely blocked or under significant load for an extended time.

**What to watch for:**
- Elevated \`miss\` counts may suggest CPU contention, I/O blocking, or overloaded event loops.
- \`mega_miss\` values are critical indicators of potential full thread blocking.
- Frequent occurrences might result in degraded request processing or connection handling failures.

**Tips:**
- Profile the worker thread CPU usage and check for blocking handlers.
- Monitor for excessive synchronous work in filters, extensions, or logging sinks.
- Consider increasing the number of worker threads (via \`concurrency\`) if under heavy load.`;