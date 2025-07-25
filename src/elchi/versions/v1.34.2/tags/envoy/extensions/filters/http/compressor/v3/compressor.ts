import {OutType} from '@elchi/tags/tagsType';


export const Compressor_CommonDirectionConfig: OutType = { "Compressor_CommonDirectionConfig": [
  {
    "name": "enabled",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "RuntimeFeatureFlag",
    "enums": null,
    "comment": "Runtime flag that controls whether compression is enabled or not for the direction this common config is put in. If set to false, the filter will operate as a pass-through filter in the chosen direction, unless overridden by CompressorPerRoute. If the field is omitted, the filter will be enabled.",
    "notImp": false
  },
  {
    "name": "min_content_length",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "number",
    "enums": null,
    "comment": "Minimum value of Content-Length header of request or response messages (depending on the direction this common config is put in), in bytes, which will trigger compression. The default value is 30.",
    "notImp": false
  },
  {
    "name": "content_type",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "string[]",
    "enums": null,
    "comment": "Set of strings that allows specifying which mime-types yield compression; e.g., application/json, text/html, etc. When this field is not defined, compression will be applied to the following mime-types: \"application/javascript\", \"application/json\", \"application/xhtml+xml\", \"image/svg+xml\", \"text/css\", \"text/html\", \"text/plain\", \"text/xml\" and their synonyms.",
    "notImp": false
  }
] };

export const Compressor_CommonDirectionConfig_SingleFields = [
  "min_content_length",
  "content_type"
];

export const Compressor_RequestDirectionConfig: OutType = { "Compressor_RequestDirectionConfig": [
  {
    "name": "common_config",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "Compressor_CommonDirectionConfig",
    "enums": null,
    "comment": "",
    "notImp": false
  }
] };

export const Compressor_ResponseDirectionConfig: OutType = { "Compressor_ResponseDirectionConfig": [
  {
    "name": "common_config",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "Compressor_CommonDirectionConfig",
    "enums": null,
    "comment": "",
    "notImp": false
  },
  {
    "name": "disable_on_etag_header",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "boolean",
    "enums": null,
    "comment": "If true, disables compression when the response contains an etag header. When it is false, the filter will preserve weak etags and remove the ones that require strong validation.",
    "notImp": false
  },
  {
    "name": "remove_accept_encoding_header",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "boolean",
    "enums": null,
    "comment": "If true, removes accept-encoding from the request headers before dispatching it to the upstream so that responses do not get compressed before reaching the filter.\n\n:::attention\n\nTo avoid interfering with other compression filters in the same chain use this option in the filter closest to the upstream.",
    "notImp": false
  },
  {
    "name": "uncompressible_response_codes",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "number[]",
    "enums": null,
    "comment": "Set of response codes for which compression is disabled, e.g. 206 Partial Content should not be compressed.",
    "notImp": false
  }
] };

export const Compressor_ResponseDirectionConfig_SingleFields = [
  "disable_on_etag_header",
  "remove_accept_encoding_header",
  "uncompressible_response_codes"
];

