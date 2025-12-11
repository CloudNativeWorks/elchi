import { TagsType } from "@/elchi/tags/tagsType";

export const modtag_hash_policy = [
    {
        alias: 'hp',
        relativePath: 'envoy/extensions/filters/udp/udp_proxy/v3/udp_proxy',
        names: ['UdpProxyConfig_HashPolicy', 'UdpProxyConfig_HashPolicy_SingleFields'],
    },
];

export const modtag_us_hash_policy: TagsType = {
    "UdpProxyConfig_HashPolicy": []
};
