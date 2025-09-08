import { UPSTREAM_ACTIVE_CONNECTIONS_METRICS_DESCRIPTION, UPSTREAM_CONNECT_FAILS_METRICS_DESCRIPTION, UPSTREAM_CONNECT_TIME_METRICS_DESCRIPTION, UPSTREAM_CONNECT_TIMEOUTS_METRICS_DESCRIPTION, UPSTREAM_CONNECTION_DESTROYED_FROM_LOCAL_METRICS_DESCRIPTION, UPSTREAM_CONNECTION_DESTROYED_FROM_REMOTE_METRICS_DESCRIPTION, UPSTREAM_CONNECTION_LENGTH_METRICS_DESCRIPTION, UPSTREAM_HEALTH_CHECKS_FAILS_METRICS_DESCRIPTION, UPSTREAM_HEALTH_METRICS_DESCRIPTION, UPSTREAM_HTTP_CONNECTIONS_METRICS_DESCRIPTION, UPSTREAM_PENDING_REQUESTS_METRICS_DESCRIPTION, UPSTREAM_RECEIVED_BUFFERED_METRICS_DESCRIPTION, UPSTREAM_REQUEST_RETRY_METRICS_DESCRIPTION, UPSTREAM_REQUEST_RETRY_OVERFLOW_METRICS_DESCRIPTION, UPSTREAM_REQUEST_TIMEOUTS_METRICS_DESCRIPTION, UPSTREAM_REQUESTS_METRICS_DESCRIPTION, UPSTREAM_RESPONSE_CODES_METRICS_DESCRIPTION, UPSTREAM_RESPONSE_TIME_METRICS_DESCRIPTION, UPSTREAM_RX_TX_RESET_METRICS_DESCRIPTION, UPSTREAM_SENT_BUFFERED_METRICS_DESCRIPTION } from "../Descriptions/DescriptionsUpstreams";
import { MetricConfig } from "../MetricConfig";

const defaultWindowSecs = {
    default: 15,
    ranges: [
        { threshold: 2 * 24 * 60 * 60, value: 300 }, // 2 days
        { threshold: 24 * 60 * 60, value: 60 },      // 1 day
        { threshold: 1 * 60 * 60, value: 30 },       // 1 hour
    ]
}

export const UPSTREAM_MEMBER_METRICS: MetricConfig[] = [
    {
        section: 'Upstream Health Metrics',
        title: 'Upstream Health',
        metric: 'cluster_membership_(healthy|total)',
        description: UPSTREAM_HEALTH_METRICS_DESCRIPTION,
        groups: ['all', 'errors', 'clusters'],
        span: 12,
        formatType: 'number',
        queryTemplate: `
            sum by (envoy_cluster_name, state) (
                label_replace(
                    {__name__=~"%{name}_%{project}_%{metric}", envoy_cluster_name!="elchi-control-plane"},
                    "state","$1","__name__",".*_%{metric}$"
                )
            )
        `,
        legendMapping: [
            {
                template: '%s',
                labelKeys: ['envoy_cluster_name', 'state']
            }
        ]
    },
    {
        section: 'Upstream Health Metrics',
        title: 'Upstream HealthChecks Fails',
        metric: 'cluster_health_check_(failure_total|network_failure_total)',
        description: UPSTREAM_HEALTH_CHECKS_FAILS_METRICS_DESCRIPTION,
        groups: ['all', 'errors', 'clusters'],
        span: 12,
        formatType: 'number',
        queryTemplate: `
            sum by (envoy_cluster_name, state) (
                label_replace(
                    {__name__=~"%{name}_%{project}_%{metric}", envoy_cluster_name!="elchi-control-plane"},
                    "state","$1","__name__",".*_%{metric}$"
                )
            )
        `,
        legendMapping: [
            {
                template: '%s',
                labelKeys: ['envoy_cluster_name', 'state']
            }
        ]
    }
];

