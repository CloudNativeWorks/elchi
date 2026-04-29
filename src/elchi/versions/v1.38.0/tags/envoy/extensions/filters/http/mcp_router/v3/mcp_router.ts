import {OutType} from '@elchi/tags/tagsType';


export const HeaderSource: OutType = { "HeaderSource": [
  {
    "name": "name",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "string",
    "enums": null,
    "comment": "Header name to extract (e.g., \"x-user-identity\").",
    "notImp": false
  }
] };

export const HeaderSource_SingleFields = [
  "name"
];

export const DynamicMetadataSource: OutType = { "DynamicMetadataSource": [
  {
    "name": "key",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "MetadataKey",
    "enums": null,
    "comment": "The metadata key to retrieve the value from.",
    "notImp": false
  }
] };

export const IdentityExtractor: OutType = { "IdentityExtractor": [
  {
    "name": "header",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "HeaderSource",
    "enums": null,
    "comment": "Extract identity from a request header.",
    "notImp": false
  },
  {
    "name": "dynamic_metadata",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "DynamicMetadataSource",
    "enums": null,
    "comment": "Extract identity from dynamic metadata.",
    "notImp": false
  }
] };

export const ValidationPolicy: OutType = { "ValidationPolicy": [
  {
    "name": "mode",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "ValidationPolicy_Mode",
    "enums": [
      "MODE_UNSPECIFIED",
      "DISABLED",
      "ENFORCE"
    ],
    "comment": "",
    "notImp": false
  }
] };

export const ValidationPolicy_SingleFields = [
  "mode"
];

export const SessionIdentity: OutType = { "SessionIdentity": [
  {
    "name": "identity",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "IdentityExtractor",
    "enums": null,
    "comment": "Defines how the identity (user/principal) is extracted from the request.",
    "notImp": false
  },
  {
    "name": "validation",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "ValidationPolicy",
    "enums": null,
    "comment": "Specifies how to handle requests where the subject is missing or invalid. Defaults to DISABLED.",
    "notImp": false
  }
] };

export const McpRouter: OutType = { "McpRouter": [
  {
    "name": "servers",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "McpRouter_McpBackend[]",
    "enums": null,
    "comment": "A list of remote MCP servers. MCP router aggregates capabilities, tools and resources from remote MCP servers and presents itself as single MCP server to the client. All remote MCP servers are sent the same capabilities that the client presented to Envoy.",
    "notImp": false
  },
  {
    "name": "session_identity",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "SessionIdentity",
    "enums": null,
    "comment": "If set, extracts a request \"subject\" and binds it into the MCP session. If not set, sessions are created without identity binding.",
    "notImp": false
  }
] };

export const McpRouter_McpCluster: OutType = { "McpRouter_McpCluster": [
  {
    "name": "cluster",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "string",
    "enums": null,
    "comment": "Cluster name to route requests to.",
    "notImp": false
  },
  {
    "name": "path",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "string",
    "enums": null,
    "comment": "Path to use for MCP requests. Defaults to \"/mcp\".",
    "notImp": false
  },
  {
    "name": "timeout",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "Duration",
    "enums": null,
    "comment": "Request timeout. If not set, uses cluster's timeout configuration.",
    "notImp": false
  },
  {
    "name": "host_rewrite_literal",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "string",
    "enums": null,
    "comment": "Indicates that during forwarding, the host header will be swapped with this value.",
    "notImp": false
  }
] };

export const McpRouter_McpCluster_SingleFields = [
  "cluster",
  "path",
  "timeout",
  "host_rewrite_literal"
];

export const McpRouter_McpBackend: OutType = { "McpRouter_McpBackend": [
  {
    "name": "name",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "string",
    "enums": null,
    "comment": "Unique name for this backend. Used for: - Tool name prefixing (e.g., \"time__get_current_time\") - Session ID composition - Logging and error messages. Default will be the cluster name if not specified.",
    "notImp": false
  },
  {
    "name": "mcp_cluster",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "McpRouter_McpCluster",
    "enums": null,
    "comment": "Backend target specification.",
    "notImp": false
  }
] };

export const McpRouter_McpBackend_SingleFields = [
  "name"
];