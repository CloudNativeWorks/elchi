import { MetricConfig } from "../../MetricConfig";

const defaultWindowSecs = {
    default: 15,
    ranges: [
        { threshold: 2 * 24 * 60 * 60, value: 300 }, // 2 days
        { threshold: 24 * 60 * 60, value: 60 },      // 1 day
        { threshold: 1 * 60 * 60, value: 30 },       // 1 hour
    ]
}

export const HTTP_RBAC_METRICS: MetricConfig[] = [
    {
        section: 'HTTP Filter - RBAC Metrics',
        title: 'RBAC Allowed',
        metric: 'extension_config_discovery_http_filter_(.+?)_rbac_(.+?)_allowed_total',
        description: '',
        groups: ['all', 'filters'],
        queryTemplate: `
            sum by (filter, filter2) (
                ceil(
                    rate(
                        label_replace(
                            label_replace(
                            {__name__=~"%{name}_%{project}_%{metric}"}, 
                                "filter", "$1", "__name__", ".*%{metric}"
                            ),
                            "filter2", "$2", "__name__", ".*%{metric}"
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
            labelKeys: ['filter', 'filter2']
        }]
    },
    {
        section: 'HTTP Filter - RBAC Metrics',
        title: 'RBAC Denied',
        metric: 'extension_config_discovery_http_filter_(.+?)_rbac_(.+?)_denied_total',
        description: '',
        groups: ['all', 'filters', 'errors'],
        queryTemplate: `
            sum by (filter, filter2) (
                ceil(
                    rate(
                        label_replace(
                            label_replace(
                            {__name__=~"%{name}_%{project}_%{metric}"}, 
                                "filter", "$1", "__name__", ".*%{metric}"
                            ),
                            "filter2", "$2", "__name__", ".*%{metric}"
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
            labelKeys: ['filter', 'filter2']
        }]
    },
    {
        section: 'HTTP Filter - RBAC Metrics',
        title: 'RBAC Shadow Allowed',
        metric: 'extension_config_discovery_http_filter_(.+?)_rbac_(.+?)_shadow_allowed_total',
        description: '',
        groups: ['all', 'filters'],
        queryTemplate: `
            sum by (filter, filter2) (
                ceil(
                    rate(
                        label_replace(
                            label_replace(
                            {__name__=~"%{name}_%{project}_%{metric}"}, 
                                "filter", "$1", "__name__", ".*%{metric}"
                            ),
                            "filter2", "$2", "__name__", ".*%{metric}"
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
            labelKeys: ['filter', 'filter2']
        }]
    },
    {
        section: 'HTTP Filter - RBAC Metrics',
        title: 'RBAC Shadow Denied',
        metric: 'extension_config_discovery_http_filter_(.+?)_rbac_(.+?)_shadow_denied_total',
        description: '',
        groups: ['all', 'filters', 'errors'],
        queryTemplate: `
            sum by (filter, filter2) (
                ceil(
                    rate(
                        label_replace(
                            label_replace(
                            {__name__=~"%{name}_%{project}_%{metric}"}, 
                                "filter", "$1", "__name__", ".*%{metric}"
                            ),
                            "filter2", "$2", "__name__", ".*%{metric}"
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
            labelKeys: ['filter', 'filter2']
        }]
    },
    {
        section: 'HTTP Filter - RBAC Metrics',
        title: 'RBAC Per Rule Denied',
        metric: 'extension_config_discovery_http_filter_(.+?)_rbac_(.+?)_policy_(.+?)_denied_total',
        description: '',
        groups: ['all', 'filters', 'errors'],
        queryTemplate: `
            sum by (filter, filter2, filter3) (
                ceil(
                    rate(
                        label_replace(
                            label_replace(
                                label_replace(
                                    {__name__=~"%{name}_%{project}_%{metric}"}, 
                                    "filter", "$1", "__name__", ".*%{metric}"
                                ),
                                "filter2", "$2", "__name__", ".*%{metric}"
                            ),
                            "filter3", "$3", "__name__", ".*%{metric}"
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
            labelKeys: ['filter', 'filter2', 'filter3']
        }]
    },
];
