import { TagsType } from "@/elchi/tags/tagsType";

export const modtag_slow_start_config = [
    {
        alias: 'ssc',
        relativePath: 'envoy/config/cluster/v3/cluster',
        names: ['Cluster_SlowStartConfig', 'Cluster_SlowStartConfig_SingleFields'],
    },
];

export const modtag_us_slow_start_config: TagsType = {
    "Cluster_SlowStartConfig": []
};
