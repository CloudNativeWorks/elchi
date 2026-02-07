import {OutType} from '@elchi/tags/tagsType';


export const Bootstrap_StaticResources: OutType = { "Bootstrap_StaticResources": [
  {
    "name": "listeners",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "Listener[]",
    "enums": null,
    "comment": "Static `Listeners`. These listeners are available regardless of LDS configuration.",
    "notImp": false
  },
  {
    "name": "clusters",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "Cluster[]",
    "enums": null,
    "comment": "If a network based configuration source is specified for `cds_config`, it's necessary to have some initial cluster definitions available to allow Envoy to know how to speak to the management server.",
    "notImp": false
  },
  {
    "name": "secrets",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "Secret[]",
    "enums": null,
    "comment": "These static secrets can be used by `SdsSecretConfig`",
    "notImp": false
  }
] };

export const Bootstrap_DynamicResources: OutType = { "Bootstrap_DynamicResources": [
  {
    "name": "lds_config",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "ConfigSource",
    "enums": null,
    "comment": "All `Listeners` are provided by a single `LDS` configuration source.",
    "notImp": false
  },
  {
    "name": "lds_resources_locator",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "string",
    "enums": null,
    "comment": "``xdstp://`` resource locator for listener collection. [#not-implemented-hide:]",
    "notImp": true
  },
  {
    "name": "cds_config",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "ConfigSource",
    "enums": null,
    "comment": "All post-bootstrap `Cluster` definitions are provided by a single `CDS` configuration source.",
    "notImp": false
  },
  {
    "name": "cds_resources_locator",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "string",
    "enums": null,
    "comment": "``xdstp://`` resource locator for cluster collection. [#not-implemented-hide:]",
    "notImp": true
  },
  {
    "name": "ads_config",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "ApiConfigSource",
    "enums": null,
    "comment": "A single `ADS` source may be optionally specified. This must have `api_type` `GRPC`. Only `ConfigSources` that have the `ads` field set will be streamed on the ADS channel.",
    "notImp": false
  }
] };

export const Bootstrap_DynamicResources_SingleFields = [
  "lds_resources_locator",
  "cds_resources_locator"
];

export const ClusterManager_OutlierDetection: OutType = { "ClusterManager_OutlierDetection": [
  {
    "name": "event_log_path",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "string",
    "enums": null,
    "comment": "Specifies the path to the outlier event log.",
    "notImp": false
  },
  {
    "name": "event_service",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "EventServiceConfig",
    "enums": null,
    "comment": "[#not-implemented-hide:] The gRPC service for the outlier detection event service. If empty, outlier detection events won't be sent to a remote endpoint.",
    "notImp": true
  }
] };

export const ClusterManager_OutlierDetection_SingleFields = [
  "event_log_path"
];

export const ClusterManager: OutType = { "ClusterManager": [
  {
    "name": "local_cluster_name",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "string",
    "enums": null,
    "comment": "Name of the local cluster (i.e., the cluster that owns the Envoy running this configuration). In order to enable `zone aware routing` this option must be set. If ``local_cluster_name`` is defined then `clusters` must be defined in the `Bootstrap static cluster resources`. This is unrelated to the :option:`--service-cluster` option which does not `affect zone aware routing <https://github.com/envoyproxy/envoy/issues/774>`_.",
    "notImp": false
  },
  {
    "name": "outlier_detection",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "ClusterManager_OutlierDetection",
    "enums": null,
    "comment": "Optional global configuration for outlier detection.",
    "notImp": false
  },
  {
    "name": "upstream_bind_config",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "BindConfig",
    "enums": null,
    "comment": "Optional configuration used to bind newly established upstream connections. This may be overridden on a per-cluster basis by ``upstream_bind_config`` in the ``cds_config``.",
    "notImp": false
  },
  {
    "name": "load_stats_config",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "ApiConfigSource",
    "enums": null,
    "comment": "A management server endpoint to stream load stats to via ``StreamLoadStats``. This must have `api_type` `GRPC`.",
    "notImp": false
  },
  {
    "name": "enable_deferred_cluster_creation",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "boolean",
    "enums": null,
    "comment": "Whether the ClusterManager will create clusters on the worker threads inline during requests. This will save memory and CPU cycles in cases where there are lots of inactive clusters and ``> 1`` worker thread.",
    "notImp": false
  }
] };

