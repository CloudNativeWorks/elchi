import {OutType} from '@elchi/tags/tagsType';


export const FaultDelay: OutType = { "FaultDelay": [
  {
    "name": "fault_delay_secifier.fixed_delay",
    "isUnion": true,
    "isDeprecated": false,
    "fieldType": "Duration",
    "enums": null,
    "comment": "Delay specification is used to inject latency into the HTTP/Mongo operation. [#next-free-field: 6]",
    "notImp": false
  },
  {
    "name": "fault_delay_secifier.header_delay",
    "isUnion": true,
    "isDeprecated": false,
    "fieldType": "FaultDelay_HeaderDelay",
    "enums": null,
    "comment": "Delay specification is used to inject latency into the HTTP/Mongo operation. [#next-free-field: 6]",
    "notImp": false
  },
  {
    "name": "percentage",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "FractionalPercent",
    "enums": null,
    "comment": "The percentage of operations/connections/requests on which the delay will be injected.",
    "notImp": false
  }
] };

export const FaultDelay_SingleFields = [
  "fault_delay_secifier.fixed_delay"
];

export const FaultRateLimit: OutType = { "FaultRateLimit": [
  {
    "name": "limit_type.fixed_limit",
    "isUnion": true,
    "isDeprecated": false,
    "fieldType": "FaultRateLimit_FixedLimit",
    "enums": null,
    "comment": "Describes a rate limit to be applied.",
    "notImp": false
  },
  {
    "name": "limit_type.header_limit",
    "isUnion": true,
    "isDeprecated": false,
    "fieldType": "FaultRateLimit_HeaderLimit",
    "enums": null,
    "comment": "Describes a rate limit to be applied.",
    "notImp": false
  },
  {
    "name": "percentage",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "FractionalPercent",
    "enums": null,
    "comment": "The percentage of operations/connections/requests on which the rate limit will be injected.",
    "notImp": false
  }
] };

export const FaultRateLimit_FixedLimit: OutType = { "FaultRateLimit_FixedLimit": [
  {
    "name": "limit_kbps",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "number",
    "enums": null,
    "comment": "The limit supplied in KiB/s.",
    "notImp": false
  }
] };

export const FaultRateLimit_FixedLimit_SingleFields = [
  "limit_kbps"
];