import { MetricConfig } from "../../MetricConfig";

const defaultWindowSecs = {
    default: 15,
    ranges: [
        { threshold: 2 * 24 * 60 * 60, value: 300 }, // 2 days
        { threshold: 24 * 60 * 60, value: 60 },      // 1 day
        { threshold: 1 * 60 * 60, value: 30 },       // 1 hour
    ]
}

export const HTTP_LOCAL_RATE_LIMIT_METRICS: MetricConfig[] = [
    {
        section: 'HTTP Filter - Local Ratelimit Metrics',
        title: 'Request OK',
        metric: 'http_local_rate_limit_ok_total',
        description: '',
        groups: ['all', 'filters'],
        queryTemplate: `
            sum by (envoy_local_http_ratelimit_prefix) (
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
            labelKeys: ['envoy_local_http_ratelimit_prefix']
        }]
    },
    {
        section: 'HTTP Filter - Local Ratelimit Metrics',
        title: 'Ratelimit Enforced',
        metric: 'http_local_rate_limit_enforced_total',
        description: '',
        groups: ['all', 'filters', 'errors'],
        queryTemplate: `
            sum by (envoy_local_http_ratelimit_prefix) (
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
            labelKeys: ['envoy_local_http_ratelimit_prefix']
        }]
    },
    {
        section: 'HTTP Filter - Local Ratelimit Metrics',
        title: 'Ratelimit Enabled',
        metric: 'http_local_rate_limit_enabled_total',
        description: '',
        groups: ['all', 'filters'],
        queryTemplate: `
            sum by (envoy_local_http_ratelimit_prefix) (
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
            labelKeys: ['envoy_local_http_ratelimit_prefix']
        }]
    },
    {
        section: 'HTTP Filter - Local Ratelimit Metrics',
        title: 'Ratelimit Rate Limited',
        metric: 'http_local_rate_limit_rate_limited_total',
        description: '',
        groups: ['all', 'filters', 'errors'],
        queryTemplate: `
            sum by (envoy_local_http_ratelimit_prefix) (
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
            labelKeys: ['envoy_local_http_ratelimit_prefix']
        }]
    },
];
