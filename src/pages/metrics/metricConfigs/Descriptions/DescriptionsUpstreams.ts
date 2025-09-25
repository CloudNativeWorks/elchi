export const UPSTREAM_HEALTH_METRICS_DESCRIPTION = `**🟢 Upstream Health**

Shows the number of upstream targets that are currently considered **healthy** versus the **total** number of configured endpoints.

This metric is based on active health checks and uses labeled counters like \`cluster_membership_healthy\` and \`cluster_membership_total\`.

**Why it's important:**
- Indicates the **availability of your backend services**.
- If healthy count drops below total, some endpoints are failing health checks.
- Essential for **load balancing** — traffic will only be sent to healthy endpoints.

**What to watch for:**
- Healthy < Total → some servers are unhealthy or unreachable.
- If all endpoints show healthy = 0, your entire backend is unreachable for that cluster.

**Tips:**
- 🧪 Use this to validate whether your upstream services are properly registered and available.
- 🔍 Correlate with health check failures to identify root cause.`;

export const UPSTREAM_HEALTH_CHECKS_FAILS_METRICS_DESCRIPTION = `**❌ Upstream HealthChecks Fails**

Shows the number of failed health check attempts to upstream endpoints.

This includes:
- \`failure_total\`: application-level health check failures (e.g., 503 response)
- \`network_failure_total\`: network-level issues (e.g., TCP timeout, connection refused)

**Why it's important:**
- High failure counts signal that backends are either **unhealthy** or **unreachable**.
- Health check failures directly affect **routing decisions** and **cluster stability**.

**What to watch for:**
- Persistent network failures may indicate infrastructure issues.
- A spike in failure count during deployment might mean bad service rollout or dependency outage.

**Tips:**
- 🌐 Compare failure type: network failures vs app-level failures give different clues.
- 🧩 Combine with upstream response time or error rate to narrow down issues.
- 🧠 Avoid confusing temporary startup failures with ongoing degradation — use rate over time.`;

export const UPSTREAM_REQUESTS_METRICS_DESCRIPTION = `**📡 Upstream Requests**

Shows how many HTTP requests are being sent to upstream services per second.

This metric uses \`rate()\` to reflect the frequency of outbound requests.

**Why it's important:**
- Measures service-to-service communication load.
- Helps track dependency pressure and traffic distribution across clusters.

**What to watch for:**
- Sudden increase without matching downstream traffic may indicate retry storms or infinite loops.
- A sharp drop could mean upstream unavailability or misrouted traffic.

**Tips:**
- 🔍 If this is high while downstream request count is low, look for retries or background tasks.
- 🧠 Useful for identifying services that may need scaling based on backend usage patterns.`;

export const UPSTREAM_REQUEST_TIMEOUTS_METRICS_DESCRIPTION = `**⏱️ Upstream Request Timeouts**

Tracks how many requests to upstream services have timed out — meaning no response was received within the configured timeout period.

**Why it's important:**
- Timeout errors can degrade user experience or trigger retries.
- Repeated timeouts may cause cascading failures across microservices.

**What to watch for:**
- Timeout spikes during traffic increase may indicate capacity issues.
- Even small timeout counts on critical upstreams can severely impact downstream SLAs.

**Tips:**
- 🚨 Always monitor this during deployments or when scaling down services.
- 🔁 Check if timeouts correlate with retry spikes — retries add more load and may worsen the problem.`;

export const UPSTREAM_PENDING_REQUESTS_METRICS_DESCRIPTION = `**⏳ Upstream Pending Requests**

Shows the number of upstream requests currently waiting for a connection to become available.

**Why it's important:**
- Indicates bottlenecks in connection pools or concurrency limits.
- Can cause increased latencies or timeouts if not resolved.

**What to watch for:**
- Sustained high values signal under-provisioned connection capacity or excessive load.
- Zero values during load may mean connections are failing before queuing.

**Tips:**
- 🧯 Persistent high values mean connection pool exhaustion — increase concurrency limits or scale out the upstream.
- 🔎 Correlate with timeouts and active connection counts.`;

