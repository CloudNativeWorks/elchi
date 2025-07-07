import {OutType} from '@/elchi/tags/tagsType';


export const AccessLogFilter: OutType = { "AccessLogFilter": [
  {
    "name": "filter_specifier.status_code_filter",
    "isUnion": true,
    "isDeprecated": false,
    "fieldType": "StatusCodeFilter",
    "enums": null,
    "comment": "Status code filter.",
    "notImp": false
  },
  {
    "name": "filter_specifier.duration_filter",
    "isUnion": true,
    "isDeprecated": false,
    "fieldType": "DurationFilter",
    "enums": null,
    "comment": "Duration filter.",
    "notImp": false
  },
  {
    "name": "filter_specifier.not_health_check_filter",
    "isUnion": true,
    "isDeprecated": false,
    "fieldType": "NotHealthCheckFilter",
    "enums": null,
    "comment": "Not health check filter.",
    "notImp": false
  },
  {
    "name": "filter_specifier.traceable_filter",
    "isUnion": true,
    "isDeprecated": false,
    "fieldType": "TraceableFilter",
    "enums": null,
    "comment": "Traceable filter.",
    "notImp": false
  },
  {
    "name": "filter_specifier.runtime_filter",
    "isUnion": true,
    "isDeprecated": false,
    "fieldType": "RuntimeFilter",
    "enums": null,
    "comment": "Runtime filter.",
    "notImp": false
  },
  {
    "name": "filter_specifier.and_filter",
    "isUnion": true,
    "isDeprecated": false,
    "fieldType": "AndFilter",
    "enums": null,
    "comment": "And filter.",
    "notImp": false
  },
  {
    "name": "filter_specifier.or_filter",
    "isUnion": true,
    "isDeprecated": false,
    "fieldType": "OrFilter",
    "enums": null,
    "comment": "Or filter.",
    "notImp": false
  },
  {
    "name": "filter_specifier.header_filter",
    "isUnion": true,
    "isDeprecated": false,
    "fieldType": "HeaderFilter",
    "enums": null,
    "comment": "Header filter.",
    "notImp": false
  },
  {
    "name": "filter_specifier.response_flag_filter",
    "isUnion": true,
    "isDeprecated": false,
    "fieldType": "ResponseFlagFilter",
    "enums": null,
    "comment": "Response flag filter.",
    "notImp": false
  },
  {
    "name": "filter_specifier.grpc_status_filter",
    "isUnion": true,
    "isDeprecated": false,
    "fieldType": "GrpcStatusFilter",
    "enums": null,
    "comment": "gRPC status filter.",
    "notImp": false
  },
  {
    "name": "filter_specifier.extension_filter",
    "isUnion": true,
    "isDeprecated": false,
    "fieldType": "ExtensionFilter",
    "enums": null,
    "comment": "Extension filter. extension-category: envoy.access_loggers.extension_filters",
    "notImp": false
  },
  {
    "name": "filter_specifier.metadata_filter",
    "isUnion": true,
    "isDeprecated": false,
    "fieldType": "MetadataFilter",
    "enums": null,
    "comment": "Metadata Filter",
    "notImp": false
  },
  {
    "name": "filter_specifier.log_type_filter",
    "isUnion": true,
    "isDeprecated": false,
    "fieldType": "LogTypeFilter",
    "enums": null,
    "comment": "Log Type Filter",
    "notImp": false
  }
] };

export const AccessLog: OutType = { "AccessLog": [
  {
    "name": "name",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "string",
    "enums": null,
    "comment": "The name of the access log extension configuration.",
    "notImp": false
  },
  {
    "name": "filter",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "AccessLogFilter",
    "enums": null,
    "comment": "Filter which is used to determine if the access log needs to be written.",
    "notImp": false
  },
  {
    "name": "config_type.typed_config",
    "isUnion": true,
    "isDeprecated": false,
    "fieldType": "Any",
    "enums": null,
    "comment": "Custom configuration that must be set according to the access logger extension being instantiated. extension-category: envoy.access_loggers",
    "notImp": false
  }
] };

export const AccessLog_SingleFields = [
  "name"
];

export const ComparisonFilter: OutType = { "ComparisonFilter": [
  {
    "name": "op",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "ComparisonFilter_Op",
    "enums": [
      "EQ",
      "GE",
      "LE"
    ],
    "comment": "Comparison operator.",
    "notImp": false
  },
  {
    "name": "value",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "RuntimeUInt32",
    "enums": null,
    "comment": "Value to compare against.",
    "notImp": false
  }
] };

export const ComparisonFilter_SingleFields = [
  "op"
];

export const StatusCodeFilter: OutType = { "StatusCodeFilter": [
  {
    "name": "comparison",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "ComparisonFilter",
    "enums": null,
    "comment": "Comparison.",
    "notImp": false
  }
] };

