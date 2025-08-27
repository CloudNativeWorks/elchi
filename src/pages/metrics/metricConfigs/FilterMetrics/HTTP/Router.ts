import { MetricConfig } from "../../MetricConfig";

const defaultWindowSecs = {
    default: 15,
    ranges: [
        { threshold: 2 * 24 * 60 * 60, value: 300 }, // 2 days
        { threshold: 24 * 60 * 60, value: 60 },      // 1 day
        { threshold: 1 * 60 * 60, value: 30 },       // 1 hour
    ]
}

export const HTTP_ROUTER_METRICS: MetricConfig[] = [
    {
        section: 'HTTP Filter - Router Metrics',
        title: 'Direct Response',
        metric: 'extension_config_discovery_http_filter_(.+?)_rq_direct_response_total',
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
        section: 'HTTP Filter - Router Metrics',
        title: 'Requests',
        metric: 'extension_config_discovery_http_filter_(.+?)_rq_total',
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
        section: 'HTTP Filter - Router Metrics',
        title: 'No Route',
        metric: 'extension_config_discovery_http_filter_(.+?)_no_route_total',
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
    {
        section: 'HTTP Filter - Router Metrics',
        title: 'No Cluster',
        metric: 'extension_config_discovery_http_filter_(.+?)_no_cluster_total',
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
    {
        section: 'HTTP Filter - Router Metrics',
        title: 'Redirects',
        metric: 'extension_config_discovery_http_filter_(.+?)_rq_redirect_total',
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
        section: 'HTTP Filter - Router Metrics',
        title: 'Reset After Downstream Response Started',
        metric: 'extension_config_discovery_http_filter_(.+?)_rq_reset_after_downstream_response_started_total',
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
    {
        section: 'HTTP Filter - Router Metrics',
        title: 'Overload Local Reply',
        metric: 'extension_config_discovery_http_filter_(.+?)_rq_overload_local_reply_total',
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
