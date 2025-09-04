import {OutType} from '@elchi/tags/tagsType';


export const RateLimitSettings: OutType = { "RateLimitSettings": [
  {
    "name": "max_tokens",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "number",
    "enums": null,
    "comment": "Maximum number of tokens to be used for rate limiting discovery request calls. If not set, a default value of 100 will be used.",
    "notImp": false
  },
  {
    "name": "fill_rate",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "number",
    "enums": null,
    "comment": "Rate at which tokens will be filled per second. If not set, a default fill rate of 10 tokens per second will be used. The minimal fill rate is once per year. Lower fill rates will be set to once per year.",
    "notImp": false
  }
] };

export const RateLimitSettings_SingleFields = [
  "max_tokens",
  "fill_rate"
];

export const ApiConfigSource: OutType = { "ApiConfigSource": [
  {
    "name": "api_type",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "ApiConfigSource_ApiType",
    "enums": [
      "DEPRECATED_AND_UNAVAILABLE_DO_NOT_USE",
      "REST",
      "GRPC",
      "DELTA_GRPC",
      "AGGREGATED_GRPC",
      "AGGREGATED_DELTA_GRPC"
    ],
    "comment": "API type (gRPC, REST, delta gRPC)",
    "notImp": false
  },
  {
    "name": "transport_api_version",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "ApiVersion",
    "enums": [
      "AUTO",
      "V2",
      "V3"
    ],
    "comment": "API version for xDS transport protocol. This describes the xDS gRPC/REST endpoint and version of [Delta]DiscoveryRequest/Response used on the wire.",
    "notImp": false
  },
  {
    "name": "cluster_names",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "string[]",
    "enums": null,
    "comment": "Cluster names should be used only with REST. If > 1 cluster is defined, clusters will be cycled through if any kind of failure occurs.\n\n:::note\n\nThe cluster with name ``cluster_name`` must be statically defined and its type must not be ``EDS``.",
    "notImp": false
  },
  {
    "name": "grpc_services",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "GrpcService[]",
    "enums": null,
    "comment": "Multiple gRPC services be provided for GRPC. If > 1 cluster is defined, services will be cycled through if any kind of failure occurs.",
    "notImp": false
  },
  {
    "name": "refresh_delay",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "Duration",
    "enums": null,
    "comment": "For REST APIs, the delay between successive polls.",
    "notImp": false
  },
  {
    "name": "request_timeout",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "Duration",
    "enums": null,
    "comment": "For REST APIs, the request timeout. If not set, a default value of 1s will be used.",
    "notImp": false
  },
  {
    "name": "rate_limit_settings",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "RateLimitSettings",
    "enums": null,
    "comment": "For GRPC APIs, the rate limit settings. If present, discovery requests made by Envoy will be rate limited.",
    "notImp": false
  },
  {
    "name": "set_node_on_first_message_only",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "boolean",
    "enums": null,
    "comment": "Skip the node identifier in subsequent discovery requests for streaming gRPC config types.",
    "notImp": false
  },
  {
    "name": "config_validators",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "TypedExtensionConfig[]",
    "enums": null,
    "comment": "A list of config validators that will be executed when a new update is received from the ApiConfigSource. Note that each validator handles a specific xDS service type, and only the validators corresponding to the type url (in `` DiscoveryResponse`` or `` DeltaDiscoveryResponse``) will be invoked. If the validator returns false or throws an exception, the config will be rejected by the client, and a NACK will be sent. extension-category: envoy.config.validators",
    "notImp": false
  }
] };

export const ApiConfigSource_SingleFields = [
  "api_type",
  "transport_api_version",
  "cluster_names",
  "refresh_delay",
  "request_timeout",
  "set_node_on_first_message_only"
];

export const SelfConfigSource: OutType = { "SelfConfigSource": [
  {
    "name": "transport_api_version",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "ApiVersion",
    "enums": [
      "AUTO",
      "V2",
      "V3"
    ],
    "comment": "API version for xDS transport protocol. This describes the xDS gRPC/REST endpoint and version of [Delta]DiscoveryRequest/Response used on the wire.",
    "notImp": false
  }
] };

export const SelfConfigSource_SingleFields = [
  "transport_api_version"
];

