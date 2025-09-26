import { TagsType } from "@/elchi/tags/tagsType";

export const modtag_listener = [
    {
        alias: 'l',
        relativePath: 'envoy/config/listener/v3/listener',
        names: ['Listener', 'Listener_SingleFields'],
    },
];

export const modtag_listener_filter = [
    {
        alias: 'lf',
        relativePath: 'envoy/config/listener/v3/listener_components',
        names: ['ListenerFilter', 'ListenerFilter_SingleFields'],
    },
];


export const modtag_us_listener: TagsType = {
    "listener": [
        'additional_addresses',
        'filter_chain_matcher',
        'default_filter_chain',
        'metadata',
        'socket_options',
        'udp_listener_config',
        'api_listener',
        'connection_balance_config',
        'internal_listener',
        'deprecated_v1',
        'reuse_port',
        'listener_specifier',
        'listener_specifier.internal_listener'
    ],
    "address": [
        "address.pipe",
        "address.envoy_internal_address"
    ],
    "filters_chains": [
        "use_proxy_proto",
        "metadata",
        "on_demand_configuration",
        "filter_chain_match"
    ],
    "socket_address": [
        "named_port",
        "resolver_name",
        "ipv4_compat"
    ],
}

export const modtag_r_listener: TagsType = {
    "listener": [
        'name'
    ]
}