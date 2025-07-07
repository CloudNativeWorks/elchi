import {OutType} from '@/elchi/tags/tagsType';


export const Filter: OutType = { "Filter": [
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
    "comment": "Filter specific configuration which depends on the filter being instantiated. See the supported filters for further documentation. extension-category: envoy.filters.network",
    "notImp": false
  },
  {
    "name": "config_type.config_discovery",
    "isUnion": true,
    "isDeprecated": false,
    "fieldType": "ExtensionConfigSource",
    "enums": null,
    "comment": "Configuration source specifier for an extension configuration discovery service. In case of a failure and without the default configuration, the listener closes the connections.",
    "notImp": false
  }
] };

export const Filter_SingleFields = [
  "name"
];

export const FilterChainMatch: OutType = { "FilterChainMatch": [
  {
    "name": "destination_port",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "number",
    "enums": null,
    "comment": "Optional destination port to consider when use_original_dst is set on the listener in determining a filter chain match.",
    "notImp": false
  },
  {
    "name": "prefix_ranges",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "CidrRange[]",
    "enums": null,
    "comment": "If non-empty, an IP address and prefix length to match addresses when the listener is bound to 0.0.0.0/:: or when use_original_dst is specified.",
    "notImp": false
  },
  {
    "name": "address_suffix",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "string",
    "enums": null,
    "comment": "If non-empty, an IP address and suffix length to match addresses when the listener is bound to 0.0.0.0/:: or when use_original_dst is specified. [#not-implemented-hide:]",
    "notImp": true
  },
  {
    "name": "suffix_len",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "number",
    "enums": null,
    "comment": "[#not-implemented-hide:]",
    "notImp": true
  },
  {
    "name": "direct_source_prefix_ranges",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "CidrRange[]",
    "enums": null,
    "comment": "The criteria is satisfied if the directly connected source IP address of the downstream connection is contained in at least one of the specified subnets. If the parameter is not specified or the list is empty, the directly connected source IP address is ignored.",
    "notImp": false
  },
  {
    "name": "source_type",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "FilterChainMatch_ConnectionSourceType",
    "enums": [
      "ANY",
      "SAME_IP_OR_LOOPBACK",
      "EXTERNAL"
    ],
    "comment": "Specifies the connection source IP match type. Can be any, local or external network.",
    "notImp": false
  },
  {
    "name": "source_prefix_ranges",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "CidrRange[]",
    "enums": null,
    "comment": "The criteria is satisfied if the source IP address of the downstream connection is contained in at least one of the specified subnets. If the parameter is not specified or the list is empty, the source IP address is ignored.",
    "notImp": false
  },
  {
    "name": "source_ports",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "number[]",
    "enums": null,
    "comment": "The criteria is satisfied if the source port of the downstream connection is contained in at least one of the specified ports. If the parameter is not specified, the source port is ignored.",
    "notImp": false
  },
  {
    "name": "server_names",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "string[]",
    "enums": null,
    "comment": "If non-empty, a list of server names (e.g. SNI for TLS protocol) to consider when determining a filter chain match. Those values will be compared against the server names of a new connection, when detected by one of the listener filters.\n\nThe server name will be matched against all wildcard domains, i.e. ``www.example.com`` will be first matched against ``www.example.com``, then ``*.example.com``, then ``*.com``.\n\nNote that partial wildcards are not supported, and values like ``*w.example.com`` are invalid. The value ``*`` is also not supported, and ``server_names`` should be omitted instead.\n\n:::attention\n\nSee the `FAQ entry` on how to configure SNI for more information.",
    "notImp": false
  },
  {
    "name": "transport_protocol",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "string",
    "enums": null,
    "comment": "If non-empty, a transport protocol to consider when determining a filter chain match. This value will be compared against the transport protocol of a new connection, when it's detected by one of the listener filters.\n\nSuggested values include:\n\n* ``raw_buffer`` - default, used when no transport protocol is detected, * ``tls`` - set by `envoy.filters.listener.tls_inspector` when TLS protocol is detected.",
    "notImp": false
  },
  {
    "name": "application_protocols",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "string[]",
    "enums": null,
    "comment": "If non-empty, a list of application protocols (e.g. ALPN for TLS protocol) to consider when determining a filter chain match. Those values will be compared against the application protocols of a new connection, when detected by one of the listener filters.\n\nSuggested values include:\n\n* ``http/1.1`` - set by `envoy.filters.listener.tls_inspector`, * ``h2`` - set by `envoy.filters.listener.tls_inspector`\n\n:::attention\n\nCurrently, only `TLS Inspector` provides application protocol detection based on the requested `ALPN <https://en.wikipedia.org/wiki/Application-Layer_Protocol_Negotiation>`_ values. \n:::\n\n  However, the use of ALPN is pretty much limited to the HTTP/2 traffic on the Internet, and matching on values other than ``h2`` is going to lead to a lot of false negatives, unless all connecting clients are known to use ALPN.",
    "notImp": false
  }
] };

