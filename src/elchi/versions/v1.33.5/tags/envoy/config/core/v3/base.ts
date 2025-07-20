import {OutType} from '@elchi/tags/tagsType';


export const Locality: OutType = { "Locality": [
  {
    "name": "region",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "string",
    "enums": null,
    "comment": "Region this `zone` belongs to.",
    "notImp": false
  },
  {
    "name": "zone",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "string",
    "enums": null,
    "comment": "Defines the local service zone where Envoy is running. Though optional, it should be set if discovery service routing is used and the discovery service exposes `zone data`, either in this message or via :option:`--service-zone`. The meaning of zone is context dependent, e.g. `Availability Zone (AZ) <https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/using-regions-availability-zones.html>`_ on AWS, `Zone <https://cloud.google.com/compute/docs/regions-zones/>`_ on GCP, etc.",
    "notImp": false
  },
  {
    "name": "sub_zone",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "string",
    "enums": null,
    "comment": "When used for locality of upstream hosts, this field further splits zone into smaller chunks of sub-zones so they can be load balanced independently.",
    "notImp": false
  }
] };

export const Locality_SingleFields = [
  "region",
  "zone",
  "sub_zone"
];

export const BuildVersion: OutType = { "BuildVersion": [
  {
    "name": "version",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "SemanticVersion",
    "enums": null,
    "comment": "SemVer version of extension.",
    "notImp": false
  },
  {
    "name": "metadata",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "{ [key: string]: any; }",
    "enums": null,
    "comment": "Free-form build information. Envoy defines several well known keys in the source/common/version/version.h file",
    "notImp": false
  }
] };

export const Extension: OutType = { "Extension": [
  {
    "name": "name",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "string",
    "enums": null,
    "comment": "This is the name of the Envoy filter as specified in the Envoy configuration, e.g. envoy.filters.http.router, com.acme.widget.",
    "notImp": false
  },
  {
    "name": "category",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "string",
    "enums": null,
    "comment": "Category of the extension. Extension category names use reverse DNS notation. For instance \"envoy.filters.listener\" for Envoy's built-in listener filters or \"com.acme.filters.http\" for HTTP filters from acme.com vendor.",
    "notImp": false
  },
  {
    "name": "type_descriptor",
    "isUnion": false,
    "isDeprecated": true,
    "fieldType": "string",
    "enums": null,
    "comment": "[#not-implemented-hide:] Type descriptor of extension configuration proto.",
    "notImp": true
  },
  {
    "name": "version",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "BuildVersion",
    "enums": null,
    "comment": "The version is a property of the extension and maintained independently of other extensions and the Envoy API. This field is not set when extension did not provide version information.",
    "notImp": false
  },
  {
    "name": "disabled",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "boolean",
    "enums": null,
    "comment": "Indicates that the extension is present but was disabled via dynamic configuration.",
    "notImp": false
  },
  {
    "name": "type_urls",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "string[]",
    "enums": null,
    "comment": "Type URLs of extension configuration protos.",
    "notImp": false
  }
] };

export const Extension_SingleFields = [
  "name",
  "category",
  "disabled",
  "type_urls"
];

