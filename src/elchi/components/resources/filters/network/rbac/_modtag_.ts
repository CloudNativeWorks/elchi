import { TagsType } from "@/elchi/tags/tagsType";

export const modtag_rbac = [
    {
        alias: 'r',
        relativePath: 'envoy/extensions/filters/network/rbac/v3/rbac',
        names: ['RBAC', 'RBAC_SingleFields'],
    },
];

export const modtag_r_rbac: TagsType = {
    "rbac": [
        "matcher",
        "shadow_matcher",
    ]
}