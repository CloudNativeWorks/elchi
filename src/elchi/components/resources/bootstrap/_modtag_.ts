import { TagsType } from "@/elchi/tags/tagsType";

export const modtag_bootstrap = [
    {
        alias: 'b',
        relativePath: 'envoy/config/bootstrap/v3/bootstrap',
        names: ['Bootstrap', 'Bootstrap_SingleFields'],
    },
];

export const modtag_node = [
    {
        alias: 'n',
        relativePath: 'envoy/config/core/v3/base',
        names: ['Node', 'Node_SingleFields'],
    },
];

export const modtag_admin = [
    {
        alias: 'a',
        relativePath: 'envoy/config/bootstrap/v3/bootstrap',
        names: ['Admin', 'Admin_SingleFields'],
    },
];

export const modtag_memory_allocator_manager = [
    {
        alias: 'mam',
        relativePath: 'envoy/config/bootstrap/v3/bootstrap',
        names: ['MemoryAllocatorManager', 'MemoryAllocatorManager_SingleFields'],
    },
];

export const modtag_api_config_source = [
    {
        alias: 'acs',
        relativePath: 'envoy/config/core/v3/config_source',
        names: ['ApiConfigSource', 'ApiConfigSource_SingleFields'],
    },
];

export const modtag_grpc_service = [
    {
        alias: 'ge',
        relativePath: 'envoy/config/core/v3/grpc_service',
        names: ['GrpcService_EnvoyGrpc'],
    },
];

export const modtag_bootstrap_deferred_stat_options = [
    {
        alias: 'dso',
        relativePath: 'envoy/config/bootstrap/v3/bootstrap',
        names: ['Bootstrap_DeferredStatOptions', 'Bootstrap_DeferredStatOptions_SingleFields'],
    },
];

export const modtag_overload_manager = [
    {
        alias: 'om',
        relativePath: 'envoy/config/overload/v3/overload',
        names: ['OverloadManager', 'OverloadManager_SingleFields'],
    },
];

export const modtag_overload_action = [
    {
        alias: 'oa',
        relativePath: 'envoy/config/overload/v3/overload',
        names: ['OverloadAction', 'OverloadAction_SingleFields'],
    },
];

export const modtag_trigger = [
    {
        alias: 'tr',
        relativePath: 'envoy/config/overload/v3/overload',
        names: ['Trigger', 'Trigger_SingleFields', 'ThresholdTrigger', 'ThresholdTrigger_SingleFields', 'ScaledTrigger', 'ScaledTrigger_SingleFields'],
    },
];

export const modtag_loadshed_point = [
    {
        alias: 'lsp',
        relativePath: 'envoy/config/overload/v3/overload',
        names: ['LoadShedPoint', 'LoadShedPoint_SingleFields'],
    },
];

export const modtag_buffer_factory_config = [
    {
        alias: 'bfc',
        relativePath: 'envoy/config/overload/v3/overload',
        names: ['BufferFactoryConfig', 'BufferFactoryConfig_SingleFields'],
    },
];

export const modtag_us_bootstrap: TagsType = {
    "Bootstrap": [
        'node_context_params',
        'cluster_manager',
        'hds_config',
        'stats_config',
        'stats_flush_on_admin',
        'watchdog',
        'watchdogs',
        'tracing',
        'layered_runtime',
        'use_tcp_for_dns_lookups', // deprecated
        'dns_resolution_config',
        'typed_dns_resolver_config',
        'bootstrap_extensions',
        'fatal_actions',
        'config_sources',
        'default_config_source',
        'certificate_provider_instances', // deprecated
        'inline_headers',
        'default_regex_engine',
        'xds_delegate_extension',
        'xds_config_tracker_extension',
        'listener_manager',
        'application_log_config',
        'grpc_async_client_manager_config'
    ],
    "node": [
        'user_agent_version_type.user_agent_build_version',
        'extensions',
        'client_features',
        'listening_addresses',
        'dynamic_parameters',
        'metadata'
    ],
    "admin": [
        'access_log_path',
        'socket_options',
    ],
    "dynamic_resources": [
        "cds_config",
        "lds_config",
        "lds_resources_locator",
        "cds_resources_locator"
    ],
    "ads_config": [
        "refresh_delay",
        "request_timeout",
        "config_validators",
        "cluster_names",
        "rate_limit_settings",
    ],
    "static_resources": [
        "listeners",
        "secrets"
    ],
    "clusters": [
        "transport_socket_matches",
        "alt_stat_name",
        "cluster_type",
        "eds_cluster_config",
        "per_connection_buffer_limit_bytes",
        "health_checks",
        "max_requests_per_connection",
        "circuit_breakers",
        "upstream_http_protocol_options",
        "common_http_protocol_options",
        "http_protocol_options",
        "typed_extension_protocol_options",
        "dns_refresh_rate",
        "dns_failure_refresh_rate",
        "respect_dns_ttl",
        "dns_lookup_family",
        "dns_resolvers",
        "use_tcp_for_dns_lookups",
        "dns_resolution_config",
        "typed_dns_resolver_config",
        "wait_for_warm_on_init",
        "outlier_detection",
        "cleanup_interval",
        "upstream_bind_config",
        "lb_subset_config",
        "ring_hash_lb_config",
        "maglev_lb_config",
        "original_dst_lb_config",
        "least_request_lb_config",
        "round_robin_lb_config",
        "common_lb_config",
        "transport_socket",
        "metadata",
        "protocol_selection",
        "upstream_connection_options",
        "close_connections_on_host_health_failure",
        "ignore_health_on_host_removal",
        "filters",
        "load_balancing_policy",
        "lrs_server",
        "track_timeout_budgets",
        "upstream_config",
        "track_cluster_stats",
        "preconnect_policy",
        "connection_pool_per_downstream_connection",
    ]
}