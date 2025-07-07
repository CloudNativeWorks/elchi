import {OutType} from '@/elchi/tags/tagsType';


export const Tap: OutType = { "Tap": [
  {
    "name": "common_config",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "CommonExtensionConfig",
    "enums": null,
    "comment": "Common configuration for the tap transport socket.",
    "notImp": false
  },
  {
    "name": "transport_socket",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "TransportSocket",
    "enums": null,
    "comment": "The underlying transport socket being wrapped.",
    "notImp": false
  }
] };