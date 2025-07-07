import {OutType} from '@/elchi/tags/tagsType';


export const GrpcFieldExtractionConfig: OutType = { "GrpcFieldExtractionConfig": [
  {
    "name": "descriptor_set",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "DataSource",
    "enums": null,
    "comment": "The proto descriptor set binary for the gRPC services.\n\nIt could be passed by a local file through ``Datasource.filename`` or embedded in the ``Datasource.inline_bytes``.",
    "notImp": false
  },
  {
    "name": "extractions_by_method",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "Map<string, FieldExtractions>",
    "enums": null,
    "comment": "Specify the extraction info. The key is the fully qualified gRPC method name. ``${package}.${Service}.${Method}``, like ``endpoints.examples.bookstore.BookStore.GetShelf``\n\nThe value is the field extractions for individual gRPC method.",
    "notImp": false
  }
] };

export const FieldExtractions: OutType = { "FieldExtractions": [
  {
    "name": "request_field_extractions",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "Map<string, RequestFieldValueDisposition>",
    "enums": null,
    "comment": "The field extractions for requests. The key is the field path within the grpc request. For example, we can define ``foo.bar.name`` if we want to extract ``Request.foo.bar.name``.\n\n.. code-block:: proto\n\n message Request { Foo foo = 1; }\n\n message Foo { Bar bar = 1; }\n\n message Bar { string name = 1; }",
    "notImp": false
  }
] };

export const GrpcFieldExtractionConfig_ExtractionsByMethodEntry: OutType = { "GrpcFieldExtractionConfig_ExtractionsByMethodEntry": [
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
    "fieldType": "FieldExtractions",
    "enums": null,
    "comment": "",
    "notImp": false
  }
] };

export const GrpcFieldExtractionConfig_ExtractionsByMethodEntry_SingleFields = [
  "key"
];

export const RequestFieldValueDisposition: OutType = { "RequestFieldValueDisposition": [
  {
    "name": "disposition.dynamic_metadata",
    "isUnion": true,
    "isDeprecated": false,
    "fieldType": "string",
    "enums": null,
    "comment": "The dynamic metadata namespace. If empty, \"envoy.filters.http.grpc_field_extraction\" will be used by default.\n\nUnimplemented. Uses \"envoy.filters.http.grpc_field_extraction\" for now.",
    "notImp": false
  }
] };

export const RequestFieldValueDisposition_SingleFields = [
  "disposition.dynamic_metadata"
];

export const FieldExtractions_RequestFieldExtractionsEntry: OutType = { "FieldExtractions_RequestFieldExtractionsEntry": [
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
    "fieldType": "RequestFieldValueDisposition",
    "enums": null,
    "comment": "",
    "notImp": false
  }
] };

export const FieldExtractions_RequestFieldExtractionsEntry_SingleFields = [
  "key"
];