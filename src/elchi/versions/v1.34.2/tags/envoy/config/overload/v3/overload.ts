import {OutType} from '@elchi/tags/tagsType';


export const ResourceMonitor: OutType = { "ResourceMonitor": [
  {
    "name": "name",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "string",
    "enums": null,
    "comment": "The name of the resource monitor to instantiate. Must match a registered resource monitor type. See the `extensions listed in typed_config below` for the default list of available resource monitor.",
    "notImp": false
  },
  {
    "name": "config_type.typed_config",
    "isUnion": true,
    "isDeprecated": false,
    "fieldType": "Any",
    "enums": null,
    "comment": "Configuration for the resource monitor being instantiated. extension-category: envoy.resource_monitors",
    "notImp": false
  }
] };

export const ResourceMonitor_SingleFields = [
  "name"
];

export const ThresholdTrigger: OutType = { "ThresholdTrigger": [
  {
    "name": "value",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "number",
    "enums": null,
    "comment": "If the resource pressure is greater than or equal to this value, the trigger will enter saturation.",
    "notImp": false
  }
] };

export const ThresholdTrigger_SingleFields = [
  "value"
];

export const ScaledTrigger: OutType = { "ScaledTrigger": [
  {
    "name": "scaling_threshold",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "number",
    "enums": null,
    "comment": "If the resource pressure is greater than this value, the trigger will be in the `scaling` state with value ``(pressure - scaling_threshold) / (saturation_threshold - scaling_threshold)``.",
    "notImp": false
  },
  {
    "name": "saturation_threshold",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "number",
    "enums": null,
    "comment": "If the resource pressure is greater than this value, the trigger will enter saturation.",
    "notImp": false
  }
] };

export const ScaledTrigger_SingleFields = [
  "scaling_threshold",
  "saturation_threshold"
];

export const Trigger: OutType = { "Trigger": [
  {
    "name": "name",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "string",
    "enums": null,
    "comment": "The name of the resource this is a trigger for.",
    "notImp": false
  },
  {
    "name": "trigger_oneof.threshold",
    "isUnion": true,
    "isDeprecated": false,
    "fieldType": "ThresholdTrigger",
    "enums": null,
    "comment": "",
    "notImp": false
  },
  {
    "name": "trigger_oneof.scaled",
    "isUnion": true,
    "isDeprecated": false,
    "fieldType": "ScaledTrigger",
    "enums": null,
    "comment": "",
    "notImp": false
  }
] };

export const Trigger_SingleFields = [
  "name"
];

export const ScaleTimersOverloadActionConfig: OutType = { "ScaleTimersOverloadActionConfig": [
  {
    "name": "timer_scale_factors",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "ScaleTimersOverloadActionConfig_ScaleTimer[]",
    "enums": null,
    "comment": "A set of timer scaling rules to be applied.",
    "notImp": false
  }
] };

export const ScaleTimersOverloadActionConfig_ScaleTimer: OutType = { "ScaleTimersOverloadActionConfig_ScaleTimer": [
  {
    "name": "timer",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "ScaleTimersOverloadActionConfig_TimerType",
    "enums": [
      "UNSPECIFIED",
      "HTTP_DOWNSTREAM_CONNECTION_IDLE",
      "HTTP_DOWNSTREAM_STREAM_IDLE",
      "TRANSPORT_SOCKET_CONNECT",
      "HTTP_DOWNSTREAM_CONNECTION_MAX"
    ],
    "comment": "The type of timer this minimum applies to.",
    "notImp": false
  },
  {
    "name": "overload_adjust.min_timeout",
    "isUnion": true,
    "isDeprecated": false,
    "fieldType": "Duration",
    "enums": null,
    "comment": "Sets the minimum duration as an absolute value.",
    "notImp": false
  },
  {
    "name": "overload_adjust.min_scale",
    "isUnion": true,
    "isDeprecated": false,
    "fieldType": "Percent",
    "enums": null,
    "comment": "Sets the minimum duration as a percentage of the maximum value.",
    "notImp": false
  }
] };