export const Node: OutType = { "Node": [
  {
    "name": "id",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "string",
    "enums": null,
    "comment": "An opaque node identifier for the Envoy node. This also provides the local service node name. It should be set if any of the following features are used: `statsd`, `CDS`, and `HTTP tracing`, either in this message or via :option:`--service-node`.",
    "notImp": false
  },
  {
    "name": "cluster",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "string",
    "enums": null,
    "comment": "Defines the local service cluster name where Envoy is running. Though optional, it should be set if any of the following features are used: `statsd`, `health check cluster verification`, `runtime override directory`, `user agent addition`, `HTTP global rate limiting`, `CDS`, and `HTTP tracing`, either in this message or via :option:`--service-cluster`.",
    "notImp": false
  },
  {
    "name": "metadata",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "{ [key: string]: any; }",
    "enums": null,
    "comment": "Opaque metadata extending the node identifier. Envoy will pass this directly to the management server.",
    "notImp": false
  },
  {
    "name": "dynamic_parameters",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "Map<string, ContextParams>",
    "enums": null,
    "comment": "Map from xDS resource type URL to dynamic context parameters. These may vary at runtime (unlike other fields in this message). For example, the xDS client may have a shard identifier that changes during the lifetime of the xDS client. In Envoy, this would be achieved by updating the dynamic context on the Server::Instance's LocalInfo context provider. The shard ID dynamic parameter then appears in this field during future discovery requests.",
    "notImp": false
  },
  {
    "name": "locality",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "Locality",
    "enums": null,
    "comment": "Locality specifying where the Envoy instance is running.",
    "notImp": false
  },
  {
    "name": "user_agent_name",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "string",
    "enums": null,
    "comment": "Free-form string that identifies the entity requesting config. E.g. \"envoy\" or \"grpc\"",
    "notImp": false
  },
  {
    "name": "user_agent_version_type.user_agent_version",
    "isUnion": true,
    "isDeprecated": false,
    "fieldType": "string",
    "enums": null,
    "comment": "Free-form string that identifies the version of the entity requesting config. E.g. \"1.12.2\" or \"abcd1234\", or \"SpecialEnvoyBuild\"",
    "notImp": false
  },
  {
    "name": "user_agent_version_type.user_agent_build_version",
    "isUnion": true,
    "isDeprecated": false,
    "fieldType": "BuildVersion",
    "enums": null,
    "comment": "Structured version of the entity requesting config.",
    "notImp": false
  },
  {
    "name": "extensions",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "Extension[]",
    "enums": null,
    "comment": "List of extensions and their versions supported by the node.",
    "notImp": false
  },
  {
    "name": "client_features",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "string[]",
    "enums": null,
    "comment": "Client feature support list. These are well known features described in the Envoy API repository for a given major version of an API. Client features use reverse DNS naming scheme, for example ``com.acme.feature``. See `the list of features` that xDS client may support.",
    "notImp": false
  },
  {
    "name": "listening_addresses",
    "isUnion": false,
    "isDeprecated": true,
    "fieldType": "Address[]",
    "enums": null,
    "comment": "Known listening ports on the node as a generic hint to the management server for filtering `listeners` to be returned. For example, if there is a listener bound to port 80, the list can optionally contain the SocketAddress ``(0.0.0.0,80)``. The field is optional and just a hint.",
    "notImp": false
  }
] };

export const Node_SingleFields = [
  "id",
  "cluster",
  "user_agent_name",
  "user_agent_version_type.user_agent_version",
  "client_features"
];

export const Node_DynamicParametersEntry: OutType = { "Node_DynamicParametersEntry": [
  {
    "name": "key",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "string",
    "enums": null,
    "comment": "",
    "notImp": false
  },
  {
    "name": "value",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "ContextParams",
    "enums": null,
    "comment": "",
    "notImp": false
  }
] };

export const Node_DynamicParametersEntry_SingleFields = [
  "key"
];

export const Metadata: OutType = { "Metadata": [
  {
    "name": "filter_metadata",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "Map<string, { [key: string]: any; }>",
    "enums": null,
    "comment": "Key is the reverse DNS filter name, e.g. com.acme.widget. The ``envoy.*`` namespace is reserved for Envoy's built-in filters. If both ``filter_metadata`` and `typed_filter_metadata` fields are present in the metadata with same keys, only ``typed_filter_metadata`` field will be parsed.",
    "notImp": false
  },
  {
    "name": "typed_filter_metadata",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "Map<string, Any>",
    "enums": null,
    "comment": "Key is the reverse DNS filter name, e.g. com.acme.widget. The ``envoy.*`` namespace is reserved for Envoy's built-in filters. The value is encoded as google.protobuf.Any. If both `filter_metadata` and ``typed_filter_metadata`` fields are present in the metadata with same keys, only ``typed_filter_metadata`` field will be parsed.",
    "notImp": false
  }
] };

