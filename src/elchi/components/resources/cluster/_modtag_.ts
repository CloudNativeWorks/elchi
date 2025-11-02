import { TagsType } from "@/elchi/tags/tagsType";


export const modtag_cluster = [
    {
        alias: 'c',
        relativePath: 'envoy/config/cluster/v3/cluster',
        names: ['Cluster', 'Cluster_SingleFields']
    },
    {
        alias: 't',
        relativePath: 'envoy/config/core/v3/base',
        names: ['TransportSocket']
    }
];

export const modtag_outlier_detection = [
    {
        alias: 'o',
        relativePath: 'envoy/config/cluster/v3/outlier_detection',
        names: ['OutlierDetection', 'OutlierDetection_SingleFields'],
    },
];

export const modtag_health_check = [
    {
        alias: 'h',
        relativePath: 'envoy/config/core/v3/health_check',
        names: ['HealthCheck', 'HealthCheck_SingleFields'],
    }
];

export const modtag_http_health_check = [
    {
        alias: 'hh',
        relativePath: 'envoy/config/core/v3/health_check',
        names: ['HealthCheck_HttpHealthCheck', 'HealthCheck_HttpHealthCheck_SingleFields'],
    }
]

export const modtag_tcp_health_check = [
    {
        alias: 'ht',
        relativePath: 'envoy/config/core/v3/health_check',
        names: ['HealthCheck_TcpHealthCheck'],
    }
];

export const modtag_grpc_health_check = [
    {
        alias: 'hg',
        relativePath: 'envoy/config/core/v3/health_check',
        names: ['HealthCheck_GrpcHealthCheck', 'HealthCheck_GrpcHealthCheck_SingleFields'],
    }
];

export const modtag_load_assignment = [
    {
        alias: 'c',
        relativePath: 'envoy/config/endpoint/v3/endpoint',
        names: ['ClusterLoadAssignment', 'ClusterLoadAssignment_SingleFields']
    },
];


export const modtag_us_cluster: TagsType = {
    "Cluster": [
        "transport_socket_matches",
        "cluster_discovery_type.cluster_type",
        "circuit_breakers",
        "typed_dns_resolver_config",
        "dns_failure_refresh_rate",
        "upstream_bind_config",
        "lb_subset_config",
        "lb_config.ring_hash_lb_config",
        "lb_config.maglev_lb_config",
        "lb_config.original_dst_lb_config",
        "lb_config.least_request_lb_config",
        "lb_config.round_robin_lb_config",
        "common_lb_config",
        "metadata",
        "upstream_connection_options",
        "filters",
        "load_balancing_policy",
        "lrs_server", //deprecated
        "upstream_config",
        "track_cluster_stats",
        "preconnect_policy",
        "track_timeout_budgets", //deprecated
        "max_requests_per_connection", //deprecated
        "upstream_http_protocol_options", //deprecated
        "common_http_protocol_options", //deprecated
        "http_protocol_options", //deprecated
        "http2_protocol_options", //deprecated
        "dns_resolvers", //deprecated
        "use_tcp_for_dns_lookups", //deprecated
        "dns_resolution_config", //deprecated
        "protocol_selection", //deprecated

        "dns_refresh_rate",
        "dns_jitter",
        "respect_dns_ttl"
    ],
    "HealthCheck": [
        "health_checker.custom_health_check",
        "event_log_path",
        "transport_socket_match_criteria",
        "tls_options",
        "event_service",
        "alt_port"
    ],
    "HttpHealthCheck": [
        "send",
    ],
    "TCPHealthCheck": [
        "proxy_protocol_config",
    ],
    "load_assignment": [
        "named_endpoints",
    ]
}

export const modtag_r_cluster: TagsType = {
    "Cluster": [
        "name",
        "type"
    ]
}