export const UPSTREAM_REQUEST_METRICS: MetricConfig[] = [
    {
        section: 'Upstream Request Metrics',
        title: 'Upstream Requests',
        metric: 'cluster_upstream_rq_total',
        description: UPSTREAM_REQUESTS_METRICS_DESCRIPTION,
        groups: ['all', 'clusters'],
        span: 12,
        formatType: 'number',
        queryTemplate: `
            sum by (envoy_cluster_name)(
                ceil(
                    rate(
                        {__name__=~"%{name}_%{project}_%{metric}", envoy_cluster_name!="elchi-control-plane"}[%{window}s]
                    )
                )
            )
        `,
        windowSecs: defaultWindowSecs,
        legendMapping: [{
            template: '%s',
            labelKeys: ['envoy_cluster_name']
        }]
    },
    {
        section: 'Upstream Request Metrics',
        title: 'Upstream Request Timeouts',
        metric: 'cluster_upstream_rq_timeout_total',
        description: UPSTREAM_REQUEST_TIMEOUTS_METRICS_DESCRIPTION,
        groups: ['all', 'errors', 'clusters'],
        span: 12,
        formatType: 'number',
        queryTemplate: `
            sum by (envoy_cluster_name)(
                ceil(
                    rate(
                        {__name__=~"%{name}_%{project}_%{metric}", envoy_cluster_name!="elchi-control-plane"}[%{window}s]
                    )
                )
            )
        `,
        windowSecs: defaultWindowSecs,
        legendMapping: [{
            template: '%s',
            labelKeys: ['envoy_cluster_name']
        }]
    },
    {
        section: 'Upstream Request Metrics',
        title: 'Upstream Pending Requests',
        metric: 'cluster_upstream_rq_pending_total',
        description: UPSTREAM_PENDING_REQUESTS_METRICS_DESCRIPTION,
        groups: ['all', 'errors', 'clusters'],
        span: 12,
        formatType: 'number',
        queryTemplate: `
            sum by (envoy_cluster_name)(
                ceil(
                    rate(
                        {__name__=~"%{name}_%{project}_%{metric}", envoy_cluster_name!="elchi-control-plane"}[%{window}s]
                    )
                )
            )
        `,
        windowSecs: defaultWindowSecs,
        legendMapping: [{
            template: '%s',
            labelKeys: ['envoy_cluster_name']
        }]
    },
    {
        section: 'Upstream Request Metrics',
        title: 'Upstream Response Time (90th percentile)',
        metric: 'cluster_external_upstream_rq_time_bucket',
        description: UPSTREAM_RESPONSE_TIME_METRICS_DESCRIPTION,
        groups: ['all', 'clusters'],
        queryTemplate: `
            histogram_quantile(
                0.90, sum (
                    rate(
                        %{name}_%{project}_%{metric}[%{window}s]
                    )
                ) by (le, envoy_cluster_name)
            )
        `,
        span: 12,
        formatType: 'duration',
        formatConfig: {
            inputUnit: 'ms',
            units: ['ms', 's', 'm']
        },
        windowSecs: defaultWindowSecs,
        legendMapping: [{
            template: '%s',
            labelKeys: ['envoy_cluster_name']
        }]
    },
    {
        section: 'Upstream Request Metrics',
        title: 'Upstream Response Codes',
        metric: 'cluster_external_upstream_rq_total',
        description: UPSTREAM_RESPONSE_CODES_METRICS_DESCRIPTION,
        groups: ['all', 'errors', 'clusters'],
        span: 12,
        formatType: 'number',
        queryTemplate: `
            sum by (envoy_cluster_name, envoy_response_code)(
                ceil(
                    rate(
                        {__name__=~"%{name}_%{project}_%{metric}", envoy_cluster_name!="elchi-control-plane"}[%{window}s]
                    )
                )
            )
        `,
        windowSecs: defaultWindowSecs,
        legendMapping: [{
            template: '%s',
            labelKeys: ['envoy_cluster_name', 'envoy_response_code']
        }]
    },
    {
        section: 'Upstream Request Metrics',
        title: 'Upstream RX/TX Reset',
        metric: 'cluster_upstream_rq_(rx_reset_total|tx_reset_total)',
        description: UPSTREAM_RX_TX_RESET_METRICS_DESCRIPTION,
        groups: ['all', 'errors', 'clusters'],
        queryTemplate: `
            sum by (envoy_cluster_name, state) (
                ceil(
                    rate(
                        label_replace(
                            label_replace(
                                label_replace(
                                    {__name__=~"%{name}_%{project}_%{metric}", envoy_cluster_name!="elchi-control-plane"},
                                    "state", "$1", "__name__", ".*%{metric}"
                                ),
                                "state", "rx_reset", "state", "^rx_reset_total$"
                            ),
                            "state", "tx_reset", "state", "^tx_reset_total$"
                        )[%{window}s]
                    )
                )
            )
        `,
        span: 12,
        formatType: 'number',
        windowSecs: defaultWindowSecs,
        legendMapping: [{
            template: '%s',
            labelKeys: ['envoy_cluster_name', 'state']
        }]
    },
    {
        section: 'Upstream Request Metrics',
        title: 'Upstream Request Retry',
        metric: 'cluster_upstream_rq_(retry_total|retry_success_total)',
        description: UPSTREAM_REQUEST_RETRY_METRICS_DESCRIPTION,
        groups: ['all', 'errors', 'clusters'],
        queryTemplate: `
            sum by (envoy_cluster_name, state) (
                ceil(
                    rate(
                        label_replace(
                            label_replace(
                                label_replace(
                                    {__name__=~"%{name}_%{project}_%{metric}", envoy_cluster_name!="elchi-control-plane"},
                                    "state", "$1", "__name__", ".*%{metric}"
                                ),
                                "state", "retry", "state", "^retry_total$"
                            ),
                            "state", "retry_success", "state", "^retry_success_total$"
                        )[%{window}s]
                    )
                )
            )
        `,
        span: 12,
        formatType: 'number',
        windowSecs: defaultWindowSecs,
        legendMapping: [{
            template: '%s',
            labelKeys: ['envoy_cluster_name', 'state']
        }]
    },
    {
        section: 'Upstream Request Metrics',
        title: 'Upstream Request Retry Overflow',
        metric: 'cluster_upstream_rq_retry_overflow_total',
        description: UPSTREAM_REQUEST_RETRY_OVERFLOW_METRICS_DESCRIPTION,
        groups: ['all', 'errors', 'clusters'],
        span: 12,
        formatType: 'number',
        queryTemplate: `
            sum by (envoy_cluster_name)(
                ceil(
                    rate(
                        {__name__=~"%{name}_%{project}_%{metric}", envoy_cluster_name!="elchi-control-plane"}[%{window}s]
                    )
                )
            )
        `,
        windowSecs: defaultWindowSecs,
        legendMapping: [{
            template: '%s',
            labelKeys: ['envoy_cluster_name']
        }]
    },
];