export const UPSTREAM_RESPONSE_TIME_METRICS_DESCRIPTION = `**📈 Upstream Response Time (90th Percentile)**

Shows how long it takes to receive responses from upstream services, focusing on the slowest 10% of requests.

**Why it's important:**
- Indicates slowness in dependent services.
- Useful for tracking SLO performance or tail-latency degradation.

**What to watch for:**
- P90 increase during traffic spikes = potential bottleneck.
- Flat but high P90 = upstream inherently slow or overloaded.

**Tips:**
- 🧠 Large gaps between P50 and P90 indicate uneven performance.
- 🧯 If P90 latency increases without higher request load, backend might be overloaded or blocked.`;

export const UPSTREAM_RESPONSE_CODES_METRICS_DESCRIPTION = `**🚦 Upstream Response Codes**

Shows HTTP status codes returned by upstream services, such as \`2xx\`, \`4xx\`, and \`5xx\`.

**Why it's important:**
- Useful for tracking errors in dependent services.
- Reveals whether upstreams are misbehaving or being misused.

**What to watch for:**
- Spikes in \`5xx\` = service degradation.
- Spikes in \`4xx\` = client integration issues (e.g., invalid payloads, expired tokens).

**Tips:**
- ❗ Spikes in \`5xx\` likely indicate dependency degradation.
- 🧪 High \`4xx\` from upstreams may mean you're passing bad data — check integration contracts.`;

export const UPSTREAM_HTTP_CONNECTIONS_METRICS_DESCRIPTION = `**🔌 Upstream HTTP Connections**

Displays the rate of **HTTP/1** and **HTTP/2** connections established to upstream clusters.

This metric helps you understand the protocol usage pattern across upstream services and can reveal protocol-level performance characteristics.

**What to watch for:**
- A high rate of \`http1\` connections may suggest compatibility limitations or that upstream services do not support HTTP/2.
- A shift from \`http2\` to \`http1\` (or vice versa) could indicate upstream configuration changes or degraded HTTP/2 performance.
- If connection growth trends upward consistently, it might indicate inefficient connection reuse.

**Tips:**
- Prefer HTTP/2 where possible for better multiplexing and reduced connection overhead.
- Compare against upstream connection destruction metrics to identify leaks or slow closures.
- Monitor together with \`cluster_upstream_cx_active\` and \`cluster_upstream_rq_total\` for a holistic view of upstream traffic pressure.`;

export const UPSTREAM_ACTIVE_CONNECTIONS_METRICS_DESCRIPTION = `**🔌 Upstream Active Connections**

Shows the current number of open connections to each upstream service.

**Why it's important:**
- Indicates connection pool usage and concurrency load.
- High numbers reflect either steady traffic or inefficient connection reuse.

**What to watch for:**
- High values that don't drop between request bursts may signal connection leaks or pooling issues.
- Sudden drops could suggest backend outages or disconnections.

**Tips:**
- 🔍 Useful during traffic surges to monitor backend pressure.
- 📊 Compare against pending requests to detect saturation.`;

export const UPSTREAM_CONNECT_FAILS_METRICS_DESCRIPTION = `**❌ Upstream Connect Failures**

Counts how many times a connection attempt to an upstream service failed (e.g., TCP error, DNS resolution failure).

**Why it's important:**
- Frequent failures indicate instability or unreachability of the backend.

**What to watch for:**
- Spikes after deployment or scaling events may indicate incorrect config or DNS drift.
- Persistent failure rates = misconfigured endpoints or infrastructure issues.

**Tips:**
- ⚠️ Correlate with retry count — these failures often trigger retries.
- 🧠 Review service discovery or endpoint health if this increases.`;

