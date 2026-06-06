import {OutType} from '@elchi/tags/tagsType';


export const ExtAuthz: OutType = { "ExtAuthz": [
  {
    "name": "stat_prefix",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "string",
    "enums": null,
    "comment": "The prefix to use when emitting statistics.",
    "notImp": false
  },
  {
    "name": "grpc_service",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "GrpcService",
    "enums": null,
    "comment": "The external authorization gRPC service configuration. The default timeout is set to 200ms by this filter.",
    "notImp": false
  },
  {
    "name": "failure_mode_allow",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "boolean",
    "enums": null,
    "comment": "The filter's behaviour in case the external authorization service does not respond back. When it is set to true, Envoy will also allow traffic in case of communication failure between authorization service and the proxy. Defaults to false.",
    "notImp": false
  },
  {
    "name": "include_peer_certificate",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "boolean",
    "enums": null,
    "comment": "Specifies if the peer certificate is sent to the external service.\n\nWhen this field is true, Envoy will include the peer X.509 certificate, if available, in the `certificate`.",
    "notImp": false
  },
  {
    "name": "transport_api_version",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "ApiVersion",
    "enums": [
      "AUTO",
      "V2",
      "V3"
    ],
    "comment": "API version for ext_authz transport protocol. This describes the ext_authz gRPC endpoint and version of Check{Request,Response} used on the wire.",
    "notImp": false
  },
  {
    "name": "filter_enabled_metadata",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "MetadataMatcher",
    "enums": null,
    "comment": "Specifies if the filter is enabled with metadata matcher. If this field is not specified, the filter will be enabled for all requests.",
    "notImp": false
  },
  {
    "name": "bootstrap_metadata_labels_key",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "string",
    "enums": null,
    "comment": "Optional labels that will be passed to `labels` in `destination`. The labels will be read from `metadata` with the specified key.",
    "notImp": false
  },
  {
    "name": "include_tls_session",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "boolean",
    "enums": null,
    "comment": "Specifies if the TLS session level details like SNI are sent to the external service.\n\nWhen this field is true, Envoy will include the SNI name used for TLSClientHello, if available, in the `tls_session`.",
    "notImp": false
  },
  {
    "name": "send_tls_alert_on_denial",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "boolean",
    "enums": null,
    "comment": "When set to ``true``, the filter will send a TLS ``access_denied(49)`` alert before closing the connection when authorization is denied. This provides better visibility to TLS clients about the reason for connection closure. This alert is only sent for TLS connections. The non-TLS connections will be closed without sending an alert.\n\nDefaults to ``false``.",
    "notImp": false
  },
  {
    "name": "metadata_context_namespaces",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "string[]",
    "enums": null,
    "comment": "Specifies a list of metadata namespaces whose values, if present, will be passed to the ext_authz service. The `filter_metadata` is passed as an opaque ``protobuf::Struct``.\n\nFor example, if the ``proxy_protocol`` listener filter is used and populates TLV metadata, then the following will pass that metadata to the authorization server for making decisions based on proxy protocol information.\n\n```yaml\n\n   metadata_context_namespaces:\n   - envoy.filters.listener.proxy_protocol",
    "notImp": false
  },
  {
    "name": "typed_metadata_context_namespaces",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "string[]",
    "enums": null,
    "comment": "Specifies a list of metadata namespaces whose values, if present, will be passed to the ext_authz service. `typed_filter_metadata` is passed as a ``protobuf::Any``.\n\nThis works similarly to ``metadata_context_namespaces`` but allows Envoy and the ext_authz server to share the protobuf message definition in order to perform safe parsing.",
    "notImp": false
  }
] };

export const ExtAuthz_SingleFields = [
  "stat_prefix",
  "failure_mode_allow",
  "include_peer_certificate",
  "transport_api_version",
  "bootstrap_metadata_labels_key",
  "include_tls_session",
  "send_tls_alert_on_denial",
  "metadata_context_namespaces",
  "typed_metadata_context_namespaces"
];