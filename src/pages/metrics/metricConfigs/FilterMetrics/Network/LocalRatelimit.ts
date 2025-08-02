import { MetricConfig } from "../../MetricConfig";

const defaultWindowSecs = {
    default: 15,
    ranges: [
        { threshold: 2 * 24 * 60 * 60, value: 300 }, // 2 days
        { threshold: 24 * 60 * 60, value: 60 },      // 1 day
        { threshold: 1 * 60 * 60, value: 30 },       // 1 hour
    ]
}

export const LOCAL_RATE_LIMIT_METRICS: MetricConfig[] = [
    {
        section: 'Network Filter - Local Ratelimit Metrics',
        title: 'Rate Limited',
        metric: 'local_rate_limit_rate_limited_total',
        description: '',
        groups: ['all', 'filters', 'errors'],
        queryTemplate: `
            sum by (envoy_local_network_ratelimit_prefix) (
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
            labelKeys: ['envoy_local_network_ratelimit_prefix']
        }]
    },
];