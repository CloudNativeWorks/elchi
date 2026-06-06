import {OutType} from '@elchi/tags/tagsType';


export const Filter: OutType = { "Filter": [
  {
    "name": "name",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "string",
    "enums": null,
    "comment": "The name of the filter configuration.",
    "notImp": false
  },
  {
    "name": "typed_config",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "Any",
    "enums": null,
    "comment": "Filter specific configuration which depends on the filter being instantiated. See the supported filters for further documentation. Note that Envoy's `downstream network filters` are not valid upstream network filters. Only one of typed_config or config_discovery can be used.",
    "notImp": false
  },
  {
    "name": "config_discovery",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "ExtensionConfigSource",
    "enums": null,
    "comment": "Configuration source specifier for an extension configuration discovery service. In case of a failure and without the default configuration, the listener closes the connections. Only one of typed_config or config_discovery can be used.",
    "notImp": false
  }
] };

export const Filter_SingleFields = [
  "name"
];