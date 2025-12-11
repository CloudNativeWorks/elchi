export const modtag_retry_policy = [
    {
        alias: 'rp',
        relativePath: 'envoy/config/route/v3/route_components',
        names: ['RetryPolicy', 'RetryPolicy_SingleFields', 'RetryPolicy_RetryBackOff', 'RetryPolicy_RetryBackOff_SingleFields', 'RetryPolicy_RateLimitedRetryBackOff'],
    },
];

export const tags_reset_header = [
    {
        alias: 'RetryPolicy_ResetHeader',
        relativePath: 'envoy/config/route/v3/route_components',
        tagName: 'RetryPolicy_ResetHeader',
    },
];

export const modtag_retry_backoff = [
    {
        alias: 'rbo',
        relativePath: 'envoy/config/route/v3/route_components',
        names: ['RetryPolicy_RetryBackOff', 'RetryPolicy_RetryBackOff_SingleFields'],
    },
];

export const modtag_rate_limited_retry_backoff = [
    {
        alias: 'rlrbo',
        relativePath: 'envoy/config/route/v3/route_components',
        names: ['RetryPolicy_RateLimitedRetryBackOff'],
    },
];

export const modtag_reset_header = [
    {
        alias: 'rh',
        relativePath: 'envoy/config/route/v3/route_components',
        names: ['RetryPolicy_ResetHeader'],
    },
];