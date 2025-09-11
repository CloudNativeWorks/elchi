import { MAIN_THREAD_MISS_METRICS_DESCRIPTION, SERVER_MAIN_THREAD_MISS_METRICS_DESCRIPTION, SERVER_WORKER_MISS_METRICS_DESCRIPTION, WORKERS_WATCHDOG_MISS_METRICS_DESCRIPTION } from "../Descriptions/DescriptionOthers";
import { MetricConfig } from "../MetricConfig";

const defaultWindowSecs = {
    default: 15,
    ranges: [
        { threshold: 2 * 24 * 60 * 60, value: 300 }, // 2 days
        { threshold: 24 * 60 * 60, value: 60 },      // 1 day
        { threshold: 1 * 60 * 60, value: 30 },       // 1 hour
    ]
}

export const OTHERS_METRICS: MetricConfig[] = [
    {
        section: 'Others Metrics',
        title: 'Server Worker Watchdog Miss',
        metric: 'server_worker_watchdog_(miss_total|mega_miss_total)',
        description: SERVER_WORKER_MISS_METRICS_DESCRIPTION,
        groups: ['all'],
        queryTemplate: `
            sum by (envoy_worker_id, state) (
                ceil(
                    rate(
                        label_replace(
                            label_replace(
                                label_replace(
                                    {__name__=~"%{name}_%{project}_%{metric}", envoy_cluster_name!="elchi-control-plane"},
                                    "state", "$1", "__name__", ".*%{metric}"
                                ),
                                "state", "miss", "state", "^miss_total$"
                            ),
                            "state", "mega_miss", "state", "^mega_miss_total$"
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
            labelKeys: ['envoy_worker_id', 'state']
        }]
    },
    {
        section: 'Others Metrics',
        title: 'Server Main Thread Watchdog Miss',
        metric: 'server_main_thread_watchdog_(miss_total|mega_miss_total)',
        description: SERVER_MAIN_THREAD_MISS_METRICS_DESCRIPTION,
        groups: ['all'],
        queryTemplate: `
            sum by (state) (
                ceil(
                    rate(
                        label_replace(
                            label_replace(
                                label_replace(
                                    {__name__=~"%{name}_%{project}_%{metric}", envoy_cluster_name!="elchi-control-plane"},
                                    "state", "$1", "__name__", ".*%{metric}"
                                ),
                                "state", "miss", "state", "^miss_total$"
                            ),
                            "state", "mega_miss", "state", "^mega_miss_total$"
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
        section: 'Others Metrics',
        title: 'Main Thread Watchdog Miss',
        metric: 'main_thread_watchdog_(miss_total|mega_miss_total)',
        description: MAIN_THREAD_MISS_METRICS_DESCRIPTION,
        groups: ['all'],
        queryTemplate: `
            sum by (state) (
                ceil(
                    rate(
                        label_replace(
                            label_replace(
                                label_replace(
                                    {__name__=~"%{name}_%{project}_%{metric}", envoy_cluster_name!="elchi-control-plane"},
                                    "state", "$1", "__name__", ".*%{metric}"
                                ),
                                "state", "miss", "state", "^miss_total$"
                            ),
                            "state", "mega_miss", "state", "^mega_miss_total$"
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
        section: 'Others Metrics',
        title: 'Workers Watchdog Miss',
        metric: 'workers_watchdog_(miss_total|mega_miss_total)',
        description: WORKERS_WATCHDOG_MISS_METRICS_DESCRIPTION,
        groups: ['all'],
        queryTemplate: `
            sum by (state) (
                ceil(
                    rate(
                        label_replace(
                            label_replace(
                                label_replace(
                                    {__name__=~"%{name}_%{project}_%{metric}", envoy_cluster_name!="elchi-control-plane"},
                                    "state", "$1", "__name__", ".*%{metric}"
                                ),
                                "state", "miss", "state", "^miss_total$"
                            ),
                            "state", "mega_miss", "state", "^mega_miss_total$"
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