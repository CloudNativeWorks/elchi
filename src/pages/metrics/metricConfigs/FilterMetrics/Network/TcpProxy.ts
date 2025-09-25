import { MetricConfig } from "../../MetricConfig";

const defaultWindowSecs = {
    default: 15,
    ranges: [
        { threshold: 2 * 24 * 60 * 60, value: 300 }, // 2 days
        { threshold: 24 * 60 * 60, value: 60 },      // 1 day
        { threshold: 1 * 60 * 60, value: 30 },       // 1 hour
    ]
}

export const TCP_PROXY_METRICS: MetricConfig[] = [
    {
        section: 'Network Filter - TCP Proxy Metrics',
        title: 'TCP Proxy Downstream Connections',
        metric: 'tcp_downstream_cx_total',
        description: '',
        groups: ['all', 'filters'],
        queryTemplate: `
            sum by (envoy_tcp_prefix) (
                ceil(
                    rate(
                        {__name__=~"%{name}_%{project}_%{metric}"}[%{window}s]
                    )
                )
            )
        `,
        span: 12,
        formatType: 'number',
        windowSecs: defaultWindowSecs,
        legendMapping: [{
            template: '%s',
            labelKeys: ['envoy_tcp_prefix']
        }]
    },
    {
        section: 'Network Filter - TCP Proxy Metrics',
        title: 'TCP Proxy Early Data Received',
        metric: 'tcp_early_data_received_count_total',
        description: '',
        groups: ['all', 'filters'],
        queryTemplate: `
            sum by (envoy_tcp_prefix) (
                ceil(
                    rate(
                        {__name__=~"%{name}_%{project}_%{metric}"}[%{window}s]
                    )
                )
            )
        `,
        span: 12,
        formatType: 'number',
        windowSecs: defaultWindowSecs,
        legendMapping: [{
            template: '%s',
            labelKeys: ['envoy_tcp_prefix']
        }]
    },
    {
        section: 'Network Filter - TCP Proxy Metrics',
        title: 'TCP Proxy Downstream Bytes Received Buffered',
        metric: 'tcp_downstream_cx_rx_bytes_buffered',
        description: '',
        groups: ['all', 'filters'],
        queryTemplate: `
            sum by (envoy_tcp_prefix) (
                {__name__=~"%{name}_%{project}_%{metric}"}
            )
        `,
        span: 12,
        formatType: 'bytes',
        legendMapping: [{
            template: '%s',
            labelKeys: ['envoy_tcp_prefix']
        }]
    },
    {
        section: 'Network Filter - TCP Proxy Metrics',
        title: 'TCP Proxy Downstream Bytes Sent Buffered',
        metric: 'tcp_downstream_cx_tx_bytes_buffered',
        description: '',
        groups: ['all', 'filters'],
        queryTemplate: `
            sum by (envoy_tcp_prefix) (
                {__name__=~"%{name}_%{project}_%{metric}"}
            )
        `,
        span: 12,
        formatType: 'bytes',
        legendMapping: [{
            template: '%s',
            labelKeys: ['envoy_tcp_prefix']
        }]
    },
    {
        section: 'Network Filter - TCP Proxy Metrics',
        title: 'TCP Proxy Downstream Bytes Received',
        metric: 'tcp_downstream_cx_rx_bytes_total',
        description: '',
        groups: ['all', 'filters'],
        queryTemplate: `
            sum by (envoy_tcp_prefix) (
                ceil(
                    rate(
                        {__name__=~"%{name}_%{project}_%{metric}"}[%{window}s]
                    )
                )
            )
        `,
        span: 12,
        formatType: 'bytes',
        windowSecs: defaultWindowSecs,
        legendMapping: [{
            template: '%s',
            labelKeys: ['envoy_tcp_prefix']
        }]
    },
    {
        section: 'Network Filter - TCP Proxy Metrics',
        title: 'TCP Proxy Downstream Bytes Sent',
        metric: 'tcp_downstream_cx_tx_bytes_total',
        description: '',
        groups: ['all', 'filters'],
        queryTemplate: `
            sum by (envoy_tcp_prefix) (
                ceil(
                    rate(
                        {__name__=~"%{name}_%{project}_%{metric}"}[%{window}s]
                    )
                )
            )
        `,
        span: 12,
        formatType: 'bytes',
        windowSecs: defaultWindowSecs,
        legendMapping: [{
            template: '%s',
            labelKeys: ['envoy_tcp_prefix']
        }]
    },
    {
        section: 'Network Filter - TCP Proxy Metrics',
        title: 'TCP Proxy Idle Timeout',
        metric: 'tcp_idle_timeout',
        description: '',
        groups: ['all', 'filters', 'errors'],
        queryTemplate: `
            sum by (envoy_tcp_prefix) (
                ceil(
                    rate(
                        {__name__=~"%{name}_%{project}_%{metric}"}[%{window}s]
                    )
                )
            )
        `,
        span: 12,
        formatType: 'number',
        windowSecs: defaultWindowSecs,
        legendMapping: [{
            template: '%s',
            labelKeys: ['envoy_tcp_prefix']
        }]
    },
];