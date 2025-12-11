import {OutType} from '@elchi/tags/tagsType';


export const Pipe: OutType = { "Pipe": [
  {
    "name": "path",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "string",
    "enums": null,
    "comment": "Unix Domain Socket path. On Linux, paths starting with '@' will use the abstract namespace. The starting '@' is replaced by a null byte by Envoy. Paths starting with '@' will result in an error in environments other than Linux.",
    "notImp": false
  },
  {
    "name": "mode",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "number",
    "enums": null,
    "comment": "The mode for the Pipe. Not applicable for abstract sockets.",
    "notImp": false
  }
] };

export const Pipe_SingleFields = [
  "path",
  "mode"
];

export const EnvoyInternalAddress: OutType = { "EnvoyInternalAddress": [
  {
    "name": "address_name_specifier.server_listener_name",
    "isUnion": true,
    "isDeprecated": false,
    "fieldType": "string",
    "enums": null,
    "comment": "Specifies the `name` of the internal listener.",
    "notImp": false
  },
  {
    "name": "endpoint_id",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "string",
    "enums": null,
    "comment": "Specifies an endpoint identifier to distinguish between multiple endpoints for the same internal listener in a single upstream pool. Only used in the upstream addresses for tracking changes to individual endpoints. This, for example, may be set to the final destination IP for the target internal listener.",
    "notImp": false
  }
] };

export const EnvoyInternalAddress_SingleFields = [
  "address_name_specifier.server_listener_name",
  "endpoint_id"
];

export const SocketAddress: OutType = { "SocketAddress": [
  {
    "name": "protocol",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "SocketAddress_Protocol",
    "enums": [
      "TCP",
      "UDP"
    ],
    "comment": "",
    "notImp": false
  },
  {
    "name": "address",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "string",
    "enums": null,
    "comment": "The address for this socket. `Listeners` will bind to the address. An empty address is not allowed. Specify ``0.0.0.0`` or ``::`` to bind to any address.  When used within an upstream `BindConfig`, the address controls the source address of outbound connections. For `clusters`, the cluster type determines whether the address must be an IP (``STATIC`` or ``EDS`` clusters) or a hostname resolved by DNS (``STRICT_DNS`` or ``LOGICAL_DNS`` clusters). Address resolution can be customized via `resolver_name`.",
    "notImp": false
  },
  {
    "name": "port_specifier.port_value",
    "isUnion": true,
    "isDeprecated": false,
    "fieldType": "number",
    "enums": null,
    "comment": "[#next-free-field: 8]",
    "notImp": false
  },
  {
    "name": "port_specifier.named_port",
    "isUnion": true,
    "isDeprecated": false,
    "fieldType": "string",
    "enums": null,
    "comment": "This is only valid if `resolver_name` is specified below and the named resolver is capable of named port resolution.",
    "notImp": false
  },
  {
    "name": "resolver_name",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "string",
    "enums": null,
    "comment": "The name of the custom resolver. This must have been registered with Envoy. If this is empty, a context dependent default applies. If the address is a concrete IP address, no resolution will occur. If address is a hostname this should be set for resolution other than DNS. Specifying a custom resolver with ``STRICT_DNS`` or ``LOGICAL_DNS`` will generate an error at runtime.",
    "notImp": false
  },
  {
    "name": "ipv4_compat",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "boolean",
    "enums": null,
    "comment": "When binding to an IPv6 address above, this enables `IPv4 compatibility <https://tools.ietf.org/html/rfc3493#page-11>`_. Binding to ``::`` will allow both IPv4 and IPv6 connections, with peer IPv4 addresses mapped into IPv6 space as ``::FFFF:<IPv4-address>``.",
    "notImp": false
  },
  {
    "name": "network_namespace_filepath",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "string",
    "enums": null,
    "comment": "Filepath that specifies the Linux network namespace this socket will be created in (see ``man 7 network_namespaces``). If this field is set, Envoy will create the socket in the specified network namespace.\n\n:::note\nSetting this parameter requires Envoy to run with the ``CAP_NET_ADMIN`` capability. \n:::\n\n:::attention\nNetwork namespaces are only configurable on Linux. Otherwise, this field has no effect.",
    "notImp": false
  }
] };

export const SocketAddress_SingleFields = [
  "protocol",
  "address",
  "port_specifier.port_value",
  "port_specifier.named_port",
  "resolver_name",
  "ipv4_compat",
  "network_namespace_filepath"
];

