import {OutType} from '@elchi/tags/tagsType';


export const DynatraceSamplerConfig: OutType = { "DynatraceSamplerConfig": [
  {
    "name": "tenant",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "string",
    "enums": null,
    "comment": "The Dynatrace tenant.\n\nThe value can be obtained from the Envoy deployment page in Dynatrace.",
    "notImp": false
  },
  {
    "name": "cluster_id",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "number",
    "enums": null,
    "comment": "The id of the Dynatrace cluster id.\n\nThe value can be obtained from the Envoy deployment page in Dynatrace.",
    "notImp": false
  },
  {
    "name": "http_service",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "HttpService",
    "enums": null,
    "comment": "The HTTP service to fetch the sampler configuration from the Dynatrace API (root spans per minute). For example:\n\n```yaml\n\n   http_service:\n     http_uri:\n       cluster: dynatrace\n       uri: <tenant>.dev.dynatracelabs.com/api/v2/samplingConfiguration\n       timeout: 10s\n     request_headers_to_add:\n     - header:\n         key : \"authorization\"\n         value: \"Api-Token dt...\"",
    "notImp": false
  },
  {
    "name": "root_spans_per_minute",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "number",
    "enums": null,
    "comment": "Default number of root spans per minute, used when the value can't be obtained from the Dynatrace API.\n\nA default value of ``1000`` is used when:\n\n- ``root_spans_per_minute`` is unset - ``root_spans_per_minute`` is set to 0",
    "notImp": false
  }
] };

export const DynatraceSamplerConfig_SingleFields = [
  "tenant",
  "cluster_id",
  "root_spans_per_minute"
];