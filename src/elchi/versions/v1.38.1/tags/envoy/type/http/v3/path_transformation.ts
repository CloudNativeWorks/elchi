import {OutType} from '@elchi/tags/tagsType';


export const PathTransformation: OutType = { "PathTransformation": [
  {
    "name": "operations",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "PathTransformation_Operation[]",
    "enums": null,
    "comment": "A list of operations to apply. Transformations will be performed in the order that they appear.",
    "notImp": false
  }
] };

export const PathTransformation_Operation: OutType = { "PathTransformation_Operation": [
  {
    "name": "operation_specifier.normalize_path_rfc_3986",
    "isUnion": true,
    "isDeprecated": false,
    "fieldType": "PathTransformation_Operation_NormalizePathRFC3986",
    "enums": null,
    "comment": "A type of operation to alter text.",
    "notImp": false
  },
  {
    "name": "operation_specifier.merge_slashes",
    "isUnion": true,
    "isDeprecated": false,
    "fieldType": "PathTransformation_Operation_MergeSlashes",
    "enums": null,
    "comment": "A type of operation to alter text.",
    "notImp": false
  }
] };