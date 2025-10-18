import {OutType} from '@elchi/tags/tagsType';


export const DynamicOtConfig: OutType = { "DynamicOtConfig": [
  {
    "name": "library",
    "isUnion": false,
    "isDeprecated": true,
    "fieldType": "string",
    "enums": null,
    "comment": "Dynamic library implementing the `OpenTracing API <https://github.com/opentracing/opentracing-cpp>`_.",
    "notImp": false
  },
  {
    "name": "config",
    "isUnion": false,
    "isDeprecated": true,
    "fieldType": "{ [key: string]: any; }",
    "enums": null,
    "comment": "The configuration to use when creating a tracer from the given dynamic library.",
    "notImp": false
  }
] };