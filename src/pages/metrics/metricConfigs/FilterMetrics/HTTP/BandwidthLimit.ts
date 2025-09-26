import { MetricConfig } from "../../MetricConfig";

const defaultWindowSecs = {
    default: 15,
    ranges: [
        { threshold: 2 * 24 * 60 * 60, value: 300 }, // 2 days
        { threshold: 24 * 60 * 60, value: 60 },      // 1 day
        { threshold: 1 * 60 * 60, value: 30 },       // 1 hour
    ]
}

export const BANDWIDTH_LIMIT_METRICS: MetricConfig[] = [
    {
        section: 'HTTP Filter - Bandwidth Limit Metrics',
        title: 'Request Enabled',
        metric: '(.+?)_http_bandwidth_limit_request_enabled_total',
        description: '',
        groups: ['all', 'filters', 'errors'],
        queryTemplate: `
            sum by (filter) (
                ceil(
                    rate(
                        label_replace(
                            {__name__=~"%{name}_%{project}_%{metric}"}, 
                            "filter", "$1", "__name__", ".*_%{metric}"
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
            labelKeys: ['filter']
        }]
    },
    {
        section: 'HTTP Filter - Bandwidth Limit Metrics',
        title: 'Response Enabled',
        metric: '(.+?)_http_bandwidth_limit_response_enabled_total',
        description: '',
        groups: ['all', 'filters', 'errors'],
        queryTemplate: `
            sum by (filter) (
                ceil(
                    rate(
                        label_replace(
                            {__name__=~"%{name}_%{project}_%{metric}"}, 
                            "filter", "$1", "__name__", ".*_%{metric}"
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
            labelKeys: ['filter']
        }]
    },
    {
        section: 'HTTP Filter - Bandwidth Limit Metrics',
        title: 'Response Incoming Size',
        metric: '(.+?)_http_bandwidth_limit_response_incoming_size_total',
        description: '',
        groups: ['all', 'filters', 'errors'],
        queryTemplate: `
            sum by (filter) (
                ceil(
                    rate(
                        label_replace(
                            {__name__=~"%{name}_%{project}_%{metric}"},
                            "filter", "$1", "__name__", ".*_%{metric}"
                        )[%{window}s]
                    )
                )
            )
        `,
        span: 12,
        formatType: 'bytes',
        windowSecs: defaultWindowSecs,
        legendMapping: [{
            template: '%s',
            labelKeys: ['filter']
        }]
    },
    {
        section: 'HTTP Filter - Bandwidth Limit Metrics',
        title: 'Response Allowed Size',
        metric: '(.+?)_http_bandwidth_limit_response_allowed_size_total',
        description: '',
        groups: ['all', 'filters', 'errors'],
        queryTemplate: `
            sum by (filter) (
                ceil(
                    rate(
                        label_replace(
                            {__name__=~"%{name}_%{project}_%{metric}"}, 
                            "filter", "$1", "__name__", ".*_%{metric}"
                        )[%{window}s]
                    )
                )
            )
        `,
        span: 12,
        formatType: 'bytes',
        windowSecs: defaultWindowSecs,
        legendMapping: [{
            template: '%s',
            labelKeys: ['filter']
        }]
    },
    {
        section: 'HTTP Filter - Bandwidth Limit Metrics',
        title: 'Response Pending',
        metric: '(.+?)_http_bandwidth_limit_response_pending',
        description: '',
        groups: ['all', 'filters', 'errors'],
        queryTemplate: `
            sum by (filter) (
                label_replace(
                    {__name__=~"%{name}_%{project}_%{metric}"},
                    "filter", "$1", "__name__", ".*_%{metric}"
                )
            )
        `,
        span: 12,
        formatType: 'number',
        legendMapping: [{
            template: '%s',
            labelKeys: ['filter']
        }]
    },
    {
        section: 'HTTP Filter - Bandwidth Limit Metrics',
        title: 'Response Transfer Duration',
        metric: '(.+?)_http_bandwidth_limit_response_transfer_duration',
        description: '',
        groups: ['all', 'filters'],
        queryTemplate: `
            sum by (filter) (
                rate(
                    label_replace(
                        {__name__=~"%{name}_%{project}_%{metric}_sum"},
                        "filter", "$1", "__name__", ".*_%{metric}_sum"
                    )
                ) 
            )
            / 
            sum by (filter) (
                rate(
                    label_replace(
                        {__name__=~"%{name}_%{project}_%{metric}_count"},
                        "filter", "$1", "__name__", ".*_%{metric}_count"
                    )
                )
            )
        `,
        span: 12,
        formatType: 'duration',
        legendMapping: [{
            template: '%s',
            labelKeys: ['filter']
        }]
    },
    {
        section: 'HTTP Filter - Bandwidth Limit Metrics',
        title: 'Response Enforced',
        metric: '(.+?)_http_bandwidth_limit_response_enforced_total',
        description: '',
        groups: ['all', 'filters', 'errors'],
        queryTemplate: `
            sum by (filter) (
                ceil(
                    rate(
                        label_replace(
                            {__name__=~"%{name}_%{project}_%{metric}"},
                            "filter", "$1", "__name__", ".*_%{metric}"
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
            labelKeys: ['filter']
        }]
    },
];
