import {OutType} from '@/elchi/tags/tagsType';


export const Tracing_Http: OutType = { "Tracing_Http": [
  {
    "name": "name",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "string",
    "enums": null,
    "comment": "The name of the HTTP trace driver to instantiate. The name must match a supported HTTP trace driver. See the `extensions listed in typed_config below` for the default list of the HTTP trace driver.",
    "notImp": false
  },
  {
    "name": "config_type.typed_config",
    "isUnion": true,
    "isDeprecated": false,
    "fieldType": "Any",
    "enums": null,
    "comment": "Trace driver specific configuration which must be set according to the driver being instantiated. extension-category: envoy.tracers",
    "notImp": false
  }
] };

export const Tracing_Http_SingleFields = [
  "name"
];

export const Tracing: OutType = { "Tracing": [
  {
    "name": "http",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "Tracing_Http",
    "enums": null,
    "comment": "Provides configuration for the HTTP tracer.",
    "notImp": false
  }
] };