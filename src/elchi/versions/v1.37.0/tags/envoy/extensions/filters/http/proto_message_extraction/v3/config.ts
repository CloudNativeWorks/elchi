import {OutType} from '@elchi/tags/tagsType';


export const ProtoMessageExtractionConfig: OutType = { "ProtoMessageExtractionConfig": [
  {
    "name": "descriptor_set.data_source",
    "isUnion": true,
    "isDeprecated": false,
    "fieldType": "DataSource",
    "enums": null,
    "comment": "It could be passed by a local file through ``Datasource.filename`` or embedded in the ``Datasource.inline_bytes``.",
    "notImp": false
  },
  {
    "name": "descriptor_set.proto_descriptor_typed_metadata",
    "isUnion": true,
    "isDeprecated": false,
    "fieldType": "string",
    "enums": null,
    "comment": "Unimplemented, the key of proto descriptor TypedMetadata. Among filters depending on the proto descriptor, we can have a TypedMetadata for proto descriptors, so that these filters can share one copy of proto descriptor in memory.",
    "notImp": false
  },
  {
    "name": "mode",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "ProtoMessageExtractionConfig_ExtractMode",
    "enums": [
      "ExtractMode_UNSPECIFIED",
      "FIRST_AND_LAST"
    ],
    "comment": "",
    "notImp": false
  },
  {
    "name": "extraction_by_method",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "Map<string, MethodExtraction>",
    "enums": null,
    "comment": "Specify the message extraction info. The key is the fully qualified gRPC method name. ``${package}.${Service}.${Method}``, like ``endpoints.examples.bookstore.BookStore.GetShelf``\n\nThe value is the message extraction information for individual gRPC methods.",
    "notImp": false
  }
] };

export const ProtoMessageExtractionConfig_SingleFields = [
  "descriptor_set.proto_descriptor_typed_metadata",
  "mode"
];

export const MethodExtraction: OutType = { "MethodExtraction": [
  {
    "name": "request_extraction_by_field",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "Map<string, MethodExtraction_ExtractDirective>",
    "enums": null,
    "comment": "The mapping of field path to its ExtractDirective for request messages",
    "notImp": false
  },
  {
    "name": "response_extraction_by_field",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "Map<string, MethodExtraction_ExtractDirective>",
    "enums": null,
    "comment": "The mapping of field path to its ExtractDirective for response messages",
    "notImp": false
  }
] };

export const ProtoMessageExtractionConfig_ExtractionByMethodEntry: OutType = { "ProtoMessageExtractionConfig_ExtractionByMethodEntry": [
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
    "fieldType": "MethodExtraction",
    "enums": null,
    "comment": "",
    "notImp": false
  }
] };

export const ProtoMessageExtractionConfig_ExtractionByMethodEntry_SingleFields = [
  "key"
];

export const MethodExtraction_RequestExtractionByFieldEntry: OutType = { "MethodExtraction_RequestExtractionByFieldEntry": [
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
    "fieldType": "MethodExtraction_ExtractDirective",
    "enums": [
      "ExtractDirective_UNSPECIFIED",
      "EXTRACT",
      "EXTRACT_REDACT",
      "EXTRACT_REPEATED_CARDINALITY"
    ],
    "comment": "",
    "notImp": false
  }
] };

export const MethodExtraction_RequestExtractionByFieldEntry_SingleFields = [
  "key",
  "value"
];

export const MethodExtraction_ResponseExtractionByFieldEntry: OutType = { "MethodExtraction_ResponseExtractionByFieldEntry": [
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
    "fieldType": "MethodExtraction_ExtractDirective",
    "enums": [
      "ExtractDirective_UNSPECIFIED",
      "EXTRACT",
      "EXTRACT_REDACT",
      "EXTRACT_REPEATED_CARDINALITY"
    ],
    "comment": "",
    "notImp": false
  }
] };

export const MethodExtraction_ResponseExtractionByFieldEntry_SingleFields = [
  "key",
  "value"
];