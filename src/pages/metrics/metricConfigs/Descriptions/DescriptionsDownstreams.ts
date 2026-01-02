export const DOWNSTREAM_REQUEST_METRICS_DESCRIPTION = `**🔢 Downstream Requests**

Tracks the number of incoming HTTP requests received by your service over time.

It uses \`rate()\` to show how frequently requests arrive per second, not the total cumulative count. This makes it perfect for spotting traffic patterns.

**Why it's important:**
- Gives a real-time sense of how much traffic your system is handling.
- Helps detect abnormal usage spikes, bot activity, or campaign-driven traffic increases.
- Useful during load testing or scaling evaluations.

**What to watch for:**
- Sudden increases could mean incoming flood traffic, new client integrations, or retries caused by failures.
- Drops may point to upstream connection issues, outages, or misconfigured clients.

**Tips:**
- 📈 Correlate with **Response Codes** to ensure your backend is keeping up with the load.
- 🔁 If you're using retries, a spike here doesn't always mean more *real* users — check retry metrics too.
- 🧭 Break it down by route or client ID (if label exists) for more granular insights.`;

export const DOWNSTREAM_RESPONSE_CODES_METRICS_DESCRIPTION = `**🚦 Downstream Response Codes**

Shows the frequency of HTTP responses your service is returning, categorized by status code class (\`2xx\`, \`3xx\`, \`4xx\`, \`5xx\`).

Since it uses \`rate()\`, you see how many of each code class are returned per second.

**Why it's important:**
- Helps identify whether your service is functioning correctly.
- A healthy service should mostly return \`2xx\`. Spikes in \`4xx\` or \`5xx\` indicate issues that need attention.

**What to watch for:**
- A rise in \`5xx\` responses may indicate backend service failures, crashes, or overload.
- A rise in \`4xx\` may indicate client misuse, frontend bugs, or expired/missing tokens.
- If \`3xx\` values spike unexpectedly, it might signal incorrect routing or redirect loops.

**Tips:**
- ❌ A sudden spike in \`5xx\` likely means a backend or database issue — act fast.
- ⚠️ High \`4xx\` rates after frontend deploy? It may be sending malformed or unauthorized requests.
- 🔍 You can group by route or client to pinpoint who is causing the errors.
- ⏳ Compare with latency charts — a slow service often fails after being overloaded.`;

export const DOWNSTREAM_REQUEST_BY_PROTOCOLS_METRICS_DESCRIPTION = `**🌐 Downstream Requests by Protocol**

Monitors the usage of HTTP versions in incoming traffic — typically HTTP/1.1 vs HTTP/2.

Uses \`rate()\` to show how many requests per second arrive over each protocol.

**Why it's important:**
- Lets you verify if clients are using newer, more efficient protocols like HTTP/2.
- Sudden protocol shifts may indicate misconfigurations, load balancer issues, or certificate problems.

**What to watch for:**
- A drop in HTTP/2 usage could indicate TLS/ALPN negotiation issues, a misconfigured client, or proxy downgrade.
- Sudden protocol changes after a deployment may point to incorrect server or gateway settings.
- Dominance of HTTP/1.1 in high-throughput environments could signal missed optimization opportunities.

**Tips:**
- 🚦 If you expect HTTP/2 (like on browsers or gRPC clients) and see only HTTP/1.1, check TLS/ALPN negotiation.
- 📉 A drop in HTTP/2 may mean fallback to HTTP/1.1 due to TLS cert expiry or proxy downgrade.
- 🧪 During load tests, HTTP/2 may appear more efficient — verify both protocol load distributions.`;

