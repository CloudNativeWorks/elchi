export const modtag_retry_policy = [
    {
        alias: 'rp',
        relativePath: 'envoy/config/core/v3/base',
        names: ['RetryPolicy', 'RetryPolicy_SingleFields', 'RetryPolicy_RetryBackOff', 'RetryPolicy_RetryBackOff_SingleFields'],
    },
];

export const modtag_retry_backoff = [
    {
        alias: 'rbo',
        relativePath: 'envoy/config/route/v3/route_components',
        names: ['RetryPolicy_RetryBackOff', 'RetryPolicy_RetryBackOff_SingleFields'],
    },
];
