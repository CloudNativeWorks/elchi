import {OutType} from '@elchi/tags/tagsType';


export const TraceIdRatioBasedSamplerConfig: OutType = { "TraceIdRatioBasedSamplerConfig": [
  {
    "name": "sampling_percentage",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "FractionalPercent",
    "enums": null,
    "comment": "If the given trace_id falls into a given percentage of all possible trace_id values, ShouldSample will return RECORD_AND_SAMPLE. required extension-category: envoy.tracers.opentelemetry.samplers",
    "notImp": false
  }
] };