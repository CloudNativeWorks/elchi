import {OutType} from '@elchi/tags/tagsType';


export const DynamicModuleConfig: OutType = { "DynamicModuleConfig": [
  {
    "name": "name",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "string",
    "enums": null,
    "comment": "The name of the dynamic module. The client is expected to have some configuration indicating where to search for the module. In Envoy, the search path can only be configured via the environment variable ``ENVOY_DYNAMIC_MODULES_SEARCH_PATH``. The actual search path is ``${ENVOY_DYNAMIC_MODULES_SEARCH_PATH}/lib${name}.so``. TODO: make the search path configurable via command line options.",
    "notImp": false
  },
  {
    "name": "do_not_close",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "boolean",
    "enums": null,
    "comment": "Set true to prevent the module from being unloaded with dlclose. This is useful for modules that have global state that should not be unloaded. A module is closed when no more references to it exist in the process. For example, no HTTP filters are using the module (e.g. after configuration update).",
    "notImp": false
  }
] };

export const DynamicModuleConfig_SingleFields = [
  "name",
  "do_not_close"
];