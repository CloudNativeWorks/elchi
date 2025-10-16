import {OutType} from '@elchi/tags/tagsType';


export const Compressor_CommonDirectionConfig: OutType = { "Compressor_CommonDirectionConfig": [
  {
    "name": "enabled",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "RuntimeFeatureFlag",
    "enums": null,
    "comment": "Runtime flag that controls whether compression is enabled for the direction this common config is applied to. When this field is ``false``, the filter will operate as a pass-through filter in the chosen direction, unless overridden by ``CompressorPerRoute``. If this field is not specified, the filter will be enabled.",
    "notImp": false
  },
  {
    "name": "min_content_length",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "number",
    "enums": null,
    "comment": "Minimum value of the ``Content-Length`` header in request or response messages (depending on the direction this common config is applied to), in bytes, that will trigger compression. Defaults to 30.",
    "notImp": false
  },
  {
    "name": "content_type",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "string[]",
    "enums": null,
    "comment": "Set of strings that allows specifying which mime-types yield compression; e.g., ``application/json``, ``text/html``, etc.\n\nWhen this field is not specified, compression will be applied to these following mime-types and their synonyms:\n\n* ``application/javascript`` * ``application/json`` * ``application/xhtml+xml`` * ``image/svg+xml`` * ``text/css`` * ``text/html`` * ``text/plain`` * ``text/xml``",
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
    "comment": "When this field is ``true``, disables compression when the response contains an ``ETag`` header. When this field is ``false``, the filter will preserve weak ``ETag`` values and remove those that require strong validation.",
    "notImp": false
  },
  {
    "name": "remove_accept_encoding_header",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "boolean",
    "enums": null,
    "comment": "When this field is ``true``, removes ``Accept-Encoding`` from the request headers before dispatching the request to the upstream so that responses do not get compressed before reaching the filter.\n\n:::attention\n\nTo avoid interfering with other compression filters in the same chain, use this option in the filter closest to the upstream.",
    "notImp": false
  },
  {
    "name": "uncompressible_response_codes",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "number[]",
    "enums": null,
    "comment": "Set of response codes for which compression is disabled; e.g., 206 Partial Content should not be compressed.",
    "notImp": false
  },
  {
    "name": "status_header_enabled",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "boolean",
    "enums": null,
    "comment": "If true, the filter adds the ``x-envoy-compression-status`` response header to indicate whether the compression occurred and, if not, provide the reason why. The header's value format is ``<encoder-type>;<status>[;<additional-params>]``, where ``<status>`` is ``Compressed`` or the reason compression was skipped (e.g., ``ContentLengthTooSmall``). When this field is enabled, the compressor filter alters the order of the compression eligibility checks to report the most valid reason for skipping the compression.",
    "notImp": false
  }
] };

export const Compressor_ResponseDirectionConfig_SingleFields = [
  "disable_on_etag_header",
  "remove_accept_encoding_header",
  "uncompressible_response_codes",
  "status_header_enabled"
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
    "comment": "Set of strings that allows specifying which mime-types yield compression; e.g., ``application/json``, ``text/html``, etc.\n\nWhen this field is not specified, compression will be applied to these following mime-types and their synonyms:\n\n* ``application/javascript`` * ``application/json`` * ``application/xhtml+xml`` * ``image/svg+xml`` * ``text/css`` * ``text/html`` * ``text/plain`` * ``text/xml``",
    "notImp": false
  },
  {
    "name": "disable_on_etag_header",
    "isUnion": false,
    "isDeprecated": true,
    "fieldType": "boolean",
    "enums": null,
    "comment": "When this field is ``true``, disables compression when the response contains an ``ETag`` header. When this field is ``false``, the filter will preserve weak ``ETag`` values and remove those that require strong validation.",
    "notImp": false
  },
  {
    "name": "remove_accept_encoding_header",
    "isUnion": false,
    "isDeprecated": true,
    "fieldType": "boolean",
    "enums": null,
    "comment": "When this field is ``true``, removes ``Accept-Encoding`` from the request headers before dispatching the request to the upstream so that responses do not get compressed before reaching the filter.\n\n:::attention\n\nTo avoid interfering with other compression filters in the same chain, use this option in the filter closest to the upstream. \n:::",
    "notImp": false
  },
  {
    "name": "runtime_enabled",
    "isUnion": false,
    "isDeprecated": true,
    "fieldType": "RuntimeFeatureFlag",
    "enums": null,
    "comment": "Runtime flag that controls whether the filter is enabled. When this field is ``false``, the filter will operate as a pass-through filter, unless overridden by ``CompressorPerRoute``. If this field is not specified, the filter is enabled by default.",
    "notImp": false
  },
  {
    "name": "compressor_library",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "TypedExtensionConfig",
    "enums": null,
    "comment": "A compressor library to use for compression. extension-category: envoy.compression.compressor",
    "notImp": false
  },
  {
    "name": "request_direction_config",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "Compressor_RequestDirectionConfig",
    "enums": null,
    "comment": "Configuration for request compression. If this field is not specified, request compression is disabled.",
    "notImp": false
  },
  {
    "name": "response_direction_config",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "Compressor_ResponseDirectionConfig",
    "enums": null,
    "comment": "Configuration for response compression. If this field is not specified, response compression is enabled.\n\n:::attention\n\nWhen this field is set, duplicate deprecated fields of the ``Compressor`` message, such as ``content_length``, ``content_type``, ``disable_on_etag_header``, ``remove_accept_encoding_header``, and ``runtime_enabled``, are ignored. \n:::\n\n   Additionally, all statistics related to response compression will be rooted in ``<stat_prefix>.compressor.<compressor_library.name>.<compressor_library_stat_prefix>.response.*`` instead of ``<stat_prefix>.compressor.<compressor_library.name>.<compressor_library_stat_prefix>.*``.",
    "notImp": false
  },
  {
    "name": "choose_first",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "boolean",
    "enums": null,
    "comment": "When this field is ``true``, this compressor is preferred when q-values in ``Accept-Encoding`` are equal. If multiple compressor filters set ``choose_first`` to ``true``, the last one in the filter chain is chosen.",
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
  },
  {
    "name": "compressor_library",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "TypedExtensionConfig",
    "enums": null,
    "comment": "A compressor library to use for compression. If specified, this overrides the filter-level ``compressor_library`` configuration for this route.",
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
    "comment": "If set, the filter will operate as a pass-through filter. Overrides ``Compressor.runtime_enabled`` and ``CommonDirectionConfig.enabled``.",
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