import { TagsType } from "@/elchi/tags/tagsType";

export const modtag_virtual_host = [
    {
        alias: 'vh',
        relativePath: 'envoy/config/route/v3/route_components',
        names: ['VirtualHost', 'VirtualHost_SingleFields'],
    },
];

export const modtag_route = [
    {
        alias: 'r',
        relativePath: 'envoy/config/route/v3/route_components',
        names: ['Route', 'Route_SingleFields'],
    },
];

export const modtag_virtual_cluster = [
    {
        alias: 'vc',
        relativePath: 'envoy/config/route/v3/route_components',
        names: ['VirtualCluster'],
    },
];

export const modtag_route_match = [
    {
        alias: 'rm',
        relativePath: 'envoy/config/route/v3/route_components',
        names: ['RouteMatch', 'RouteMatch_SingleFields'],
    },
];

export const modtag_query_parameter_matcher = [
    {
        alias: 'qpm',
        relativePath: 'envoy/config/route/v3/route_components',
        names: ['QueryParameterMatcher'],
    },
];

export const modtag_direct_response_action = [
    {
        alias: 'dra',
        relativePath: 'envoy/config/route/v3/route_components',
        names: ['DirectResponseAction', 'DirectResponseAction_SingleFields'],
    },
];

export const modtag_redirect_action = [
    {
        alias: 'ra',
        relativePath: 'envoy/config/route/v3/route_components',
        names: ['RedirectAction', 'RedirectAction_SingleFields'],
    },
];

export const modtag_route_action = [
    {
        alias: 'rta',
        relativePath: 'envoy/config/route/v3/route_components',
        names: ['RouteAction', 'RouteAction_SingleFields'],
    },
];

export const modtag_max_stream_duration = [
    {
        alias: 'msd',
        relativePath: 'envoy/config/route/v3/route_components',
        names: ['RouteAction_MaxStreamDuration', 'RouteAction_MaxStreamDuration_SingleFields'],
    },
];

export const modtag_upgrade_config = [
    {
        alias: 'uc',
        relativePath: 'envoy/config/route/v3/route_components',
        names: ['RouteAction_UpgradeConfig', 'RouteAction_UpgradeConfig_SingleFields'],
    },
];

export const modtag_hash_policy = [
    {
        alias: 'hp',
        relativePath: 'envoy/config/route/v3/route_components',
        names: ['RouteAction_HashPolicy'],
    },
];

export const modtag_hash_policy_header = [
    {
        alias: 'hph',
        relativePath: 'envoy/config/route/v3/route_components',
        names: ['RouteAction_HashPolicy_Header', 'RouteAction_HashPolicy_Header_SingleFields'],
    },
];

export const modtag_hash_policy_cookie_attribute = [
    {
        alias: 'hpca',
        relativePath: 'envoy/config/route/v3/route_components',
        names: ['RouteAction_HashPolicy_CookieAttribute', 'RouteAction_HashPolicy_CookieAttribute_SingleFields'],
    },
];

export const modtag_hash_policy_connection_properties = [
    {
        alias: 'hpcp',
        relativePath: 'envoy/config/route/v3/route_components',
        names: ['RouteAction_HashPolicy_ConnectionProperties', 'RouteAction_HashPolicy_ConnectionProperties_SingleFields'],
    },
];

export const modtag_hash_policy_query_parameter = [
    {
        alias: 'hpqp',
        relativePath: 'envoy/config/route/v3/route_components',
        names: ['RouteAction_HashPolicy_QueryParameter', 'RouteAction_HashPolicy_QueryParameter_SingleFields'],
    },
];

export const modtag_hash_policy_filter_state = [
    {
        alias: 'hpfs',
        relativePath: 'envoy/config/route/v3/route_components',
        names: ['RouteAction_HashPolicy_FilterState', 'RouteAction_HashPolicy_FilterState_SingleFields'],
    },
];

export const modtag_hash_policy_cookie = [
    {
        alias: 'hpc',
        relativePath: 'envoy/config/route/v3/route_components',
        names: ['RouteAction_HashPolicy_Cookie', 'RouteAction_HashPolicy_Cookie_SingleFields'],
    },
];

export const modtag_tls_context_match_options = [
    {
        alias: 'tcm',
        relativePath: 'envoy/config/route/v3/route_components',
        names: ['RouteMatch_TlsContextMatchOptions', 'RouteMatch_TlsContextMatchOptions_SingleFields'],
    },
];


export const modtag_us_virtualhost: TagsType = {
    'RetryPolicy': [
        'retry_priority',
        'retry_host_predicate',
        'retry_options_predicates'
    ],
    'match': [
        'path_specifier.connect_matcher',
        'dynamic_metadata',
        'filter_state'
    ],
    'routes': [
        'filter_action',
        'metadata',
        'non_forwarding_action',
        'tracing',
        'decorator',
        'per_request_buffer_limit_bytes'
    ],
    'route': [
        'cluster_specifier.cluster_specifier_plugin',
        'cluster_specifier.inline_cluster_specifier_plugin',
        'metadata_match',
        'path_rewrite_policy',
        'early_data_policy',
        'rate_limits',
        'internal_redirect_policy',
        'include_vh_rate_limits',
        'cors',
        'max_internal_redirects',
        'internal_redirect_action',
        'grpc_timeout_offset',
        'max_grpc_timeout',
    ],
    'VirtualHost': [
        'rate_limits',
        'cors',
        'retry_policy_typed_config',
        'metadata',
        'matcher',
        'per_request_buffer_limit_bytes'
    ]
}

export const modtag_r_virtualhost: TagsType = {
    'VirtualHost': [
        'name',
        'domains',
    ],
}