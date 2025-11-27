import { TagsType } from "@/elchi/tags/tagsType";

export const modtag_udp_proxy = [
    {
        alias: 'up',
        relativePath: 'envoy/extensions/filters/udp/udp_proxy/v3/udp_proxy',
        names: ['UdpProxyConfig', 'UdpProxyConfig_SingleFields'],
    },
];

export const modtag_us_udp_proxy: TagsType = {
    "UdpProxyConfig": [
        "route_specifier.matcher",
        "session_filters",
        "tunneling_config"
    ]
};

export const modtag_r_udp_proxy: string[] = ["cluster", "stat_prefix"];
