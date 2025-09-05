import { DOWNSTREAM_ACTIVE_CONNECTIONS_METRICS_DESCRIPTION, DOWNSTREAM_CONNECTION_DESTROYED_FROM_REMOTE_METRICS_DESCRIPTION, DOWNSTREAM_CONNECTION_LENGTH_METRICS_DESCRIPTION, DOWNSTREAM_DESTROYED_CONNECTIONS_METRICS_DESCRIPTION, DOWNSTREAM_PROTOCOL_ERRORS_METRICS_DESCRIPTION, DOWNSTREAM_RECEIVED_BUFFERED_METRICS_DESCRIPTION, DOWNSTREAM_RECEIVED_METRICS_DESCRIPTION, DOWNSTREAM_RECEIVED_RESET_METRICS_DESCRIPTION, DOWNSTREAM_REQUEST_BY_PROTOCOLS_METRICS_DESCRIPTION, DOWNSTREAM_REQUEST_METRICS_DESCRIPTION, DOWNSTREAM_RESPONSE_CODES_METRICS_DESCRIPTION, DOWNSTREAM_RESPONSE_TIME_METRICS_DESCRIPTION, DOWNSTREAM_SENT_METRICS_DESCRIPTION } from "../Descriptions/DescriptionsDownstreams";
import { MetricConfig } from "../MetricConfig";

const defaultWindowSecs = {
    default: 15,
    ranges: [
        { threshold: 2 * 24 * 60 * 60, value: 300 }, // 2 days
        { threshold: 24 * 60 * 60, value: 60 },      // 1 day
        { threshold: 1 * 60 * 60, value: 30 },       // 1 hour
    ]
}

export const DOWNSTREAM_REQUEST_METRICS: MetricConfig[] = [
    {
        section: 'Downstream Request Metrics',
        title: 'Downstream Requests',
        metric: 'http_downstream_rq_total',
        description: DOWNSTREAM_REQUEST_METRICS_DESCRIPTION,
        groups: ['all'],
        span: 12,
        formatType: 'number',
        queryTemplate: `
            sum by (envoy_http_conn_manager_prefix)(
                ceil(
                    rate(
                        %{name}_%{project}_%{metric}{envoy_http_conn_manager_prefix!="admin"}[%{window}s]
                    )
                )
            )
        `,
        windowSecs: defaultWindowSecs,
        legendMapping: [{
            template: '%s',
            labelKeys: ['envoy_http_conn_manager_prefix']
        }]
    },
    {
        section: 'Downstream Request Metrics',
        title: 'Downstream Response Codes',
        metric: 'http_downstream_rq_xx_total',
        description: DOWNSTREAM_RESPONSE_CODES_METRICS_DESCRIPTION,
        groups: ['all', 'errors'],
        span: 12,
        formatType: 'number',
        queryTemplate: `
            sum by (envoy_http_conn_manager_prefix, envoy_response_code_class)(
                ceil(
                    rate(
                        %{name}_%{project}_%{metric}{envoy_http_conn_manager_prefix!="admin"}[%{window}s]
                    )
                )
            )
        `,
        windowSecs: defaultWindowSecs,
        legendMapping: [{
            template: '%s 2xx',
            labelKeys: ['envoy_http_conn_manager_prefix'],
            extraLabels: { 'envoy_response_code_class': '2' }
        }, {
            template: '%s 3xx',
            labelKeys: ['envoy_http_conn_manager_prefix'],
            extraLabels: { 'envoy_response_code_class': '3' }
        }, {
            template: '%s 4xx',
            labelKeys: ['envoy_http_conn_manager_prefix'],
            extraLabels: { 'envoy_response_code_class': '4' }
        }, {
            template: '%s 5xx',
            labelKeys: ['envoy_http_conn_manager_prefix'],
            extraLabels: { 'envoy_response_code_class': '5' }
        }]
    },
    {
        section: 'Downstream Request Metrics',
        title: 'Downstream Requests by Protocol',
        metric: 'http_downstream_rq_(http1_total|http2_total)',
        description: DOWNSTREAM_REQUEST_BY_PROTOCOLS_METRICS_DESCRIPTION,
        groups: ['all'],
        span: 12,
        formatType: 'number',
        queryTemplate: `
            sum by (envoy_http_conn_manager_prefix, state) (
                ceil(
                    rate(
                        label_replace(
                            label_replace(
                                label_replace(
                                    {__name__=~"%{name}_%{project}_%{metric}", envoy_http_conn_manager_prefix!="admin"},
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
                labelKeys: ['envoy_http_conn_manager_prefix', 'state']
            }
        ]
    },
    {
        section: 'Downstream Request Metrics',
        title: 'Downstream Response Time (90th percentile)',
        metric: 'http_downstream_rq_time_bucket',
        description: DOWNSTREAM_RESPONSE_TIME_METRICS_DESCRIPTION,
        groups: ['all'],
        queryTemplate: `
            histogram_quantile(
                0.90, sum(
                    rate(
                        %{name}_%{project}_%{metric}{envoy_http_conn_manager_prefix!="admin"}[%{window}s]
                    )
                ) by (le, envoy_http_conn_manager_prefix)
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
            labelKeys: ['envoy_http_conn_manager_prefix']
        }]
    },
    {
        section: 'Downstream Request Metrics',
        title: 'Downstream Received Reset',
        metric: 'http_downstream_rq_rx_reset_total',
        description: DOWNSTREAM_RECEIVED_RESET_METRICS_DESCRIPTION,
        groups: ['all', 'errors'],
        span: 12,
        formatType: 'number',
        queryTemplate: `
            sum by (envoy_http_conn_manager_prefix)(
                ceil(
                    rate(
                        %{name}_%{project}_%{metric}{envoy_http_conn_manager_prefix!="admin"}[%{window}s]
                    )
                )
            )
        `,
        windowSecs: defaultWindowSecs,
        legendMapping: [{
            template: '%s',
            labelKeys: ['envoy_http_conn_manager_prefix']
        }]
    },
];

