import {OutType} from '@/elchi/tags/tagsType';


export const UdpProxyConfig_UdpTunnelingConfig_RetryOptions: OutType = { "UdpProxyConfig_UdpTunnelingConfig_RetryOptions": [
  {
    "name": "max_connect_attempts",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "number",
    "enums": null,
    "comment": "The maximum number of unsuccessful connection attempts that will be made before giving up. If the parameter is not specified, 1 connection attempt will be made.",
    "notImp": false
  }
] };

export const UdpProxyConfig_UdpTunnelingConfig_RetryOptions_SingleFields = [
  "max_connect_attempts"
];

export const UdpProxyConfig_UdpTunnelingConfig_BufferOptions: OutType = { "UdpProxyConfig_UdpTunnelingConfig_BufferOptions": [
  {
    "name": "max_buffered_datagrams",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "number",
    "enums": null,
    "comment": "If set, the filter will only buffer datagrams up to the requested limit, and will drop new UDP datagrams if the buffer contains the max_buffered_datagrams value at the time of a new datagram arrival. If not set, the default value is 1024 datagrams.",
    "notImp": false
  },
  {
    "name": "max_buffered_bytes",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "number",
    "enums": null,
    "comment": "If set, the filter will only buffer datagrams up to the requested total buffered bytes limit, and will drop new UDP datagrams if the buffer contains the max_buffered_datagrams value at the time of a new datagram arrival. If not set, the default value is 16,384 (16KB).",
    "notImp": false
  }
] };

export const UdpProxyConfig_UdpTunnelingConfig_BufferOptions_SingleFields = [
  "max_buffered_datagrams",
  "max_buffered_bytes"
];

export const UdpProxyConfig_UdpTunnelingConfig: OutType = { "UdpProxyConfig_UdpTunnelingConfig": [
  {
    "name": "proxy_host",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "string",
    "enums": null,
    "comment": "The hostname to send in the synthesized CONNECT headers to the upstream proxy. This field evaluates command operators if set, otherwise returns hostname as is.\n\nExample: dynamically set hostname using filter state\n\n```yaml\n\n   tunneling_config:\n     proxy_host: \"%FILTER_STATE(proxy.host.key:PLAIN)%\"",
    "notImp": false
  },
  {
    "name": "proxy_port",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "number",
    "enums": null,
    "comment": "Optional port value to add to the HTTP request URI. This value can be overridden per-session by setting the required port value for the filter state key ``udp.connect.proxy_port``.",
    "notImp": false
  },
  {
    "name": "target_host",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "string",
    "enums": null,
    "comment": "The target host to send in the synthesized CONNECT headers to the upstream proxy. This field evaluates command operators if set, otherwise returns hostname as is.\n\nExample: dynamically set target host using filter state\n\n```yaml\n\n   tunneling_config:\n     target_host: \"%FILTER_STATE(target.host.key:PLAIN)%\"",
    "notImp": false
  },
  {
    "name": "default_target_port",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "number",
    "enums": null,
    "comment": "The default target port to send in the CONNECT headers to the upstream proxy. This value can be overridden per-session by setting the required port value for the filter state key ``udp.connect.target_port``.",
    "notImp": false
  },
  {
    "name": "use_post",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "boolean",
    "enums": null,
    "comment": "Use POST method instead of CONNECT method to tunnel the UDP stream.\n\n:::note\nIf use_post is set, the upstream stream does not comply with the connect-udp RFC, and instead it will be a POST request. the path used in the headers will be set from the post_path field, and the headers will not contain the target host and target port, as required by the connect-udp protocol. This flag should be used carefully.",
    "notImp": false
  },
  {
    "name": "post_path",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "string",
    "enums": null,
    "comment": "The path used with POST method. Default path is ``/``. If post path is specified and use_post field isn't true, it will be rejected.",
    "notImp": false
  },
  {
    "name": "retry_options",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "UdpProxyConfig_UdpTunnelingConfig_RetryOptions",
    "enums": null,
    "comment": "Optional retry options, in case connecting to the upstream failed.",
    "notImp": false
  },
  {
    "name": "headers_to_add",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "HeaderValueOption[]",
    "enums": null,
    "comment": "Additional request headers to upstream proxy. Neither ``:-prefixed`` pseudo-headers nor the Host: header can be overridden. Values of the added headers evaluates command operators if they are set in the value template.\n\nExample: dynamically set a header with the local port\n\n```yaml\n\n   headers_to_add:\n   - header:\n       key: original_dst_port\n       value: \"%DOWNSTREAM_LOCAL_PORT%\"",
    "notImp": false
  },
  {
    "name": "buffer_options",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "UdpProxyConfig_UdpTunnelingConfig_BufferOptions",
    "enums": null,
    "comment": "If configured, the filter will buffer datagrams in case that it is waiting for the upstream to be ready, whether if it is during the connection process or due to upstream buffer watermarks. If this field is not configured, there will be no buffering and downstream datagrams that arrive while the upstream is not ready will be dropped. In case this field is set but the options are not configured, the default values will be applied as described in the ``BufferOptions``.",
    "notImp": false
  },
  {
    "name": "propagate_response_headers",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "boolean",
    "enums": null,
    "comment": "Save the response headers to the downstream info filter state for consumption by the session filters. The filter state key is ``envoy.udp_proxy.propagate_response_headers``.",
    "notImp": false
  },
  {
    "name": "propagate_response_trailers",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "boolean",
    "enums": null,
    "comment": "Save the response trailers to the downstream info filter state for consumption by the session filters. The filter state key is ``envoy.udp_proxy.propagate_response_trailers``.",
    "notImp": false
  }
] };