export const ClusterManager_SingleFields = [
  "local_cluster_name",
  "enable_deferred_cluster_creation"
];

export const Bootstrap_DeferredStatOptions: OutType = { "Bootstrap_DeferredStatOptions": [
  {
    "name": "enable_deferred_creation_stats",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "boolean",
    "enums": null,
    "comment": "When the flag is enabled, Envoy will lazily initialize a subset of the stats (see below). This will save memory and CPU cycles when creating the objects that own these stats, if those stats are never referenced throughout the lifetime of the process. However, it will incur additional memory overhead for these objects, and a small increase of CPU usage when at least one of the stats is updated for the first time.\n\nGroups of stats that will be lazily initialized:\n\n- Cluster traffic stats: a subgroup of the `cluster statistics` that are used when requests are routed to the cluster.",
    "notImp": false
  }
] };

export const Bootstrap_DeferredStatOptions_SingleFields = [
  "enable_deferred_creation_stats"
];

export const Watchdog: OutType = { "Watchdog": [
  {
    "name": "actions",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "Watchdog_WatchdogAction[]",
    "enums": null,
    "comment": "Register actions that will fire on given Watchdog events. See ``WatchdogAction`` for priority of events.",
    "notImp": false
  },
  {
    "name": "miss_timeout",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "Duration",
    "enums": null,
    "comment": "The duration after which Envoy counts a nonresponsive thread in the ``watchdog_miss`` statistic. If not specified the default is ``200ms``.",
    "notImp": false
  },
  {
    "name": "megamiss_timeout",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "Duration",
    "enums": null,
    "comment": "The duration after which Envoy counts a nonresponsive thread in the ``watchdog_mega_miss`` statistic. If not specified the default is ``1000ms``.",
    "notImp": false
  },
  {
    "name": "kill_timeout",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "Duration",
    "enums": null,
    "comment": "If a watched thread has been nonresponsive for this duration, assume a programming error and kill the entire Envoy process. Set to ``0`` to disable kill behavior. If not specified the default is ``0`` (disabled).",
    "notImp": false
  },
  {
    "name": "max_kill_timeout_jitter",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "Duration",
    "enums": null,
    "comment": "Defines the maximum jitter used to adjust the ``kill_timeout`` if ``kill_timeout`` is enabled. Enabling this feature would help to reduce risk of synchronized watchdog kill events across proxies due to external triggers. Set to ``0`` to disable. If not specified the default is ``0`` (disabled).",
    "notImp": false
  },
  {
    "name": "multikill_timeout",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "Duration",
    "enums": null,
    "comment": "If ``max(2, ceil(registered_threads * Fraction(multikill_threshold)))`` threads have been nonresponsive for at least this duration kill the entire Envoy process. Set to ``0`` to disable this behavior. If not specified the default is ``0`` (disabled).",
    "notImp": false
  },
  {
    "name": "multikill_threshold",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "Percent",
    "enums": null,
    "comment": "Sets the threshold for ``multikill_timeout`` in terms of the percentage of nonresponsive threads required for the ``multikill_timeout``. If not specified the default is ``0``.",
    "notImp": false
  }
] };

export const Watchdog_SingleFields = [
  "miss_timeout",
  "megamiss_timeout",
  "kill_timeout",
  "max_kill_timeout_jitter",
  "multikill_timeout"
];

export const Watchdogs: OutType = { "Watchdogs": [
  {
    "name": "main_thread_watchdog",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "Watchdog",
    "enums": null,
    "comment": "Watchdog for the main thread.",
    "notImp": false
  },
  {
    "name": "worker_watchdog",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "Watchdog",
    "enums": null,
    "comment": "Watchdog for the worker threads.",
    "notImp": false
  }
] };

export const LayeredRuntime: OutType = { "LayeredRuntime": [
  {
    "name": "layers",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "RuntimeLayer[]",
    "enums": null,
    "comment": "The `layers` of the runtime. This is ordered such that later layers in the list overlay earlier entries.",
    "notImp": false
  }
] };

