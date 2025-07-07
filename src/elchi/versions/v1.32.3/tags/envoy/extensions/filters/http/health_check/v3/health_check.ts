import {OutType} from '@/elchi/tags/tagsType';


export const HealthCheck: OutType = { "HealthCheck": [
  {
    "name": "pass_through_mode",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "boolean",
    "enums": null,
    "comment": "Specifies whether the filter operates in pass through mode or not.",
    "notImp": false
  },
  {
    "name": "cache_time",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "Duration",
    "enums": null,
    "comment": "If operating in pass through mode, the amount of time in milliseconds that the filter should cache the upstream response.",
    "notImp": false
  },
  {
    "name": "cluster_min_healthy_percentages",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "Map<string, Percent>",
    "enums": null,
    "comment": "If operating in non-pass-through mode, specifies a set of upstream cluster names and the minimum percentage of servers in each of those clusters that must be healthy or degraded in order for the filter to return a 200.\n\n:::note\n\nThis value is interpreted as an integer by truncating, so 12.50% will be calculated as if it were 12%.",
    "notImp": false
  },
  {
    "name": "headers",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "HeaderMatcher[]",
    "enums": null,
    "comment": "Specifies a set of health check request headers to match on. The health check filter will check a request’s headers against all the specified headers. To specify the health check endpoint, set the ``:path`` header to match on.",
    "notImp": false
  }
] };

export const HealthCheck_SingleFields = [
  "pass_through_mode",
  "cache_time"
];

export const HealthCheck_ClusterMinHealthyPercentagesEntry: OutType = { "HealthCheck_ClusterMinHealthyPercentagesEntry": [
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
    "fieldType": "Percent",
    "enums": null,
    "comment": "",
    "notImp": false
  }
] };

export const HealthCheck_ClusterMinHealthyPercentagesEntry_SingleFields = [
  "key"
];