export const UdpProxyConfig_UdpTunnelingConfig_SingleFields = [
  "proxy_host",
  "proxy_port",
  "target_host",
  "default_target_port",
  "use_post",
  "post_path",
  "propagate_response_headers",
  "propagate_response_trailers"
];

export const UdpProxyConfig_UdpAccessLogOptions: OutType = { "UdpProxyConfig_UdpAccessLogOptions": [
  {
    "name": "access_log_flush_interval",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "Duration",
    "enums": null,
    "comment": "The interval to flush access log. The UDP proxy will flush only one access log when the session is ended by default. If this field is set, the UDP proxy will flush access log periodically with the specified interval. This field does not require on-tunnel-connected access logging enabled, and the other way around. The interval must be at least 1ms.",
    "notImp": false
  },
  {
    "name": "flush_access_log_on_tunnel_connected",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "boolean",
    "enums": null,
    "comment": "If set to true and UDP tunneling is configured, access log will be flushed when the UDP proxy has successfully established a connection tunnel with the upstream. If the connection failed, the access log will not be flushed.",
    "notImp": false
  }
] };

export const UdpProxyConfig_UdpAccessLogOptions_SingleFields = [
  "access_log_flush_interval",
  "flush_access_log_on_tunnel_connected"
];

export const UdpProxyConfig: OutType = { "UdpProxyConfig": [
  {
    "name": "stat_prefix",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "string",
    "enums": null,
    "comment": "The stat prefix used when emitting UDP proxy filter stats.",
    "notImp": false
  },
  {
    "name": "route_specifier.cluster",
    "isUnion": true,
    "isDeprecated": false,
    "fieldType": "string",
    "enums": null,
    "comment": "The upstream cluster to connect to. This field is deprecated in favor of `matcher`.",
    "notImp": false
  },
  {
    "name": "route_specifier.matcher",
    "isUnion": true,
    "isDeprecated": false,
    "fieldType": "Matcher",
    "enums": null,
    "comment": "The match tree to use when resolving route actions for incoming requests. See `Routing` for more information.",
    "notImp": false
  },
  {
    "name": "idle_timeout",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "Duration",
    "enums": null,
    "comment": "The idle timeout for sessions. Idle is defined as no datagrams between received or sent by the session. The default if not specified is 1 minute.",
    "notImp": false
  },
  {
    "name": "use_original_src_ip",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "boolean",
    "enums": null,
    "comment": "Use the remote downstream IP address as the sender IP address when sending packets to upstream hosts. This option requires Envoy to be run with the ``CAP_NET_ADMIN`` capability on Linux. And the IPv6 stack must be enabled on Linux kernel. This option does not preserve the remote downstream port. If this option is enabled, the IP address of sent datagrams will be changed to the remote downstream IP address. This means that Envoy will not receive packets that are sent by upstream hosts because the upstream hosts will send the packets with the remote downstream IP address as the destination. All packets will be routed to the remote downstream directly if there are route rules on the upstream host side. There are two options to return the packets back to the remote downstream. The first one is to use DSR (Direct Server Return). The other one is to configure routing rules on the upstream hosts to forward all packets back to Envoy and configure iptables rules on the host running Envoy to forward all packets from upstream hosts to the Envoy process so that Envoy can forward the packets to the downstream. If the platform does not support this option, Envoy will raise a configuration error.",
    "notImp": false
  },
  {
    "name": "hash_policies",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "UdpProxyConfig_HashPolicy[]",
    "enums": null,
    "comment": "Optional configuration for UDP proxy hash policies. If hash_policies is not set, the hash-based load balancing algorithms will select a host randomly. Currently the number of hash policies is limited to 1.",
    "notImp": false
  },
  {
    "name": "upstream_socket_config",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "UdpSocketConfig",
    "enums": null,
    "comment": "UDP socket configuration for upstream sockets. The default for `prefer_gro` is true for upstream sockets as the assumption is datagrams will be received from a single source.",
    "notImp": false
  },
  {
    "name": "use_per_packet_load_balancing",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "boolean",
    "enums": null,
    "comment": "Perform per packet load balancing (upstream host selection) on each received data chunk. The default if not specified is false, that means each data chunk is forwarded to upstream host selected on first chunk receival for that \"session\" (identified by source IP/port and local IP/port). Only one of use_per_packet_load_balancing or session_filters can be used.",
    "notImp": false
  },
  {
    "name": "access_log",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "AccessLog[]",
    "enums": null,
    "comment": "Configuration for session access logs emitted by the UDP proxy. Note that certain UDP specific data is emitted as `Dynamic Metadata`.",
    "notImp": false
  },
  {
    "name": "proxy_access_log",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "AccessLog[]",
    "enums": null,
    "comment": "Configuration for proxy access logs emitted by the UDP proxy. Note that certain UDP specific data is emitted as `Dynamic Metadata`.",
    "notImp": false
  },
  {
    "name": "session_filters",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "UdpProxyConfig_SessionFilter[]",
    "enums": null,
    "comment": "Optional session filters that will run for each UDP session. Only one of use_per_packet_load_balancing or session_filters can be used. extension-category: envoy.filters.udp.session",
    "notImp": false
  },
  {
    "name": "tunneling_config",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "UdpProxyConfig_UdpTunnelingConfig",
    "enums": null,
    "comment": "If set, this configures UDP tunneling. See `Proxying UDP in HTTP <https://www.rfc-editor.org/rfc/rfc9298.html>`_. More information can be found in the UDP Proxy and HTTP upgrade documentation.",
    "notImp": false
  },
  {
    "name": "access_log_options",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "UdpProxyConfig_UdpAccessLogOptions",
    "enums": null,
    "comment": "Additional access log options for UDP Proxy.",
    "notImp": false
  }
] };

