import { MetricConfig } from "../../MetricConfig";

const defaultWindowSecs = {
    default: 15,
    ranges: [
        { threshold: 2 * 24 * 60 * 60, value: 300 }, // 2 days
        { threshold: 24 * 60 * 60, value: 60 },      // 1 day
        { threshold: 1 * 60 * 60, value: 30 },       // 1 hour
    ]
}

export const DNS_FILTER_METRICS: MetricConfig[] = [
    {
        section: 'Listener Filter - DNS Filter Metrics',
        title: 'Received',
        metric: 'dns_filter_downstream_rx_bytes_sum',
        description: '',
        groups: ['all', 'filters'],
        queryTemplate: `
            sum by (envoy_dns_filter_prefix) (
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
            labelKeys: ['envoy_dns_filter_prefix']
        }]
    },
    {
        section: 'Listener Filter - DNS Filter Metrics',
        title: 'Sent',
        metric: 'dns_filter_downstream_tx_bytes_sum',
        description: '',
        groups: ['all', 'filters'],
        queryTemplate: `
            sum by (envoy_dns_filter_prefix) (
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
            labelKeys: ['envoy_dns_filter_prefix']
        }]
    },
    {
        section: 'Listener Filter - DNS Filter Metrics',
        title: 'Received Queries',
        metric: 'dns_filter_downstream_rx_queries_total',
        description: '',
        groups: ['all', 'filters'],
        queryTemplate: `
            sum by (envoy_dns_filter_prefix) (
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
            labelKeys: ['envoy_dns_filter_prefix']
        }]
    },
    {
        section: 'Listener Filter - DNS Filter Metrics',
        title: 'Sent Responses',
        metric: 'dns_filter_downstream_tx_responses_total',
        description: '',
        groups: ['all', 'filters'],
        queryTemplate: `
            sum by (envoy_dns_filter_prefix) (
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
            labelKeys: ['envoy_dns_filter_prefix']
        }]
    },
    {
        section: 'Listener Filter - DNS Filter Metrics',
        title: 'Known Domain Queries',
        metric: 'dns_filter_known_domain_queries_total',
        description: '',
        groups: ['all', 'filters'],
        queryTemplate: `
            sum by (envoy_dns_filter_prefix) (
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
            labelKeys: ['envoy_dns_filter_prefix']
        }]
    },
    {
        section: 'Listener Filter - DNS Filter Metrics',
        title: 'Unanswered Queries',
        metric: 'dns_filter_unanswered_queries_total',
        description: '',
        groups: ['all', 'errors'],
        queryTemplate: `
            sum by (envoy_dns_filter_prefix) (
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
            labelKeys: ['envoy_dns_filter_prefix']
        }]
    },
    {
        section: 'Listener Filter - DNS Filter Metrics',
        title: 'Unsupported Queries',
        metric: 'dns_filter_unsupported_queries_total',
        description: '',
        groups: ['all', 'filters', 'errors'],
        queryTemplate: `
            sum by (envoy_dns_filter_prefix) (
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
            labelKeys: ['envoy_dns_filter_prefix']
        }]
    },
];
