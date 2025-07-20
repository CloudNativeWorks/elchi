import {OutType} from '@elchi/tags/tagsType';


export const AdditionalAddress: OutType = { "AdditionalAddress": [
  {
    "name": "address",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "Address",
    "enums": null,
    "comment": "",
    "notImp": false
  },
  {
    "name": "socket_options",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "SocketOptionsOverride",
    "enums": null,
    "comment": "Additional socket options that may not be present in Envoy source code or precompiled binaries. If specified, this will override the `socket_options` in the listener. If specified with no `socket_options` or an empty list of `socket_options`, it means no socket option will apply.",
    "notImp": false
  }
] };

export const ListenerCollection: OutType = { "ListenerCollection": [
  {
    "name": "entries",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "CollectionEntry[]",
    "enums": null,
    "comment": "",
    "notImp": false
  }
] };

export const Listener_DeprecatedV1: OutType = { "Listener_DeprecatedV1": [
  {
    "name": "bind_to_port",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "boolean",
    "enums": null,
    "comment": "Whether the listener should bind to the port. A listener that doesn't bind can only receive connections redirected from other listeners that set use_original_dst parameter to true. Default is true.\n\nThis is deprecated. Use `Listener.bind_to_port`",
    "notImp": false
  }
] };

export const Listener_DeprecatedV1_SingleFields = [
  "bind_to_port"
];

export const Listener_ConnectionBalanceConfig: OutType = { "Listener_ConnectionBalanceConfig": [
  {
    "name": "balance_type.exact_balance",
    "isUnion": true,
    "isDeprecated": false,
    "fieldType": "Listener_ConnectionBalanceConfig_ExactBalance",
    "enums": null,
    "comment": "If specified, the listener will use the exact connection balancer.",
    "notImp": false
  },
  {
    "name": "balance_type.extend_balance",
    "isUnion": true,
    "isDeprecated": false,
    "fieldType": "TypedExtensionConfig",
    "enums": null,
    "comment": "The listener will use the connection balancer according to ``type_url``. If ``type_url`` is invalid, Envoy will not attempt to balance active connections between worker threads. extension-category: envoy.network.connection_balance",
    "notImp": false
  }
] };