export const Admin: OutType = { "Admin": [
  {
    "name": "access_log",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "AccessLog[]",
    "enums": null,
    "comment": "Configuration for `access logs` emitted by the administration server.",
    "notImp": false
  },
  {
    "name": "access_log_path",
    "isUnion": false,
    "isDeprecated": true,
    "fieldType": "string",
    "enums": null,
    "comment": "The path to write the access log for the administration server. If no access log is desired specify ``/dev/null``. This is only required if `address` is set. Deprecated in favor of ``access_log`` which offers more options.",
    "notImp": false
  },
  {
    "name": "profile_path",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "string",
    "enums": null,
    "comment": "The CPU profiler output path for the administration server. If no profile path is specified, the default is ``/var/log/envoy/envoy.prof``.",
    "notImp": false
  },
  {
    "name": "address",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "Address",
    "enums": null,
    "comment": "The TCP address that the administration server will listen on. If not specified, Envoy will not start an administration server.",
    "notImp": false
  },
  {
    "name": "socket_options",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "SocketOption[]",
    "enums": null,
    "comment": "Additional socket options that may not be present in Envoy source code or precompiled binaries.",
    "notImp": false
  },
  {
    "name": "ignore_global_conn_limit",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "boolean",
    "enums": null,
    "comment": "Indicates whether `global_downstream_max_connections` should apply to the admin interface or not.",
    "notImp": false
  },
  {
    "name": "allow_paths",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "StringMatcher[]",
    "enums": null,
    "comment": "List of admin paths that are accessible. If not specified, all admin endpoints are accessible.\n\nWhen specified, only paths in this list will be accessible, all others will return ``HTTP 403 Forbidden``.\n\nExample:\n\n```yaml\n\n  allow_paths:\n  - exact: /stats\n  - exact: /ready\n  - prefix: /healthcheck",
    "notImp": false
  }
] };

export const Admin_SingleFields = [
  "profile_path",
  "ignore_global_conn_limit"
];

export const Bootstrap_ApplicationLogConfig_LogFormat: OutType = { "Bootstrap_ApplicationLogConfig_LogFormat": [
  {
    "name": "log_format.json_format",
    "isUnion": true,
    "isDeprecated": false,
    "fieldType": "{ [key: string]: any; }",
    "enums": null,
    "comment": "Flush application logs in JSON format. The configured JSON struct can support all the format flags specified in the :option:`--log-format` command line options section, except for the ``%v`` and ``%_`` flags.",
    "notImp": false
  },
  {
    "name": "log_format.text_format",
    "isUnion": true,
    "isDeprecated": false,
    "fieldType": "string",
    "enums": null,
    "comment": "Flush application log in a format defined by a string. The text format can support all the format flags specified in the :option:`--log-format` command line option section.",
    "notImp": false
  }
] };

export const Bootstrap_ApplicationLogConfig_LogFormat_SingleFields = [
  "log_format.text_format"
];

export const Bootstrap_ApplicationLogConfig: OutType = { "Bootstrap_ApplicationLogConfig": [
  {
    "name": "log_format",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "Bootstrap_ApplicationLogConfig_LogFormat",
    "enums": null,
    "comment": "Optional field to set the application logs format. If this field is set, it will override the default log format. Setting both this field and :option:`--log-format` command line option is not allowed, and will cause a bootstrap error.",
    "notImp": false
  }
] };

export const Bootstrap_GrpcAsyncClientManagerConfig: OutType = { "Bootstrap_GrpcAsyncClientManagerConfig": [
  {
    "name": "max_cached_entry_idle_duration",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "Duration",
    "enums": null,
    "comment": "Optional field to set the expiration time for the cached gRPC client object. The minimal value is ``5s`` and the default is ``50s``.",
    "notImp": false
  }
] };

export const Bootstrap_GrpcAsyncClientManagerConfig_SingleFields = [
  "max_cached_entry_idle_duration"
];

export const MemoryAllocatorManager: OutType = { "MemoryAllocatorManager": [
  {
    "name": "bytes_to_release",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "number",
    "enums": null,
    "comment": "Configures tcmalloc to perform background release of free memory in amount of bytes per ``memory_release_interval`` interval. If equals to ``0``, no memory release will occur. Defaults to ``0``.",
    "notImp": false
  },
  {
    "name": "memory_release_interval",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "Duration",
    "enums": null,
    "comment": "Interval in milliseconds for memory releasing. If specified, during every interval Envoy will try to release ``bytes_to_release`` of free memory back to operating system for reuse. Defaults to ``1000`` milliseconds.",
    "notImp": false
  }
] };