export const FilterChainMatch_SingleFields = [
  "destination_port",
  "address_suffix",
  "suffix_len",
  "source_type",
  "source_ports",
  "server_names",
  "transport_protocol",
  "application_protocols"
];

export const FilterChain_OnDemandConfiguration: OutType = { "FilterChain_OnDemandConfiguration": [
  {
    "name": "rebuild_timeout",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "Duration",
    "enums": null,
    "comment": "The timeout to wait for filter chain placeholders to complete rebuilding. 1. If this field is set to 0, timeout is disabled. 2. If not specified, a default timeout of 15s is used. Rebuilding will wait until dependencies are ready, have failed, or this timeout is reached. Upon failure or timeout, all connections related to this filter chain will be closed. Rebuilding will start again on the next new connection.",
    "notImp": false
  }
] };

export const FilterChain_OnDemandConfiguration_SingleFields = [
  "rebuild_timeout"
];

export const FilterChain: OutType = { "FilterChain": [
  {
    "name": "filter_chain_match",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "FilterChainMatch",
    "enums": null,
    "comment": "The criteria to use when matching a connection to this filter chain.",
    "notImp": false
  },
  {
    "name": "filters",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "Filter[]",
    "enums": null,
    "comment": "A list of individual network filters that make up the filter chain for connections established with the listener. Order matters as the filters are processed sequentially as connection events happen. Note: If the filter list is empty, the connection will close by default.\n\nFor QUIC listeners, network filters other than HTTP Connection Manager (HCM) can be created, but due to differences in the connection implementation compared to TCP, the onData() method will never be called. Therefore, network filters for QUIC listeners should only expect to do work at the start of a new connection (i.e. in onNewConnection()). HCM must be the last (or only) filter in the chain.",
    "notImp": false
  },
  {
    "name": "use_proxy_proto",
    "isUnion": false,
    "isDeprecated": true,
    "fieldType": "boolean",
    "enums": null,
    "comment": "Whether the listener should expect a PROXY protocol V1 header on new connections. If this option is enabled, the listener will assume that that remote address of the connection is the one specified in the header. Some load balancers including the AWS ELB support this option. If the option is absent or set to false, Envoy will use the physical peer address of the connection as the remote address.\n\nThis field is deprecated. Add a `PROXY protocol listener filter` explicitly instead.",
    "notImp": false
  },
  {
    "name": "metadata",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "Metadata",
    "enums": null,
    "comment": "[#not-implemented-hide:] filter chain metadata.",
    "notImp": true
  },
  {
    "name": "transport_socket",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "TransportSocket",
    "enums": null,
    "comment": "Optional custom transport socket implementation to use for downstream connections. To setup TLS, set a transport socket with name ``envoy.transport_sockets.tls`` and `DownstreamTlsContext` in the ``typed_config``. If no transport socket configuration is specified, new connections will be set up with plaintext. extension-category: envoy.transport_sockets.downstream",
    "notImp": false
  },
  {
    "name": "transport_socket_connect_timeout",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "Duration",
    "enums": null,
    "comment": "If present and nonzero, the amount of time to allow incoming connections to complete any transport socket negotiations. If this expires before the transport reports connection establishment, the connection is summarily closed.",
    "notImp": false
  },
  {
    "name": "name",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "string",
    "enums": null,
    "comment": "The unique name (or empty) by which this filter chain is known. Note: `filter_chain_matcher` requires that filter chains are uniquely named within a listener.",
    "notImp": false
  },
  {
    "name": "on_demand_configuration",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "FilterChain_OnDemandConfiguration",
    "enums": null,
    "comment": "[#not-implemented-hide:] The configuration to specify whether the filter chain will be built on-demand. If this field is not empty, the filter chain will be built on-demand. Otherwise, the filter chain will be built normally and block listener warming.",
    "notImp": true
  }
] };

