import { TagsType } from "@/elchi/tags/tagsType";

export const modtag_round_robin_lb_config = [
    {
        alias: 'rrlc',
        relativePath: 'envoy/config/cluster/v3/cluster',
        names: ['Cluster_RoundRobinLbConfig', 'Cluster_RoundRobinLbConfig_SingleFields'],
    },
];

export const modtag_us_round_robin_lb_config: TagsType = {
    "Cluster_RoundRobinLbConfig": []
};
