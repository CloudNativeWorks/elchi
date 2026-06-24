import {OutType} from '@elchi/tags/tagsType';


export const OriginalSrc: OutType = { "OriginalSrc": [
  {
    "name": "mark",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "number",
    "enums": null,
    "comment": "Sets the SO_MARK option on the upstream connection's socket to the provided value. Used to ensure that non-local addresses may be routed back through envoy when binding to the original source address. The option will not be applied if the mark is 0.",
    "notImp": false
  }
] };

export const OriginalSrc_SingleFields = [
  "mark"
];