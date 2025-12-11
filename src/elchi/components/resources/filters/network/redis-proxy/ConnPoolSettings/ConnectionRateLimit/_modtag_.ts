import { TagsType } from "@/elchi/tags/tagsType"

export const modtag_connection_rate_limit = [
    {
        alias: 'crl',
        relativePath: 'envoy/extensions/filters/network/redis_proxy/v3/redis_proxy',
        names: ['RedisProxy_ConnectionRateLimit', 'RedisProxy_ConnectionRateLimit_SingleFields'],
    },
];

export const modtag_us_connectionratelimit: TagsType = {
    'RedisProxy_ConnectionRateLimit': []
}