export const Metadata_FilterMetadataEntry: OutType = { "Metadata_FilterMetadataEntry": [
  {
    "name": "key",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "string",
    "enums": null,
    "comment": "",
    "notImp": false
  },
  {
    "name": "value",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "{ [key: string]: any; }",
    "enums": null,
    "comment": "",
    "notImp": false
  }
] };

export const Metadata_FilterMetadataEntry_SingleFields = [
  "key"
];

export const Metadata_TypedFilterMetadataEntry: OutType = { "Metadata_TypedFilterMetadataEntry": [
  {
    "name": "key",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "string",
    "enums": null,
    "comment": "",
    "notImp": false
  },
  {
    "name": "value",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "Any",
    "enums": null,
    "comment": "",
    "notImp": false
  }
] };

export const Metadata_TypedFilterMetadataEntry_SingleFields = [
  "key"
];

export const RuntimeUInt32: OutType = { "RuntimeUInt32": [
  {
    "name": "default_value",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "number",
    "enums": null,
    "comment": "Default value if runtime value is not available.",
    "notImp": false
  },
  {
    "name": "runtime_key",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "string",
    "enums": null,
    "comment": "Runtime key to get value for comparison. This value is used if defined.",
    "notImp": false
  }
] };

export const RuntimeUInt32_SingleFields = [
  "default_value",
  "runtime_key"
];

export const RuntimePercent: OutType = { "RuntimePercent": [
  {
    "name": "default_value",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "Percent",
    "enums": null,
    "comment": "Default value if runtime value is not available.",
    "notImp": false
  },
  {
    "name": "runtime_key",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "string",
    "enums": null,
    "comment": "Runtime key to get value for comparison. This value is used if defined.",
    "notImp": false
  }
] };

export const RuntimePercent_SingleFields = [
  "runtime_key"
];

export const RuntimeDouble: OutType = { "RuntimeDouble": [
  {
    "name": "default_value",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "number",
    "enums": null,
    "comment": "Default value if runtime value is not available.",
    "notImp": false
  },
  {
    "name": "runtime_key",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "string",
    "enums": null,
    "comment": "Runtime key to get value for comparison. This value is used if defined.",
    "notImp": false
  }
] };

export const RuntimeDouble_SingleFields = [
  "default_value",
  "runtime_key"
];

export const RuntimeFeatureFlag: OutType = { "RuntimeFeatureFlag": [
  {
    "name": "default_value",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "boolean",
    "enums": null,
    "comment": "Default value if runtime value is not available.",
    "notImp": false
  },
  {
    "name": "runtime_key",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "string",
    "enums": null,
    "comment": "Runtime key to get value for comparison. This value is used if defined. The boolean value must be represented via its `canonical JSON encoding <https://developers.google.com/protocol-buffers/docs/proto3#json>`_.",
    "notImp": false
  }
] };

export const RuntimeFeatureFlag_SingleFields = [
  "default_value",
  "runtime_key"
];

export const KeyValue: OutType = { "KeyValue": [
  {
    "name": "key",
    "isUnion": false,
    "isDeprecated": true,
    "fieldType": "string",
    "enums": null,
    "comment": "The key of the key/value pair.",
    "notImp": false
  },
  {
    "name": "value",
    "isUnion": false,
    "isDeprecated": true,
    "fieldType": "Uint8Array<ArrayBufferLike>",
    "enums": null,
    "comment": "The value of the key/value pair.\n\nThe ``bytes`` type is used. This means if JSON or YAML is used to to represent the configuration, the value must be base64 encoded. This is unfriendly for users in most use scenarios of this message.",
    "notImp": false
  }
] };

export const KeyValuePair: OutType = { "KeyValuePair": [
  {
    "name": "key",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "string",
    "enums": null,
    "comment": "The key of the key/value pair.",
    "notImp": false
  },
  {
    "name": "value",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "any",
    "enums": null,
    "comment": "The value of the key/value pair.",
    "notImp": false
  }
] };

