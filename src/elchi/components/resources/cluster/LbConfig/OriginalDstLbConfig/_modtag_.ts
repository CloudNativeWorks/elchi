import { TagsType } from "@/elchi/tags/tagsType";

export const modtag_original_dst_lb_config = [
    {
        alias: 'odlc',
        relativePath: 'envoy/config/cluster/v3/cluster',
        names: ['Cluster_OriginalDstLbConfig', 'Cluster_OriginalDstLbConfig_SingleFields'],
    },
];

export const modtag_us_original_dst_lb_config: TagsType = {
    "Cluster_OriginalDstLbConfig": ["metadata_key"]
};
