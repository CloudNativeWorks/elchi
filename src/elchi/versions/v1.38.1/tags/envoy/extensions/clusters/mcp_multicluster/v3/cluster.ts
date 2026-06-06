import {OutType} from '@elchi/tags/tagsType';


export const ClusterConfig: OutType = { "ClusterConfig": [
  {
    "name": "servers",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "ClusterConfig_McpBackend[]",
    "enums": null,
    "comment": "A list of remote MCP servers. Based on the MCP multi cluster configuration the MCP router aggregates capabilities, tools and resources from remote MCP servers and presents itself as single MCP server to the client. All remote MCP servers are sent the same capabilities that the client presented to Envoy. MCP router prefixes tool names and resource path with the server name to resolve naming collisions.",
    "notImp": false
  }
] };

export const ClusterConfig_McpCluster: OutType = { "ClusterConfig_McpCluster": [
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

export const ClusterConfig_McpCluster_SingleFields = [
  "cluster",
  "path",
  "timeout",
  "host_rewrite_literal"
];

export const ClusterConfig_McpBackend: OutType = { "ClusterConfig_McpBackend": [
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
    "fieldType": "ClusterConfig_McpCluster",
    "enums": null,
    "comment": "Backend target specification.",
    "notImp": false
  }
] };

export const ClusterConfig_McpBackend_SingleFields = [
  "name"
];