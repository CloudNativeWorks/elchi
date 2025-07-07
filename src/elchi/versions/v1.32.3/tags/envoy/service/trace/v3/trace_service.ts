import {OutType} from '@/elchi/tags/tagsType';


export const StreamTracesMessage_Identifier: OutType = { "StreamTracesMessage_Identifier": [
  {
    "name": "node",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "Node",
    "enums": null,
    "comment": "The node sending the access log messages over the stream.",
    "notImp": false
  }
] };

export const StreamTracesMessage: OutType = { "StreamTracesMessage": [
  {
    "name": "identifier",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "StreamTracesMessage_Identifier",
    "enums": null,
    "comment": "Identifier data effectively is a structured metadata. As a performance optimization this will only be sent in the first message on the stream.",
    "notImp": false
  },
  {
    "name": "spans",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "Span[]",
    "enums": null,
    "comment": "A list of Span entries",
    "notImp": false
  }
] };