export const DOWNSTREAM_CONNECTION_METRICS: MetricConfig[] = [
    {
        section: 'Downstream Connection Metrics',
        title: 'Downstream Active Connections',
        metric: 'http_downstream_cx_active',
        description: DOWNSTREAM_ACTIVE_CONNECTIONS_METRICS_DESCRIPTION,
        groups: ['all'],
        span: 12,
        formatType: 'number',
        queryTemplate: `
            sum by (envoy_http_conn_manager_prefix)(
                %{name}_%{project}_%{metric}{envoy_http_conn_manager_prefix!="admin"}
            )
        `,
        legendMapping: [{
            template: '%s',
            labelKeys: ['envoy_http_conn_manager_prefix']
        }]
    },
    {
        section: 'Downstream Connection Metrics',
        title: 'Downstream Connection Length (90th percentile)',
        metric: 'http_downstream_cx_length_ms_bucket',
        description: DOWNSTREAM_CONNECTION_LENGTH_METRICS_DESCRIPTION,
        groups: ['all'],
        queryTemplate: `
            histogram_quantile(
                0.90, sum(
                    rate(
                        %{name}_%{project}_%{metric}{envoy_http_conn_manager_prefix!="admin"}[%{window}s]
                    )
                ) by (le, envoy_http_conn_manager_prefix)
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
            labelKeys: ['envoy_http_conn_manager_prefix']
        }]
    },
    {
        section: 'Downstream Connection Metrics',
        title: 'Downstream Connection Destroyed From Remote',
        metric: 'http_downstream_cx_destroy_(remote_total|remote_active_rq_total)',
        description: DOWNSTREAM_CONNECTION_DESTROYED_FROM_REMOTE_METRICS_DESCRIPTION,
        groups: ['all', 'errors'],
        queryTemplate: `
            sum by (envoy_http_conn_manager_prefix, state) (
                ceil(
                    rate(
                        label_replace(
                            label_replace(
                                label_replace(
                                    {__name__=~"%{name}_%{project}_%{metric}", envoy_http_conn_manager_prefix!="admin"},
                                    "state", "$1", "__name__", ".*%{metric}"
                                ),
                                "state", "remote_active_rq", "state", "^remote_active_rq_total$"
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
            labelKeys: ['envoy_http_conn_manager_prefix', 'state']
        }]
    },
    {
        section: 'Downstream Connection Metrics',
        title: 'Downstream Destroyed Connections',
        metric: 'http_downstream_cx_destroy_total',
        description: DOWNSTREAM_DESTROYED_CONNECTIONS_METRICS_DESCRIPTION,
        groups: ['all', 'errors'],
        span: 12,
        formatType: 'number',
        queryTemplate: `
            sum by (envoy_http_conn_manager_prefix)(
                ceil(
                    rate(
                        %{name}_%{project}_%{metric}{envoy_http_conn_manager_prefix!="admin"}[%{window}s]
                    )
                )
            )
        `,
        windowSecs: defaultWindowSecs,
        legendMapping: [{
            template: '%s',
            labelKeys: ['envoy_http_conn_manager_prefix']
        }]
    },
    {
        section: 'Downstream Connection Metrics',
        title: 'Downstream Received',
        metric: 'http_downstream_cx_rx_bytes_total',
        description: DOWNSTREAM_RECEIVED_METRICS_DESCRIPTION,
        groups: ['all'],
        span: 12,
        formatType: 'bytes',
        queryTemplate: `
            sum by (envoy_http_conn_manager_prefix)(
                rate(
                    %{name}_%{project}_%{metric}{envoy_http_conn_manager_prefix!="admin"}[%{window}s]
                )
            )
        `,
        windowSecs: defaultWindowSecs,
        legendMapping: [{
            template: '%s',
            labelKeys: ['envoy_http_conn_manager_prefix']
        }]
    },
    {
        section: 'Downstream Connection Metrics',
        title: 'Downstream Sent',
        metric: 'http_downstream_cx_tx_bytes_total',
        description: DOWNSTREAM_SENT_METRICS_DESCRIPTION,
        groups: ['all'],
        span: 12,
        formatType: 'bytes',
        queryTemplate: `
            sum by (envoy_http_conn_manager_prefix)(
                rate(
                    %{name}_%{project}_%{metric}{envoy_http_conn_manager_prefix!="admin"}[%{window}s]
                )
            )
        `,
        windowSecs: defaultWindowSecs,
        legendMapping: [{
            template: '%s',
            labelKeys: ['envoy_http_conn_manager_prefix']
        }]
    },
    {
        section: 'Downstream Connection Metrics',
        title: 'Downstream Protocol Errors',
        metric: 'http_downstream_cx_protocol_error_total',
        description: DOWNSTREAM_PROTOCOL_ERRORS_METRICS_DESCRIPTION,
        groups: ['all', 'errors'],
        span: 12,
        formatType: 'number',
        queryTemplate: `
            sum by (envoy_http_conn_manager_prefix)(
                ceil(
                    rate(
                        %{name}_%{project}_%{metric}{envoy_http_conn_manager_prefix!="admin"}[%{window}s]
                    )
                )
            )
        `,
        windowSecs: defaultWindowSecs,
        legendMapping: [{
            template: '%s',
            labelKeys: ['envoy_http_conn_manager_prefix']
        }]
    },
    {
        section: 'Downstream Connection Metrics',
        title: 'Downstream Received Buffered',
        metric: 'http_downstream_cx_rx_bytes_buffered',
        description: DOWNSTREAM_RECEIVED_BUFFERED_METRICS_DESCRIPTION,
        groups: ['all'],
        span: 12,
        formatType: 'number',
        queryTemplate: `
            sum by (envoy_http_conn_manager_prefix)(
                ceil(
                    rate(
                        %{name}_%{project}_%{metric}{envoy_http_conn_manager_prefix!="admin"}[%{window}s]
                    )
                )
            )
        `,
        windowSecs: defaultWindowSecs,
        legendMapping: [{
            template: '%s',
            labelKeys: ['envoy_http_conn_manager_prefix']
        }]
    },
    {
        section: 'Downstream Connection Metrics',
        title: 'Downstream Connections Accepted Per Socket Event',
        metric: 'listener_connections_accepted_per_socket_event_sum',
        groups: ['all'],
        span: 12,
        formatType: 'number',
        queryTemplate: `
            sum by (envoy_listener_address)(
                ceil(
                    rate(
                        %{name}_%{project}_%{metric}{envoy_http_conn_manager_prefix!="admin"}[%{window}s]
                    )
                )
            )
        `,
        windowSecs: defaultWindowSecs,
        legendMapping: [{
            template: '%s',
            labelKeys: ['envoy_listener_address']
        }]
    },
];