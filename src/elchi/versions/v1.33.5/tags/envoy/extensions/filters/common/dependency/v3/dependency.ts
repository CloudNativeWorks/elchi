import {OutType} from '@elchi/tags/tagsType';


export const Dependency: OutType = { "Dependency": [
  {
    "name": "type",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "Dependency_DependencyType",
    "enums": [
      "HEADER",
      "FILTER_STATE_KEY",
      "DYNAMIC_METADATA"
    ],
    "comment": "The kind of dependency.",
    "notImp": false
  },
  {
    "name": "name",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "string",
    "enums": null,
    "comment": "The string identifier for the dependency.",
    "notImp": false
  }
] };

export const Dependency_SingleFields = [
  "type",
  "name"
];

export const FilterDependencies: OutType = { "FilterDependencies": [
  {
    "name": "decode_required",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "Dependency[]",
    "enums": null,
    "comment": "A list of dependencies required on the decode path.",
    "notImp": false
  },
  {
    "name": "decode_provided",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "Dependency[]",
    "enums": null,
    "comment": "A list of dependencies provided on the encode path.",
    "notImp": false
  },
  {
    "name": "encode_required",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "Dependency[]",
    "enums": null,
    "comment": "A list of dependencies required on the decode path.",
    "notImp": false
  },
  {
    "name": "encode_provided",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "Dependency[]",
    "enums": null,
    "comment": "A list of dependencies provided on the encode path.",
    "notImp": false
  }
] };

export const MatchingRequirements_DataInputAllowList: OutType = { "MatchingRequirements_DataInputAllowList": [
  {
    "name": "type_url",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "string[]",
    "enums": null,
    "comment": "An explicit list of data inputs that are allowed to be used with this filter.",
    "notImp": false
  }
] };

export const MatchingRequirements_DataInputAllowList_SingleFields = [
  "type_url"
];

export const MatchingRequirements: OutType = { "MatchingRequirements": [
  {
    "name": "data_input_allow_list",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "MatchingRequirements_DataInputAllowList",
    "enums": null,
    "comment": "",
    "notImp": false
  }
] };