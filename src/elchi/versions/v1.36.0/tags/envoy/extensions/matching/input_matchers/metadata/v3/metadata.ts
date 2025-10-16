import {OutType} from '@elchi/tags/tagsType';


export const Metadata: OutType = { "Metadata": [
  {
    "name": "value",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "ValueMatcher",
    "enums": null,
    "comment": "The Metadata is matched if the value retrieved by metadata matching input is matched to this value.",
    "notImp": false
  },
  {
    "name": "invert",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "boolean",
    "enums": null,
    "comment": "If true, the match result will be inverted.",
    "notImp": false
  }
] };

export const Metadata_SingleFields = [
  "invert"
];