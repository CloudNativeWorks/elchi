import { TagsType } from "@/elchi/tags/tagsType";

export const modtag_route = [
    {
        alias: 'rc',
        relativePath: 'envoy/config/route/v3/route',
        names: ['RouteConfiguration', 'RouteConfiguration_SingleFields'],
    },

];

export const modtag_us_route: TagsType = {
    "RouteConfiguration": [
        "cluster_specifier_plugins",
        "metadata"
    ],
    "WeightedClusters": [
        "metadata_match",
        "typed_per_filter_config",
    ]
}

export const modtag_r_route: TagsType = {
    "RouteConfiguration": [
        'name',
    ],
}