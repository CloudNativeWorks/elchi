import { TagsType } from "@/elchi/tags/tagsType";

export const modtag_least_request_lb_config = [
    {
        alias: 'lrlc',
        relativePath: 'envoy/config/cluster/v3/cluster',
        names: ['Cluster_LeastRequestLbConfig', 'Cluster_LeastRequestLbConfig_SingleFields'],
    },
];

export const modtag_us_least_request_lb_config: TagsType = {
    "Cluster_LeastRequestLbConfig": []
};
