import {OutType} from '@elchi/tags/tagsType';


export const Router: OutType = { "Router": [
  {
    "name": "close_downstream_on_upstream_error",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "boolean",
    "enums": null,
    "comment": "Close downstream connection in case of routing or upstream connection problem. Default: true",
    "notImp": false
  }
] };

export const Router_SingleFields = [
  "close_downstream_on_upstream_error"
];