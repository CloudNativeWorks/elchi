import { TagsType } from "@/elchi/tags/tagsType";

export const modtag_upstream_socket_config = [
    {
        alias: 'usc',
        relativePath: 'envoy/config/core/v3/udp_socket_config',
        names: ['UdpSocketConfig', 'UdpSocketConfig_SingleFields'],
    },
];

export const modtag_us_upstream_socket_config: TagsType = {
    "UdpSocketConfig": []
};
