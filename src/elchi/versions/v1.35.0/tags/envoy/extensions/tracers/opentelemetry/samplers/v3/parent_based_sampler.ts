import {OutType} from '@elchi/tags/tagsType';


export const ParentBasedSamplerConfig: OutType = { "ParentBasedSamplerConfig": [
  {
    "name": "wrapped_sampler",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "TypedExtensionConfig",
    "enums": null,
    "comment": "Specifies the sampler to be used by this sampler. The configured sampler will be used if the parent trace ID is not passed to Envoy\n\nrequired extension-category: envoy.tracers.opentelemetry.samplers",
    "notImp": false
  }
] };