export const MemoryAllocatorManager_SingleFields = [
  "bytes_to_release",
  "memory_release_interval"
];

export const Bootstrap: OutType = { "Bootstrap": [
  {
    "name": "node",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "Node",
    "enums": null,
    "comment": "Node identity to present to the management server and for instance identification purposes (e.g. in generated headers).",
    "notImp": false
  },
  {
    "name": "node_context_params",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "string[]",
    "enums": null,
    "comment": "A list of `Node` field names that will be included in the context parameters of the effective ``xdstp://`` URL that is sent in a discovery request when resource locators are used for LDS/CDS. Any non-string field will have its JSON encoding set as the context parameter value, with the exception of metadata, which will be flattened (see example below). The supported field names are: - ``cluster`` - ``id`` - ``locality.region`` - ``locality.sub_zone`` - ``locality.zone`` - ``metadata`` - ``user_agent_build_version.metadata`` - ``user_agent_build_version.version`` - ``user_agent_name`` - ``user_agent_version``\n\nThe node context parameters act as a base layer dictionary for the context parameters (i.e. more specific resource specific context parameters will override). Field names will be prefixed with ````\"udpa.node.\"```` when included in context parameters.\n\nFor example, if node_context_params is ``[\"user_agent_name\", \"metadata\"]``, the implied context parameters might be::\n\n  node.user_agent_name: \"envoy\" node.metadata.foo: \"{\\\"bar\\\": \\\"baz\\\"}\" node.metadata.some: \"42\" node.metadata.thing: \"\\\"thing\\\"\"\n\n[#not-implemented-hide:]",
    "notImp": true
  },
  {
    "name": "static_resources",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "Bootstrap_StaticResources",
    "enums": null,
    "comment": "Statically specified resources.",
    "notImp": false
  },
  {
    "name": "dynamic_resources",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "Bootstrap_DynamicResources",
    "enums": null,
    "comment": "xDS configuration sources.",
    "notImp": false
  },
  {
    "name": "cluster_manager",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "ClusterManager",
    "enums": null,
    "comment": "Configuration for the cluster manager which owns all upstream clusters within the server.",
    "notImp": false
  },
  {
    "name": "hds_config",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "ApiConfigSource",
    "enums": null,
    "comment": "Health discovery service config option. (`core.ApiConfigSource`)",
    "notImp": false
  },
  {
    "name": "flags_path",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "string",
    "enums": null,
    "comment": "Optional file system path to search for startup flag files.",
    "notImp": false
  },
  {
    "name": "stats_sinks",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "StatsSink[]",
    "enums": null,
    "comment": "Optional set of stats sinks.",
    "notImp": false
  },
  {
    "name": "deferred_stat_options",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "Bootstrap_DeferredStatOptions",
    "enums": null,
    "comment": "Options to control behaviors of deferred creation compatible stats.",
    "notImp": false
  },
  {
    "name": "stats_config",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "StatsConfig",
    "enums": null,
    "comment": "Configuration for internal processing of stats.",
    "notImp": false
  },
  {
    "name": "stats_flush_interval",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "Duration",
    "enums": null,
    "comment": "Optional duration between flushes to configured stats sinks. For performance reasons Envoy latches counters and only flushes counters and gauges at a periodic interval. If not specified the default is ``5000ms`` (``5`` seconds). Only one of ``stats_flush_interval`` or ``stats_flush_on_admin`` can be set. Duration must be at least ``1ms`` and at most ``5 min``.",
    "notImp": false
  },
  {
    "name": "stats_flush.stats_flush_on_admin",
    "isUnion": true,
    "isDeprecated": false,
    "fieldType": "boolean",
    "enums": null,
    "comment": "Flush stats to sinks only when queried for on the admin interface. If set, a flush timer is not created. Only one of ``stats_flush_on_admin`` or ``stats_flush_interval`` can be set.",
    "notImp": false
  },
  {
    "name": "stats_eviction.stats_eviction_interval",
    "isUnion": true,
    "isDeprecated": false,
    "fieldType": "Duration",
    "enums": null,
    "comment": "Optional duration to perform metric eviction. At every interval, during the stats flush the unused metrics are removed from the worker caches and the used metrics are marked as unused. Must be a multiple of the ``stats_flush_interval``.",
    "notImp": false
  },
  {
    "name": "watchdog",
    "isUnion": false,
    "isDeprecated": true,
    "fieldType": "Watchdog",
    "enums": null,
    "comment": "Optional watchdog configuration. This is for a single watchdog configuration for the entire system. Deprecated in favor of ``watchdogs`` which has finer granularity.",
    "notImp": false
  },
  {
    "name": "watchdogs",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "Watchdogs",
    "enums": null,
    "comment": "Optional watchdogs configuration. This is used for specifying different watchdogs for the different subsystems. extension-category: envoy.guarddog_actions",
    "notImp": false
  },
  {
    "name": "tracing",
    "isUnion": false,
    "isDeprecated": true,
    "fieldType": "Tracing",
    "enums": null,
    "comment": "Configuration for an external tracing provider.\n\n:::attention\nThis field has been deprecated in favor of `HttpConnectionManager.Tracing.provider`. \n:::",
    "notImp": false
  },
  {
    "name": "layered_runtime",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "LayeredRuntime",
    "enums": null,
    "comment": "Configuration for the runtime configuration provider. If not specified, a “null” provider will be used which will result in all defaults being used.",
    "notImp": false
  },
  {
    "name": "admin",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "Admin",
    "enums": null,
    "comment": "Configuration for the local administration HTTP server.",
    "notImp": false
  },
  {
    "name": "overload_manager",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "OverloadManager",
    "enums": null,
    "comment": "Optional overload manager configuration.",
    "notImp": false
  },
  {
    "name": "enable_dispatcher_stats",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "boolean",
    "enums": null,
    "comment": "Enable `stats for event dispatcher`. Defaults to ``false``.\n\n:::note\n\nThis records a value for each iteration of the event loop on every thread. This should normally be minimal overhead, but when using `statsd`, it will send each observed value over the wire individually because the statsd protocol doesn't have any way to represent a histogram summary. Be aware that this can be a very large volume of data.",
    "notImp": false
  },
  {
    "name": "header_prefix",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "string",
    "enums": null,
    "comment": "Optional string which will be used in lieu of ``x-envoy`` in prefixing headers.\n\nFor example, if this string is present and set to ``X-Foo``, then ``x-envoy-retry-on`` will be transformed into ``x-foo-retry-on`` etc.\n\n:::note\n\nThis applies to the headers Envoy will generate, the headers Envoy will sanitize, and the headers Envoy will trust for core code and core extensions only. Be VERY careful making changes to this string, especially in multi-layer Envoy deployments or deployments using extensions which are not upstream.",
    "notImp": false
  },
  {
    "name": "stats_server_version_override",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "number",
    "enums": null,
    "comment": "Optional proxy version which will be used to set the value of `server.version statistic` if specified. Envoy will not process this value, it will be sent as is to `stats sinks`.",
    "notImp": false
  },
  {
    "name": "use_tcp_for_dns_lookups",
    "isUnion": false,
    "isDeprecated": true,
    "fieldType": "boolean",
    "enums": null,
    "comment": "Always use ``TCP`` queries instead of ``UDP`` queries for DNS lookups. This may be overridden on a per-cluster basis in ``cds_config``, when `dns_resolvers` and `use_tcp_for_dns_lookups` are specified. This field is deprecated in favor of ``dns_resolution_config`` which aggregates all of the DNS resolver configuration in a single message.",
    "notImp": false
  },
  {
    "name": "dns_resolution_config",
    "isUnion": false,
    "isDeprecated": true,
    "fieldType": "DnsResolutionConfig",
    "enums": null,
    "comment": "DNS resolution configuration which includes the underlying DNS resolver addresses and options. This may be overridden on a per-cluster basis in ``cds_config``, when `dns_resolution_config` is specified. This field is deprecated in favor of `typed_dns_resolver_config`.",
    "notImp": false
  },
  {
    "name": "typed_dns_resolver_config",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "TypedExtensionConfig",
    "enums": null,
    "comment": "DNS resolver type configuration extension. This extension can be used to configure ``c-ares``, ``apple``, or any other DNS resolver types and the related parameters. For example, an object of `CaresDnsResolverConfig` can be packed into this ``typed_dns_resolver_config``. This configuration replaces the `dns_resolution_config` configuration.\n\nDuring the transition period when both ``dns_resolution_config`` and ``typed_dns_resolver_config`` exist, when ``typed_dns_resolver_config`` is in place, Envoy will use it and ignore ``dns_resolution_config``. When ``typed_dns_resolver_config`` is missing, the default behavior is in place. extension-category: envoy.network.dns_resolver",
    "notImp": false
  },
  {
    "name": "bootstrap_extensions",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "TypedExtensionConfig[]",
    "enums": null,
    "comment": "Specifies optional bootstrap extensions to be instantiated at startup time. Each item contains extension specific configuration. extension-category: envoy.bootstrap",
    "notImp": false
  },
  {
    "name": "fatal_actions",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "FatalAction[]",
    "enums": null,
    "comment": "Specifies optional extensions instantiated at startup time and invoked during crash time on the request that caused the crash.",
    "notImp": false
  },
  {
    "name": "config_sources",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "ConfigSource[]",
    "enums": null,
    "comment": "Configuration sources that will participate in ``xdstp://`` URL authority resolution. The algorithm is as follows:\n\n1. The authority field is taken from the ``xdstp://`` URL, call this ``resource_authority``. 2. ``resource_authority`` is compared against the authorities in any peer ``ConfigSource``. The peer ``ConfigSource`` is the configuration source message which would have been used unconditionally for resolution with opaque resource names. If there is a match with an authority, the peer ``ConfigSource`` message is used. 3. ``resource_authority`` is compared sequentially with the authorities in each configuration source in ``config_sources``. The first ``ConfigSource`` to match wins. 4. As a fallback, if no configuration source matches, then ``default_config_source`` is used. 5. If ``default_config_source`` is not specified, resolution fails. [#not-implemented-hide:]",
    "notImp": true
  },
  {
    "name": "default_config_source",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "ConfigSource",
    "enums": null,
    "comment": "Default configuration source for ``xdstp://`` URLs if all other resolution fails. [#not-implemented-hide:]",
    "notImp": true
  },
  {
    "name": "default_socket_interface",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "string",
    "enums": null,
    "comment": "Optional overriding of default socket interface. The value must be the name of one of the socket interface factories initialized through a bootstrap extension",
    "notImp": false
  },
  {
    "name": "certificate_provider_instances",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "Map<string, TypedExtensionConfig>",
    "enums": null,
    "comment": "Global map of CertificateProvider instances. These instances are referred to by name in the `CommonTlsContext.CertificateProviderInstance.instance_name` field. [#not-implemented-hide:]",
    "notImp": true
  },
  {
    "name": "inline_headers",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "CustomInlineHeader[]",
    "enums": null,
    "comment": "Specifies a set of headers that need to be registered as inline header. This configuration allows users to customize the inline headers on-demand at Envoy startup without modifying Envoy's source code.\n\n:::note\n\nThe ``set-cookie`` header cannot be registered as inline header.",
    "notImp": false
  },
  {
    "name": "perf_tracing_file_path",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "string",
    "enums": null,
    "comment": "Optional path to a file with performance tracing data created by ``Perfetto`` SDK in binary ProtoBuf format. The default value is ``envoy.pftrace``.",
    "notImp": false
  },
  {
    "name": "default_regex_engine",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "TypedExtensionConfig",
    "enums": null,
    "comment": "Optional overriding of default regex engine. If the value is not specified, ``Google RE2`` will be used by default. extension-category: envoy.regex_engines",
    "notImp": false
  },
  {
    "name": "xds_delegate_extension",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "TypedExtensionConfig",
    "enums": null,
    "comment": "Optional XdsResourcesDelegate configuration, which allows plugging custom logic into both fetch and load events during xDS processing. If a value is not specified, no ``XdsResourcesDelegate`` will be used. TODO(abeyad): Add public-facing documentation. [#not-implemented-hide:]",
    "notImp": true
  },
  {
    "name": "xds_config_tracker_extension",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "TypedExtensionConfig",
    "enums": null,
    "comment": "Optional XdsConfigTracker configuration, which allows tracking xDS responses in external components, e.g., external tracer or monitor. It provides the process point when receive, ingest, or fail to process xDS resources and messages. If a value is not specified, no ``XdsConfigTracker`` will be used.\n\n:::note\n\nThere are no in-repo extensions currently, and the :repo:`XdsConfigTracker <envoy/config/xds_config_tracker.h>` interface should be implemented before using. See :repo:`xds_config_tracker_integration_test <test/integration/xds_config_tracker_integration_test.cc>` for an example usage of the interface.",
    "notImp": false
  },
  {
    "name": "listener_manager",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "TypedExtensionConfig",
    "enums": null,
    "comment": "[#not-implemented-hide:] This controls the type of listener manager configured for Envoy. Currently Envoy only supports ``ListenerManager`` for this field and Envoy Mobile supports ``ApiListenerManager``.",
    "notImp": true
  },
  {
    "name": "application_log_config",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "Bootstrap_ApplicationLogConfig",
    "enums": null,
    "comment": "Optional application log configuration.",
    "notImp": false
  },
  {
    "name": "grpc_async_client_manager_config",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "Bootstrap_GrpcAsyncClientManagerConfig",
    "enums": null,
    "comment": "Optional gRPC async client manager config.",
    "notImp": false
  },
  {
    "name": "memory_allocator_manager",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "MemoryAllocatorManager",
    "enums": null,
    "comment": "Optional configuration for memory allocation manager. Memory releasing is only supported for `tcmalloc allocator <https://github.com/google/tcmalloc>`_.",
    "notImp": false
  }
] };

