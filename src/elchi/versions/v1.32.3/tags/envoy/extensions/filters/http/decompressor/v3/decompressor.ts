import {OutType} from '@/elchi/tags/tagsType';


export const Decompressor_CommonDirectionConfig: OutType = { "Decompressor_CommonDirectionConfig": [
  {
    "name": "enabled",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "RuntimeFeatureFlag",
    "enums": null,
    "comment": "Runtime flag that controls whether the filter is enabled for decompression or not. If set to false, the filter will operate as a pass-through filter. If the message is unspecified, the filter will be enabled.",
    "notImp": false
  },
  {
    "name": "ignore_no_transform_header",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "boolean",
    "enums": null,
    "comment": "If set to true, will decompress response even if a ``no-transform`` cache control header is set.",
    "notImp": false
  }
] };

export const Decompressor_CommonDirectionConfig_SingleFields = [
  "ignore_no_transform_header"
];

export const Decompressor_RequestDirectionConfig: OutType = { "Decompressor_RequestDirectionConfig": [
  {
    "name": "common_config",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "Decompressor_CommonDirectionConfig",
    "enums": null,
    "comment": "",
    "notImp": false
  },
  {
    "name": "advertise_accept_encoding",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "boolean",
    "enums": null,
    "comment": "If set to true, and response decompression is enabled, the filter modifies the Accept-Encoding request header by appending the decompressor_library's encoding. Defaults to true.",
    "notImp": false
  }
] };

export const Decompressor_RequestDirectionConfig_SingleFields = [
  "advertise_accept_encoding"
];

export const Decompressor_ResponseDirectionConfig: OutType = { "Decompressor_ResponseDirectionConfig": [
  {
    "name": "common_config",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "Decompressor_CommonDirectionConfig",
    "enums": null,
    "comment": "",
    "notImp": false
  }
] };

export const Decompressor: OutType = { "Decompressor": [
  {
    "name": "decompressor_library",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "TypedExtensionConfig",
    "enums": null,
    "comment": "A decompressor library to use for both request and response decompression. Currently only `envoy.compression.gzip.compressor` is included in Envoy. extension-category: envoy.compression.decompressor",
    "notImp": false
  },
  {
    "name": "request_direction_config",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "Decompressor_RequestDirectionConfig",
    "enums": null,
    "comment": "Configuration for request decompression. Decompression is enabled by default if left empty.",
    "notImp": false
  },
  {
    "name": "response_direction_config",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "Decompressor_ResponseDirectionConfig",
    "enums": null,
    "comment": "Configuration for response decompression. Decompression is enabled by default if left empty.",
    "notImp": false
  }
] };