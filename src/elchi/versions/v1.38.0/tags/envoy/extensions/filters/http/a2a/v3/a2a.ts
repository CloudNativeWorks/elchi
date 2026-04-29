import {OutType} from '@elchi/tags/tagsType';


export const ParserConfig: OutType = { "ParserConfig": [
  {
    "name": "method_configs",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "Map<string, MethodParsingConfig>",
    "enums": null,
    "comment": "Method-specific overrides for grouping and attribute extraction. If a method is not specified in method_configs, or if 'group' is empty in its config, its group will be determined by built-in classification based on method prefix (e.g., \"message\" for \"message/send\") and default extraction rules will be applied for that method.",
    "notImp": false
  },
  {
    "name": "always_extract_attributes",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "string[]",
    "enums": null,
    "comment": "Attributes that should always be extracted regardless of the method. Specified by their JSON paths (e.g., \"params.id\").",
    "notImp": false
  },
  {
    "name": "group_metadata_key",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "string",
    "enums": null,
    "comment": "The dynamic metadata key under which the method's group name will be stored (e.g., \"a2a_group\"). If this key is empty, group information will not be added to dynamic metadata.",
    "notImp": false
  }
] };

export const ParserConfig_SingleFields = [
  "always_extract_attributes",
  "group_metadata_key"
];

export const A2a: OutType = { "A2a": [
  {
    "name": "traffic_mode",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "A2a_TrafficMode",
    "enums": [
      "PASS_THROUGH",
      "REJECT"
    ],
    "comment": "Configures how the filter handles non-A2A traffic.",
    "notImp": false
  },
  {
    "name": "max_request_body_size",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "number",
    "enums": null,
    "comment": "Maximum size of the request body to buffer for JSON-RPC validation. If the request body exceeds this size, the request is rejected with ``413 Payload Too Large``. This limit applies to both ``REJECT`` and ``PASS_THROUGH`` modes to prevent unbounded buffering.\n\nIt defaults to 8KB (8192 bytes) and the maximum allowed value is 10MB (10485760 bytes).\n\nSetting it to 0 would disable the limit. It is not recommended to do so in production.",
    "notImp": false
  },
  {
    "name": "parser_config",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "ParserConfig",
    "enums": null,
    "comment": "Customized configuration for A2A parser.",
    "notImp": false
  },
  {
    "name": "storage_mode",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "A2a_StorageMode",
    "enums": [
      "NONE",
      "DYNAMIC_METADATA",
      "FILTER_STATE",
      "DYNAMIC_METADATA_AND_FILTER_STATE"
    ],
    "comment": "Where to store parsed A2A message attributes. Controls whether attributes are written to dynamic metadata, filter state, or both. Default is no storage.",
    "notImp": false
  }
] };

export const A2a_SingleFields = [
  "traffic_mode",
  "max_request_body_size",
  "storage_mode"
];

export const MethodParsingConfig: OutType = { "MethodParsingConfig": [
  {
    "name": "group",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "string",
    "enums": null,
    "comment": "The group/category name to assign to this method (e.g., \"tasks\", \"message\"). If provided, this overrides any built-in classification for the method. This will be emitted to dynamic metadata under the key specified by ``group_metadata_key``.",
    "notImp": false
  },
  {
    "name": "paths",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "string[]",
    "enums": null,
    "comment": "List of attributes to extract for this method, specified by their JSON paths (e.g., \"params.name\").",
    "notImp": false
  }
] };

export const MethodParsingConfig_SingleFields = [
  "group",
  "paths"
];

export const ParserConfig_MethodConfigsEntry: OutType = { "ParserConfig_MethodConfigsEntry": [
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
    "fieldType": "MethodParsingConfig",
    "enums": null,
    "comment": "",
    "notImp": false
  }
] };

export const ParserConfig_MethodConfigsEntry_SingleFields = [
  "key"
];