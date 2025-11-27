import { TagsType } from "@/elchi/tags/tagsType";

export const modtag_udp_listener_config = [
    {
        alias: 'ulc',
        relativePath: 'envoy/config/listener/v3/udp_listener_config',
        names: ['UdpListenerConfig'],
    },
];

export const modtag_us_udp_listener_config: TagsType = {
    "UdpListenerConfig": [
        "udp_packet_packet_writer_config"
    ]
};
