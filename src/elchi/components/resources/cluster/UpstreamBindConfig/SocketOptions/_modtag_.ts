import { TagsType } from "@/elchi/tags/tagsType";

export const modtag_socket_options = [
    {
        alias: 'so',
        relativePath: 'envoy/config/core/v3/socket_option',
        names: ['SocketOption', 'SocketOption_SingleFields'],
    },
];

export const modtag_us_socket_options: TagsType = {
    "SocketOption": [
        "socket_type",
        "type",
        "value.buf_value"
    ]
};