export const PathConfigSource: OutType = { "PathConfigSource": [
  {
    "name": "path",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "string",
    "enums": null,
    "comment": "Path on the filesystem to source and watch for configuration updates. When sourcing configuration for a `secret`, the certificate and key files are also watched for updates.\n\n:::note\n\nThe path to the source must exist at config load time. \n:::\n\n:::note\n\nIf ``watched_directory`` is *not* configured, Envoy will watch the file path for *moves*. This is because in general only moves are atomic. The same method of swapping files as is demonstrated in the `runtime documentation` can be used here also. If ``watched_directory`` is configured, no watch will be placed directly on this path. Instead, the configured ``watched_directory`` will be used to trigger reloads of this path. This is required in certain deployment scenarios. See below for more information.",
    "notImp": false
  },
  {
    "name": "watched_directory",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "WatchedDirectory",
    "enums": null,
    "comment": "If configured, this directory will be watched for *moves*. When an entry in this directory is moved to, the ``path`` will be reloaded. This is required in certain deployment scenarios.\n\nSpecifically, if trying to load an xDS resource using a `Kubernetes ConfigMap <https://kubernetes.io/docs/concepts/configuration/configmap/>`_, the following configuration might be used: 1. Store xds.yaml inside a ConfigMap. 2. Mount the ConfigMap to ``/config_map/xds`` 3. Configure path ``/config_map/xds/xds.yaml`` 4. Configure watched directory ``/config_map/xds``\n\nThe above configuration will ensure that Envoy watches the owning directory for moves which is required due to how Kubernetes manages ConfigMap symbolic links during atomic updates.",
    "notImp": false
  }
] };

export const PathConfigSource_SingleFields = [
  "path"
];

export const ConfigSource: OutType = { "ConfigSource": [
  {
    "name": "authorities",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "Authority[]",
    "enums": null,
    "comment": "Authorities that this config source may be used for. An authority specified in a xdstp:// URL is resolved to a ``ConfigSource`` prior to configuration fetch. This field provides the association between authority name and configuration source. [#not-implemented-hide:]",
    "notImp": true
  },
  {
    "name": "config_source_specifier.path",
    "isUnion": true,
    "isDeprecated": false,
    "fieldType": "string",
    "enums": null,
    "comment": "Deprecated in favor of ``path_config_source``. Use that field instead.",
    "notImp": false
  },
  {
    "name": "config_source_specifier.path_config_source",
    "isUnion": true,
    "isDeprecated": false,
    "fieldType": "PathConfigSource",
    "enums": null,
    "comment": "Local filesystem path configuration source.",
    "notImp": false
  },
  {
    "name": "config_source_specifier.api_config_source",
    "isUnion": true,
    "isDeprecated": false,
    "fieldType": "ApiConfigSource",
    "enums": null,
    "comment": "API configuration source.",
    "notImp": false
  },
  {
    "name": "config_source_specifier.ads",
    "isUnion": true,
    "isDeprecated": false,
    "fieldType": "AggregatedConfigSource",
    "enums": null,
    "comment": "When set, ADS will be used to fetch resources. The ADS API configuration source in the bootstrap configuration is used.",
    "notImp": false
  },
  {
    "name": "config_source_specifier.self",
    "isUnion": true,
    "isDeprecated": false,
    "fieldType": "SelfConfigSource",
    "enums": null,
    "comment": "[#not-implemented-hide:] When set, the client will access the resources from the same server it got the ConfigSource from, although not necessarily from the same stream. This is similar to the `ads` field, except that the client may use a different stream to the same server. As a result, this field can be used for things like LRS that cannot be sent on an ADS stream. It can also be used to link from (e.g.) LDS to RDS on the same server without requiring the management server to know its name or required credentials.",
    "notImp": true
  },
  {
    "name": "initial_fetch_timeout",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "Duration",
    "enums": null,
    "comment": "When this timeout is specified, Envoy will wait no longer than the specified time for first config response on this xDS subscription during the `initialization process`. After reaching the timeout, Envoy will move to the next initialization phase, even if the first config is not delivered yet. The timer is activated when the xDS API subscription starts, and is disarmed on first config update or on error. 0 means no timeout - Envoy will wait indefinitely for the first xDS config (unless another timeout applies). The default is 15s.",
    "notImp": false
  },
  {
    "name": "resource_api_version",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "ApiVersion",
    "enums": [
      "AUTO",
      "V2",
      "V3"
    ],
    "comment": "API version for xDS resources. This implies the type URLs that the client will request for resources and the resource type that the client will in turn expect to be delivered.",
    "notImp": false
  }
] };

export const ConfigSource_SingleFields = [
  "config_source_specifier.path",
  "initial_fetch_timeout",
  "resource_api_version"
];

export const ExtensionConfigSource: OutType = { "ExtensionConfigSource": [
  {
    "name": "config_source",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "ConfigSource",
    "enums": null,
    "comment": "",
    "notImp": false
  },
  {
    "name": "default_config",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "Any",
    "enums": null,
    "comment": "Optional default configuration to use as the initial configuration if there is a failure to receive the initial extension configuration or if ``apply_default_config_without_warming`` flag is set.",
    "notImp": false
  },
  {
    "name": "apply_default_config_without_warming",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "boolean",
    "enums": null,
    "comment": "Use the default config as the initial configuration without warming and waiting for the first discovery response. Requires the default configuration to be supplied.",
    "notImp": false
  },
  {
    "name": "type_urls",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "string[]",
    "enums": null,
    "comment": "A set of permitted extension type URLs. Extension configuration updates are rejected if they do not match any type URL in the set.",
    "notImp": false
  }
] };

export const ExtensionConfigSource_SingleFields = [
  "apply_default_config_without_warming",
  "type_urls"
];