export const ScaleTimersOverloadActionConfig_ScaleTimer_SingleFields = [
  "timer",
  "overload_adjust.min_timeout"
];

export const OverloadAction: OutType = { "OverloadAction": [
  {
    "name": "name",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "string",
    "enums": null,
    "comment": "The name of the overload action. This is just a well-known string that listeners can use for registering callbacks. Custom overload actions should be named using reverse DNS to ensure uniqueness.",
    "notImp": false
  },
  {
    "name": "triggers",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "Trigger[]",
    "enums": null,
    "comment": "A set of triggers for this action. The state of the action is the maximum state of all triggers, which can be scalar values between 0 and 1 or saturated. Listeners are notified when the overload action changes state. An overload manager action can only have one trigger for a given resource e.g. `Trigger.name` must be unique in this list.",
    "notImp": false
  },
  {
    "name": "typed_config",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "Any",
    "enums": null,
    "comment": "Configuration for the action being instantiated.",
    "notImp": false
  }
] };

export const OverloadAction_SingleFields = [
  "name"
];

export const LoadShedPoint: OutType = { "LoadShedPoint": [
  {
    "name": "name",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "string",
    "enums": null,
    "comment": "This is just a well-known string for the LoadShedPoint. Deployment specific LoadShedPoints e.g. within a custom extension should be prefixed by the company / deployment name to avoid colliding with any open source LoadShedPoints.",
    "notImp": false
  },
  {
    "name": "triggers",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "Trigger[]",
    "enums": null,
    "comment": "A set of triggers for this LoadShedPoint. The LoadShedPoint will use the the maximum state of all triggers, which can be scalar values between 0 and 1 or saturated. A LoadShedPoint can only have one trigger for a given resource e.g. `Trigger.name` must be unique in this list.",
    "notImp": false
  }
] };

export const LoadShedPoint_SingleFields = [
  "name"
];

export const BufferFactoryConfig: OutType = { "BufferFactoryConfig": [
  {
    "name": "minimum_account_to_track_power_of_two",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "number",
    "enums": null,
    "comment": "The minimum power of two at which Envoy starts tracking an account.\n\nEnvoy has 8 power of two buckets starting with the provided exponent below. Concretely the 1st bucket contains accounts for streams that use [2^minimum_account_to_track_power_of_two, 2^(minimum_account_to_track_power_of_two + 1)) bytes. With the 8th bucket tracking accounts >= 128 * 2^minimum_account_to_track_power_of_two.\n\nThe maximum value is 56, since we're using uint64_t for bytes counting, and that's the last value that would use the 8 buckets. In practice, we don't expect the proxy to be holding 2^56 bytes.\n\nIf omitted, Envoy should not do any tracking.",
    "notImp": false
  }
] };

export const BufferFactoryConfig_SingleFields = [
  "minimum_account_to_track_power_of_two"
];

export const OverloadManager: OutType = { "OverloadManager": [
  {
    "name": "refresh_interval",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "Duration",
    "enums": null,
    "comment": "The interval for refreshing resource usage.",
    "notImp": false
  },
  {
    "name": "resource_monitors",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "ResourceMonitor[]",
    "enums": null,
    "comment": "The set of resources to monitor.",
    "notImp": false
  },
  {
    "name": "actions",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "OverloadAction[]",
    "enums": null,
    "comment": "The set of overload actions.",
    "notImp": false
  },
  {
    "name": "loadshed_points",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "LoadShedPoint[]",
    "enums": null,
    "comment": "The set of load shed points.",
    "notImp": false
  },
  {
    "name": "buffer_factory_config",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "BufferFactoryConfig",
    "enums": null,
    "comment": "Configuration for buffer factory.",
    "notImp": false
  }
] };

export const OverloadManager_SingleFields = [
  "refresh_interval"
];