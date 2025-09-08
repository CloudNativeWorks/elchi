import {OutType} from '@elchi/tags/tagsType';


export const LoadStatsRequest: OutType = { "LoadStatsRequest": [
  {
    "name": "node",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "Node",
    "enums": null,
    "comment": "Node identifier for Envoy instance.",
    "notImp": false
  },
  {
    "name": "cluster_stats",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "ClusterStats[]",
    "enums": null,
    "comment": "A list of load stats to report.",
    "notImp": false
  }
] };

export const LoadStatsResponse: OutType = { "LoadStatsResponse": [
  {
    "name": "clusters",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "string[]",
    "enums": null,
    "comment": "Clusters to report stats for. Not populated if ``send_all_clusters`` is true.",
    "notImp": false
  },
  {
    "name": "send_all_clusters",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "boolean",
    "enums": null,
    "comment": "If true, the client should send all clusters it knows about. Only clients that advertise the \"envoy.lrs.supports_send_all_clusters\" capability in their `client_features` field will honor this field.",
    "notImp": false
  },
  {
    "name": "load_reporting_interval",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "Duration",
    "enums": null,
    "comment": "The minimum interval of time to collect stats over. This is only a minimum for two reasons:\n\n1. There may be some delay from when the timer fires until stats sampling occurs. 2. For clusters that were already feature in the previous ``LoadStatsResponse``, any traffic that is observed in between the corresponding previous ``LoadStatsRequest`` and this ``LoadStatsResponse`` will also be accumulated and billed to the cluster. This avoids a period of inobservability that might otherwise exists between the messages. New clusters are not subject to this consideration.",
    "notImp": false
  },
  {
    "name": "report_endpoint_granularity",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "boolean",
    "enums": null,
    "comment": "Set to ``true`` if the management server supports endpoint granularity report.",
    "notImp": false
  }
] };

export const LoadStatsResponse_SingleFields = [
  "clusters",
  "send_all_clusters",
  "load_reporting_interval",
  "report_endpoint_granularity"
];