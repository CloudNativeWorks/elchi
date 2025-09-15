import {OutType} from '@elchi/tags/tagsType';


export const ClusterAction: OutType = { "ClusterAction": [
  {
    "name": "cluster",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "string",
    "enums": null,
    "comment": "Indicates the upstream cluster to which the request should be routed to.",
    "notImp": false
  }
] };

export const ClusterAction_SingleFields = [
  "cluster"
];

export const MatcherClusterSpecifier: OutType = { "MatcherClusterSpecifier": [
  {
    "name": "cluster_matcher",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "Matcher",
    "enums": null,
    "comment": "The matcher for cluster selection after the route has been selected. This is used when the route has multiple clusters (like multiple clusters for different users) and the matcher is used to select the cluster to use for the request.\n\nThe match tree to use for grouping incoming requests into buckets.\n\nExample:\n\n```yaml\n  :type-name: xds.type.matcher.v3.Matcher\n\n  matcher_list:\n    matchers:\n    - predicate:\n        single_predicate:\n          input:\n            typed_config:\n              '@type': type.googleapis.com/envoy.type.matcher.v3.HttpRequestHeaderMatchInput\n              header_name: env\n          value_match:\n            exact: staging\n      on_match:\n        action:\n          typed_config:\n            '@type': type.googleapis.com/envoy.extensions.router.cluster_specifiers.matcher.v3.ClusterAction\n            cluster: \"staging-cluster\"\n```\n - predicate: single_predicate: input: typed_config: '@type': type.googleapis.com/envoy.type.matcher.v3.HttpRequestHeaderMatchInput header_name: env value_match: exact: prod on_match: action: typed_config: '@type': type.googleapis.com/envoy.extensions.router.cluster_specifiers.matcher.v3.ClusterAction cluster: \"prod-cluster\"\n\n  # Catch-all with a default cluster. on_no_match: action: typed_config: '@type': type.googleapis.com/envoy.extensions.router.cluster_specifiers.matcher.v3.ClusterAction cluster: \"default-cluster\"",
    "notImp": false
  }
] };