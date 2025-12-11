import { TagsType } from "@/elchi/tags/tagsType"

export const modtag_redis_proxy = [
    {
        alias: 'rp',
        relativePath: 'envoy/extensions/filters/network/redis_proxy/v3/redis_proxy',
        names: ['RedisProxy', 'RedisProxy_SingleFields'],
    },
    {
        alias: 'reap',
        relativePath: 'envoy/extensions/filters/network/redis_proxy/v3/redis_proxy',
        names: ['RedisExternalAuthProvider', 'RedisExternalAuthProvider_SingleFields'],
    },
];

export const modtag_us_redisproxy: TagsType = {
    'RedisProxy': ["downstream_auth_password"]
}
