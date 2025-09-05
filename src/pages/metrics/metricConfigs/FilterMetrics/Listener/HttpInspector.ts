import { MetricConfig } from "../../MetricConfig";

const defaultWindowSecs = {
    default: 15,
    ranges: [
        { threshold: 2 * 24 * 60 * 60, value: 300 }, // 2 days
        { threshold: 24 * 60 * 60, value: 60 },      // 1 day
        { threshold: 1 * 60 * 60, value: 30 },       // 1 hour
    ]
}

export const HTTP_INSPECTOR_METRICS: MetricConfig[] = [
    {
        section: 'Listener Filter - Http Inspector Metrics',
        title: 'Http Found',
        metric: 'http_inspector_(http11|http10|http2)_found_total',
        description: '',
        groups: ['all', 'filters'],
        queryTemplate: `
            sum by (state) (
                ceil(
                    rate(
                        label_replace(
                            {__name__=~"%{name}_%{project}_%{metric}"},
                            "state", "$1", "__name__", ".*%{metric}"
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
            labelKeys: ['state']
        }]
    },
    {
        section: 'Listener Filter - Http Inspector Metrics',
        title: 'Http Error',
        metric: 'http_inspector_(read_error|http_not_found)_total',
        description: '',
        groups: ['all', 'filters', 'errors'],
        queryTemplate: `
            sum by (state) (
                ceil(
                    rate(
                        label_replace(
                            {__name__=~"%{name}_%{project}_%{metric}"},
                            "state", "$1", "__name__", ".*%{metric}"
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
            labelKeys: ['state']
        }]
    },
];