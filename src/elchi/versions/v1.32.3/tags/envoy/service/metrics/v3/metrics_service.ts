import {OutType} from '@/elchi/tags/tagsType';


export const StreamMetricsMessage_Identifier: OutType = { "StreamMetricsMessage_Identifier": [
  {
    "name": "node",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "Node",
    "enums": null,
    "comment": "The node sending metrics over the stream.",
    "notImp": false
  }
] };

export const StreamMetricsMessage: OutType = { "StreamMetricsMessage": [
  {
    "name": "identifier",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "StreamMetricsMessage_Identifier",
    "enums": null,
    "comment": "Identifier data effectively is a structured metadata. As a performance optimization this will only be sent in the first message on the stream.",
    "notImp": false
  },
  {
    "name": "envoy_metrics",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "MetricFamily[]",
    "enums": null,
    "comment": "A list of metric entries",
    "notImp": false
  }
] };