import { MetricConfig } from "../../MetricConfig";

const defaultWindowSecs = {
    default: 15,
    ranges: [
        { threshold: 2 * 24 * 60 * 60, value: 300 }, // 2 days
        { threshold: 24 * 60 * 60, value: 60 },      // 1 day
        { threshold: 1 * 60 * 60, value: 30 },       // 1 hour
    ]
}

export const NETWORK_RBAC_METRICS: MetricConfig[] = [
    {
        section: 'Network Filter - RBAC Metrics',
        title: 'RBAC Allowed',
        metric: 'rbac_allowed_total',
        description: '',
        groups: ['all', 'filters'],
        queryTemplate: `
            sum by (envoy_rbac_prefix) (
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
            labelKeys: ['envoy_rbac_prefix']
        }]
    },
    {
        section: 'Network Filter - RBAC Metrics',
        title: 'RBAC Denied',
        metric: 'rbac_denied_total',
        description: '',
        groups: ['all', 'filters', 'errors'],
        queryTemplate: `
            sum by (envoy_rbac_prefix) (
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
            labelKeys: ['envoy_rbac_prefix']
        }]
    },
    {
        section: 'Network Filter - RBAC Metrics',
        title: 'RBAC Shadow Allowed',
        metric: 'rbac_(.+?)_shadow_allowed_total',
        description: '',
        groups: ['all', 'filters'],
        queryTemplate: `
            sum by (envoy_rbac_prefix, filter) (
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
            labelKeys: ['envoy_rbac_prefix', 'filter']
        }]
    },
    {
        section: 'Network Filter - RBAC Metrics',
        title: 'RBAC Shadow Denied',
        metric: 'rbac_(.+?)_shadow_denied_total',
        description: '',
        groups: ['all', 'filters', 'errors'],
        queryTemplate: `
            sum by (envoy_rbac_prefix, filter) (
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
            labelKeys: ['envoy_rbac_prefix', 'filter']
        }]
    },
];