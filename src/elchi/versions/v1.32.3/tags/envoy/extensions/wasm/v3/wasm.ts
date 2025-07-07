import {OutType} from '@/elchi/tags/tagsType';


export const CapabilityRestrictionConfig: OutType = { "CapabilityRestrictionConfig": [
  {
    "name": "allowed_capabilities",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "Map<string, SanitizationConfig>",
    "enums": null,
    "comment": "The Proxy-Wasm capabilities which will be allowed. Capabilities are mapped by name. The ``SanitizationConfig`` which each capability maps to is currently unimplemented and ignored, and so should be left empty.\n\nThe capability names are given in the `Proxy-Wasm ABI <https://github.com/proxy-wasm/spec/tree/master/abi-versions/vNEXT>`_. Additionally, the following WASI capabilities from `this list <https://github.com/WebAssembly/WASI/blob/master/phases/snapshot/docs.md#modules>`_ are implemented and can be allowed: ``fd_write``, ``fd_read``, ``fd_seek``, ``fd_close``, ``fd_fdstat_get``, ``environ_get``, ``environ_sizes_get``, ``args_get``, ``args_sizes_get``, ``proc_exit``, ``clock_time_get``, ``random_get``.",
    "notImp": false
  }
] };

export const CapabilityRestrictionConfig_AllowedCapabilitiesEntry: OutType = { "CapabilityRestrictionConfig_AllowedCapabilitiesEntry": [
  {
    "name": "key",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "string",
    "enums": null,
    "comment": "",
    "notImp": false
  },
  {
    "name": "value",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "SanitizationConfig",
    "enums": null,
    "comment": "",
    "notImp": false
  }
] };

export const CapabilityRestrictionConfig_AllowedCapabilitiesEntry_SingleFields = [
  "key"
];

export const EnvironmentVariables: OutType = { "EnvironmentVariables": [
  {
    "name": "host_env_keys",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "string[]",
    "enums": null,
    "comment": "The keys of *Envoy's* environment variables exposed to this VM. In other words, if a key exists in Envoy's environment variables, then that key-value pair will be injected. Note that if a key does not exist, it will be ignored.",
    "notImp": false
  },
  {
    "name": "key_values",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "Map<string, string>",
    "enums": null,
    "comment": "Explicitly given key-value pairs to be injected to this VM in the form of \"KEY=VALUE\".",
    "notImp": false
  }
] };

export const EnvironmentVariables_SingleFields = [
  "host_env_keys"
];

export const VmConfig: OutType = { "VmConfig": [
  {
    "name": "vm_id",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "string",
    "enums": null,
    "comment": "An ID which will be used along with a hash of the wasm code (or the name of the registered Null VM plugin) to determine which VM will be used for the plugin. All plugins which use the same ``vm_id`` and code will use the same VM. May be left blank. Sharing a VM between plugins can reduce memory utilization and make sharing of data easier which may have security implications.",
    "notImp": false
  },
  {
    "name": "runtime",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "string",
    "enums": null,
    "comment": "The Wasm runtime type, defaults to the first available Wasm engine used at Envoy build-time. The priority to search for the available engine is: v8 -> wasmtime -> wamr. Available Wasm runtime types are registered as extensions. The following runtimes are included in Envoy code base:\n\n.. _extension_envoy.wasm.runtime.null:\n\n**envoy.wasm.runtime.null**: Null sandbox, the Wasm module must be compiled and linked into the Envoy binary. The registered name is given in the ``code`` field as ``inline_string``.\n\n.. _extension_envoy.wasm.runtime.v8:\n\n**envoy.wasm.runtime.v8**: `V8 <https://v8.dev/>`_-based WebAssembly runtime.\n\n.. _extension_envoy.wasm.runtime.wamr:\n\n**envoy.wasm.runtime.wamr**: `WAMR <https://github.com/bytecodealliance/wasm-micro-runtime/>`_-based WebAssembly runtime. This runtime is not enabled in the official build.\n\n.. _extension_envoy.wasm.runtime.wasmtime:\n\n**envoy.wasm.runtime.wasmtime**: `Wasmtime <https://wasmtime.dev/>`_-based WebAssembly runtime. This runtime is not enabled in the official build.\n\nextension-category: envoy.wasm.runtime",
    "notImp": false
  },
  {
    "name": "code",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "AsyncDataSource",
    "enums": null,
    "comment": "The Wasm code that Envoy will execute.",
    "notImp": false
  },
  {
    "name": "configuration",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "Any",
    "enums": null,
    "comment": "The Wasm configuration used in initialization of a new VM (proxy_on_start). ``google.protobuf.Struct`` is serialized as JSON before passing it to the plugin. ``google.protobuf.BytesValue`` and ``google.protobuf.StringValue`` are passed directly without the wrapper.",
    "notImp": false
  },
  {
    "name": "allow_precompiled",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "boolean",
    "enums": null,
    "comment": "Allow the wasm file to include pre-compiled code on VMs which support it. Warning: this should only be enable for trusted sources as the precompiled code is not verified.",
    "notImp": false
  },
  {
    "name": "nack_on_code_cache_miss",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "boolean",
    "enums": null,
    "comment": "If true and the code needs to be remotely fetched and it is not in the cache then NACK the configuration update and do a background fetch to fill the cache, otherwise fetch the code asynchronously and enter warming state.",
    "notImp": false
  },
  {
    "name": "environment_variables",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "EnvironmentVariables",
    "enums": null,
    "comment": "Specifies environment variables to be injected to this VM which will be available through WASI's ``environ_get`` and ``environ_get_sizes`` system calls. Note that these functions are generally called implicitly by your language's standard library. Therefore, you do not need to call them directly. You can access environment variables in the same way you would on native platforms. Warning: Envoy rejects the configuration if there's conflict of key space.",
    "notImp": false
  }
] };