export const Listener: OutType = { "Listener": [
  {
    "name": "name",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "string",
    "enums": null,
    "comment": "The unique name by which this listener is known. If no name is provided, Envoy will allocate an internal UUID for the listener. If the listener is to be dynamically updated or removed via `LDS` a unique name must be provided.",
    "notImp": false
  },
  {
    "name": "address",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "Address",
    "enums": null,
    "comment": "The address that the listener should listen on. In general, the address must be unique, though that is governed by the bind rules of the OS. E.g., multiple listeners can listen on port 0 on Linux as the actual port will be allocated by the OS. Required unless ``api_listener`` or ``listener_specifier`` is populated.",
    "notImp": false
  },
  {
    "name": "additional_addresses",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "AdditionalAddress[]",
    "enums": null,
    "comment": "The additional addresses the listener should listen on. The addresses must be unique across all listeners. Multiple addresses with port 0 can be supplied. When using multiple addresses in a single listener, all addresses use the same protocol, and multiple internal addresses are not supported.",
    "notImp": false
  },
  {
    "name": "stat_prefix",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "string",
    "enums": null,
    "comment": "Optional prefix to use on listener stats. If empty, the stats will be rooted at ``listener.<address as string>.``. If non-empty, stats will be rooted at ``listener.<stat_prefix>.``.",
    "notImp": false
  },
  {
    "name": "filter_chains",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "FilterChain[]",
    "enums": null,
    "comment": "A list of filter chains to consider for this listener. The `FilterChain` with the most specific `FilterChainMatch` criteria is used on a connection.\n\nExample using SNI for filter chain selection can be found in the `FAQ entry`.",
    "notImp": false
  },
  {
    "name": "filter_chain_matcher",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "Matcher",
    "enums": null,
    "comment": "`Matcher API` resolving the filter chain name from the network properties. This matcher is used as a replacement for the filter chain match condition `filter_chain_match`. If specified, all `filter_chains` must have a non-empty and unique `name` field and not specify `filter_chain_match` field.\n\n:::note\n\nOnce matched, each connection is permanently bound to its filter chain. If the matcher changes but the filter chain remains the same, the connections bound to the filter chain are not drained. If, however, the filter chain is removed or structurally modified, then the drain for its connections is initiated.",
    "notImp": false
  },
  {
    "name": "use_original_dst",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "boolean",
    "enums": null,
    "comment": "If a connection is redirected using ``iptables``, the port on which the proxy receives it might be different from the original destination address. When this flag is set to true, the listener hands off redirected connections to the listener associated with the original destination address. If there is no listener associated with the original destination address, the connection is handled by the listener that receives it. Defaults to false.",
    "notImp": false
  },
  {
    "name": "default_filter_chain",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "FilterChain",
    "enums": null,
    "comment": "The default filter chain if none of the filter chain matches. If no default filter chain is supplied, the connection will be closed. The filter chain match is ignored in this field.",
    "notImp": false
  },
  {
    "name": "per_connection_buffer_limit_bytes",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "number",
    "enums": null,
    "comment": "Soft limit on size of the listener’s new connection read and write buffers. If unspecified, an implementation defined default is applied (1MiB).",
    "notImp": false
  },
  {
    "name": "metadata",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "Metadata",
    "enums": null,
    "comment": "Listener metadata.",
    "notImp": false
  },
  {
    "name": "deprecated_v1",
    "isUnion": false,
    "isDeprecated": true,
    "fieldType": "Listener_DeprecatedV1",
    "enums": null,
    "comment": "[#not-implemented-hide:]",
    "notImp": true
  },
  {
    "name": "drain_type",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "Listener_DrainType",
    "enums": [
      "DEFAULT",
      "MODIFY_ONLY"
    ],
    "comment": "The type of draining to perform at a listener-wide level.",
    "notImp": false
  },
  {
    "name": "listener_filters",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "ListenerFilter[]",
    "enums": null,
    "comment": "Listener filters have the opportunity to manipulate and augment the connection metadata that is used in connection filter chain matching, for example. These filters are run before any in `filter_chains`. Order matters as the filters are processed sequentially right after a socket has been accepted by the listener, and before a connection is created. UDP Listener filters can be specified when the protocol in the listener socket address in `protocol` is `UDP` and no `quic_options` is specified in `udp_listener_config`. QUIC listener filters can be specified when `quic_options` is specified in `udp_listener_config`. They are processed sequentially right before connection creation. And like TCP Listener filters, they can be used to manipulate the connection metadata and socket. But the difference is that they can't be used to pause connection creation.",
    "notImp": false
  },
  {
    "name": "listener_filters_timeout",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "Duration",
    "enums": null,
    "comment": "The timeout to wait for all listener filters to complete operation. If the timeout is reached, the accepted socket is closed without a connection being created unless ``continue_on_listener_filters_timeout`` is set to true. Specify 0 to disable the timeout. If not specified, a default timeout of 15s is used.",
    "notImp": false
  },
  {
    "name": "continue_on_listener_filters_timeout",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "boolean",
    "enums": null,
    "comment": "Whether a connection should be created when listener filters timeout. Default is false.\n\n:::attention\n\nSome listener filters, such as `Proxy Protocol filter`, should not be used with this option. It will cause unexpected behavior when a connection is created.",
    "notImp": false
  },
  {
    "name": "transparent",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "boolean",
    "enums": null,
    "comment": "Whether the listener should be set as a transparent socket. When this flag is set to true, connections can be redirected to the listener using an ``iptables`` ``TPROXY`` target, in which case the original source and destination addresses and ports are preserved on accepted connections. This flag should be used in combination with `an original_dst` `listener filter` to mark the connections' local addresses as \"restored.\" This can be used to hand off each redirected connection to another listener associated with the connection's destination address. Direct connections to the socket without using ``TPROXY`` cannot be distinguished from connections redirected using ``TPROXY`` and are therefore treated as if they were redirected. When this flag is set to false, the listener's socket is explicitly reset as non-transparent. Setting this flag requires Envoy to run with the ``CAP_NET_ADMIN`` capability. When this flag is not set (default), the socket is not modified, i.e. the transparent option is neither set nor reset.",
    "notImp": false
  },
  {
    "name": "freebind",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "boolean",
    "enums": null,
    "comment": "Whether the listener should set the ``IP_FREEBIND`` socket option. When this flag is set to true, listeners can be bound to an IP address that is not configured on the system running Envoy. When this flag is set to false, the option ``IP_FREEBIND`` is disabled on the socket. When this flag is not set (default), the socket is not modified, i.e. the option is neither enabled nor disabled.",
    "notImp": false
  },
  {
    "name": "socket_options",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "SocketOption[]",
    "enums": null,
    "comment": "Additional socket options that may not be present in Envoy source code or precompiled binaries. The socket options can be updated for a listener when `enable_reuse_port` is ``true``. Otherwise, if socket options change during a listener update the update will be rejected to make it clear that the options were not updated.",
    "notImp": false
  },
  {
    "name": "tcp_fast_open_queue_length",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "number",
    "enums": null,
    "comment": "Whether the listener should accept TCP Fast Open (TFO) connections. When this flag is set to a value greater than 0, the option TCP_FASTOPEN is enabled on the socket, with a queue length of the specified size (see `details in RFC7413 <https://tools.ietf.org/html/rfc7413#section-5.1>`_). When this flag is set to 0, the option TCP_FASTOPEN is disabled on the socket. When this flag is not set (default), the socket is not modified, i.e. the option is neither enabled nor disabled.\n\nOn Linux, the net.ipv4.tcp_fastopen kernel parameter must include flag 0x2 to enable TCP_FASTOPEN. See `ip-sysctl.txt <https://www.kernel.org/doc/Documentation/networking/ip-sysctl.txt>`_.\n\nOn macOS, only values of 0, 1, and unset are valid; other values may result in an error. To set the queue length on macOS, set the net.inet.tcp.fastopen_backlog kernel parameter.",
    "notImp": false
  },
  {
    "name": "traffic_direction",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "TrafficDirection",
    "enums": [
      "UNSPECIFIED",
      "INBOUND",
      "OUTBOUND"
    ],
    "comment": "Specifies the intended direction of the traffic relative to the local Envoy. This property is required on Windows for listeners using the original destination filter, see `Original Destination`.",
    "notImp": false
  },
  {
    "name": "udp_listener_config",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "UdpListenerConfig",
    "enums": null,
    "comment": "If the protocol in the listener socket address in `protocol` is `UDP`, this field specifies UDP listener specific configuration.",
    "notImp": false
  },
  {
    "name": "api_listener",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "ApiListener",
    "enums": null,
    "comment": "Used to represent an API listener, which is used in non-proxy clients. The type of API exposed to the non-proxy application depends on the type of API listener. When this field is set, no other field except for `name` should be set.\n\n:::note\n\nCurrently only one ApiListener can be installed; and it can only be done via bootstrap config, not LDS. \n:::",
    "notImp": false
  },
  {
    "name": "connection_balance_config",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "Listener_ConnectionBalanceConfig",
    "enums": null,
    "comment": "The listener's connection balancer configuration, currently only applicable to TCP listeners. If no configuration is specified, Envoy will not attempt to balance active connections between worker threads.\n\nIn the scenario that the listener X redirects all the connections to the listeners Y1 and Y2 by setting `use_original_dst` in X and `bind_to_port` to false in Y1 and Y2, it is recommended to disable the balance config in listener X to avoid the cost of balancing, and enable the balance config in Y1 and Y2 to balance the connections among the workers.",
    "notImp": false
  },
  {
    "name": "reuse_port",
    "isUnion": false,
    "isDeprecated": true,
    "fieldType": "boolean",
    "enums": null,
    "comment": "Deprecated. Use ``enable_reuse_port`` instead.",
    "notImp": false
  },
  {
    "name": "enable_reuse_port",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "boolean",
    "enums": null,
    "comment": "When this flag is set to true, listeners set the ``SO_REUSEPORT`` socket option and create one socket for each worker thread. This makes inbound connections distribute among worker threads roughly evenly in cases where there are a high number of connections. When this flag is set to false, all worker threads share one socket. This field defaults to true. The change of field will be rejected during an listener update when the runtime flag ``envoy.reloadable_features.enable_update_listener_socket_options`` is enabled. Otherwise, the update of this field will be ignored quietly.\n\n:::attention\n\nAlthough this field defaults to true, it has different behavior on different platforms. See the following text for more information. \n:::\n\n* On Linux, reuse_port is respected for both TCP and UDP listeners. It also works correctly with hot restart. * On macOS, reuse_port for TCP does not do what it does on Linux. Instead of load balancing, the last socket wins and receives all connections/packets. For TCP, reuse_port is force disabled and the user is warned. For UDP, it is enabled, but only one worker will receive packets. For QUIC/H3, SW routing will send packets to other workers. For \"raw\" UDP, only a single worker will currently receive packets. * On Windows, reuse_port for TCP has undefined behavior. It is force disabled and the user is warned similar to macOS. It is left enabled for UDP with undefined behavior currently.",
    "notImp": false
  },
  {
    "name": "access_log",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "AccessLog[]",
    "enums": null,
    "comment": "Configuration for `access logs` emitted by this listener.",
    "notImp": false
  },
  {
    "name": "tcp_backlog_size",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "number",
    "enums": null,
    "comment": "The maximum length a tcp listener's pending connections queue can grow to. If no value is provided net.core.somaxconn will be used on Linux and 128 otherwise.",
    "notImp": false
  },
  {
    "name": "max_connections_to_accept_per_socket_event",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "number",
    "enums": null,
    "comment": "The maximum number of connections to accept from the kernel per socket event. Envoy may decide to close these connections after accepting them from the kernel e.g. due to load shedding, or other policies. If there are more than max_connections_to_accept_per_socket_event connections pending accept, connections over this threshold will be accepted in later event loop iterations. If no value is provided Envoy will accept all connections pending accept from the kernel.",
    "notImp": false
  },
  {
    "name": "bind_to_port",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "boolean",
    "enums": null,
    "comment": "Whether the listener should bind to the port. A listener that doesn't bind can only receive connections redirected from other listeners that set `use_original_dst` to true. Default is true.",
    "notImp": false
  },
  {
    "name": "listener_specifier.internal_listener",
    "isUnion": true,
    "isDeprecated": false,
    "fieldType": "Listener_InternalListenerConfig",
    "enums": null,
    "comment": "Used to represent an internal listener which does not listen on OSI L4 address but can be used by the `envoy cluster` to create a user space connection to. The internal listener acts as a TCP listener. It supports listener filters and network filter chains. Upstream clusters refer to the internal listeners by their `name`. `Address` must not be set on the internal listeners.\n\nThere are some limitations that are derived from the implementation. The known limitations include:\n\n* `ConnectionBalanceConfig` is not allowed because both the cluster connection and the listener connection must be owned by the same dispatcher. * `tcp_backlog_size` * `freebind` * `transparent`",
    "notImp": false
  },
  {
    "name": "enable_mptcp",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "boolean",
    "enums": null,
    "comment": "Enable MPTCP (multi-path TCP) on this listener. Clients will be allowed to establish MPTCP connections. Non-MPTCP clients will fall back to regular TCP.",
    "notImp": false
  },
  {
    "name": "ignore_global_conn_limit",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "boolean",
    "enums": null,
    "comment": "Whether the listener should limit connections based upon the value of `global_downstream_max_connections`.",
    "notImp": false
  },
  {
    "name": "bypass_overload_manager",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "boolean",
    "enums": null,
    "comment": "Whether the listener bypasses configured overload manager actions.",
    "notImp": false
  }
] };

export const Listener_SingleFields = [
  "name",
  "stat_prefix",
  "use_original_dst",
  "per_connection_buffer_limit_bytes",
  "drain_type",
  "listener_filters_timeout",
  "continue_on_listener_filters_timeout",
  "transparent",
  "freebind",
  "tcp_fast_open_queue_length",
  "traffic_direction",
  "enable_reuse_port",
  "tcp_backlog_size",
  "max_connections_to_accept_per_socket_event",
  "bind_to_port",
  "enable_mptcp",
  "ignore_global_conn_limit",
  "bypass_overload_manager"
];