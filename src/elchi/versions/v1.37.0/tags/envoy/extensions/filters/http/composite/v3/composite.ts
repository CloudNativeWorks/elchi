import {OutType} from '@elchi/tags/tagsType';


export const Composite: OutType = { "Composite": [
  {
    "name": "named_filter_chains",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "Map<string, FilterChainConfiguration>",
    "enums": null,
    "comment": "Named filter chain definitions that can be referenced from `ExecuteFilterAction.filter_chain_name`. The filter chains are compiled at configuration time and can be referenced by name. This is useful when the same filter chain needs to be applied across many routes, as it avoids duplicating the filter chain configuration.",
    "notImp": false
  }
] };

export const FilterChainConfiguration: OutType = { "FilterChainConfiguration": [
  {
    "name": "typed_config",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "TypedExtensionConfig[]",
    "enums": null,
    "comment": "",
    "notImp": false
  }
] };

export const Composite_NamedFilterChainsEntry: OutType = { "Composite_NamedFilterChainsEntry": [
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
    "fieldType": "FilterChainConfiguration",
    "enums": null,
    "comment": "",
    "notImp": false
  }
] };

export const Composite_NamedFilterChainsEntry_SingleFields = [
  "key"
];

export const DynamicConfig: OutType = { "DynamicConfig": [
  {
    "name": "name",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "string",
    "enums": null,
    "comment": "The name of the extension configuration. It also serves as a resource name in ExtensionConfigDS. The resource type in the ``DiscoveryRequest`` will be `TypedExtensionConfig`.",
    "notImp": false
  },
  {
    "name": "config_discovery",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "ExtensionConfigSource",
    "enums": null,
    "comment": "Configuration source specifier for an extension configuration discovery service. In case of a failure and without the default configuration, 500(Internal Server Error) will be returned.",
    "notImp": false
  }
] };

export const DynamicConfig_SingleFields = [
  "name"
];

export const ExecuteFilterAction: OutType = { "ExecuteFilterAction": [
  {
    "name": "typed_config",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "TypedExtensionConfig",
    "enums": null,
    "comment": "Filter specific configuration which depends on the filter being instantiated. See the supported filters for further documentation. Only one of ``typed_config``, ``dynamic_config``, ``filter_chain``, or ``filter_chain_name`` can be set. extension-category: envoy.filters.http",
    "notImp": false
  },
  {
    "name": "dynamic_config",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "DynamicConfig",
    "enums": null,
    "comment": "Dynamic configuration of filter obtained via extension configuration discovery service. Only one of ``typed_config``, ``dynamic_config``, ``filter_chain``, or ``filter_chain_name`` can be set.",
    "notImp": false
  },
  {
    "name": "filter_chain",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "FilterChainConfiguration",
    "enums": null,
    "comment": "An inlined list of filter configurations. The specified filters will be executed in order. Only one of ``typed_config``, ``dynamic_config``, ``filter_chain``, or ``filter_chain_name`` can be set.",
    "notImp": false
  },
  {
    "name": "filter_chain_name",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "string",
    "enums": null,
    "comment": "The name of a filter chain defined in `Composite.named_filter_chains`. At runtime, if the named filter chain is not found in the Composite filter's configuration, no filter will be applied for this match (the action is silently skipped). Only one of ``typed_config``, ``dynamic_config``, ``filter_chain``, or ``filter_chain_name`` can be set.",
    "notImp": false
  },
  {
    "name": "sample_percent",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "RuntimeFractionalPercent",
    "enums": null,
    "comment": "Probability of the action execution. If not specified, this is 100%. This allows sampling behavior for the configured actions. For example, if `default_value` under the ``sample_percent`` is configured with 30%, a dice roll with that probability is done. The underline action will only be executed if the dice roll returns positive. Otherwise, the action is skipped.",
    "notImp": false
  }
] };

export const ExecuteFilterAction_SingleFields = [
  "filter_chain_name"
];