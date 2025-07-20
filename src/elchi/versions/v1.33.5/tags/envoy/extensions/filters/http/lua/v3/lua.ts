import {OutType} from '@elchi/tags/tagsType';


export const Lua: OutType = { "Lua": [
  {
    "name": "inline_code",
    "isUnion": false,
    "isDeprecated": true,
    "fieldType": "string",
    "enums": null,
    "comment": "The Lua code that Envoy will execute. This can be a very small script that further loads code from disk if desired. Note that if JSON configuration is used, the code must be properly escaped. YAML configuration may be easier to read since YAML supports multi-line strings so complex scripts can be easily expressed inline in the configuration.\n\nThis field is deprecated. Please use `default_source_code`. Only one of `inline_code` or `default_source_code` can be set for the Lua filter.",
    "notImp": false
  },
  {
    "name": "source_codes",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "Map<string, DataSource>",
    "enums": null,
    "comment": "Map of named Lua source codes that can be referenced in `LuaPerRoute`. The Lua source codes can be loaded from inline string or local files.\n\nExample:\n\n```yaml\n\n  source_codes:\n    hello.lua:\n      inline_string: |\n        function envoy_on_response(response_handle)\n          -- Do something.\n        end\n    world.lua:\n      filename: /etc/lua/world.lua",
    "notImp": false
  },
  {
    "name": "default_source_code",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "DataSource",
    "enums": null,
    "comment": "The default Lua code that Envoy will execute. If no per route config is provided for the request, this Lua code will be applied.",
    "notImp": false
  },
  {
    "name": "stat_prefix",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "string",
    "enums": null,
    "comment": "Optional additional prefix to use when emitting statistics. By default metrics are emitted in *.lua.* namespace. If multiple lua filters are configured in a filter chain, the stats from each filter instance can be emitted using custom stat prefix to distinguish emitted statistics. For example:\n\n```yaml\n\n  http_filters:\n    - name: envoy.filters.http.lua\n      typed_config:\n        \"@type\": type.googleapis.com/envoy.extensions.filters.http.lua.v3.Lua\n        stat_prefix: foo_script # This emits lua.foo_script.errors etc.\n    - name: envoy.filters.http.lua\n      typed_config:\n        \"@type\": type.googleapis.com/envoy.extensions.filters.http.lua.v3.Lua\n        stat_prefix: bar_script # This emits lua.bar_script.errors etc.",
    "notImp": false
  }
] };

export const Lua_SingleFields = [
  "stat_prefix"
];

export const Lua_SourceCodesEntry: OutType = { "Lua_SourceCodesEntry": [
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
    "fieldType": "DataSource",
    "enums": null,
    "comment": "",
    "notImp": false
  }
] };

export const Lua_SourceCodesEntry_SingleFields = [
  "key"
];

export const LuaPerRoute: OutType = { "LuaPerRoute": [
  {
    "name": "override.disabled",
    "isUnion": true,
    "isDeprecated": false,
    "fieldType": "boolean",
    "enums": null,
    "comment": "Disable the Lua filter for this particular vhost or route. If disabled is specified in multiple per-filter-configs, the most specific one will be used.",
    "notImp": false
  },
  {
    "name": "override.name",
    "isUnion": true,
    "isDeprecated": false,
    "fieldType": "string",
    "enums": null,
    "comment": "A name of a Lua source code stored in `Lua.source_codes`.",
    "notImp": false
  },
  {
    "name": "override.source_code",
    "isUnion": true,
    "isDeprecated": false,
    "fieldType": "DataSource",
    "enums": null,
    "comment": "A configured per-route Lua source code that can be served by RDS or provided inline.",
    "notImp": false
  }
] };

export const LuaPerRoute_SingleFields = [
  "override.disabled",
  "override.name"
];