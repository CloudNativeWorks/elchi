import { TagsType } from "@/elchi/tags/tagsType"

export const modtag_conn_pool_settings = [
    {
        alias: 'cps',
        relativePath: 'envoy/extensions/filters/network/redis_proxy/v3/redis_proxy',
        names: ['RedisProxy_ConnPoolSettings', 'RedisProxy_ConnPoolSettings_SingleFields'],
    },
];

export const modtag_us_connpoolsettings: TagsType = {
    'RedisProxy_ConnPoolSettings': []
}
