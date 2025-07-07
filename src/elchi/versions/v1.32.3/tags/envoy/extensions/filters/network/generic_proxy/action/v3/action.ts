import {OutType} from '@/elchi/tags/tagsType';


export const RouteAction: OutType = { "RouteAction": [
  {
    "name": "name",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "string",
    "enums": null,
    "comment": "The name of the route action. This should be unique across all route actions.",
    "notImp": false
  },
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
    "comment": "[#not-implemented-hide:] Multiple upstream clusters can be specified for a given route. The request is routed to one of the upstream clusters based on weights assigned to each cluster. Currently ClusterWeight only supports the name and weight fields.",
    "notImp": true
  },
  {
    "name": "metadata",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "Metadata",
    "enums": null,
    "comment": "Route metadata.",
    "notImp": false
  },
  {
    "name": "per_filter_config",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "Map<string, Any>",
    "enums": null,
    "comment": "Route level config for L7 generic filters. The key should be the related `extension name` in the `generic filters`.",
    "notImp": false
  },
  {
    "name": "timeout",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "Duration",
    "enums": null,
    "comment": "Specifies the upstream timeout for the route. If not specified, the default is 15s. This spans between the point at which the entire downstream request (i.e. end-of-stream) has been processed and when the upstream response has been completely processed. A value of 0 will disable the route's timeout.",
    "notImp": false
  },
  {
    "name": "retry_policy",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "RetryPolicy",
    "enums": null,
    "comment": "Specifies the retry policy for the route. If not specified, then no retries will be performed.\n\n:::note\nOnly simplest retry policy is supported and only ``num_retries`` field is used for generic proxy. The default value for ``num_retries`` is 1 means that the request will be tried once and no additional retries will be performed.",
    "notImp": false
  }
] };

export const RouteAction_SingleFields = [
  "name",
  "cluster_specifier.cluster",
  "timeout"
];

export const RouteAction_PerFilterConfigEntry: OutType = { "RouteAction_PerFilterConfigEntry": [
  {
    "name": "key",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "string",
    "enums": null,
    "comment": "",
    "notImp": false
  },
  {
    "name": "value",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "Any",
    "enums": null,
    "comment": "",
    "notImp": false
  }
] };

export const RouteAction_PerFilterConfigEntry_SingleFields = [
  "key"
];