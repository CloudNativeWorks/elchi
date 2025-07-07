import {OutType} from '@/elchi/tags/tagsType';


export const StaticConfigResourceDetectorConfig: OutType = { "StaticConfigResourceDetectorConfig": [
  {
    "name": "attributes",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "Map<string, string>",
    "enums": null,
    "comment": "Custom Resource attributes to be included.",
    "notImp": false
  }
] };

export const StaticConfigResourceDetectorConfig_AttributesEntry: OutType = { "StaticConfigResourceDetectorConfig_AttributesEntry": [
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

export const StaticConfigResourceDetectorConfig_AttributesEntry_SingleFields = [
  "key",
  "value"
];