export const UPSTREAM_CONNECT_TIMEOUTS_METRICS_DESCRIPTION = `**⏱️ Upstream Connect Timeouts**

Measures the number of connections that failed due to exceeding the connection timeout threshold.

**Why it's important:**
- Indicates backend slowness in accepting new connections.
- Can degrade performance or cause request timeouts upstream.

**What to watch for:**
- High counts under load suggest backend pressure or SYN flood protection kicking in.
- Random bursts may indicate networking issues or firewall-level blocking.

**Tips:**
- 🔍 Tune connect timeouts conservatively to avoid masking latency issues.
- 🔄 Correlate with destroyed connections and latency spikes.`;

export const UPSTREAM_RECEIVED_BUFFERED_METRICS_DESCRIPTION = `**📥 Upstream Received Buffered**

Shows how much data is currently buffered in the connection receive path, not yet processed.

**Why it's important:**
- Large buffered data may indicate upstream slow processing or stalled reads.

**What to watch for:**
- Growing values during request spikes may signal backend bottlenecks.
- If consistently high, it may cause backpressure or memory issues.

**Tips:**
- 🧯 Monitor during slow backend responses or heavy streaming.
- 📊 Combine with connect time and connection length for full flow control insight.`;

export const UPSTREAM_SENT_BUFFERED_METRICS_DESCRIPTION = `**📤 Upstream Sent Buffered**

Shows how much data is waiting to be flushed to the upstream service.

**Why it's important:**
- High values suggest upstream isn't reading fast enough or write stalls.

**What to watch for:**
- Persistent buffer growth may indicate saturated upstreams or flow control issues.
- Sudden drops with spikes in destroyed connections could mean disconnects under load.

**Tips:**
- 🔍 Watch alongside protocol errors and retransmissions.
- 💡 Investigate if services use large payloads or streaming.`;

export const UPSTREAM_CONNECT_TIME_METRICS_DESCRIPTION = `**📈 Upstream Connect Time (99th Percentile)**

Displays how long it takes to establish TCP connections to upstream services (P99).

**Why it's important:**
- Indicates cold connection latency — important for burst traffic and connection churn scenarios.

**What to watch for:**
- Spikes may indicate network latency, TCP handshake delay, or slow DNS.
- Gradual increase over time can point to network congestion or DNS lag.

**Tips:**
- 🧪 High P99 with low failure = slowness, not instability.
- 🔄 Use with connection timeout to adjust thresholds proactively.`;

export const UPSTREAM_CONNECTION_LENGTH_METRICS_DESCRIPTION = `**⏳ Upstream Connection Length (90th Percentile)**

Shows how long upstream connections stay open (P90).

**Why it's important:**
- Long-lived connections may improve reuse but increase resource holding.
- Very short-lived connections may indicate frequent re-establishment (inefficient).

**What to watch for:**
- Spikes = long-lived streaming or stuck requests.
- Drops = churn or TLS negotiation per request.

**Tips:**
- 🔍 Compare with HTTP protocol breakdown — HTTP/1.1 tends to have shorter connections.
- 🧪 Ideal balance depends on traffic model: request/response vs streaming.`;

export const UPSTREAM_CONNECTION_DESTROYED_FROM_LOCAL_METRICS_DESCRIPTION = `**🧨 Upstream Connection Destroyed From Local**

Counts the number of upstream connections that were closed intentionally by your side, optionally while a request was still active.

**Why it's important:**
- Graceful or forced closes, can indicate connection reuse policies or timeouts.

**What to watch for:**
- \`with_active_rq\` count high = aborted requests mid-flight.
- Spikes could indicate upstream errors or retry-triggered terminations.

**Tips:**
- 🧯 Investigate if retries or load balancers are cutting short connections.
- 📊 Correlate with latency and retry volume.`;