export const DOWNSTREAM_RESPONSE_TIME_METRICS_DESCRIPTION = `**⏱️ Downstream Response Time (90th Percentile)**

Shows how long it takes to serve the slowest requests — specifically the 90th percentile (P90).  
This means 90% of requests are faster than this value.

Computed using \`histogram_quantile()\` over a \`rate()\` of histogram buckets.

**Why it's important:**
- Helps you understand the "worst-case normal" latency your users experience.
- P90 is more realistic than average latency, especially in systems with occasional slowness.

**What to watch for:**
- A rising P90 while request volume stays steady suggests backend slowness or resource contention.
- Sudden spikes may occur during deployments, autoscaling delays, or external dependency latency.
- Flat but consistently high values may indicate poor performance even under normal load.

**Tips:**
- 🚨 If P90 spikes during peak traffic, you might need autoscaling or caching.
- 🔍 Compare P90 to P50 (median) to understand latency distribution. A large gap = inconsistent performance.
- 🧊 If running serverless or auto-scaling systems, P90 can reveal cold start delays.`;

export const DOWNSTREAM_RECEIVED_RESET_METRICS_DESCRIPTION = `**❌ Downstream Received Reset**

Counts how often clients terminate or reset the connection before receiving a full response.

This could be due to:
- Client-side timeouts
- User aborts (like closing a browser tab)
- Misconfigured retry policies

Uses \`rate()\` to track the frequency of such resets over time.

**Why it's important:**
- High reset counts = wasted resources. Your server may be doing work that never gets delivered.
- Can signal poor client behavior or genuine network issues.

**What to watch for:**
- A steady increase may point to clients timing out or cancelling requests before completion.
- Spikes after frontend or mobile app updates may indicate aggressive timeout settings or broken flows.
- If resets occur alongside high latency or buffer usage, it could signal poor user experience or overloaded responses.

**Tips:**
- ⚠️ Investigate spikes — it may mean you're too slow, causing clients to give up.
- 📱 Mobile apps are more likely to cause resets due to flaky networks.
- 🕵️ Combine with latency: high latency followed by reset = timeout risk.
- 🔁 If followed by retries, these resets might artificially inflate your traffic volume.`;

export const DOWNSTREAM_ACTIVE_CONNECTIONS_METRICS_DESCRIPTION = `**🔌 Downstream Active Connections**

Shows the current number of open TCP connections from clients to the service.

This is a real-time snapshot showing how many connections are currently held open.

**Why it's important:**
- Indicates connection concurrency and load.
- Useful for detecting connection leaks or slow clients holding connections too long.

**What to watch for:**
- A continuous increase may indicate that client connections are not closing properly or that keep-alive connections are overused.
- High connection counts with low request volume could suggest idle connections consuming server resources.
- Unexpected drops may point to network interruptions, service crashes, or misconfigured proxies.

**Tips:**
- 🧮 A growing number of active connections without a matching increase in requests may signal client slowness or keep-alive misuse.
- 📉 A sudden drop could mean a frontend crash or network cut-off.`;

export const DOWNSTREAM_CONNECTION_LENGTH_METRICS_DESCRIPTION = `**⏳ Downstream Connection Length (90th Percentile)**

Shows how long downstream connections stay open, measured at the 90th percentile.

Calculated using \`histogram_quantile()\` over \`rate()\` of histogram buckets.

**Why it's important:**
- Reveals connection longevity patterns.
- Helps identify idle or long-polling clients (e.g., WebSocket, gRPC).

**Tips:**
- 🕵️ High values may indicate connection hoarding or long-lived streams.
- 🔍 Investigate with active connection counts to detect resource exhaustion.`;

export const DOWNSTREAM_CONNECTION_DESTROYED_FROM_REMOTE_METRICS_DESCRIPTION = `**🧨 Downstream Connection Destroyed From Remote**

Counts the number of connections closed by the client side, including:
- \`remote\`: all remote-initiated closes
- \`remote_active_rq\`: remote closes while requests are still active

**Why it's important:**
- Indicates client-side instability or disconnects.
- Remote closes during active requests may mean timeout or aborted operations.

**What to watch for:**
- An increase in 90th percentile connection duration may signal that clients are taking longer to read responses or holding connections open unnecessarily.
- Could indicate issues with slow client networks, frontend slowness, or large response payloads.
- If combined with high buffer usage or low throughput, this may point to bottlenecks on the receiving end.

**Tips:**
- 📱 Mobile or flaky networks often cause frequent remote disconnects.
- 🧪 Correlate with latency and retry metrics for a full picture.`;



