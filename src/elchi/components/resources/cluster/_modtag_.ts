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

export const modtag_circuit_breakers = [
    {
        alias: 'cbs',
        relativePath: 'envoy/config/cluster/v3/circuit_breaker',
        names: ['CircuitBreakers']
    },
    {
        alias: 'cb',
        relativePath: 'envoy/config/cluster/v3/circuit_breaker',
        names: ['CircuitBreakers_Thresholds', 'CircuitBreakers_Thresholds_SingleFields']
    },
    {
        alias: 'cbr',
        relativePath: 'envoy/config/cluster/v3/circuit_breaker',
        names: ['CircuitBreakers_Thresholds_RetryBudget', 'CircuitBreakers_Thresholds_RetryBudget_SingleFields']
    },
    {
        alias: 'p',
        relativePath: 'envoy/type/v3/percent',
        names: ['Percent']
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
        "lb_subset_config",
        "metadata",
        "filters",
        "load_balancing_policy",
        "upstream_config",

        "dns_failure_refresh_rate", //deprecated
        "lrs_server", //deprecated
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
        "dns_refresh_rate", //deprecated
        "dns_jitter", //deprecated
        "respect_dns_ttl" //deprecated
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