import {OutType} from '@/elchi/tags/tagsType';


export const ApiListener: OutType = { "ApiListener": [
  {
    "name": "api_listener",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "Any",
    "enums": null,
    "comment": "The type in this field determines the type of API listener. At present, the following types are supported: envoy.extensions.filters.network.http_connection_manager.v3.HttpConnectionManager (HTTP) envoy.extensions.filters.network.http_connection_manager.v3.EnvoyMobileHttpConnectionManager (HTTP)",
    "notImp": false
  }
] };