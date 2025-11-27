import { TagsType } from "@/elchi/tags/tagsType";

export const modtag_tcp_keepalive = [
    {
        alias: 'tk',
        relativePath: 'envoy/config/core/v3/address',
        names: ['TcpKeepalive', 'TcpKeepalive_SingleFields'],
    },
];

export const modtag_us_tcp_keepalive: TagsType = {
    "TcpKeepalive": []
};
