import { MetricConfig } from "../../MetricConfig";

const defaultWindowSecs = {
    default: 15,
    ranges: [
        { threshold: 2 * 24 * 60 * 60, value: 300 }, // 2 days
        { threshold: 24 * 60 * 60, value: 60 },      // 1 day
        { threshold: 1 * 60 * 60, value: 30 },       // 1 hour
    ]
}

export const BASIC_AUTH_METRICS: MetricConfig[] = [
    {
        section: 'HTTP Filter - Basic Auth Metrics',
        title: 'Basic Auth Allowed',
        metric: 'extension_config_discovery_http_filter_(.+?)_basic_auth_allowed_total',
        description: '',
        groups: ['all', 'filters'],
        queryTemplate: `
            sum by (filter) (
                ceil(
                    rate(
                        label_replace(
                            {__name__=~"%{name}_%{project}_%{metric}"}, 
                            "filter", "$1", "__name__", ".*%{metric}"
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
        section: 'HTTP Filter - Basic Auth Metrics',
        title: 'Basic Auth Denied',
        metric: 'extension_config_discovery_http_filter_(.+?)_basic_auth_denied_total',
        description: '',
        groups: ['all', 'filters', 'errors'],
        queryTemplate: `
            sum by (filter) (
                ceil(
                    rate(
                        label_replace(
                            {__name__=~"%{name}_%{project}_%{metric}"}, 
                            "filter", "$1", "__name__", ".*%{metric}"
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
