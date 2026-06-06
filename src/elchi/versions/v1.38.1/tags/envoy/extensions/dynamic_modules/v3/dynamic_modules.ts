import {OutType} from '@elchi/tags/tagsType';


export const DynamicModuleConfig: OutType = { "DynamicModuleConfig": [
  {
    "name": "name",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "string",
    "enums": null,
    "comment": "The name of the dynamic module.\n\nThe client is expected to have some configuration indicating where to search for the module. In Envoy, the search path can be configured via the environment variable ``ENVOY_DYNAMIC_MODULES_SEARCH_PATH``. The actual search path is ``${ENVOY_DYNAMIC_MODULES_SEARCH_PATH}/lib${name}.so``. If not set, the current working directory is used as the search path. After Envoy fails to find the module in the search path, it will also try to find the module from a standard system library path (e.g., ``/usr/lib``) following the platform's default behavior for ``dlopen``.\n\nThis field is optional if the ``module`` field is set. When both ``name`` and ``module`` are specified, the ``module`` field takes precedence.\n\n:::note\nThere is some remaining work to make the search path configurable via command line options.",
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
    "comment": "If ``true``, the dynamic module is loaded with the ``RTLD_GLOBAL`` flag.\n\nThe dynamic module is loaded with the ``RTLD_LOCAL`` flag by default to avoid symbol conflicts when multiple modules are loaded. Set this to ``true`` to load the module with the ``RTLD_GLOBAL`` flag. This is useful for modules that need to share symbols with other dynamic libraries. For example, a module X may load another shared library Y that depends on some symbols defined in module X. In this case, module X must be loaded with the ``RTLD_GLOBAL`` flag so that the symbols defined in module X are visible to library Y.\n\n:::warning\nUse this option with caution as it may lead to symbol conflicts and undefined behavior if multiple modules define the same symbols and are loaded globally. \n:::\n\nDefaults to ``false``.",
    "notImp": false
  },
  {
    "name": "metrics_namespace",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "string",
    "enums": null,
    "comment": "The namespace prefix for metrics emitted by this dynamic module.\n\nThis allows users to customize the prefix used for all metrics created by the dynamic module. The prefix is prepended to all metric names. In prometheus output, metrics will appear with the standard ``envoy_`` prefix followed by this namespace. For example, if this is set to ``myapp``, a counter ``requests`` would appear as ``envoy_myapp_requests_total``.\n\nDefaults to ``dynamicmodulescustom``.",
    "notImp": false
  },
  {
    "name": "module",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "AsyncDataSource",
    "enums": null,
    "comment": "The dynamic module binary to load. Supports local file paths via ``local.filename`` and remote HTTP sources via ``remote``.\n\nWhen using ``remote``, the module is fetched asynchronously during listener initialization. If the fetch fails (network error, SHA256 mismatch, invalid binary, etc.), the filter is **not installed** and requests pass through unfiltered (fail-open).\n\nWhen both ``name`` and ``module`` are set, ``module`` takes precedence.",
    "notImp": false
  },
  {
    "name": "nack_on_cache_miss",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "boolean",
    "enums": null,
    "comment": "Controls how a cache miss for a remote module is handled.\n\nWhen true (NACK mode), a cache miss causes an immediate NACK of the xDS config update. A background fetch is started and the module will be available on the next config push if the fetch succeeds.\n\nWhen false (default, warming mode), the server blocks during initialization until the fetch completes or exhausts retries. This mode requires an init manager and is not available in ECDS or per-route configurations.\n\nWhen using ``module.remote`` with ECDS or per-route configurations, this must be set to ``true``.\n\nOnly applies when ``module.remote`` is set.\n\nDefaults to ``false``.",
    "notImp": false
  }
] };

export const DynamicModuleConfig_SingleFields = [
  "name",
  "do_not_close",
  "load_globally",
  "metrics_namespace",
  "nack_on_cache_miss"
];