export const UdpProxyConfig_SingleFields = [
  "stat_prefix",
  "route_specifier.cluster",
  "idle_timeout",
  "use_original_src_ip",
  "use_per_packet_load_balancing"
];

export const UdpProxyConfig_HashPolicy: OutType = { "UdpProxyConfig_HashPolicy": [
  {
    "name": "policy_specifier.source_ip",
    "isUnion": true,
    "isDeprecated": false,
    "fieldType": "boolean",
    "enums": null,
    "comment": "The source IP will be used to compute the hash used by hash-based load balancing algorithms.",
    "notImp": false
  },
  {
    "name": "policy_specifier.key",
    "isUnion": true,
    "isDeprecated": false,
    "fieldType": "string",
    "enums": null,
    "comment": "A given key will be used to compute the hash used by hash-based load balancing algorithms. In certain cases there is a need to direct different UDP streams jointly towards the selected set of endpoints. A possible use-case is VoIP telephony, where media (RTP) and its corresponding control (RTCP) belong to the same logical session, although they travel in separate streams. To ensure that these pair of streams are load-balanced on session level (instead of individual stream level), dynamically created listeners can use the same hash key for each stream in the session.",
    "notImp": false
  }
] };

export const UdpProxyConfig_HashPolicy_SingleFields = [
  "policy_specifier.source_ip",
  "policy_specifier.key"
];

export const UdpProxyConfig_SessionFilter: OutType = { "UdpProxyConfig_SessionFilter": [
  {
    "name": "name",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "string",
    "enums": null,
    "comment": "The name of the filter configuration.",
    "notImp": false
  },
  {
    "name": "config_type.typed_config",
    "isUnion": true,
    "isDeprecated": false,
    "fieldType": "Any",
    "enums": null,
    "comment": "Filter specific configuration which depends on the filter being instantiated. See the supported filters for further documentation.",
    "notImp": false
  },
  {
    "name": "config_type.config_discovery",
    "isUnion": true,
    "isDeprecated": false,
    "fieldType": "ExtensionConfigSource",
    "enums": null,
    "comment": "Configuration source specifier for an extension configuration discovery service. In case of a failure and without the default configuration, the UDP session will be removed.",
    "notImp": false
  }
] };

export const UdpProxyConfig_SessionFilter_SingleFields = [
  "name"
];