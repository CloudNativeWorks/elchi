import {OutType} from '@elchi/tags/tagsType';


export const ParserConfig: OutType = { "ParserConfig": [
  {
    "name": "methods",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "ParserConfig_MethodConfig[]",
    "enums": null,
    "comment": "List of rules for classification and extraction. Rules are evaluated in order; the first match wins. If no rule matches, extraction defaults are used and group falls back to built-in classification. Built-in groups: lifecycle, tool, resource, prompt, notification, logging, sampling, completion, unknown.",
    "notImp": false
  },
  {
    "name": "group_metadata_key",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "string",
    "enums": null,
    "comment": "The dynamic metadata key where the group name will be stored. If empty, group classification is disabled.",
    "notImp": false
  }
] };

export const ParserConfig_SingleFields = [
  "group_metadata_key"
];

export const Mcp: OutType = { "Mcp": [
  {
    "name": "traffic_mode",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "Mcp_TrafficMode",
    "enums": [
      "PASS_THROUGH",
      "REJECT_NO_MCP"
    ],
    "comment": "Configures how the filter handles non-MCP traffic.",
    "notImp": false
  },
  {
    "name": "clear_route_cache",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "boolean",
    "enums": null,
    "comment": "When set to true, the filter will clear the route cache after setting dynamic metadata. This allows the route to be re-selected based on the MCP metadata (e.g., method, params). Defaults to false.",
    "notImp": false
  },
  {
    "name": "max_request_body_size",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "number",
    "enums": null,
    "comment": "Maximum size of the request body to buffer for JSON-RPC validation. If the request body exceeds this size, the request is rejected with ``413 Payload Too Large``. This limit applies to both ``REJECT_NO_MCP`` and ``PASS_THROUGH`` modes to prevent unbounded buffering.\n\nIt defaults to 8KB (8192 bytes) and the maximum allowed value is 10MB (10485760 bytes).\n\nSetting it to 0 would disable the limit. It is not recommended to do so in production.",
    "notImp": false
  },
  {
    "name": "parser_config",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "ParserConfig",
    "enums": null,
    "comment": "Parser configuration, this provide the attribute extraction override.",
    "notImp": false
  }
] };

export const Mcp_SingleFields = [
  "traffic_mode",
  "clear_route_cache",
  "max_request_body_size"
];

export const ParserConfig_AttributeExtractionRule: OutType = { "ParserConfig_AttributeExtractionRule": [
  {
    "name": "path",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "string",
    "enums": null,
    "comment": "JSON path to extract (e.g., \"params.name\", \"params.uri\"). The path is a dot-separated string representing the location of the field in the JSON payload. For example, \"params.name\" extracts the \"name\" field from the \"params\" object.",
    "notImp": false
  }
] };

export const ParserConfig_AttributeExtractionRule_SingleFields = [
  "path"
];

export const ParserConfig_MethodConfig: OutType = { "ParserConfig_MethodConfig": [
  {
    "name": "method",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "string",
    "enums": null,
    "comment": "Method name (e.g., \"tools/call\", \"resources/read\", \"initialize\"). This matches the \"method\" field in the JSON-RPC request.",
    "notImp": false
  },
  {
    "name": "group",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "string",
    "enums": null,
    "comment": "The group/category name to assign to this method (e.g., \"tool\", \"lifecycle\"). This will be emitted to dynamic metadata under the key specified by group_metadata_key. If empty, the built-in group classification is used.",
    "notImp": false
  },
  {
    "name": "extraction_rules",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "ParserConfig_AttributeExtractionRule[]",
    "enums": null,
    "comment": "Attributes to extract for this method. If empty, only default attributes (jsonrpc, method) are extracted.",
    "notImp": false
  }
] };

export const ParserConfig_MethodConfig_SingleFields = [
  "method",
  "group"
];

export const McpOverride: OutType = { "McpOverride": [
  {
    "name": "traffic_mode",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "Mcp_TrafficMode",
    "enums": [
      "PASS_THROUGH",
      "REJECT_NO_MCP"
    ],
    "comment": "Optional per-route traffic mode override",
    "notImp": false
  },
  {
    "name": "max_request_body_size",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "number",
    "enums": null,
    "comment": "Optional per-route max request body size override. When set, this overrides the global max_request_body_size for this route. It defaults to 8KB (8192 bytes) and the maximum allowed value is 10MB (10485760 bytes).",
    "notImp": false
  }
] };

export const McpOverride_SingleFields = [
  "traffic_mode",
  "max_request_body_size"
];