export const KeyValuePair_SingleFields = [
  "key",
  "value"
];

export const KeyValueAppend: OutType = { "KeyValueAppend": [
  {
    "name": "record",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "KeyValuePair",
    "enums": null,
    "comment": "The single key/value pair record to be appended or overridden. This field must be set.",
    "notImp": false
  },
  {
    "name": "entry",
    "isUnion": false,
    "isDeprecated": true,
    "fieldType": "KeyValue",
    "enums": null,
    "comment": "Key/value pair entry that this option to append or overwrite. This field is deprecated and please use `record` as replacement. [#not-implemented-hide:]",
    "notImp": true
  },
  {
    "name": "action",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "KeyValueAppend_KeyValueAppendAction",
    "enums": [
      "APPEND_IF_EXISTS_OR_ADD",
      "ADD_IF_ABSENT",
      "OVERWRITE_IF_EXISTS_OR_ADD",
      "OVERWRITE_IF_EXISTS"
    ],
    "comment": "Describes the action taken to append/overwrite the given value for an existing key or to only add this key if it's absent.",
    "notImp": false
  }
] };

export const KeyValueAppend_SingleFields = [
  "action"
];

export const KeyValueMutation: OutType = { "KeyValueMutation": [
  {
    "name": "append",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "KeyValueAppend",
    "enums": null,
    "comment": "Key/value pair to append or overwrite. Only one of ``append`` or ``remove`` can be set or the configuration will be rejected.",
    "notImp": false
  },
  {
    "name": "remove",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "string",
    "enums": null,
    "comment": "Key to remove. Only one of ``append`` or ``remove`` can be set or the configuration will be rejected.",
    "notImp": false
  }
] };

export const KeyValueMutation_SingleFields = [
  "remove"
];

export const QueryParameter: OutType = { "QueryParameter": [
  {
    "name": "key",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "string",
    "enums": null,
    "comment": "The key of the query parameter. Case sensitive.",
    "notImp": false
  },
  {
    "name": "value",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "string",
    "enums": null,
    "comment": "The value of the query parameter.",
    "notImp": false
  }
] };

export const QueryParameter_SingleFields = [
  "key",
  "value"
];

export const HeaderValue: OutType = { "HeaderValue": [
  {
    "name": "key",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "string",
    "enums": null,
    "comment": "Header name.",
    "notImp": false
  },
  {
    "name": "value",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "string",
    "enums": null,
    "comment": "Header value.\n\nThe same `format specifier` as used for `HTTP access logging` applies here, however unknown header values are replaced with the empty string instead of ``-``. Header value is encoded as string. This does not work for non-utf8 characters. Only one of ``value`` or ``raw_value`` can be set.",
    "notImp": false
  },
  {
    "name": "raw_value",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "Uint8Array<ArrayBufferLike>",
    "enums": null,
    "comment": "Header value is encoded as bytes which can support non-utf8 characters. Only one of ``value`` or ``raw_value`` can be set.",
    "notImp": false
  }
] };

export const HeaderValue_SingleFields = [
  "key",
  "value"
];

export const HeaderValueOption: OutType = { "HeaderValueOption": [
  {
    "name": "header",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "HeaderValue",
    "enums": null,
    "comment": "Header name/value pair that this option applies to.",
    "notImp": false
  },
  {
    "name": "append",
    "isUnion": false,
    "isDeprecated": true,
    "fieldType": "boolean",
    "enums": null,
    "comment": "Should the value be appended? If true (default), the value is appended to existing values. Otherwise it replaces any existing values. This field is deprecated and please use `append_action` as replacement.\n\n:::note\nThe `external authorization service` and `external processor service` have default value (``false``) for this field. \n:::",
    "notImp": false
  },
  {
    "name": "append_action",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "HeaderValueOption_HeaderAppendAction",
    "enums": [
      "APPEND_IF_EXISTS_OR_ADD",
      "ADD_IF_ABSENT",
      "OVERWRITE_IF_EXISTS_OR_ADD",
      "OVERWRITE_IF_EXISTS"
    ],
    "comment": "Describes the action taken to append/overwrite the given value for an existing header or to only add this header if it's absent. Value defaults to `APPEND_IF_EXISTS_OR_ADD`.",
    "notImp": false
  },
  {
    "name": "keep_empty_value",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "boolean",
    "enums": null,
    "comment": "Is the header value allowed to be empty? If false (default), custom headers with empty values are dropped, otherwise they are added.",
    "notImp": false
  }
] };