export const UPSTREAM_CONNECTION_METRICS: MetricConfig[] = [
    {
        section: 'Upstream Connection Metrics',
        title: 'Upstream Active Connections',
        metric: 'cluster_upstream_cx_active',
        description: UPSTREAM_ACTIVE_CONNECTIONS_METRICS_DESCRIPTION,
        groups: ['all', 'clusters'],
        span: 12,
        formatType: 'number',
        queryTemplate: `
            sum by (envoy_cluster_name)(
                {__name__=~"%{name}_%{project}_%{metric}", envoy_cluster_name!="elchi-control-plane"}
            )
        `,
        legendMapping: [{
            template: '%s',
            labelKeys: ['envoy_cluster_name']
        }]
    },
    {
        section: 'Upstream Connection Metrics',
        title: 'Upstream Connect Failures',
        metric: 'cluster_upstream_cx_connect_fail_total',
        description: UPSTREAM_CONNECT_FAILS_METRICS_DESCRIPTION,
        groups: ['all', 'errors', 'clusters'],
        span: 12,
        formatType: 'number',
        queryTemplate: `
            sum by (envoy_cluster_name)(
                ceil(
                    rate(
                        %{name}_%{project}_%{metric}[%{window}s]
                    )
                )
            )
        `,
        windowSecs: defaultWindowSecs,
        legendMapping: [{
            template: '%s',
            labelKeys: ['envoy_cluster_name']
        }]
    },
    {
        section: 'Upstream Connection Metrics',
        title: 'Upstream Connect Timeouts',
        metric: 'cluster_upstream_cx_connect_timeout_total',
        description: UPSTREAM_CONNECT_TIMEOUTS_METRICS_DESCRIPTION,
        groups: ['all', 'errors', 'clusters'],
        span: 12,
        formatType: 'number',
        queryTemplate: `
            sum by (envoy_cluster_name)(
                ceil(
                    rate(
                        {__name__=~"%{name}_%{project}_%{metric}", envoy_cluster_name!="elchi-control-plane"}[%{window}s]
                    )
                )
            )
        `,
        windowSecs: defaultWindowSecs,
        legendMapping: [{
            template: '%s',
            labelKeys: ['envoy_cluster_name']
        }]
    },
    {
        section: 'Upstream Connection Metrics',
        title: 'Upstream Received Buffered',
        metric: 'cluster_upstream_cx_rx_bytes_buffered',
        description: UPSTREAM_RECEIVED_BUFFERED_METRICS_DESCRIPTION,
        groups: ['all', 'clusters'],
        span: 12,
        formatType: 'bytes',
        queryTemplate: `
            sum by (envoy_cluster_name)(
                {__name__=~"%{name}_%{project}_%{metric}", envoy_cluster_name!="elchi-control-plane"}
            )
        `,
        legendMapping: [{
            template: '%s',
            labelKeys: ['envoy_cluster_name']
        }]
    },
    {
        section: 'Upstream Connection Metrics',
        title: 'Upstream Sent Buffered',
        metric: 'cluster_upstream_cx_tx_bytes_buffered',
        description: UPSTREAM_SENT_BUFFERED_METRICS_DESCRIPTION,
        groups: ['all', 'clusters'],
        span: 12,
        formatType: 'bytes',
        queryTemplate: `
            sum by (envoy_cluster_name)(
                {__name__=~"%{name}_%{project}_%{metric}", envoy_cluster_name!="elchi-control-plane"}
            )
        `,
        legendMapping: [{
            template: '%s',
            labelKeys: ['envoy_cluster_name']
        }]
    },
    {
        section: 'Upstream Connection Metrics',
        title: 'Upstream Connect Time (99th percentile)',
        metric: 'cluster_upstream_cx_connect_ms_bucket',
        description: UPSTREAM_CONNECT_TIME_METRICS_DESCRIPTION,
        groups: ['all', 'clusters'],
        queryTemplate: `
            histogram_quantile(
                0.99, sum(
                    rate(
                        %{name}_%{project}_%{metric}[%{window}s]
                    )
                ) by (le, envoy_cluster_name)
            )
        `,
        span: 12,
        formatType: 'duration',
        formatConfig: {
            inputUnit: 'ms',
            units: ['ms', 's', 'm']
        },
        windowSecs: defaultWindowSecs,
        legendMapping: [{
            template: '%s',
            labelKeys: ['envoy_cluster_name']
        }]
    },
    {
        section: 'Upstream Connection Metrics',
        title: 'Upstream Connection Length (90th percentile)',
        metric: 'cluster_upstream_cx_length_ms_bucket',
        description: UPSTREAM_CONNECTION_LENGTH_METRICS_DESCRIPTION,
        groups: ['all', 'clusters'],
        queryTemplate: `
            histogram_quantile(
                0.90, sum(
                    rate(
                        %{name}_%{project}_%{metric}[%{window}s]
                    )
                ) by (le, envoy_cluster_name)
            )
        `,
        span: 12,
        formatType: 'duration',
        formatConfig: {
            inputUnit: 'ms',
            units: ['ms', 's', 'm']
        },
        windowSecs: defaultWindowSecs,
        legendMapping: [{
            template: '%s',
            labelKeys: ['envoy_cluster_name']
        }]
    },
    {
        section: 'Upstream Connection Metrics',
        title: 'Upstream Connection Destroyed From Local',
        metric: 'cluster_upstream_cx_destroy_(local_total|local_with_active_rq_total)',
        description: UPSTREAM_CONNECTION_DESTROYED_FROM_LOCAL_METRICS_DESCRIPTION,
        groups: ['all', 'errors', 'clusters'],
        queryTemplate: `
            sum by (envoy_cluster_name, state) (
                ceil(
                    rate(
                        label_replace(
                            label_replace(
                                label_replace(
                                    {__name__=~"%{name}_%{project}_%{metric}", envoy_cluster_name!="elchi-control-plane"},
                                    "state", "$1", "__name__", ".*%{metric}"
                                ),
                                "state", "local_with_active_rq", "state", "^local_with_active_rq_total$"
                            ),
                            "state", "local", "state", "^local_total$"
                        )[%{window}s]
                    )
                )
            )
        `,
        span: 12,
        formatType: 'number',
        windowSecs: defaultWindowSecs,
        legendMapping: [{
            template: '%s',
            labelKeys: ['envoy_cluster_name', 'state']
        }]
    },
    {
        section: 'Upstream Connection Metrics',
        title: 'Upstream Connection Destroyed From Remote',
        metric: 'cluster_upstream_cx_destroy_(remote_total|remote_with_active_rq_total)',
        description: UPSTREAM_CONNECTION_DESTROYED_FROM_REMOTE_METRICS_DESCRIPTION,
        groups: ['all', 'errors', 'clusters'],
        queryTemplate: `
            sum by (envoy_cluster_name, state) (
                ceil(
                    rate(
                        label_replace(
                            label_replace(
                                label_replace(
                                    {__name__=~"%{name}_%{project}_%{metric}", envoy_cluster_name!="elchi-control-plane"},
                                    "state", "$1", "__name__", ".*%{metric}"
                                ),
                                "state", "remote_with_active_rq", "state", "^remote_with_active_rq_total$"
                            ),
                            "state", "remote", "state", "^remote_total$"
                        )[%{window}s]
                    )
                )
            )
        `,
        span: 12,
        formatType: 'number',
        windowSecs: defaultWindowSecs,
        legendMapping: [{
            template: '%s',
            labelKeys: ['envoy_cluster_name', 'state']
        }]
    },
    {
        section: 'Upstream Connection Metrics',
        title: 'Upstream HTTP Connections',
        metric: 'cluster_upstream_cx_(http1_total|http2_total)',
        description: UPSTREAM_HTTP_CONNECTIONS_METRICS_DESCRIPTION,
        groups: ['all', 'clusters'],
        span: 12,
        formatType: 'number',
        queryTemplate: `
            sum by (envoy_cluster_name, state) (
                ceil(
                    rate(
                        label_replace(
                            label_replace(
                                label_replace(
                                    {__name__=~"%{name}_%{project}_%{metric}", envoy_cluster_name!="elchi-control-plane"},
                                    "state","$1","__name__",".*_%{metric}$"
                                ),
                                "state", "http1", "state", "^http1_total$"
                            ),
                            "state", "http2", "state", "^http2_total$"
                        )[%{window}s]
                    )
                )
            )
        `,
        windowSecs: defaultWindowSecs,
        legendMapping: [
            {
                template: '%s',
                labelKeys: ['envoy_cluster_name', 'state']
            }
        ]
    },
];