export const Bootstrap_SingleFields = [
  "node_context_params",
  "flags_path",
  "stats_flush_interval",
  "stats_flush.stats_flush_on_admin",
  "stats_eviction.stats_eviction_interval",
  "enable_dispatcher_stats",
  "header_prefix",
  "stats_server_version_override",
  "default_socket_interface",
  "perf_tracing_file_path"
];

export const Bootstrap_CertificateProviderInstancesEntry: OutType = { "Bootstrap_CertificateProviderInstancesEntry": [
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
    "fieldType": "TypedExtensionConfig",
    "enums": null,
    "comment": "",
    "notImp": false
  }
] };

export const Bootstrap_CertificateProviderInstancesEntry_SingleFields = [
  "key"
];

export const Watchdog_WatchdogAction: OutType = { "Watchdog_WatchdogAction": [
  {
    "name": "config",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "TypedExtensionConfig",
    "enums": null,
    "comment": "Extension specific configuration for the action.",
    "notImp": false
  },
  {
    "name": "event",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "Watchdog_WatchdogAction_WatchdogEvent",
    "enums": [
      "UNKNOWN",
      "KILL",
      "MULTIKILL",
      "MEGAMISS",
      "MISS"
    ],
    "comment": "",
    "notImp": false
  }
] };

export const Watchdog_WatchdogAction_SingleFields = [
  "event"
];

