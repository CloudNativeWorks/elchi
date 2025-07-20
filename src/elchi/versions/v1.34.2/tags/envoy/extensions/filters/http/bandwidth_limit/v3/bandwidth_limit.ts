import {OutType} from '@elchi/tags/tagsType';


export const BandwidthLimit: OutType = { "BandwidthLimit": [
  {
    "name": "stat_prefix",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "string",
    "enums": null,
    "comment": "The human readable prefix to use when emitting stats.",
    "notImp": false
  },
  {
    "name": "enable_mode",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "BandwidthLimit_EnableMode",
    "enums": [
      "DISABLED",
      "REQUEST",
      "RESPONSE",
      "REQUEST_AND_RESPONSE"
    ],
    "comment": "The enable mode for the bandwidth limit filter. Default is Disabled.",
    "notImp": false
  },
  {
    "name": "limit_kbps",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "number",
    "enums": null,
    "comment": "The limit supplied in KiB/s.\n\n:::note\nIt's fine for the limit to be unset for the global configuration since the bandwidth limit can be applied at a the virtual host or route level. Thus, the limit must be set for the per route configuration otherwise the config will be rejected. \n:::\n\n:::note\nWhen using per route configuration, the limit becomes unique to that route.",
    "notImp": false
  },
  {
    "name": "fill_interval",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "Duration",
    "enums": null,
    "comment": "Optional Fill interval in milliseconds for the token refills. Defaults to 50ms. It must be at least 20ms to avoid too aggressive refills.",
    "notImp": false
  },
  {
    "name": "runtime_enabled",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "RuntimeFeatureFlag",
    "enums": null,
    "comment": "Runtime flag that controls whether the filter is enabled or not. If not specified, defaults to enabled.",
    "notImp": false
  },
  {
    "name": "enable_response_trailers",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "boolean",
    "enums": null,
    "comment": "Enable response trailers.\n\n:::note\n\nIf set true, the following 4 trailers will be added, prefixed by ``response_trailer_prefix``: * bandwidth-request-delay-ms: delay time in milliseconds it took for the request stream transfer including request body transfer time and the time added by the filter. * bandwidth-response-delay-ms: delay time in milliseconds it took for the response stream transfer including response body transfer time and the time added by the filter. * bandwidth-request-filter-delay-ms: delay time in milliseconds in request stream transfer added by the filter. * bandwidth-response-filter-delay-ms: delay time in milliseconds that added by the filter. If `enable_mode` is ``DISABLED`` or ``REQUEST``, the trailers will not be set. If both the request and response delay time is 0, the trailers will not be set.",
    "notImp": false
  },
  {
    "name": "response_trailer_prefix",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "string",
    "enums": null,
    "comment": "Optional The prefix for the response trailers.",
    "notImp": false
  }
] };

export const BandwidthLimit_SingleFields = [
  "stat_prefix",
  "enable_mode",
  "limit_kbps",
  "fill_interval",
  "enable_response_trailers",
  "response_trailer_prefix"
];