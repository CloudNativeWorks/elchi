import { MetricConfig } from "../../MetricConfig";

const defaultWindowSecs = {
    default: 15,
    ranges: [
        { threshold: 2 * 24 * 60 * 60, value: 300 }, // 2 days
        { threshold: 24 * 60 * 60, value: 60 },      // 1 day
        { threshold: 1 * 60 * 60, value: 30 },       // 1 hour
    ]
}

export const CONNECTION_LIMIT_METRICS: MetricConfig[] = [
    {
        section: 'Network Filter - Connection Limit Metrics',
        title: 'Active Connections',
        metric: 'connection_limit_active_connections',
        description: '',
        groups: ['all', 'filters'],
        queryTemplate: `
            sum by (envoy_connection_limit_prefix) (
                {__name__=~"%{name}_%{project}_%{metric}"}
            )
        `,
        span: 12,
        formatType: 'number',
        legendMapping: [{
            template: '%s',
            labelKeys: ['envoy_connection_limit_prefix']
        }]
    },
    {
        section: 'Network Filter - Connection Limit Metrics',
        title: 'Limited Connections',
        metric: 'connection_limit_limited_connections_total',
        description: '',
        groups: ['all', 'filters', 'errors'],
        queryTemplate: `
            sum by (envoy_connection_limit_prefix) (
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
            labelKeys: ['envoy_connection_limit_prefix']
        }]
    },
];