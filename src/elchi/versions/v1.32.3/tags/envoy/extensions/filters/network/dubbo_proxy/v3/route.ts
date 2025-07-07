import {OutType} from '@/elchi/tags/tagsType';


export const RouteConfiguration: OutType = { "RouteConfiguration": [
  {
    "name": "name",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "string",
    "enums": null,
    "comment": "The name of the route configuration. Reserved for future use in asynchronous route discovery.",
    "notImp": false
  },
  {
    "name": "interface",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "string",
    "enums": null,
    "comment": "The interface name of the service. Wildcard interface are supported in the suffix or prefix form. e.g. ``*.methods.add`` will match ``com.dev.methods.add``, ``com.prod.methods.add``, etc. ``com.dev.methods.*`` will match ``com.dev.methods.add``, ``com.dev.methods.update``, etc. Special wildcard ``*`` matching any interface.\n\n:::note\n\nThe wildcard will not match the empty string. e.g. ``*.methods.add`` will match ``com.dev.methods.add`` but not ``.methods.add``.",
    "notImp": false
  },
  {
    "name": "group",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "string",
    "enums": null,
    "comment": "Which group does the interface belong to.",
    "notImp": false
  },
  {
    "name": "version",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "string",
    "enums": null,
    "comment": "The version number of the interface.",
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
  }
] };

export const RouteConfiguration_SingleFields = [
  "name",
  "interface",
  "group",
  "version"
];

export const MethodMatch: OutType = { "MethodMatch": [
  {
    "name": "name",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "StringMatcher",
    "enums": null,
    "comment": "The name of the method.",
    "notImp": false
  },
  {
    "name": "params_match",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "Map<number, MethodMatch_ParameterMatchSpecifier>",
    "enums": null,
    "comment": "Method parameter definition. The key is the parameter index, starting from 0. The value is the parameter matching type.",
    "notImp": false
  }
] };

export const RouteMatch: OutType = { "RouteMatch": [
  {
    "name": "method",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "MethodMatch",
    "enums": null,
    "comment": "Method level routing matching.",
    "notImp": false
  },
  {
    "name": "headers",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "HeaderMatcher[]",
    "enums": null,
    "comment": "Specifies a set of headers that the route should match on. The router will check the request’s headers against all the specified headers in the route config. A match will happen if all the headers in the route are present in the request with the same values (or based on presence if the value field is not in the config).",
    "notImp": false
  }
] };

export const RouteAction: OutType = { "RouteAction": [
  {
    "name": "cluster_specifier.cluster",
    "isUnion": true,
    "isDeprecated": false,
    "fieldType": "string",
    "enums": null,
    "comment": "Indicates the upstream cluster to which the request should be routed.",
    "notImp": false
  },
  {
    "name": "cluster_specifier.weighted_clusters",
    "isUnion": true,
    "isDeprecated": false,
    "fieldType": "WeightedCluster",
    "enums": null,
    "comment": "Multiple upstream clusters can be specified for a given route. The request is routed to one of the upstream clusters based on weights assigned to each cluster. Currently ClusterWeight only supports the name and weight fields.",
    "notImp": false
  },
  {
    "name": "metadata_match",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "Metadata",
    "enums": null,
    "comment": "Optional endpoint metadata match criteria used by the subset load balancer. Only endpoints in the upstream cluster with metadata matching what is set in this field will be considered for load balancing. The filter name should be specified as ``envoy.lb``.",
    "notImp": false
  }
] };

export const RouteAction_SingleFields = [
  "cluster_specifier.cluster"
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

export const MethodMatch_ParameterMatchSpecifier: OutType = { "MethodMatch_ParameterMatchSpecifier": [
  {
    "name": "parameter_match_specifier.exact_match",
    "isUnion": true,
    "isDeprecated": false,
    "fieldType": "string",
    "enums": null,
    "comment": "If specified, header match will be performed based on the value of the header.",
    "notImp": false
  },
  {
    "name": "parameter_match_specifier.range_match",
    "isUnion": true,
    "isDeprecated": false,
    "fieldType": "Int64Range",
    "enums": null,
    "comment": "If specified, header match will be performed based on range. The rule will match if the request header value is within this range. The entire request header value must represent an integer in base 10 notation: consisting of an optional plus or minus sign followed by a sequence of digits. The rule will not match if the header value does not represent an integer. Match will fail for empty values, floating point numbers or if only a subsequence of the header value is an integer.\n\nExamples:\n\n* For range [-10,0), route will match for header value -1, but not for 0, \"somestring\", 10.9, \"-1somestring\"",
    "notImp": false
  }
] };

export const MethodMatch_ParameterMatchSpecifier_SingleFields = [
  "parameter_match_specifier.exact_match"
];

export const MethodMatch_ParamsMatchEntry: OutType = { "MethodMatch_ParamsMatchEntry": [
  {
    "name": "key",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "number",
    "enums": null,
    "comment": "",
    "notImp": false
  },
  {
    "name": "value",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "MethodMatch_ParameterMatchSpecifier",
    "enums": null,
    "comment": "",
    "notImp": false
  }
] };

export const MethodMatch_ParamsMatchEntry_SingleFields = [
  "key"
];

export const MultipleRouteConfiguration: OutType = { "MultipleRouteConfiguration": [
  {
    "name": "name",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "string",
    "enums": null,
    "comment": "The name of the named route configurations. This name is used in asynchronous route discovery.",
    "notImp": false
  },
  {
    "name": "route_config",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "RouteConfiguration[]",
    "enums": null,
    "comment": "The route table of the dubbo connection manager.",
    "notImp": false
  }
] };

export const MultipleRouteConfiguration_SingleFields = [
  "name"
];