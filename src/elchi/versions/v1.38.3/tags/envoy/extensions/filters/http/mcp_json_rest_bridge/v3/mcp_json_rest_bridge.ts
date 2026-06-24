import {OutType} from '@elchi/tags/tagsType';


export const ServerInfo: OutType = { "ServerInfo": [
  {
    "name": "supported_protocol_versions",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "string[]",
    "enums": null,
    "comment": "[#not-implemented-hide:]  Lists the MCP protocol versions supported by this MCP endpoint.\n\n- If provided: The extension enforces version negotiation according to the MCP specification: https://modelcontextprotocol.io/specification/2025-11-25/basic/lifecycle#version-negotiation - If not provided: The extension accepts any version sent by the client during negotiation and skips validation of the mcp-protocol-version header on subsequent requests.\n\nExample values: [\"2025-11-25\", \"2025-06-18\"]",
    "notImp": true
  },
  {
    "name": "description",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "string",
    "enums": null,
    "comment": "[#not-implemented-hide:]  Optional description of the server.",
    "notImp": true
  },
  {
    "name": "fallback_protocol_version",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "string",
    "enums": null,
    "comment": "The fallback protocol version to use if the client does not provide the ``mcp-protocol-version`` header.\n\n- If provided: The extension uses this version as the fallback protocol version. - If not provided: The extension uses the fallback protocol version defined in the latest MCP specification. For example, the current latest 2025-11-25 specification designates \"2025-03-26\" as the fallback protocol version. See https://modelcontextprotocol.io/specification/2025-11-25/basic/transports#protocol-version-header",
    "notImp": false
  }
] };

export const ServerInfo_SingleFields = [
  "supported_protocol_versions",
  "description",
  "fallback_protocol_version"
];

export const HttpRule: OutType = { "HttpRule": [
  {
    "name": "get",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "string",
    "enums": null,
    "comment": "Determines the HTTP method and the URL path template.\n\nPath templating uses curly braces ``{}`` to mark a section of the URL path as replaceable. Each template variable MUST correspond to a field in the JSON-RPC \"arguments\". Use dot-notation to access fields within nested objects (e.g., \"user.id\" maps the value of the \"id\" field inside \"user\").\n\nTo support backward compatibility with future methods, these are defined as individual fields rather than a \"oneof\". If multiple fields are present, the one with the highest field number highest priority) is the effective method.\n\nMaps to HTTP GET.",
    "notImp": false
  },
  {
    "name": "put",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "string",
    "enums": null,
    "comment": "Maps to HTTP PUT.",
    "notImp": false
  },
  {
    "name": "post",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "string",
    "enums": null,
    "comment": "Maps to HTTP POST.",
    "notImp": false
  },
  {
    "name": "delete",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "string",
    "enums": null,
    "comment": "Maps to HTTP DELETE.",
    "notImp": false
  },
  {
    "name": "patch",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "string",
    "enums": null,
    "comment": "Maps to HTTP PATCH.",
    "notImp": false
  },
  {
    "name": "body",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "string",
    "enums": null,
    "comment": "The name of the request field whose value is mapped to the HTTP request body.\n\n- If \"*\": All fields not bound by the path template are mapped to the request body. - If specify a field: This specific field is mapped to the body. Uses dot-notation for nested fields (e.g., \"user.data\" maps the value of the \"data\" field inside \"user\"). - If omitted: There is no HTTP request body; fields not in the path become query parameters.",
    "notImp": false
  }
] };

export const HttpRule_SingleFields = [
  "get",
  "put",
  "post",
  "delete",
  "patch",
  "body"
];

export const ServerToolConfig: OutType = { "ServerToolConfig": [
  {
    "name": "tools",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "ToolConfig[]",
    "enums": null,
    "comment": "List of MCP tools configurations.",
    "notImp": false
  },
  {
    "name": "list_changed",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "boolean",
    "enums": null,
    "comment": "[#not-implemented-hide:]  Whether this server supports notifications for changes to the tool list.",
    "notImp": true
  },
  {
    "name": "tool_list_http_rule",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "HttpRule",
    "enums": null,
    "comment": "Optional configuration to transcode the tools/list requests to a standard HTTP request.\n\nNote: tools/list should be mapped to a GET request with an empty body.\n\n- If provided: The extension transcodes the request and forwards it down the filter chain. The response (whether from an upstream backend, a configured ``direct_response``, or another extension) MUST be a JSON body strictly matching the MCP ``ListToolsResult`` schema. Ref: https://modelcontextprotocol.io/specification/2025-11-25/schema#listtoolsresult - If not provided: The ``tools/list`` request is passed through. This allows subsequent extension or the backend itself to handle the tools/list request if they support it.",
    "notImp": false
  }
] };

export const ServerToolConfig_SingleFields = [
  "list_changed"
];

export const McpJsonRestBridge: OutType = { "McpJsonRestBridge": [
  {
    "name": "server_info",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "ServerInfo",
    "enums": null,
    "comment": "General server information.",
    "notImp": false
  },
  {
    "name": "tool_config",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "ServerToolConfig",
    "enums": null,
    "comment": "Configuration for the MCP tools.",
    "notImp": false
  }
] };

export const ToolConfig: OutType = { "ToolConfig": [
  {
    "name": "name",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "string",
    "enums": null,
    "comment": "Name of the tool.",
    "notImp": false
  },
  {
    "name": "http_rule",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "HttpRule",
    "enums": null,
    "comment": "The HTTP configuration rules that apply to the normal backend.",
    "notImp": false
  }
] };

export const ToolConfig_SingleFields = [
  "name"
];