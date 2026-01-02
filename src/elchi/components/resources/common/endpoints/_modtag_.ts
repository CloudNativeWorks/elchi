export const modtag_locality_lb_endpoints = [
    {
        alias: 'LocalityLbEndpoints',
        relativePath: 'envoy/config/endpoint/v3/endpoint_components',
        names: ['LocalityLbEndpoints', 'LocalityLbEndpoints_SingleFields'],
    },
];

export const modtag_lb_endpoints = [
    {
        alias: 'lb',
        relativePath: 'envoy/config/endpoint/v3/endpoint_components',
        names: ['LbEndpoint', 'LbEndpoint_SingleFields'],
    },
];

export const modtag_endpoint = [
    {
        alias: 'e',
        relativePath: 'envoy/config/endpoint/v3/endpoint_components',
        names: ['Endpoint', 'Endpoint_SingleFields'],
    },
];

export const modtag_endpoint_hc = [
    {
        alias: 'eh',
        relativePath: 'envoy/config/endpoint/v3/endpoint_components',
        names: ['Endpoint_HealthCheckConfig', 'Endpoint_HealthCheckConfig_SingleFields'],
    },
];