export const FatalAction: OutType = { "FatalAction": [
  {
    "name": "config",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "TypedExtensionConfig",
    "enums": null,
    "comment": "Extension specific configuration for the action. It's expected to conform to the ``Envoy::Server::Configuration::FatalAction`` interface.",
    "notImp": false
  }
] };

export const Runtime: OutType = { "Runtime": [
  {
    "name": "symlink_root",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "string",
    "enums": null,
    "comment": "The implementation assumes that the file system tree is accessed via a symbolic link. An atomic link swap is used when a new tree should be switched to. This parameter specifies the path to the symbolic link. Envoy will watch the location for changes and reload the file system tree when they happen. If this parameter is not set, there will be no disk based runtime.",
    "notImp": false
  },
  {
    "name": "subdirectory",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "string",
    "enums": null,
    "comment": "Specifies the subdirectory to load within the root directory. This is useful if multiple systems share the same delivery mechanism. Envoy configuration elements can be contained in a dedicated subdirectory.",
    "notImp": false
  },
  {
    "name": "override_subdirectory",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "string",
    "enums": null,
    "comment": "Specifies an optional subdirectory to load within the root directory. If specified and the directory exists, configuration values within this directory will override those found in the primary subdirectory. This is useful when Envoy is deployed across many different types of servers. Sometimes it is useful to have a per service cluster directory for runtime configuration. See below for exactly how the override directory is used.",
    "notImp": false
  },
  {
    "name": "base",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "{ [key: string]: any; }",
    "enums": null,
    "comment": "Static base runtime. This will be `overridden` by other runtime layers, e.g. disk or admin. This follows the `runtime protobuf JSON representation encoding`.",
    "notImp": false
  }
] };

