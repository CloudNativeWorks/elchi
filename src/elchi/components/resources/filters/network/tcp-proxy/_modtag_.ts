import { TagsType } from "@/elchi/tags/tagsType";

export const modtag_tcp_proxy = [
    {
        alias: 'tp',
        relativePath: 'envoy/extensions/filters/network/tcp_proxy/v3/tcp_proxy',
        names: ['TcpProxy', 'TcpProxy_SingleFields'],
    },
];

export const modtag_hash_policy = [
    {
        alias: 'hp',
        relativePath: 'envoy/type/v3/hash_policy',
        names: ['HashPolicy'],
    },
];

export const modtag_access_log_options = [
    {
        alias: 'alo',
        relativePath: 'envoy/extensions/filters/network/tcp_proxy/v3/tcp_proxy',
        names: ['TcpProxy_TcpAccessLogOptions', 'TcpProxy_TcpAccessLogOptions_SingleFields'],
    },
];

export const modtag_tunneling_config = [
    {
        alias: 'ttc',
        relativePath: 'envoy/extensions/filters/network/tcp_proxy/v3/tcp_proxy',
        names: ['TcpProxy_TunnelingConfig', 'TcpProxy_TunnelingConfig_SingleFields'],
    },
];

export const modtag_us_tcpproxy: TagsType = {
    'TcpProxy': [
        'on_demand',
        'metadata_match',
        'access_log_flush_interval',
        'downstream_idle_timeout', // deprecated
        'upstream_idle_timeout', // deprecated
        'access_log_flush_interval', // deprecated
        'flush_access_log_on_connected', // deprecated
    ]
}