export const TcpKeepalive: OutType = { "TcpKeepalive": [
  {
    "name": "keepalive_probes",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "number",
    "enums": null,
    "comment": "Maximum number of keepalive probes to send without response before deciding the connection is dead. Default is to use the OS level configuration (unless overridden, Linux defaults to 9.)",
    "notImp": false
  },
  {
    "name": "keepalive_time",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "number",
    "enums": null,
    "comment": "The number of seconds a connection needs to be idle before keep-alive probes start being sent. Default is to use the OS level configuration (unless overridden, Linux defaults to 7200s (i.e., 2 hours.)",
    "notImp": false
  },
  {
    "name": "keepalive_interval",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "number",
    "enums": null,
    "comment": "The number of seconds between keep-alive probes. Default is to use the OS level configuration (unless overridden, Linux defaults to 75s.)",
    "notImp": false
  }
] };

export const TcpKeepalive_SingleFields = [
  "keepalive_probes",
  "keepalive_time",
  "keepalive_interval"
];

export const ExtraSourceAddress: OutType = { "ExtraSourceAddress": [
  {
    "name": "address",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "SocketAddress",
    "enums": null,
    "comment": "The additional address to bind.",
    "notImp": false
  },
  {
    "name": "socket_options",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "SocketOptionsOverride",
    "enums": null,
    "comment": "Additional socket options that may not be present in Envoy source code or precompiled binaries. If specified, this will override the `socket_options` in the BindConfig. If specified with no `socket_options` or an empty list of `socket_options`, it means no socket option will apply.",
    "notImp": false
  }
] };

export const BindConfig: OutType = { "BindConfig": [
  {
    "name": "source_address",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "SocketAddress",
    "enums": null,
    "comment": "The address to bind to when creating a socket.",
    "notImp": false
  },
  {
    "name": "freebind",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "boolean",
    "enums": null,
    "comment": "Whether to set the ``IP_FREEBIND`` option when creating the socket. When this flag is set to true, allows the `source_address` to be an IP address that is not configured on the system running Envoy. When this flag is set to false, the option ``IP_FREEBIND`` is disabled on the socket. When this flag is not set (default), the socket is not modified, i.e. the option is neither enabled nor disabled.",
    "notImp": false
  },
  {
    "name": "socket_options",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "SocketOption[]",
    "enums": null,
    "comment": "Additional socket options that may not be present in Envoy source code or precompiled binaries.",
    "notImp": false
  },
  {
    "name": "extra_source_addresses",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "ExtraSourceAddress[]",
    "enums": null,
    "comment": "Extra source addresses appended to the address specified in the ``source_address`` field. This enables to specify multiple source addresses. The source address selection is determined by `local_address_selector`.",
    "notImp": false
  },
  {
    "name": "additional_source_addresses",
    "isUnion": false,
    "isDeprecated": true,
    "fieldType": "SocketAddress[]",
    "enums": null,
    "comment": "Deprecated by `extra_source_addresses`",
    "notImp": false
  },
  {
    "name": "local_address_selector",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "TypedExtensionConfig",
    "enums": null,
    "comment": "Custom local address selector to override the default (i.e. `DefaultLocalAddressSelector`). extension-category: envoy.upstream.local_address_selector",
    "notImp": false
  }
] };

export const BindConfig_SingleFields = [
  "freebind"
];

export const Address: OutType = { "Address": [
  {
    "name": "address.socket_address",
    "isUnion": true,
    "isDeprecated": false,
    "fieldType": "SocketAddress",
    "enums": null,
    "comment": "Addresses specify either a logical or physical address and port, which are used to tell Envoy where to bind/listen, connect to upstream and find management servers.",
    "notImp": false
  },
  {
    "name": "address.pipe",
    "isUnion": true,
    "isDeprecated": false,
    "fieldType": "Pipe",
    "enums": null,
    "comment": "Addresses specify either a logical or physical address and port, which are used to tell Envoy where to bind/listen, connect to upstream and find management servers.",
    "notImp": false
  },
  {
    "name": "address.envoy_internal_address",
    "isUnion": true,
    "isDeprecated": false,
    "fieldType": "EnvoyInternalAddress",
    "enums": null,
    "comment": "Specifies a user-space address handled by `internal listeners`.",
    "notImp": false
  }
] };

export const CidrRange: OutType = { "CidrRange": [
  {
    "name": "address_prefix",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "string",
    "enums": null,
    "comment": "IPv4 or IPv6 address, e.g. ``192.0.0.0`` or ``2001:db8::``.",
    "notImp": false
  },
  {
    "name": "prefix_len",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "number",
    "enums": null,
    "comment": "Length of prefix, e.g. 0, 32. Defaults to 0 when unset.",
    "notImp": false
  }
] };

export const CidrRange_SingleFields = [
  "address_prefix",
  "prefix_len"
];