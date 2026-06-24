import {OutType} from '@elchi/tags/tagsType';


export const AttributeContext_Peer: OutType = { "AttributeContext_Peer": [
  {
    "name": "address",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "Address",
    "enums": null,
    "comment": "The address of the peer, this is typically the IP address. It can also be UDS path, or others.",
    "notImp": false
  },
  {
    "name": "service",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "string",
    "enums": null,
    "comment": "The canonical service name of the peer. It should be set to `the HTTP x-envoy-downstream-service-cluster` If a more trusted source of the service name is available through mTLS/secure naming, it should be used.",
    "notImp": false
  },
  {
    "name": "labels",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "Map<string, string>",
    "enums": null,
    "comment": "The labels associated with the peer. These could be pod labels for Kubernetes or tags for VMs. The source of the labels could be an X.509 certificate or other configuration.",
    "notImp": false
  },
  {
    "name": "principal",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "string",
    "enums": null,
    "comment": "The authenticated identity of this peer. For example, the identity associated with the workload such as a service account. If an X.509 certificate is used to assert the identity this field should be sourced from ``URI Subject Alternative Names``, ``DNS Subject Alternate Names`` or ``Subject`` in that order. The primary identity should be the principal. The principal format is issuer specific.\n\nExamples:\n\n- SPIFFE format is ``spiffe://trust-domain/path``. - Google account format is ``https://accounts.google.com/{userid}``.",
    "notImp": false
  },
  {
    "name": "certificate",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "string",
    "enums": null,
    "comment": "The X.509 certificate used to authenticate the identify of this peer. When present, the certificate contents are encoded in URL and PEM format.",
    "notImp": false
  }
] };

export const AttributeContext_Peer_SingleFields = [
  "service",
  "principal",
  "certificate"
];

export const AttributeContext_HttpRequest: OutType = { "AttributeContext_HttpRequest": [
  {
    "name": "id",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "string",
    "enums": null,
    "comment": "The unique ID for a request, which can be propagated to downstream systems. The ID should have low probability of collision within a single day for a specific service. For HTTP requests, it should be X-Request-ID or equivalent.",
    "notImp": false
  },
  {
    "name": "method",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "string",
    "enums": null,
    "comment": "The HTTP request method, such as ``GET``, ``POST``.",
    "notImp": false
  },
  {
    "name": "headers",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "Map<string, string>",
    "enums": null,
    "comment": "The HTTP request headers. If multiple headers share the same key, they must be merged according to the HTTP spec. All header keys must be lower-cased, because HTTP header keys are case-insensitive. Header value is encoded as UTF-8 string. Non-UTF-8 characters will be replaced by \"!\". This field will not be set if `encode_raw_headers` is set to true.",
    "notImp": false
  },
  {
    "name": "header_map",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "HeaderMap",
    "enums": null,
    "comment": "A list of the raw HTTP request headers. This is used instead of `headers` when `encode_raw_headers` is set to true.\n\nNote that this is not actually a map type. ``header_map`` contains a single repeated field ``headers``.\n\nHere, only the ``key`` and ``raw_value`` fields will be populated for each HeaderValue, and that is only when `encode_raw_headers` is set to true.\n\nAlso, unlike the `headers` field, headers with the same key are not combined into a single comma separated header.",
    "notImp": false
  },
  {
    "name": "path",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "string",
    "enums": null,
    "comment": "The request target, as it appears in the first line of the HTTP request. This includes the URL path and query-string. No decoding is performed.",
    "notImp": false
  },
  {
    "name": "host",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "string",
    "enums": null,
    "comment": "The HTTP request ``Host`` or ``:authority`` header value.",
    "notImp": false
  },
  {
    "name": "scheme",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "string",
    "enums": null,
    "comment": "The HTTP URL scheme, such as ``http`` and ``https``.",
    "notImp": false
  },
  {
    "name": "query",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "string",
    "enums": null,
    "comment": "This field is always empty, and exists for compatibility reasons. The HTTP URL query is included in ``path`` field.",
    "notImp": false
  },
  {
    "name": "fragment",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "string",
    "enums": null,
    "comment": "This field is always empty, and exists for compatibility reasons. The URL fragment is not submitted as part of HTTP requests; it is unknowable.",
    "notImp": false
  },
  {
    "name": "size",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "number",
    "enums": null,
    "comment": "The HTTP request size in bytes. If unknown, it must be -1.",
    "notImp": false
  },
  {
    "name": "protocol",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "string",
    "enums": null,
    "comment": "The network protocol used with the request, such as \"HTTP/1.0\", \"HTTP/1.1\", or \"HTTP/2\".\n\nSee :repo:`headers.h:ProtocolStrings <source/common/http/headers.h>` for a list of all possible values.",
    "notImp": false
  },
  {
    "name": "body",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "string",
    "enums": null,
    "comment": "The HTTP request body.",
    "notImp": false
  },
  {
    "name": "raw_body",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "Uint8Array<ArrayBufferLike>",
    "enums": null,
    "comment": "The HTTP request body in bytes. This is used instead of `body` when `pack_as_bytes` is set to true.",
    "notImp": false
  }
] };