export const FilterChain_SingleFields = [
  "transport_socket_connect_timeout",
  "name"
];

export const ListenerFilterChainMatchPredicate: OutType = { "ListenerFilterChainMatchPredicate": [
  {
    "name": "rule.or_match",
    "isUnion": true,
    "isDeprecated": false,
    "fieldType": "ListenerFilterChainMatchPredicate_MatchSet",
    "enums": null,
    "comment": "A set that describes a logical OR. If any member of the set matches, the match configuration matches.",
    "notImp": false
  },
  {
    "name": "rule.and_match",
    "isUnion": true,
    "isDeprecated": false,
    "fieldType": "ListenerFilterChainMatchPredicate_MatchSet",
    "enums": null,
    "comment": "A set that describes a logical AND. If all members of the set match, the match configuration matches.",
    "notImp": false
  },
  {
    "name": "rule.not_match",
    "isUnion": true,
    "isDeprecated": false,
    "fieldType": "ListenerFilterChainMatchPredicate",
    "enums": null,
    "comment": "A negation match. The match configuration will match if the negated match condition matches.",
    "notImp": false
  },
  {
    "name": "rule.any_match",
    "isUnion": true,
    "isDeprecated": false,
    "fieldType": "boolean",
    "enums": null,
    "comment": "The match configuration will always match.",
    "notImp": false
  },
  {
    "name": "rule.destination_port_range",
    "isUnion": true,
    "isDeprecated": false,
    "fieldType": "Int32Range",
    "enums": null,
    "comment": "Match destination port. Particularly, the match evaluation must use the recovered local port if the owning listener filter is after `an original_dst listener filter`.",
    "notImp": false
  }
] };

export const ListenerFilterChainMatchPredicate_SingleFields = [
  "rule.any_match"
];

export const ListenerFilterChainMatchPredicate_MatchSet: OutType = { "ListenerFilterChainMatchPredicate_MatchSet": [
  {
    "name": "rules",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "ListenerFilterChainMatchPredicate[]",
    "enums": null,
    "comment": "The list of rules that make up the set.",
    "notImp": false
  }
] };

export const ListenerFilter: OutType = { "ListenerFilter": [
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
    "comment": "Filter specific configuration which depends on the filter being instantiated. See the supported filters for further documentation. extension-category: envoy.filters.listener,envoy.filters.udp_listener",
    "notImp": false
  },
  {
    "name": "config_type.config_discovery",
    "isUnion": true,
    "isDeprecated": false,
    "fieldType": "ExtensionConfigSource",
    "enums": null,
    "comment": "Configuration source specifier for an extension configuration discovery service. In case of a failure and without the default configuration, the listener closes the connections.",
    "notImp": false
  },
  {
    "name": "filter_disabled",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "ListenerFilterChainMatchPredicate",
    "enums": null,
    "comment": "Optional match predicate used to disable the filter. The filter is enabled when this field is empty. See `ListenerFilterChainMatchPredicate` for further examples.",
    "notImp": false
  }
] };

export const ListenerFilter_SingleFields = [
  "name"
];