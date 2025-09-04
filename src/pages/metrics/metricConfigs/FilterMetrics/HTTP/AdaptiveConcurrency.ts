import { MetricConfig } from "../../MetricConfig";

const defaultWindowSecs = {
    default: 15,
    ranges: [
        { threshold: 2 * 24 * 60 * 60, value: 300 }, // 2 days
        { threshold: 24 * 60 * 60, value: 60 },      // 1 day
        { threshold: 1 * 60 * 60, value: 30 },       // 1 hour
    ]
}

export const ADAPTIVE_CONCURRENCY_METRICS: MetricConfig[] = [
    {
        section: 'HTTP Filter - Adaptive Concurrency Metrics',
        title: 'Adaptive Concurrency Limit',
        metric: 'extension_config_discovery_http_filter_(.+?)_adaptive_concurrency_gradient_controller_concurrency_limit',
        groups: ['all', 'filters'],
        description: '',
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
        section: 'HTTP Filter - Adaptive Concurrency Metrics',
        title: 'Adaptive Concurrency Blocked',
        metric: 'extension_config_discovery_http_filter_(.+?)_adaptive_concurrency_gradient_controller_rq_blocked_total',
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
        section: 'HTTP Filter - Adaptive Concurrency Metrics',
        title: 'Adaptive Concurrency Min RTT',
        metric: 'extension_config_discovery_http_filter_(.+?)_adaptive_concurrency_gradient_controller_min_rtt_msecs',
        description: '',
        groups: ['all', 'filters'],
        queryTemplate: `
            sum by (filter) (
                label_replace(
                    {__name__=~"%{name}_%{project}_%{metric}"},
                    "filter", "$1", "__name__", ".*%{metric}"
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
        section: 'HTTP Filter - Adaptive Concurrency Metrics',
        title: 'Adaptive Concurrency Min RTT Calculation Active',
        metric: 'extension_config_discovery_http_filter_(.+?)_adaptive_concurrency_gradient_controller_min_rtt_calculation_active',
        description: '',
        groups: ['all', 'filters'],
        queryTemplate: `
            sum by (filter) (
                label_replace(
                    {__name__=~"%{name}_%{project}_%{metric}"}, 
                    "filter", "$1", "__name__", ".*%{metric}"
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
        section: 'HTTP Filter - Adaptive Concurrency Metrics',
        title: 'Adaptive Concurrency Burst Queue Size',
        metric: 'extension_config_discovery_http_filter_(.+?)_adaptive_concurrency_gradient_controller_burst_queue_size',
        description: '',
        groups: ['all', 'filters'],
        queryTemplate: `
            sum by (filter) (
                label_replace(
                    {__name__=~"%{name}_%{project}_%{metric}"},
                    "filter", "$1", "__name__", ".*%{metric}"
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
        section: 'HTTP Filter - Adaptive Concurrency Metrics',
        title: 'Adaptive Concurrency Gradient',
        metric: 'extension_config_discovery_http_filter_(.+?)_adaptive_concurrency_gradient_controller_gradient',
        description: '',
        groups: ['all', 'filters'],
        queryTemplate: `
            sum by (filter) (
                label_replace(
                    {__name__=~"%{name}_%{project}_%{metric}"}, 
                    "filter", "$1", "__name__", ".*%{metric}"
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
        section: 'HTTP Filter - Adaptive Concurrency Metrics',
        title: 'Adaptive Concurrency Sample RTT',
        metric: 'extension_config_discovery_http_filter_(.+?)_adaptive_concurrency_gradient_controller_sample_rtt_msecs',
        description: '',
        groups: ['all', 'filters'],
        queryTemplate: `
            sum by (filter) (
                label_replace(
                    {__name__=~"%{name}_%{project}_%{metric}"}, 
                    "filter", "$1", "__name__", ".*%{metric}"
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
];
