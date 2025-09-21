
export const tcp =`
# TCP Proxy

- This filter should be configured with the type URL: \`type.googleapis.com/envoy.extensions.filters.network.tcp_proxy.v3.TcpProxy\`.

## Dynamic Cluster Selection

The upstream cluster used by the TCP proxy filter can be dynamically set by other network filters on a per-connection basis. This is done by setting a per-connection state object under the key \`envoy.tcp_proxy.cluster\`. Refer to the implementation details for more information.

## Routing to a Subset of Hosts

TCP proxy can route to a subset of hosts within an upstream cluster. To define metadata for matching an upstream host:

1. Use TcpProxy.metadata_match for a single upstream cluster.
2. Use ClusterWeight.metadata_match for a weighted upstream cluster.
3. Combine both to define metadata for a weighted cluster, with the latter metadata merging over the former.

Dynamic metadata can also be set by earlier network filters on the \`StreamInfo\`. This must occur before \`onNewConnection()\` is called on the \`TcpProxy\` filter to influence load balancing.

## Tunneling TCP Over HTTP

The TCP proxy filter supports tunneling raw TCP over HTTP \`CONNECT\` or \`POST\` requests. See HTTP upgrades for details. Configure tunneling with Tunneling Config. To disable tunneling dynamically per connection, set a filter state object under \`envoy.tcp_proxy.disable_tunneling\`.

## Statistics

The TCP proxy filter generates various statistics, including access logs for upstream and downstream connections. Downstream statistics use the prefix \`tcp.<stat_prefix>.\` and include:

| Name                                   | Type     | Description |
| -------------------------------------- | -------- | ----------- |
| \`downstream_cx_total\`                  | Counter  | Total number of connections handled by the filter |
| \`downstream_cx_no_route\`               | Counter  | Number of connections with no matching route or cluster |
| \`downstream_cx_tx_bytes_total\`         | Counter  | Total bytes written to the downstream connection |
| \`downstream_cx_tx_bytes_buffered\`      | Gauge    | Total bytes currently buffered to the downstream connection |
| \`downstream_cx_rx_bytes_total\`         | Counter  | Total bytes read from the downstream connection |
| \`downstream_cx_rx_bytes_buffered\`      | Gauge    | Total bytes currently buffered from the downstream connection |
| \`downstream_flow_control_paused_reading_total\` | Counter | Times flow control paused reading from downstream |
| \`downstream_flow_control_resumed_reading_total\` | Counter | Times flow control resumed reading from downstream |
| \`idle_timeout\`                         | Counter  | Connections closed due to idle timeout |
| \`max_downstream_connection_duration\`   | Counter  | Connections closed due to max connection duration timeout |
| \`on_demand_cluster_attempt\`            | Counter  | Connections requesting on-demand cluster |
| \`on_demand_cluster_missing\`            | Counter  | Connections closed due to missing on-demand cluster |
| \`on_demand_cluster_success\`            | Counter  | Connections successfully receiving on-demand cluster |
| \`on_demand_cluster_timeout\`            | Counter  | Connections closed due to on-demand cluster lookup timeout |
| \`upstream_flush_total\`                 | Counter  | Connections continuing to flush upstream data after downstream close |
| \`upstream_flush_active\`                | Gauge    | Connections currently flushing upstream data |

These statistics are useful for monitoring the performance and behavior of the TCP proxy filter.
`