export const DOWNSTREAM_DESTROYED_CONNECTIONS_METRICS_DESCRIPTION = `**🗑️ Downstream Destroyed Connections**

Counts the number of downstream connections that were closed for any reason — server or client side.

Calculated using \`rate()\` to observe trends over time.

**Why it's important:**
- Helps track lifecycle of connection load.
- Can detect instability or changes in connection behavior.

**What to watch for:**
- A high or rapidly increasing destruction rate may point to unstable client connections or aggressive disconnection policies.
- If accompanied by protocol errors or timeouts, it might indicate application-level issues or misconfigured timeouts.
- Sudden spikes could suggest upstream failures or client-side retries being triggered frequently.

**Tips:**
- 🚨 A surge in destroyed connections may indicate server limits or client retries.
- 🔍 Combine with active connection count to see open/close churn.`;

export const DOWNSTREAM_RECEIVED_METRICS_DESCRIPTION = `**📥 Downstream Received**

Tracks how much data (in bytes) the server has received from clients over time.

Uses \`rate()\` to show throughput per second.

**Why it's important:**
- Indicates inbound traffic volume.
- Useful for bandwidth and payload monitoring.

**What to watch for:**
- A drop in received bytes may indicate reduced user activity, request failures, or issues on the client side.
- Sudden spikes could point to large POST/PUT requests or potentially abusive client behavior.
- If received traffic is high but response throughput is low, it may indicate backend slowness or blocking filters.

**Tips:**
- 🧮 Track growth over time to size infrastructure capacity.
- 🧪 Compare with "Sent" to identify asymmetric flows.`;

export const DOWNSTREAM_SENT_METRICS_DESCRIPTION = `**📤 Downstream Sent**

Tracks how much data (in bytes) has been sent to clients from the service.

Uses \`rate()\` to show outbound throughput.

**Why it's important:**
- Helps monitor service output volume.
- Detects heavy responses, file downloads, or streaming activity.

**What to watch for:**
- A sudden drop in sent bytes could indicate issues with backend responses, timeouts, or blocked filters.
- Continuous growth without matching request rates might signal large or slow responses being sent to clients.
- Discrepancy between received and sent bytes may reveal compression issues, buffering delays, or response truncation.

**Tips:**
- 🔍 A spike in sent bytes with stable request count could mean larger payloads (e.g., reports, images).
- 🧾 Use with P90 latency to ensure slow sends aren't delaying responses.`;

export const DOWNSTREAM_PROTOCOL_ERRORS_METRICS_DESCRIPTION = `**🚫 Downstream Protocol Errors**

Counts protocol-level errors encountered during downstream communication (e.g., invalid HTTP frames, malformed messages).

Uses \`rate()\` to show error frequency.

**Why it's important:**
- Indicates client misbehavior or misconfigured proxies.
- Can impact connection reusability and client experience.

**What to watch for:**
- A rise in protocol errors may indicate malformed requests, unsupported HTTP versions, or TLS handshake failures.
- Frequent occurrences can degrade client experience and may hint at compatibility issues with certain clients or load balancers.
- Sudden spikes might be caused by misbehaving clients, bots, or recent configuration changes in routing or filters.

**Tips:**
- 🧪 A sudden increase might follow a frontend update — check version compatibility.
- ⚙️ Correlate with downstream resets or destroyed connections.`;

export const DOWNSTREAM_RECEIVED_BUFFERED_METRICS_DESCRIPTION = `**📥 Downstream Received Buffered**

Shows how many bytes have been received from clients and are currently buffered but not yet processed.

**Why it's important:**
- Indicates how much pending input exists.
- Large buffer size may mean slow request body processing or backpressure.

**What to watch for:**
- High buffered data may suggest that the server is receiving data faster than it can process, possibly due to slow filters or backpressure from upstream.
- A consistently rising trend might indicate performance bottlenecks in the request handling pipeline.
- Can be a warning sign for potential memory pressure if buffers are not being flushed efficiently.

**Tips:**
- 🧯 Monitor during spikes to avoid memory pressure.
- 🔍 Pair with active connections to detect buffer growth patterns.`;
