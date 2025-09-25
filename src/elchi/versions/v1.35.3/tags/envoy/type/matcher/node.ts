import {OutType} from '@elchi/tags/tagsType';


export const NodeMatcher: OutType = { "NodeMatcher": [
  {
    "name": "node_id",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "StringMatcher",
    "enums": null,
    "comment": "Specifies match criteria on the node id.",
    "notImp": false
  },
  {
    "name": "node_metadatas",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "StructMatcher[]",
    "enums": null,
    "comment": "Specifies match criteria on the node metadata.",
    "notImp": false
  }
] };