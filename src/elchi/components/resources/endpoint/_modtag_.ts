import { TagsType } from "@/elchi/tags/tagsType";

export const modtag_cluster_load_assignment = [
    {
        alias: 'cla',
        relativePath: 'envoy/config/endpoint/v3/endpoint',
        names: ['ClusterLoadAssignment'],
    },
];


export const modtag_us_cla: TagsType = {
    "ClusterLoadAssignment": [
        "named_endpoints",
    ],
    "policy": [
        "drop_overloads",
    ],
    "endpoints": [
        "lb_config.load_balancer_endpoints",
        "lb_config.leds_cluster_locality_config",
        "proximity",
        "metadata"
    ],
    "lb_endpoints": [
        "endpoint_name",
        "metadata"
    ],
    "endpoint": [
        "hostname",
        "additional_addresses"
    ],
    "address": [
        "pipe",
        "envoy_internal_address"
    ],
    "socket_address": [
        "named_port",
        "resolver_name",
        "ipv4_compat"
    ],
}

export const modtag_r_cla: TagsType = {
    "ClusterLoadAssignment": [
        "cluster_name",
    ],
}