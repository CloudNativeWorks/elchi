import { TagsType } from "@/elchi/tags/tagsType";

export const modtag_downstream_socket_config = [
    {
        alias: 'dsc',
        relativePath: 'envoy/config/core/v3/udp_socket_config',
        names: ['UdpSocketConfig', 'UdpSocketConfig_SingleFields'],
    },
];

export const modtag_us_downstream_socket_config: TagsType = {
    "UdpSocketConfig": []
};
