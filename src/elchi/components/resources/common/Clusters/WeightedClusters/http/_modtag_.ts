import { TagsType } from "@/elchi/tags/tagsType";

export const modtag_weighted_clusters = [
    {
        alias: 'wc',
        relativePath: 'envoy/config/route/v3/route_components',
        names: ['WeightedCluster', 'WeightedCluster_SingleFields'],
    },
];

export const modtag_weighted_clusters_cluster_weight = [
    {
        alias: 'wccw',
        relativePath: 'envoy/config/route/v3/route_components',
        names: ['WeightedCluster_ClusterWeight', 'WeightedCluster_ClusterWeight_SingleFields'],
    },
];

export const modtag_us_wc: TagsType = {
    "WeightedClusters": [
        "metadata_match",
        "typed_per_filter_config",
    ]
}