export const AttributeContext_HttpRequest_SingleFields = [
  "id",
  "method",
  "path",
  "host",
  "scheme",
  "query",
  "fragment",
  "size",
  "protocol",
  "body"
];

export const AttributeContext_Request: OutType = { "AttributeContext_Request": [
  {
    "name": "time",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "Date",
    "enums": null,
    "comment": "The timestamp when the proxy receives the first byte of the request.",
    "notImp": false
  },
  {
    "name": "http",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "AttributeContext_HttpRequest",
    "enums": null,
    "comment": "Represents an HTTP request or an HTTP-like request.",
    "notImp": false
  }
] };

export const AttributeContext_TLSSession: OutType = { "AttributeContext_TLSSession": [
  {
    "name": "sni",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "string",
    "enums": null,
    "comment": "SNI used for TLS session.",
    "notImp": false
  }
] };

export const AttributeContext_TLSSession_SingleFields = [
  "sni"
];

export const AttributeContext: OutType = { "AttributeContext": [
  {
    "name": "source",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "AttributeContext_Peer",
    "enums": null,
    "comment": "The source of a network activity, such as starting a TCP connection. In a multi hop network activity, the source represents the sender of the last hop.",
    "notImp": false
  },
  {
    "name": "destination",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "AttributeContext_Peer",
    "enums": null,
    "comment": "The destination of a network activity, such as accepting a TCP connection. In a multi hop network activity, the destination represents the receiver of the last hop.",
    "notImp": false
  },
  {
    "name": "request",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "AttributeContext_Request",
    "enums": null,
    "comment": "Represents a network request, such as an HTTP request.",
    "notImp": false
  },
  {
    "name": "context_extensions",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "Map<string, string>",
    "enums": null,
    "comment": "This is analogous to http_request.headers, however these contents will not be sent to the upstream server. Context_extensions provide an extension mechanism for sending additional information to the auth server without modifying the proto definition. It maps to the internal opaque context in the filter chain.",
    "notImp": false
  },
  {
    "name": "metadata_context",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "Metadata",
    "enums": null,
    "comment": "Dynamic metadata associated with the request.",
    "notImp": false
  },
  {
    "name": "route_metadata_context",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "Metadata",
    "enums": null,
    "comment": "Metadata associated with the selected route.",
    "notImp": false
  },
  {
    "name": "tls_session",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "AttributeContext_TLSSession",
    "enums": null,
    "comment": "TLS session details of the underlying connection. This is not populated by default and will be populated only if the ext_authz filter has been specifically configured to include this information. For HTTP ext_authz, that requires `include_tls_session` to be set to true. For network ext_authz, that requires `include_tls_session` to be set to true.",
    "notImp": false
  }
] };

export const AttributeContext_Peer_LabelsEntry: OutType = { "AttributeContext_Peer_LabelsEntry": [
  {
    "name": "key",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "string",
    "enums": null,
    "comment": "",
    "notImp": false
  },
  {
    "name": "value",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "string",
    "enums": null,
    "comment": "",
    "notImp": false
  }
] };

export const AttributeContext_Peer_LabelsEntry_SingleFields = [
  "key",
  "value"
];

export const AttributeContext_HttpRequest_HeadersEntry: OutType = { "AttributeContext_HttpRequest_HeadersEntry": [
  {
    "name": "key",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "string",
    "enums": null,
    "comment": "",
    "notImp": false
  },
  {
    "name": "value",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "string",
    "enums": null,
    "comment": "",
    "notImp": false
  }
] };

export const AttributeContext_HttpRequest_HeadersEntry_SingleFields = [
  "key",
  "value"
];

export const AttributeContext_ContextExtensionsEntry: OutType = { "AttributeContext_ContextExtensionsEntry": [
  {
    "name": "key",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "string",
    "enums": null,
    "comment": "",
    "notImp": false
  },
  {
    "name": "value",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "string",
    "enums": null,
    "comment": "",
    "notImp": false
  }
] };

export const AttributeContext_ContextExtensionsEntry_SingleFields = [
  "key",
  "value"
];