export const Runtime_SingleFields = [
  "symlink_root",
  "subdirectory",
  "override_subdirectory"
];

export const RuntimeLayer: OutType = { "RuntimeLayer": [
  {
    "name": "name",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "string",
    "enums": null,
    "comment": "Descriptive name for the runtime layer. This is only used for the runtime :http:get:`/runtime` output.",
    "notImp": false
  },
  {
    "name": "layer_specifier.static_layer",
    "isUnion": true,
    "isDeprecated": false,
    "fieldType": "{ [key: string]: any; }",
    "enums": null,
    "comment": "`Static runtime` layer. This follows the `runtime protobuf JSON representation encoding`. Unlike static xDS resources, this static layer is overridable by later layers in the runtime virtual filesystem.",
    "notImp": false
  },
  {
    "name": "layer_specifier.disk_layer",
    "isUnion": true,
    "isDeprecated": false,
    "fieldType": "RuntimeLayer_DiskLayer",
    "enums": null,
    "comment": "[#next-free-field: 6]",
    "notImp": false
  },
  {
    "name": "layer_specifier.admin_layer",
    "isUnion": true,
    "isDeprecated": false,
    "fieldType": "RuntimeLayer_AdminLayer",
    "enums": null,
    "comment": "[#next-free-field: 6]",
    "notImp": false
  },
  {
    "name": "layer_specifier.rtds_layer",
    "isUnion": true,
    "isDeprecated": false,
    "fieldType": "RuntimeLayer_RtdsLayer",
    "enums": null,
    "comment": "[#next-free-field: 6]",
    "notImp": false
  }
] };

