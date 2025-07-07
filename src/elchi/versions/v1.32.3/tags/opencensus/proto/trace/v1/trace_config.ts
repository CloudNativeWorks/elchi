import {OutType} from '@/elchi/tags/tagsType';


export const TraceConfig: OutType = { "TraceConfig": [
  {
    "name": "sampler.probability_sampler",
    "isUnion": true,
    "isDeprecated": false,
    "fieldType": "ProbabilitySampler",
    "enums": null,
    "comment": "The global default sampler used to make decisions on span sampling.",
    "notImp": false
  },
  {
    "name": "sampler.constant_sampler",
    "isUnion": true,
    "isDeprecated": false,
    "fieldType": "ConstantSampler",
    "enums": null,
    "comment": "The global default sampler used to make decisions on span sampling.",
    "notImp": false
  },
  {
    "name": "sampler.rate_limiting_sampler",
    "isUnion": true,
    "isDeprecated": false,
    "fieldType": "RateLimitingSampler",
    "enums": null,
    "comment": "The global default sampler used to make decisions on span sampling.",
    "notImp": false
  },
  {
    "name": "max_number_of_attributes",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "number",
    "enums": null,
    "comment": "The global default max number of attributes per span.",
    "notImp": false
  },
  {
    "name": "max_number_of_annotations",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "number",
    "enums": null,
    "comment": "The global default max number of annotation events per span.",
    "notImp": false
  },
  {
    "name": "max_number_of_message_events",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "number",
    "enums": null,
    "comment": "The global default max number of message events per span.",
    "notImp": false
  },
  {
    "name": "max_number_of_links",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "number",
    "enums": null,
    "comment": "The global default max number of link entries per span.",
    "notImp": false
  }
] };

export const TraceConfig_SingleFields = [
  "max_number_of_attributes",
  "max_number_of_annotations",
  "max_number_of_message_events",
  "max_number_of_links"
];

export const ProbabilitySampler: OutType = { "ProbabilitySampler": [
  {
    "name": "samplingProbability",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "number",
    "enums": null,
    "comment": "The desired probability of sampling. Must be within [0.0, 1.0].",
    "notImp": false
  }
] };

export const ProbabilitySampler_SingleFields = [
  "samplingProbability"
];

export const ConstantSampler: OutType = { "ConstantSampler": [
  {
    "name": "decision",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "ConstantSampler_ConstantDecision",
    "enums": [
      "ALWAYS_OFF",
      "ALWAYS_ON",
      "ALWAYS_PARENT"
    ],
    "comment": "",
    "notImp": false
  }
] };

export const ConstantSampler_SingleFields = [
  "decision"
];

export const RateLimitingSampler: OutType = { "RateLimitingSampler": [
  {
    "name": "qps",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "number",
    "enums": null,
    "comment": "Rate per second.",
    "notImp": false
  }
] };

export const RateLimitingSampler_SingleFields = [
  "qps"
];