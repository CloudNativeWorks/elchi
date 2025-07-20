import {OutType} from '@elchi/tags/tagsType';


export const UuidRequestIdConfig: OutType = { "UuidRequestIdConfig": [
  {
    "name": "pack_trace_reason",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "boolean",
    "enums": null,
    "comment": "Whether the implementation alters the UUID to contain the trace sampling decision as per the ``UuidRequestIdConfig`` message documentation. This defaults to true. If disabled no modification to the UUID will be performed. It is important to note that if disabled, stable sampling of traces, access logs, etc. will no longer work and only random sampling will be possible.",
    "notImp": false
  },
  {
    "name": "use_request_id_for_trace_sampling",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "boolean",
    "enums": null,
    "comment": "Set whether to use `x-request-id` for sampling or not. This defaults to true. See the `context propagation` overview for more information.",
    "notImp": false
  }
] };

export const UuidRequestIdConfig_SingleFields = [
  "pack_trace_reason",
  "use_request_id_for_trace_sampling"
];