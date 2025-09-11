export const ACTIVE_LISTENERS_METRICS_DESCRIPTION = `**📡 Active Listeners**

Displays the current number of active listeners managed by Envoy.

This metric is useful for understanding listener lifecycle and deployment behavior — especially after configuration updates via LDS (Listener Discovery Service).

**What to watch for:**
- A sudden drop may indicate that listeners were removed or failed to initialize.
- A spike in active listeners could suggest rapid deployments or misconfigurations duplicating listeners.
- Stable listener count typically indicates a healthy control plane update cycle.

**Tips:**
- Correlate with \`lds_update_success_total\` or \`lds_update_failure_total\` for better diagnostics.
- Compare with \`listener_manager_total_listeners_warming\` to monitor warmup phases.
- Investigate configuration version mismatches if unexpected listener churn is observed.`;

export const LISTENER_DOWNSTREAM_CX_ACTIVE_DESCRIPTION = `**🔌 Active Downstream Connections (Listener Level)**

Tracks the number of currently active downstream connections per listener.

This metric helps evaluate load distribution across listeners and can indicate which ports or interfaces are receiving the most traffic.

**What to watch for:**
- Consistently high connection counts on a single listener may suggest uneven traffic distribution.
- A sudden drop could indicate client-side disconnections, network issues, or listener removal.
- Useful for monitoring system saturation and tuning listener-level performance.

**Tips:**
- Cross-reference with \`listener_downstream_cx_total\` to compare current vs. cumulative connections.
- Use in conjunction with HTTP downstream metrics for full request-level visibility.
- Investigate TLS listener behavior separately if termination is offloaded.`;

export const LISTENER_DOWNSTREAM_CX_DESTROY_TOTAL_DESCRIPTION = `**❌ Destroyed Downstream Connections (Listener Level)**

Represents the rate at which downstream connections have been closed (destroyed) for each listener.

This includes both normal and error-based terminations (e.g., client disconnects, idle timeouts, protocol violations).

**What to watch for:**
- A spike in destroyed connections may indicate client instability, network issues, or configuration problems.
- Compare with active connection metrics (\`listener_downstream_cx_active\`) to assess churn rate.
- Continuous high rates could lead to resource exhaustion or degraded performance.

**Tips:**
- Use together with \`http_downstream_cx_destroy_total\` for more granular insights (e.g., protocol-level).
- Investigate patterns in destruction causes (timeouts, resets, active request teardown).
- Correlate with retries and upstream failures to identify cascading effects.`;

export const LISTENER_WORKER_DOWNSTREAM_CX_TOTAL_DESCRIPTION = `**👷‍♂️ Worker Downstream Connections (Listener Level)**

Tracks the total number of downstream connections **handled per worker thread** for each listener.

This metric helps you understand how traffic is distributed across worker threads, which is critical for performance tuning and diagnosing thread imbalances.

**What to watch for:**
- Uneven connection counts across \`envoy_worker_id\` may suggest suboptimal load balancing or worker thread starvation.
- A sudden drop on one worker may indicate a crash or hang.
- Total connection volume gives a view into listener-level load across threads.

**Tips:**
- Use in combination with \`main_thread_watchdog_miss_total\` or \`workers_watchdog_miss_total\` to detect thread-level issues.
- Correlate with CPU usage and concurrency settings for performance optimization.
- Consider tuning Envoy's concurrency via \`--concurrency\` if imbalances persist.`;