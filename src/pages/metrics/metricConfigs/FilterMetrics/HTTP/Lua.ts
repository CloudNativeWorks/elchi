import { MetricConfig } from "../../MetricConfig";

const defaultWindowSecs = {
    default: 15,
    ranges: [
        { threshold: 2 * 24 * 60 * 60, value: 300 }, // 2 days
        { threshold: 24 * 60 * 60, value: 60 },      // 1 day
        { threshold: 1 * 60 * 60, value: 30 },       // 1 hour
    ]
}

export const LUA_METRICS: MetricConfig[] = [
    {
        section: 'HTTP Filter - Lua Metrics',
        title: 'Lua Errors',
        metric: 'extension_config_discovery_http_filter_(.+?)_lua_(.+?)_errors_total',
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
];