export const RuntimeLayer_SingleFields = [
  "name"
];

export const RuntimeLayer_DiskLayer: OutType = { "RuntimeLayer_DiskLayer": [
  {
    "name": "symlink_root",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "string",
    "enums": null,
    "comment": "The implementation assumes that the file system tree is accessed via a symbolic link. An atomic link swap is used when a new tree should be switched to. This parameter specifies the path to the symbolic link. Envoy will watch the location for changes and reload the file system tree when they happen. See documentation on runtime `atomicity` for further details on how reloads are treated.",
    "notImp": false
  },
  {
    "name": "subdirectory",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "string",
    "enums": null,
    "comment": "Specifies the subdirectory to load within the root directory. This is useful if multiple systems share the same delivery mechanism. Envoy configuration elements can be contained in a dedicated subdirectory.",
    "notImp": false
  },
  {
    "name": "append_service_cluster",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "boolean",
    "enums": null,
    "comment": "`Append` the service cluster to the path under symlink root.",
    "notImp": false
  }
] };

export const RuntimeLayer_DiskLayer_SingleFields = [
  "symlink_root",
  "subdirectory",
  "append_service_cluster"
];

export const RuntimeLayer_RtdsLayer: OutType = { "RuntimeLayer_RtdsLayer": [
  {
    "name": "name",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "string",
    "enums": null,
    "comment": "Resource to subscribe to at the ``rtds_config`` for the RTDS layer.",
    "notImp": false
  },
  {
    "name": "rtds_config",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "ConfigSource",
    "enums": null,
    "comment": "RTDS configuration source.",
    "notImp": false
  }
] };

export const RuntimeLayer_RtdsLayer_SingleFields = [
  "name"
];

export const CustomInlineHeader: OutType = { "CustomInlineHeader": [
  {
    "name": "inline_header_name",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "string",
    "enums": null,
    "comment": "The name of the header that is expected to be set as the inline header.",
    "notImp": false
  },
  {
    "name": "inline_header_type",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "CustomInlineHeader_InlineHeaderType",
    "enums": [
      "REQUEST_HEADER",
      "REQUEST_TRAILER",
      "RESPONSE_HEADER",
      "RESPONSE_TRAILER"
    ],
    "comment": "The type of the header that is expected to be set as the inline header.",
    "notImp": false
  }
] };

export const CustomInlineHeader_SingleFields = [
  "inline_header_name",
  "inline_header_type"
];