export const DurationFilter: OutType = { "DurationFilter": [
  {
    "name": "comparison",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "ComparisonFilter",
    "enums": null,
    "comment": "Comparison.",
    "notImp": false
  }
] };

export const RuntimeFilter: OutType = { "RuntimeFilter": [
  {
    "name": "runtime_key",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "string",
    "enums": null,
    "comment": "Runtime key to get an optional overridden numerator for use in the ``percent_sampled`` field. If found in runtime, this value will replace the default numerator.",
    "notImp": false
  },
  {
    "name": "percent_sampled",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "FractionalPercent",
    "enums": null,
    "comment": "The default sampling percentage. If not specified, defaults to 0% with denominator of 100.",
    "notImp": false
  },
  {
    "name": "use_independent_randomness",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "boolean",
    "enums": null,
    "comment": "By default, sampling pivots on the header `x-request-id` being present. If `x-request-id` is present, the filter will consistently sample across multiple hosts based on the runtime key value and the value extracted from `x-request-id`. If it is missing, or ``use_independent_randomness`` is set to true, the filter will randomly sample based on the runtime key value alone. ``use_independent_randomness`` can be used for logging kill switches within complex nested `AndFilter` and `OrFilter` blocks that are easier to reason about from a probability perspective (i.e., setting to true will cause the filter to behave like an independent random variable when composed within logical operator filters).",
    "notImp": false
  }
] };

export const RuntimeFilter_SingleFields = [
  "runtime_key",
  "use_independent_randomness"
];

export const AndFilter: OutType = { "AndFilter": [
  {
    "name": "filters",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "AccessLogFilter[]",
    "enums": null,
    "comment": "",
    "notImp": false
  }
] };

export const OrFilter: OutType = { "OrFilter": [
  {
    "name": "filters",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "AccessLogFilter[]",
    "enums": null,
    "comment": "",
    "notImp": false
  }
] };

export const HeaderFilter: OutType = { "HeaderFilter": [
  {
    "name": "header",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "HeaderMatcher",
    "enums": null,
    "comment": "Only requests with a header which matches the specified HeaderMatcher will pass the filter check.",
    "notImp": false
  }
] };

export const ResponseFlagFilter: OutType = { "ResponseFlagFilter": [
  {
    "name": "flags",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "string[]",
    "enums": null,
    "comment": "Only responses with the any of the flags listed in this field will be logged. This field is optional. If it is not specified, then any response flag will pass the filter check.",
    "notImp": false
  }
] };

export const ResponseFlagFilter_SingleFields = [
  "flags"
];

export const GrpcStatusFilter: OutType = { "GrpcStatusFilter": [
  {
    "name": "statuses",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "GrpcStatusFilter_Status[]",
    "enums": null,
    "comment": "Logs only responses that have any one of the gRPC statuses in this field.",
    "notImp": false
  },
  {
    "name": "exclude",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "boolean",
    "enums": null,
    "comment": "If included and set to true, the filter will instead block all responses with a gRPC status or inferred gRPC status enumerated in statuses, and allow all other responses.",
    "notImp": false
  }
] };

export const GrpcStatusFilter_SingleFields = [
  "exclude"
];

export const MetadataFilter: OutType = { "MetadataFilter": [
  {
    "name": "matcher",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "MetadataMatcher",
    "enums": null,
    "comment": "Matcher to check metadata for specified value. For example, to match on the access_log_hint metadata, set the filter to \"envoy.common\" and the path to \"access_log_hint\", and the value to \"true\".",
    "notImp": false
  },
  {
    "name": "match_if_key_not_found",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "boolean",
    "enums": null,
    "comment": "Default result if the key does not exist in dynamic metadata: if unset or true, then log; if false, then don't log.",
    "notImp": false
  }
] };

export const MetadataFilter_SingleFields = [
  "match_if_key_not_found"
];

export const LogTypeFilter: OutType = { "LogTypeFilter": [
  {
    "name": "types",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "AccessLogType[]",
    "enums": null,
    "comment": "Logs only records which their type is one of the types defined in this field.",
    "notImp": false
  },
  {
    "name": "exclude",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "boolean",
    "enums": null,
    "comment": "If this field is set to true, the filter will instead block all records with a access log type in types field, and allow all other records.",
    "notImp": false
  }
] };

export const LogTypeFilter_SingleFields = [
  "exclude"
];

export const ExtensionFilter: OutType = { "ExtensionFilter": [
  {
    "name": "name",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "string",
    "enums": null,
    "comment": "The name of the filter implementation to instantiate. The name must match a statically registered filter.",
    "notImp": false
  },
  {
    "name": "config_type.typed_config",
    "isUnion": true,
    "isDeprecated": false,
    "fieldType": "Any",
    "enums": null,
    "comment": "Custom configuration that depends on the filter being instantiated.",
    "notImp": false
  }
] };

export const ExtensionFilter_SingleFields = [
  "name"
];