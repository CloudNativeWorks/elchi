import {OutType} from '@elchi/tags/tagsType';


export const Validation: OutType = { "Validation": [
  {
    "name": "node_id_format",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "string",
    "enums": null,
    "comment": "Format string to extract the expected node identifier for validation. The formatted value is compared against the ``x-envoy-reverse-tunnel-node-id`` header from the incoming handshake request. If they do not match, the connection is rejected with HTTP ``403 Forbidden``.\n\nSupports Envoy's `command operators`:\n\n* ``%DYNAMIC_METADATA(namespace:key)%``: Extract expected value from dynamic metadata. * ``%FILTER_STATE(key)%``: Extract expected value from filter state. * ``%DOWNSTREAM_REMOTE_ADDRESS%``: Use downstream connection IP address. * Plain strings: Use a static expected value.\n\nIf empty, node ID validation is skipped.\n\nExample using dynamic metadata allowlist:\n\n```yaml\n\n   node_id_format: \"%DYNAMIC_METADATA(envoy.reverse_tunnel.allowlist:expected_node_id)%\"",
    "notImp": false
  },
  {
    "name": "cluster_id_format",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "string",
    "enums": null,
    "comment": "Format string to extract the expected cluster identifier for validation. The formatted value is compared against the ``x-envoy-reverse-tunnel-cluster-id`` header from the incoming handshake request. If they do not match, the connection is rejected with HTTP ``403 Forbidden``.\n\nSupports the same `command operators` as ``node_id_format``.\n\nIf empty, cluster ID validation is skipped.\n\nExample using filter state:\n\n```yaml\n\n   cluster_id_format: \"%FILTER_STATE(expected_cluster_id)%\"",
    "notImp": false
  },
  {
    "name": "emit_dynamic_metadata",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "boolean",
    "enums": null,
    "comment": "Whether to emit validation results as dynamic metadata. When enabled, the filter emits metadata under the namespace specified by ``dynamic_metadata_namespace`` containing:\n\n* ``node_id``: The actual node ID from the handshake request. * ``cluster_id``: The actual cluster ID from the handshake request. * ``validation_result``: Either ``allowed`` or ``denied``.\n\nThis metadata can be used by subsequent filters or for access logging. Defaults to ``false``.",
    "notImp": false
  },
  {
    "name": "dynamic_metadata_namespace",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "string",
    "enums": null,
    "comment": "Namespace for emitted dynamic metadata when ``emit_dynamic_metadata`` is ``true``. If not specified, defaults to ``envoy.filters.network.reverse_tunnel``.",
    "notImp": false
  }
] };

export const Validation_SingleFields = [
  "node_id_format",
  "cluster_id_format",
  "emit_dynamic_metadata",
  "dynamic_metadata_namespace"
];

export const ReverseTunnel: OutType = { "ReverseTunnel": [
  {
    "name": "ping_interval",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "Duration",
    "enums": null,
    "comment": "Ping interval for health checks on established reverse tunnel connections. If not specified, defaults to ``2 seconds``.",
    "notImp": false
  },
  {
    "name": "auto_close_connections",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "boolean",
    "enums": null,
    "comment": "Whether to automatically close connections after processing reverse tunnel requests.\n\n* When set to ``true``, connections are closed after acceptance or rejection. * When set to ``false``, connections remain open for potential reuse.\n\nDefaults to ``false``.",
    "notImp": false
  },
  {
    "name": "request_path",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "string",
    "enums": null,
    "comment": "HTTP path to match for reverse tunnel requests. If not specified, defaults to ``/reverse_connections/request``.",
    "notImp": false
  },
  {
    "name": "request_method",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "RequestMethod",
    "enums": [
      "METHOD_UNSPECIFIED",
      "GET",
      "HEAD",
      "POST",
      "PUT",
      "DELETE",
      "CONNECT",
      "OPTIONS",
      "TRACE",
      "PATCH"
    ],
    "comment": "HTTP method to match for reverse tunnel requests. If not specified (``METHOD_UNSPECIFIED``), this defaults to ``GET``.",
    "notImp": false
  },
  {
    "name": "validation",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "Validation",
    "enums": null,
    "comment": "Optional validation configuration for node and cluster identifiers. If specified, the filter validates the ``x-envoy-reverse-tunnel-node-id`` and ``x-envoy-reverse-tunnel-cluster-id`` headers against expected values extracted using format strings. Requests that fail validation are rejected with HTTP ``403 Forbidden``.",
    "notImp": false
  },
  {
    "name": "required_cluster_name",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "string",
    "enums": null,
    "comment": "Required cluster name for validating reverse tunnel connection initiations. When set, the filter validates that the upstream cluster of the initiator envoy matches this name via ``x-envoy-reverse-tunnel-upstream-cluster-name`` header. Connections with mismatched or missing cluster names are rejected with HTTP ``400 Bad Request``. When empty, no cluster name validation is performed.",
    "notImp": false
  }
] };

export const ReverseTunnel_SingleFields = [
  "ping_interval",
  "auto_close_connections",
  "request_path",
  "request_method",
  "required_cluster_name"
];