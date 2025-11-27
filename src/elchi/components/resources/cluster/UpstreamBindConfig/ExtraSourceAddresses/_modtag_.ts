import { TagsType } from "@/elchi/tags/tagsType";

export const modtag_extra_source_addresses = [
    {
        alias: 'esa',
        relativePath: 'envoy/config/core/v3/address',
        names: ['ExtraSourceAddress', 'ExtraSourceAddress_SingleFields'],
    },
];

export const modtag_us_extra_source_addresses: TagsType = {
    "ExtraSourceAddress": [
        "socket_options"
    ]
};
