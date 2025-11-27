import { TagsType } from "@/elchi/tags/tagsType";

export const modtag_upstream_bind_config = [
    {
        alias: 'bc',
        relativePath: 'envoy/config/core/v3/address',
        names: ['BindConfig', 'BindConfig_SingleFields'],
    },
];

export const modtag_us_upstream_bind_config: TagsType = {
    "BindConfig": [
        "additional_source_addresses",
        "local_address_selector"
    ]
};
