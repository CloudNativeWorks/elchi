import {OutType} from '@elchi/tags/tagsType';


export const DynamicModuleConfig: OutType = { "DynamicModuleConfig": [
  {
    "name": "name",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "string",
    "enums": null,
    "comment": "The name of the dynamic module.\n\nThe client is expected to have some configuration indicating where to search for the module. In Envoy, the search path can only be configured via the environment variable ``ENVOY_DYNAMIC_MODULES_SEARCH_PATH``. The actual search path is ``${ENVOY_DYNAMIC_MODULES_SEARCH_PATH}/lib${name}.so``.\n\n:::note\nThere is some remaining work to make the search path configurable via command line options.",
    "notImp": false
  },
  {
    "name": "do_not_close",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "boolean",
    "enums": null,
    "comment": "If true, prevents the module from being unloaded with ``dlclose``.\n\nThis is useful for modules that have global state that should not be unloaded. A module is closed when no more references to it exist in the process. For example, no HTTP filters are using the module (e.g. after configuration update).\n\nDefaults to ``false``.",
    "notImp": false
  },
  {
    "name": "load_globally",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "boolean",
    "enums": null,
    "comment": "If true, the dynamic module is loaded with the ``RTLD_GLOBAL`` flag.\n\nThe dynamic module is loaded with the ``RTLD_LOCAL`` flag by default to avoid symbol conflicts when multiple modules are loaded. Set this to ``true`` to load the module with the ``RTLD_GLOBAL`` flag. This is useful for modules that need to share symbols with other dynamic libraries. For example, a module X may load another shared library Y that depends on some symbols defined in module X. In this case, module X must be loaded with the ``RTLD_GLOBAL`` flag so that the symbols defined in module X are visible to library Y.\n\n:::warning\nUse this option with caution as it may lead to symbol conflicts and undefined behavior if multiple modules define the same symbols and are loaded globally. \n:::\n\nDefaults to ``false``.",
    "notImp": false
  }
] };

export const DynamicModuleConfig_SingleFields = [
  "name",
  "do_not_close",
  "load_globally"
];