export const VmConfig_SingleFields = [
  "vm_id",
  "runtime",
  "allow_precompiled",
  "nack_on_code_cache_miss"
];

export const EnvironmentVariables_KeyValuesEntry: OutType = { "EnvironmentVariables_KeyValuesEntry": [
  {
    "name": "key",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "string",
    "enums": null,
    "comment": "",
    "notImp": false
  },
  {
    "name": "value",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "string",
    "enums": null,
    "comment": "",
    "notImp": false
  }
] };

export const EnvironmentVariables_KeyValuesEntry_SingleFields = [
  "key",
  "value"
];

export const PluginConfig: OutType = { "PluginConfig": [
  {
    "name": "name",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "string",
    "enums": null,
    "comment": "A unique name for a filters/services in a VM for use in identifying the filter/service if multiple filters/services are handled by the same ``vm_id`` and ``root_id`` and for logging/debugging.",
    "notImp": false
  },
  {
    "name": "root_id",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "string",
    "enums": null,
    "comment": "A unique ID for a set of filters/services in a VM which will share a RootContext and Contexts if applicable (e.g. an Wasm HttpFilter and an Wasm AccessLog). If left blank, all filters/services with a blank root_id with the same ``vm_id`` will share Context(s).",
    "notImp": false
  },
  {
    "name": "vm.vm_config",
    "isUnion": true,
    "isDeprecated": false,
    "fieldType": "VmConfig",
    "enums": null,
    "comment": "TODO: add referential VM configurations.",
    "notImp": false
  },
  {
    "name": "configuration",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "Any",
    "enums": null,
    "comment": "Filter/service configuration used to configure or reconfigure a plugin (``proxy_on_configure``). ``google.protobuf.Struct`` is serialized as JSON before passing it to the plugin. ``google.protobuf.BytesValue`` and ``google.protobuf.StringValue`` are passed directly without the wrapper.",
    "notImp": false
  },
  {
    "name": "fail_open",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "boolean",
    "enums": null,
    "comment": "If there is a fatal error on the VM (e.g. exception, abort(), on_start or on_configure return false), then all plugins associated with the VM will either fail closed (by default), e.g. by returning an HTTP 503 error, or fail open (if 'fail_open' is set to true) by bypassing the filter. Note: when on_start or on_configure return false during xDS updates the xDS configuration will be rejected and when on_start or on_configuration return false on initial startup the proxy will not start.",
    "notImp": false
  },
  {
    "name": "capability_restriction_config",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "CapabilityRestrictionConfig",
    "enums": null,
    "comment": "Configuration for restricting Proxy-Wasm capabilities available to modules.",
    "notImp": false
  }
] };

export const PluginConfig_SingleFields = [
  "name",
  "root_id",
  "fail_open"
];

export const WasmService: OutType = { "WasmService": [
  {
    "name": "config",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "PluginConfig",
    "enums": null,
    "comment": "General plugin configuration.",
    "notImp": false
  },
  {
    "name": "singleton",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "boolean",
    "enums": null,
    "comment": "If true, create a single VM rather than creating one VM per worker. Such a singleton can not be used with filters.",
    "notImp": false
  }
] };

export const WasmService_SingleFields = [
  "singleton"
];