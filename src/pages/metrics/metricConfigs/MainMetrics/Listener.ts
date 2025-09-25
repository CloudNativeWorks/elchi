import { ACTIVE_LISTENERS_METRICS_DESCRIPTION, LISTENER_DOWNSTREAM_CX_ACTIVE_DESCRIPTION, LISTENER_DOWNSTREAM_CX_DESTROY_TOTAL_DESCRIPTION, LISTENER_WORKER_DOWNSTREAM_CX_TOTAL_DESCRIPTION } from "../Descriptions/DescriptionListeners";
import { MetricConfig } from "../MetricConfig";

const defaultWindowSecs = {
    default: 15,
    ranges: [
        { threshold: 2 * 24 * 60 * 60, value: 300 }, // 2 days
        { threshold: 24 * 60 * 60, value: 60 },      // 1 day
        { threshold: 1 * 60 * 60, value: 30 },       // 1 hour
    ]
}

export const LISTENER_METRICS: MetricConfig[] = [
    {
        section: 'Listener Metrics',
        title: 'Active Listeners',
        metric: 'listener_manager_total_listeners_active',
        description: ACTIVE_LISTENERS_METRICS_DESCRIPTION,
        groups: ['all'],
        queryTemplate: `
            sum by (nodeid) (
                {__name__=~"%{name}_%{project}_%{metric}"}
            )
        `,
        span: 12,
        formatType: 'number',
        legendMapping: [{
            template: '%s',
            labelKeys: ['nodeid']
        }]
    },
    {
        section: 'Listener Metrics',
        title: 'Active Downstream Connections',
        metric: 'listener_downstream_cx_active',
        description: LISTENER_DOWNSTREAM_CX_ACTIVE_DESCRIPTION,
        groups: ['all'],
        queryTemplate: `
            sum by (envoy_listener_address) (
                {__name__=~"%{name}_%{project}_%{metric}"}
            )
        `,
        span: 12,
        formatType: 'number',
        legendMapping: [{
            template: '%s',
            labelKeys: ['envoy_listener_address']
        }]
    },
    {
        section: 'Listener Metrics',
        title: 'Destroyed Downstream Connections',
        metric: 'listener_downstream_cx_destroy_total',
        description: LISTENER_DOWNSTREAM_CX_DESTROY_TOTAL_DESCRIPTION,
        groups: ['all', 'errors'],
        queryTemplate: `
            sum by (envoy_listener_address) (
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
            labelKeys: ['envoy_listener_address']
        }]
    },
    {
        section: 'Listener Metrics',
        title: 'Worker Downstream Connections',
        metric: 'listener_worker_downstream_cx_total',
        description: LISTENER_WORKER_DOWNSTREAM_CX_TOTAL_DESCRIPTION,
        groups: ['all'],
        queryTemplate: `
            sum by (envoy_listener_address, envoy_worker_id) (
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
            labelKeys: ['envoy_listener_address', 'envoy_worker_id']
        }]
    },
];