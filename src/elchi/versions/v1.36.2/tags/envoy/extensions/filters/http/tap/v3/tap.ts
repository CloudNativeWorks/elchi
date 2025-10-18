import {OutType} from '@elchi/tags/tagsType';


export const Tap: OutType = { "Tap": [
  {
    "name": "common_config",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "CommonExtensionConfig",
    "enums": null,
    "comment": "Common configuration for the HTTP tap filter.",
    "notImp": false
  },
  {
    "name": "record_headers_received_time",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "boolean",
    "enums": null,
    "comment": "Indicates whether HTTP tap filter records the time stamp for request/response headers. Request headers time stamp is stored after receiving request headers. Response headers time stamp is stored after receiving response headers.",
    "notImp": false
  },
  {
    "name": "record_downstream_connection",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "boolean",
    "enums": null,
    "comment": "Indicates whether report downstream connection info",
    "notImp": false
  },
  {
    "name": "record_upstream_connection",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "boolean",
    "enums": null,
    "comment": "If enabled, upstream connection information will be reported.",
    "notImp": false
  }
] };

export const Tap_SingleFields = [
  "record_headers_received_time",
  "record_downstream_connection",
  "record_upstream_connection"
];