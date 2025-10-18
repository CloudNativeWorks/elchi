import {OutType} from '@elchi/tags/tagsType';


export const RouteConfiguration: OutType = { "RouteConfiguration": [
  {
    "name": "name",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "string",
    "enums": null,
    "comment": "The name of the route configuration. This name is used in asynchronous route discovery. For example, it might match `route_config_name` in `envoy_v3_api_msg_extensions.filters.network.thrift_proxy.v3.Trds`.",
    "notImp": false
  },
  {
    "name": "routes",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "Route[]",
    "enums": null,
    "comment": "The list of routes that will be matched, in order, against incoming requests. The first route that matches will be used.",
    "notImp": false
  },
  {
    "name": "validate_clusters",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "boolean",
    "enums": null,
    "comment": "An optional boolean that specifies whether the clusters that the route table refers to will be validated by the cluster manager. If set to true and a route refers to a non-existent cluster, the route table will not load. If set to false and a route refers to a non-existent cluster, the route table will load and the router filter will return a INTERNAL_ERROR if the route is selected at runtime. This setting defaults to true if the route table is statically defined via the `route_config` option. This setting default to false if the route table is loaded dynamically via the `trds` option. Users may wish to override the default behavior in certain cases (for example when using CDS with a static route table).",
    "notImp": false
  }
] };

export const RouteConfiguration_SingleFields = [
  "name",
  "validate_clusters"
];

export const RouteMatch: OutType = { "RouteMatch": [
  {
    "name": "match_specifier.method_name",
    "isUnion": true,
    "isDeprecated": false,
    "fieldType": "string",
    "enums": null,
    "comment": "If specified, the route must exactly match the request method name. As a special case, an empty string matches any request method name.",
    "notImp": false
  },
  {
    "name": "match_specifier.service_name",
    "isUnion": true,
    "isDeprecated": false,
    "fieldType": "string",
    "enums": null,
    "comment": "If specified, the route must have the service name as the request method name prefix. As a special case, an empty string matches any service name. Only relevant when service multiplexing.",
    "notImp": false
  },
  {
    "name": "invert",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "boolean",
    "enums": null,
    "comment": "Inverts whatever matching is done in the `method_name` or `service_name` fields. Cannot be combined with wildcard matching as that would result in routes never being matched.\n\n:::note\n\nThis does not invert matching done as part of the `headers field` field. To invert header matching, see `invert_match`.",
    "notImp": false
  },
  {
    "name": "headers",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "HeaderMatcher[]",
    "enums": null,
    "comment": "Specifies a set of headers that the route should match on. The router will check the request’s headers against all the specified headers in the route config. A match will happen if all the headers in the route are present in the request with the same values (or based on presence if the value field is not in the config). Note that this only applies for Thrift transports and/or protocols that support headers.",
    "notImp": false
  }
] };

export const RouteMatch_SingleFields = [
  "match_specifier.method_name",
  "match_specifier.service_name",
  "invert"
];