export const Compressor: OutType = { "Compressor": [
  {
    "name": "content_length",
    "isUnion": false,
    "isDeprecated": true,
    "fieldType": "number",
    "enums": null,
    "comment": "Minimum response length, in bytes, which will trigger compression. The default value is 30.",
    "notImp": false
  },
  {
    "name": "content_type",
    "isUnion": false,
    "isDeprecated": true,
    "fieldType": "string[]",
    "enums": null,
    "comment": "Set of strings that allows specifying which mime-types yield compression; e.g., application/json, text/html, etc. When this field is not defined, compression will be applied to the following mime-types: \"application/javascript\", \"application/json\", \"application/xhtml+xml\", \"image/svg+xml\", \"text/css\", \"text/html\", \"text/plain\", \"text/xml\" and their synonyms.",
    "notImp": false
  },
  {
    "name": "disable_on_etag_header",
    "isUnion": false,
    "isDeprecated": true,
    "fieldType": "boolean",
    "enums": null,
    "comment": "If true, disables compression when the response contains an etag header. When it is false, the filter will preserve weak etags and remove the ones that require strong validation.",
    "notImp": false
  },
  {
    "name": "remove_accept_encoding_header",
    "isUnion": false,
    "isDeprecated": true,
    "fieldType": "boolean",
    "enums": null,
    "comment": "If true, removes accept-encoding from the request headers before dispatching it to the upstream so that responses do not get compressed before reaching the filter.\n\n:::attention\n\nTo avoid interfering with other compression filters in the same chain use this option in the filter closest to the upstream. \n:::",
    "notImp": false
  },
  {
    "name": "runtime_enabled",
    "isUnion": false,
    "isDeprecated": true,
    "fieldType": "RuntimeFeatureFlag",
    "enums": null,
    "comment": "Runtime flag that controls whether the filter is enabled or not. If set to false, the filter will operate as a pass-through filter, unless overridden by CompressorPerRoute. If not specified, defaults to enabled.",
    "notImp": false
  },
  {
    "name": "compressor_library",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "TypedExtensionConfig",
    "enums": null,
    "comment": "A compressor library to use for compression. Currently only `envoy.compression.gzip.compressor` is included in Envoy. extension-category: envoy.compression.compressor",
    "notImp": false
  },
  {
    "name": "request_direction_config",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "Compressor_RequestDirectionConfig",
    "enums": null,
    "comment": "Configuration for request compression. Compression is disabled by default if left empty.",
    "notImp": false
  },
  {
    "name": "response_direction_config",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "Compressor_ResponseDirectionConfig",
    "enums": null,
    "comment": "Configuration for response compression. Compression is enabled by default if left empty.\n\n:::attention\n\nIf the field is not empty then the duplicate deprecated fields of the ``Compressor`` message, such as ``content_length``, ``content_type``, ``disable_on_etag_header``, ``remove_accept_encoding_header`` and ``runtime_enabled``, are ignored. \n:::\n\n   Also all the statistics related to response compression will be rooted in ``<stat_prefix>.compressor.<compressor_library.name>.<compressor_library_stat_prefix>.response.*`` instead of ``<stat_prefix>.compressor.<compressor_library.name>.<compressor_library_stat_prefix>.*``.",
    "notImp": false
  },
  {
    "name": "choose_first",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "boolean",
    "enums": null,
    "comment": "If true, chooses this compressor first to do compression when the q-values in ``Accept-Encoding`` are same. The last compressor which enables choose_first will be chosen if multiple compressor filters in the chain have choose_first as true.",
    "notImp": false
  }
] };

export const Compressor_SingleFields = [
  "choose_first"
];

export const ResponseDirectionOverrides: OutType = { "ResponseDirectionOverrides": [
  {
    "name": "remove_accept_encoding_header",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "boolean",
    "enums": null,
    "comment": "If set, overrides the filter-level `remove_accept_encoding_header`.",
    "notImp": false
  }
] };

export const ResponseDirectionOverrides_SingleFields = [
  "remove_accept_encoding_header"
];

export const CompressorOverrides: OutType = { "CompressorOverrides": [
  {
    "name": "response_direction_config",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "ResponseDirectionOverrides",
    "enums": null,
    "comment": "If present, response compression is enabled.",
    "notImp": false
  }
] };

export const CompressorPerRoute: OutType = { "CompressorPerRoute": [
  {
    "name": "override.disabled",
    "isUnion": true,
    "isDeprecated": false,
    "fieldType": "boolean",
    "enums": null,
    "comment": "If set, the filter will operate as a pass-through filter. Overrides Compressor.runtime_enabled and CommonDirectionConfig.enabled.",
    "notImp": false
  },
  {
    "name": "override.overrides",
    "isUnion": true,
    "isDeprecated": false,
    "fieldType": "CompressorOverrides",
    "enums": null,
    "comment": "Per-route overrides. Fields set here will override corresponding fields in ``Compressor``.",
    "notImp": false
  }
] };

export const CompressorPerRoute_SingleFields = [
  "override.disabled"
];