import {OutType} from '@elchi/tags/tagsType';


export const FaultDelay: OutType = { "FaultDelay": [
  {
    "name": "fault_delay_secifier.fixed_delay",
    "isUnion": true,
    "isDeprecated": false,
    "fieldType": "Duration",
    "enums": null,
    "comment": "Add a fixed delay before forwarding the operation upstream. See https://developers.google.com/protocol-buffers/docs/proto3#json for the JSON/YAML Duration mapping. For HTTP/Mongo, the specified delay will be injected before a new request/operation. This is required if type is FIXED.",
    "notImp": false
  },
  {
    "name": "fault_delay_secifier.header_delay",
    "isUnion": true,
    "isDeprecated": false,
    "fieldType": "FaultDelay_HeaderDelay",
    "enums": null,
    "comment": "Fault delays are controlled via an HTTP header (if applicable).",
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
    "comment": "A fixed rate limit.",
    "notImp": false
  },
  {
    "name": "limit_type.header_limit",
    "isUnion": true,
    "isDeprecated": false,
    "fieldType": "FaultRateLimit_HeaderLimit",
    "enums": null,
    "comment": "Rate limits are controlled via an HTTP header (if applicable).",
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