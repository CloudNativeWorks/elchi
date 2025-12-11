export const modtag_prefix_routes = [
    {
        alias: 'pr',
        relativePath: 'envoy/extensions/filters/network/redis_proxy/v3/redis_proxy',
        names: ['RedisProxy_PrefixRoutes', 'RedisProxy_PrefixRoutes_SingleFields'],
    },
    {
        alias: 'prr',
        relativePath: 'envoy/extensions/filters/network/redis_proxy/v3/redis_proxy',
        names: ['RedisProxy_PrefixRoutes_Route', 'RedisProxy_PrefixRoutes_Route_SingleFields'],
    },
    {
        alias: 'prrmp',
        relativePath: 'envoy/extensions/filters/network/redis_proxy/v3/redis_proxy',
        names: ['RedisProxy_PrefixRoutes_Route_RequestMirrorPolicy', 'RedisProxy_PrefixRoutes_Route_RequestMirrorPolicy_SingleFields'],
    },
    {
        alias: 'prrrc',
        relativePath: 'envoy/extensions/filters/network/redis_proxy/v3/redis_proxy',
        names: ['RedisProxy_PrefixRoutes_Route_ReadCommandPolicy', 'RedisProxy_PrefixRoutes_Route_ReadCommandPolicy_SingleFields'],
    },
];
