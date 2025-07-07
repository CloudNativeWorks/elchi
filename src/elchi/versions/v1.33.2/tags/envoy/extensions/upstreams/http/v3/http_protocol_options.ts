import {OutType} from '@elchi/tags/tagsType';


export const HttpProtocolOptions: OutType = { "HttpProtocolOptions": [
  {
    "name": "common_http_protocol_options",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "HttpProtocolOptions",
    "enums": null,
    "comment": "This contains options common across HTTP/1 and HTTP/2",
    "notImp": false
  },
  {
    "name": "upstream_http_protocol_options",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "UpstreamHttpProtocolOptions",
    "enums": null,
    "comment": "This contains common protocol options which are only applied upstream.",
    "notImp": false
  },
  {
    "name": "upstream_protocol_options.explicit_http_config",
    "isUnion": true,
    "isDeprecated": false,
    "fieldType": "HttpProtocolOptions_ExplicitHttpConfig",
    "enums": null,
    "comment": "To explicitly configure either HTTP/1 or HTTP/2 (but not both!) use ``explicit_http_config``. If the ``explicit_http_config`` is empty, HTTP/1.1 is used.",
    "notImp": false
  },
  {
    "name": "upstream_protocol_options.use_downstream_protocol_config",
    "isUnion": true,
    "isDeprecated": false,
    "fieldType": "HttpProtocolOptions_UseDownstreamHttpConfig",
    "enums": null,
    "comment": "This allows switching on protocol based on what protocol the downstream connection used.",
    "notImp": false
  },
  {
    "name": "upstream_protocol_options.auto_config",
    "isUnion": true,
    "isDeprecated": false,
    "fieldType": "HttpProtocolOptions_AutoHttpConfig",
    "enums": null,
    "comment": "This allows switching on protocol based on ALPN",
    "notImp": false
  },
  {
    "name": "http_filters",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "HttpFilter[]",
    "enums": null,
    "comment": ":::note\nUpstream HTTP filters are currently in alpha. \n:::\n\nOptional HTTP filters for the upstream HTTP filter chain.\n\nThese filters will be applied for all HTTP streams which flow through this cluster. Unlike downstream HTTP filters, they will *not* be applied to terminated CONNECT requests.\n\nIf using upstream HTTP filters, please be aware that local errors sent by upstream HTTP filters will not trigger retries, and local errors sent by upstream HTTP filters will count as a final response if hedging is configured. extension-category: envoy.filters.http.upstream",
    "notImp": false
  },
  {
    "name": "header_validation_config",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "TypedExtensionConfig",
    "enums": null,
    "comment": "Configuration options for Unified Header Validation (UHV). UHV is an extensible mechanism for checking validity of HTTP responses.\n\n Leaving this field unspecified, selects the default header validator ``envoy.http.header_validators.envoy_default``.\n\n[#not-implemented-hide:] extension-category: envoy.http.header_validators",
    "notImp": true
  }
] };

export const HttpProtocolOptions_ExplicitHttpConfig: OutType = { "HttpProtocolOptions_ExplicitHttpConfig": [
  {
    "name": "protocol_config.http_protocol_options",
    "isUnion": true,
    "isDeprecated": false,
    "fieldType": "Http1ProtocolOptions",
    "enums": null,
    "comment": "If this is used, the cluster will only operate on one of the possible upstream protocols. Note that HTTP/2 or above should generally be used for upstream gRPC clusters.",
    "notImp": false
  },
  {
    "name": "protocol_config.http2_protocol_options",
    "isUnion": true,
    "isDeprecated": false,
    "fieldType": "Http2ProtocolOptions",
    "enums": null,
    "comment": "If this is used, the cluster will only operate on one of the possible upstream protocols. Note that HTTP/2 or above should generally be used for upstream gRPC clusters.",
    "notImp": false
  },
  {
    "name": "protocol_config.http3_protocol_options",
    "isUnion": true,
    "isDeprecated": false,
    "fieldType": "Http3ProtocolOptions",
    "enums": null,
    "comment": ":::warning\nQUIC upstream support is currently not ready for internet use. Please see `here` for details.",
    "notImp": false
  }
] };

export const HttpProtocolOptions_UseDownstreamHttpConfig: OutType = { "HttpProtocolOptions_UseDownstreamHttpConfig": [
  {
    "name": "http_protocol_options",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "Http1ProtocolOptions",
    "enums": null,
    "comment": "",
    "notImp": false
  },
  {
    "name": "http2_protocol_options",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "Http2ProtocolOptions",
    "enums": null,
    "comment": "",
    "notImp": false
  },
  {
    "name": "http3_protocol_options",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "Http3ProtocolOptions",
    "enums": null,
    "comment": ":::warning\nQUIC upstream support is currently not ready for internet use. Please see `here` for details.",
    "notImp": false
  }
] };

export const HttpProtocolOptions_AutoHttpConfig: OutType = { "HttpProtocolOptions_AutoHttpConfig": [
  {
    "name": "http_protocol_options",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "Http1ProtocolOptions",
    "enums": null,
    "comment": "",
    "notImp": false
  },
  {
    "name": "http2_protocol_options",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "Http2ProtocolOptions",
    "enums": null,
    "comment": "",
    "notImp": false
  },
  {
    "name": "http3_protocol_options",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "Http3ProtocolOptions",
    "enums": null,
    "comment": "Unlike HTTP/1 and HTTP/2, HTTP/3 will not be configured unless it is present, and (soon) only if there is an indication of server side support. See `here` for more information on when HTTP/3 will be used, and when Envoy will fail over to TCP.\n\n:::warning\nQUIC upstream support is currently not ready for internet use. Please see `here` for details.",
    "notImp": false
  },
  {
    "name": "alternate_protocols_cache_options",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "AlternateProtocolsCacheOptions",
    "enums": null,
    "comment": "The presence of alternate protocols cache options causes the use of the alternate protocols cache, which is responsible for parsing and caching HTTP Alt-Svc headers. This enables the use of HTTP/3 for origins that advertise supporting it.\n\n:::note\nThis is required when HTTP/3 is enabled.",
    "notImp": false
  }
] };