export const RouteAction: OutType = { "RouteAction": [
  {
    "name": "cluster_specifier.cluster",
    "isUnion": true,
    "isDeprecated": false,
    "fieldType": "string",
    "enums": null,
    "comment": "Indicates a single upstream cluster to which the request should be routed to.",
    "notImp": false
  },
  {
    "name": "cluster_specifier.weighted_clusters",
    "isUnion": true,
    "isDeprecated": false,
    "fieldType": "WeightedCluster",
    "enums": null,
    "comment": "Multiple upstream clusters can be specified for a given route. The request is routed to one of the upstream clusters based on weights assigned to each cluster.",
    "notImp": false
  },
  {
    "name": "cluster_specifier.cluster_header",
    "isUnion": true,
    "isDeprecated": false,
    "fieldType": "string",
    "enums": null,
    "comment": "Envoy will determine the cluster to route to by reading the value of the Thrift header named by cluster_header from the request headers. If the header is not found or the referenced cluster does not exist Envoy will respond with an unknown method exception or an internal error exception, respectively.",
    "notImp": false
  },
  {
    "name": "metadata_match",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "Metadata",
    "enums": null,
    "comment": "Optional endpoint metadata match criteria used by the subset load balancer. Only endpoints in the upstream cluster with metadata matching what is set in this field will be considered. Note that this will be merged with what's provided in `WeightedCluster.metadata_match`, with values there taking precedence. Keys and values should be provided under the \"envoy.lb\" metadata key.",
    "notImp": false
  },
  {
    "name": "rate_limits",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "RateLimit[]",
    "enums": null,
    "comment": "Specifies a set of rate limit configurations that could be applied to the route. N.B. Thrift service or method name matching can be achieved by specifying a RequestHeaders action with the header name \":method-name\".",
    "notImp": false
  },
  {
    "name": "strip_service_name",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "boolean",
    "enums": null,
    "comment": "Strip the service prefix from the method name, if there's a prefix. For example, the method call Service:method would end up being just method.",
    "notImp": false
  },
  {
    "name": "request_mirror_policies",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "RouteAction_RequestMirrorPolicy[]",
    "enums": null,
    "comment": "Indicates that the route has request mirroring policies.",
    "notImp": false
  }
] };

export const RouteAction_SingleFields = [
  "cluster_specifier.cluster",
  "cluster_specifier.cluster_header",
  "strip_service_name"
];

export const Route: OutType = { "Route": [
  {
    "name": "match",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "RouteMatch",
    "enums": null,
    "comment": "Route matching parameters.",
    "notImp": false
  },
  {
    "name": "route",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "RouteAction",
    "enums": null,
    "comment": "Route request to some upstream cluster.",
    "notImp": false
  }
] };

export const RouteAction_RequestMirrorPolicy: OutType = { "RouteAction_RequestMirrorPolicy": [
  {
    "name": "cluster",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "string",
    "enums": null,
    "comment": "Specifies the cluster that requests will be mirrored to. The cluster must exist in the cluster manager configuration when the route configuration is loaded. If it disappears at runtime, the shadow request will silently be ignored.",
    "notImp": false
  },
  {
    "name": "runtime_fraction",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "RuntimeFractionalPercent",
    "enums": null,
    "comment": "If not specified, all requests to the target cluster will be mirrored.\n\nFor some fraction N/D, a random number in the range [0,D) is selected. If the number is <= the value of the numerator N, or if the key is not present, the default value, the request will be mirrored.",
    "notImp": false
  }
] };

export const RouteAction_RequestMirrorPolicy_SingleFields = [
  "cluster"
];

export const WeightedCluster: OutType = { "WeightedCluster": [
  {
    "name": "clusters",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "WeightedCluster_ClusterWeight[]",
    "enums": null,
    "comment": "Specifies one or more upstream clusters associated with the route.",
    "notImp": false
  }
] };

export const WeightedCluster_ClusterWeight: OutType = { "WeightedCluster_ClusterWeight": [
  {
    "name": "name",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "string",
    "enums": null,
    "comment": "Name of the upstream cluster.",
    "notImp": false
  },
  {
    "name": "weight",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "number",
    "enums": null,
    "comment": "When a request matches the route, the choice of an upstream cluster is determined by its weight. The sum of weights across all entries in the clusters array determines the total weight.",
    "notImp": false
  },
  {
    "name": "metadata_match",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "Metadata",
    "enums": null,
    "comment": "Optional endpoint metadata match criteria used by the subset load balancer. Only endpoints in the upstream cluster with metadata matching what is set in this field, combined with what's provided in `RouteAction's metadata_match`, will be considered. Values here will take precedence. Keys and values should be provided under the \"envoy.lb\" metadata key.",
    "notImp": false
  }
] };

export const WeightedCluster_ClusterWeight_SingleFields = [
  "name",
  "weight"
];