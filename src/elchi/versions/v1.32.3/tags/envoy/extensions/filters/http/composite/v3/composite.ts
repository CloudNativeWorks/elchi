import {OutType} from '@/elchi/tags/tagsType';


export const DynamicConfig: OutType = { "DynamicConfig": [
  {
    "name": "name",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "string",
    "enums": null,
    "comment": "The name of the extension configuration. It also serves as a resource name in ExtensionConfigDS.",
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
    "comment": "Filter specific configuration which depends on the filter being instantiated. See the supported filters for further documentation. Only one of ``typed_config`` or ``dynamic_config`` can be set. extension-category: envoy.filters.http",
    "notImp": false
  },
  {
    "name": "dynamic_config",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "DynamicConfig",
    "enums": null,
    "comment": "Dynamic configuration of filter obtained via extension configuration discovery service. Only one of ``typed_config`` or ``dynamic_config`` can be set.",
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