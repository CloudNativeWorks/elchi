import { TagsType } from "@/elchi/tags/tagsType";

export const modtag_preconnect_policy = [
    {
        alias: 'pcp',
        relativePath: 'envoy/config/cluster/v3/cluster',
        names: ['Cluster_PreconnectPolicy', 'Cluster_PreconnectPolicy_SingleFields'],
    },
];

export const modtag_us_preconnect_policy: TagsType = {
    "Cluster_PreconnectPolicy": []
};