export const UPSTREAM_CONNECTION_DESTROYED_FROM_REMOTE_METRICS_DESCRIPTION = `**🚫 Upstream Connection Destroyed From Remote**

Counts how many upstream connections were closed by the remote (upstream) service — either gracefully or abruptly.

**Why it's important:**
- Remote-initiated disconnects could mean server-side timeouts, limits, or errors.

**What to watch for:**
- \`with_active_rq\` count = remote dropped connections mid-request.
- Spikes may indicate upstream crash/redeploy events.

**Tips:**
- 🔎 Check upstream health and deployment logs during spikes.
- 🧪 Persistent mid-request drops may require retry strategy tuning.`;

export const UPSTREAM_RX_TX_RESET_METRICS_DESCRIPTION = `**🚫 Upstream RX/TX Reset**

Tracks the number of upstream request resets initiated either during receiving (RX) or transmitting (TX) stages. These resets generally occur due to connection issues, timeouts, or explicit aborts initiated by either side during the request lifecycle.

This metric provides visibility into communication stability between your service and upstream clusters. By separating RX (receive) and TX (transmit) reset types, it helps pinpoint where the interruption occurs.

**RX Reset**: Indicates resets triggered while receiving data from upstream (e.g., early disconnect or upstream timeout).

**TX Reset**: Indicates resets triggered while sending data to upstream (e.g., response could not be delivered, client closed early).

**What to watch for:**
- A spike in either RX or TX resets often signals instability in upstream services or misconfigured timeouts.
- TX resets might also indicate rate limiting or upstream rejecting traffic prematurely.
- RX resets frequently point to upstream services failing to deliver a full response, crashing, or being overloaded.

**Tips:**
- Use this metric in combination with connection failure and timeout metrics to build a complete picture of upstream communication health.
- An increase in TX resets might be correlated with downstream clients aborting requests early or aggressive retries.
- RX resets may correlate with upstream instability or overloaded services.`;

export const UPSTREAM_REQUEST_RETRY_METRICS_DESCRIPTION = `**🔄 Upstream Request Retry**

This metric group measures how often requests to upstream services are retried due to transient failures or timeouts, and how many of those retries were successful.

- \`retry\`: Number of times a retry attempt was made after a failed request.
- \`retry_success\`: Number of retry attempts that eventually succeeded.

Retries are typically triggered by temporary upstream unavailability, 5xx errors, or request timeouts depending on the retry policy defined.

**Example scenario:**
If an upstream service returns a \`503\` error, a retry may be triggered. If the retry receives a \`200 OK\`, it counts under \`retry_success\`.

**What to watch for:**
- A growing number of \`retry\` with low \`retry_success\` can signal ongoing upstream instability.
- High retry rates may add latency and degrade overall throughput.
- Zero retries might indicate that retry policies are not configured or are too strict.

**Tips:**
- Monitor trends together with response codes (\`Upstream Response Codes\`) and timeouts.
- Evaluate retry budgets and backoff settings to balance reliability vs. performance.
- Use retries for transient failures, but avoid masking persistent upstream issues.`;

export const UPSTREAM_REQUEST_RETRY_OVERFLOW_METRICS_DESCRIPTION = `**🔄 Upstream Request Retry Overflow**

This metric tracks the number of times an upstream request retry was *not performed* because the maximum number of allowed retries was exceeded or the retry budget was depleted.

Each time this metric increases, it means that a request *could have been retried*, but the system chose not to due to configured retry limits (such as max retries per request, or rate-limiting via retry budgets).

**What to watch for:**  
- A consistently increasing value may indicate retry limits are being hit too often.
- This could be a sign of frequent upstream failures where the system tries to protect itself from retry storms.
- It may also point to overly aggressive retry policies or a need to tune retry budgets.

**Tips:**  
- Combine with \`Upstream Request Retry\` and \`Retry Success\` metrics to understand retry behavior fully.
- Check cluster-level failure metrics to see why retries are triggered in the first place.
- Consider relaxing retry limits *only* if upstream systems can handle the load.`;