export const HeaderValueOption_SingleFields = [
  "append_action",
  "keep_empty_value"
];

export const HeaderMap: OutType = { "HeaderMap": [
  {
    "name": "headers",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "HeaderValue[]",
    "enums": null,
    "comment": "A list of header names and their values.",
    "notImp": false
  }
] };

export const WatchedDirectory: OutType = { "WatchedDirectory": [
  {
    "name": "path",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "string",
    "enums": null,
    "comment": "Directory path to watch.",
    "notImp": false
  }
] };

export const WatchedDirectory_SingleFields = [
  "path"
];

export const DataSource: OutType = { "DataSource": [
  {
    "name": "specifier.filename",
    "isUnion": true,
    "isDeprecated": false,
    "fieldType": "string",
    "enums": null,
    "comment": "Local filesystem data source.",
    "notImp": false
  },
  {
    "name": "specifier.inline_bytes",
    "isUnion": true,
    "isDeprecated": false,
    "fieldType": "Uint8Array<ArrayBufferLike>",
    "enums": null,
    "comment": "Bytes inlined in the configuration.",
    "notImp": false
  },
  {
    "name": "specifier.inline_string",
    "isUnion": true,
    "isDeprecated": false,
    "fieldType": "string",
    "enums": null,
    "comment": "String inlined in the configuration.",
    "notImp": false
  },
  {
    "name": "specifier.environment_variable",
    "isUnion": true,
    "isDeprecated": false,
    "fieldType": "string",
    "enums": null,
    "comment": "Environment variable data source.",
    "notImp": false
  },
  {
    "name": "watched_directory",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "WatchedDirectory",
    "enums": null,
    "comment": "Watched directory that is watched for file changes. If this is set explicitly, the file specified in the ``filename`` field will be reloaded when relevant file move events occur.\n\n:::note\nThis field only makes sense when the ``filename`` field is set. \n:::\n\n:::note\nEnvoy only updates when the file is replaced by a file move, and not when the file is edited in place. \n:::\n\n:::note\nNot all use cases of ``DataSource`` support watching directories. It depends on the specific usage of the ``DataSource``. See the documentation of the parent message for details.",
    "notImp": false
  }
] };

export const DataSource_SingleFields = [
  "specifier.filename",
  "specifier.inline_string",
  "specifier.environment_variable"
];

export const RetryPolicy_RetryPriority: OutType = { "RetryPolicy_RetryPriority": [
  {
    "name": "name",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "string",
    "enums": null,
    "comment": "",
    "notImp": false
  },
  {
    "name": "config_type.typed_config",
    "isUnion": true,
    "isDeprecated": false,
    "fieldType": "Any",
    "enums": null,
    "comment": "See `RetryPriority`.",
    "notImp": false
  }
] };

export const RetryPolicy_RetryPriority_SingleFields = [
  "name"
];

