import {OutType} from '@elchi/tags/tagsType';


export const Router: OutType = { "Router": [
  {
    "name": "bind_upstream_connection",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "boolean",
    "enums": null,
    "comment": "Set to true if the upstream connection should be bound to the downstream connection, false otherwise.\n\nBy default, one random upstream connection will be selected from the upstream connection pool and used for every request. And after the request is finished, the upstream connection will be released back to the upstream connection pool.\n\nIf this option is true, the upstream connection will be bound to the downstream connection and have same lifetime as the downstream connection. The same upstream connection will be used for all requests from the same downstream connection.\n\nAnd if this options is true, one of the following requirements must be met:\n\n1. The request must be handled one by one. That is, the next request can not be sent to the upstream until the previous request is finished. 2. Unique request id must be provided for each request and response. The request id must be unique for each request and response pair in same connection pair. And the request id must be the same for the corresponding request and response.\n\nThis could be useful for some protocols that require the same upstream connection to be used for all requests from the same downstream connection. For example, the protocol using stateful connection.",
    "notImp": false
  }
] };

export const Router_SingleFields = [
  "bind_upstream_connection"
];