export const RetryPolicy: OutType = { "RetryPolicy": [
  {
    "name": "retry_back_off",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "BackoffStrategy",
    "enums": null,
    "comment": "Specifies parameters that control `retry backoff strategy`. This parameter is optional, in which case the default base interval is 1000 milliseconds. The default maximum interval is 10 times the base interval.",
    "notImp": false
  },
  {
    "name": "num_retries",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "number",
    "enums": null,
    "comment": "Specifies the allowed number of retries. This parameter is optional and defaults to 1.",
    "notImp": false
  },
  {
    "name": "retry_on",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "string",
    "enums": null,
    "comment": "For details, see `retry_on`.",
    "notImp": false
  },
  {
    "name": "retry_priority",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "RetryPolicy_RetryPriority",
    "enums": null,
    "comment": "For details, see `retry_priority`.",
    "notImp": false
  },
  {
    "name": "retry_host_predicate",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "RetryPolicy_RetryHostPredicate[]",
    "enums": null,
    "comment": "For details, see `RetryHostPredicate`.",
    "notImp": false
  },
  {
    "name": "host_selection_retry_max_attempts",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "number",
    "enums": null,
    "comment": "For details, see `host_selection_retry_max_attempts`.",
    "notImp": false
  }
] };

export const RetryPolicy_SingleFields = [
  "num_retries",
  "retry_on",
  "host_selection_retry_max_attempts"
];

export const RetryPolicy_RetryHostPredicate: OutType = { "RetryPolicy_RetryHostPredicate": [
  {
    "name": "name",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "string",
    "enums": null,
    "comment": "",
    "notImp": false
  },
  {
    "name": "config_type.typed_config",
    "isUnion": true,
    "isDeprecated": false,
    "fieldType": "Any",
    "enums": null,
    "comment": "See `RetryHostPredicate`.",
    "notImp": false
  }
] };

export const RetryPolicy_RetryHostPredicate_SingleFields = [
  "name"
];

export const RemoteDataSource: OutType = { "RemoteDataSource": [
  {
    "name": "http_uri",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "HttpUri",
    "enums": null,
    "comment": "The HTTP URI to fetch the remote data.",
    "notImp": false
  },
  {
    "name": "sha256",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "string",
    "enums": null,
    "comment": "SHA256 string for verifying data.",
    "notImp": false
  },
  {
    "name": "retry_policy",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "RetryPolicy",
    "enums": null,
    "comment": "Retry policy for fetching remote data.",
    "notImp": false
  }
] };

export const RemoteDataSource_SingleFields = [
  "sha256"
];

export const AsyncDataSource: OutType = { "AsyncDataSource": [
  {
    "name": "specifier.local",
    "isUnion": true,
    "isDeprecated": false,
    "fieldType": "DataSource",
    "enums": null,
    "comment": "Local async data source.",
    "notImp": false
  },
  {
    "name": "specifier.remote",
    "isUnion": true,
    "isDeprecated": false,
    "fieldType": "RemoteDataSource",
    "enums": null,
    "comment": "Remote async data source.",
    "notImp": false
  }
] };

export const TransportSocket: OutType = { "TransportSocket": [
  {
    "name": "name",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "string",
    "enums": null,
    "comment": "The name of the transport socket to instantiate. The name must match a supported transport socket implementation.",
    "notImp": false
  },
  {
    "name": "config_type.typed_config",
    "isUnion": true,
    "isDeprecated": false,
    "fieldType": "Any",
    "enums": null,
    "comment": "Implementation specific configuration which depends on the implementation being instantiated. See the supported transport socket implementations for further documentation.",
    "notImp": false
  }
] };

export const TransportSocket_SingleFields = [
  "name"
];

export const RuntimeFractionalPercent: OutType = { "RuntimeFractionalPercent": [
  {
    "name": "default_value",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "FractionalPercent",
    "enums": null,
    "comment": "Default value if the runtime value's for the numerator/denominator keys are not available.",
    "notImp": false
  },
  {
    "name": "runtime_key",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "string",
    "enums": null,
    "comment": "Runtime key for a YAML representation of a FractionalPercent.",
    "notImp": false
  }
] };

export const RuntimeFractionalPercent_SingleFields = [
  "runtime_key"
];

export const ControlPlane: OutType = { "ControlPlane": [
  {
    "name": "identifier",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "string",
    "enums": null,
    "comment": "An opaque control plane identifier that uniquely identifies an instance of control plane. This can be used to identify which control plane instance, the Envoy is connected to.",
    "notImp": false
  }
] };

export const ControlPlane_SingleFields = [
  "identifier"
];