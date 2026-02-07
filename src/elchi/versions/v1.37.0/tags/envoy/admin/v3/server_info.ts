import {OutType} from '@elchi/tags/tagsType';


export const CommandLineOptions: OutType = { "CommandLineOptions": [
  {
    "name": "base_id",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "number",
    "enums": null,
    "comment": "See :option:`--base-id` for details.",
    "notImp": false
  },
  {
    "name": "use_dynamic_base_id",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "boolean",
    "enums": null,
    "comment": "See :option:`--use-dynamic-base-id` for details.",
    "notImp": false
  },
  {
    "name": "skip_hot_restart_on_no_parent",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "boolean",
    "enums": null,
    "comment": "See :option:`--skip-hot-restart-on-no-parent` for details.",
    "notImp": false
  },
  {
    "name": "skip_hot_restart_parent_stats",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "boolean",
    "enums": null,
    "comment": "See :option:`--skip-hot-restart-parent-stats` for details.",
    "notImp": false
  },
  {
    "name": "base_id_path",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "string",
    "enums": null,
    "comment": "See :option:`--base-id-path` for details.",
    "notImp": false
  },
  {
    "name": "concurrency",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "number",
    "enums": null,
    "comment": "See :option:`--concurrency` for details.",
    "notImp": false
  },
  {
    "name": "config_path",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "string",
    "enums": null,
    "comment": "See :option:`--config-path` for details.",
    "notImp": false
  },
  {
    "name": "config_yaml",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "string",
    "enums": null,
    "comment": "See :option:`--config-yaml` for details.",
    "notImp": false
  },
  {
    "name": "allow_unknown_static_fields",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "boolean",
    "enums": null,
    "comment": "See :option:`--allow-unknown-static-fields` for details.",
    "notImp": false
  },
  {
    "name": "reject_unknown_dynamic_fields",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "boolean",
    "enums": null,
    "comment": "See :option:`--reject-unknown-dynamic-fields` for details.",
    "notImp": false
  },
  {
    "name": "ignore_unknown_dynamic_fields",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "boolean",
    "enums": null,
    "comment": "See :option:`--ignore-unknown-dynamic-fields` for details.",
    "notImp": false
  },
  {
    "name": "skip_deprecated_logs",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "boolean",
    "enums": null,
    "comment": "See :option:`--skip-deprecated-logs` for details.",
    "notImp": false
  },
  {
    "name": "admin_address_path",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "string",
    "enums": null,
    "comment": "See :option:`--admin-address-path` for details.",
    "notImp": false
  },
  {
    "name": "local_address_ip_version",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "CommandLineOptions_IpVersion",
    "enums": [
      "v4",
      "v6"
    ],
    "comment": "See :option:`--local-address-ip-version` for details.",
    "notImp": false
  },
  {
    "name": "log_level",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "string",
    "enums": null,
    "comment": "See :option:`--log-level` for details.",
    "notImp": false
  },
  {
    "name": "component_log_level",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "string",
    "enums": null,
    "comment": "See :option:`--component-log-level` for details.",
    "notImp": false
  },
  {
    "name": "log_format",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "string",
    "enums": null,
    "comment": "See :option:`--log-format` for details.",
    "notImp": false
  },
  {
    "name": "log_format_escaped",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "boolean",
    "enums": null,
    "comment": "See :option:`--log-format-escaped` for details.",
    "notImp": false
  },
  {
    "name": "log_path",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "string",
    "enums": null,
    "comment": "See :option:`--log-path` for details.",
    "notImp": false
  },
  {
    "name": "service_cluster",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "string",
    "enums": null,
    "comment": "See :option:`--service-cluster` for details.",
    "notImp": false
  },
  {
    "name": "service_node",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "string",
    "enums": null,
    "comment": "See :option:`--service-node` for details.",
    "notImp": false
  },
  {
    "name": "service_zone",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "string",
    "enums": null,
    "comment": "See :option:`--service-zone` for details.",
    "notImp": false
  },
  {
    "name": "file_flush_interval",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "Duration",
    "enums": null,
    "comment": "See :option:`--file-flush-interval-msec` for details.",
    "notImp": false
  },
  {
    "name": "file_flush_min_size",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "number",
    "enums": null,
    "comment": "See :option:`--file-flush-min-size-kb` for details.",
    "notImp": false
  },
  {
    "name": "drain_time",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "Duration",
    "enums": null,
    "comment": "See :option:`--drain-time-s` for details.",
    "notImp": false
  },
  {
    "name": "drain_strategy",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "CommandLineOptions_DrainStrategy",
    "enums": [
      "Gradual",
      "Immediate"
    ],
    "comment": "See :option:`--drain-strategy` for details.",
    "notImp": false
  },
  {
    "name": "parent_shutdown_time",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "Duration",
    "enums": null,
    "comment": "See :option:`--parent-shutdown-time-s` for details.",
    "notImp": false
  },
  {
    "name": "mode",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "CommandLineOptions_Mode",
    "enums": [
      "Serve",
      "Validate",
      "InitOnly"
    ],
    "comment": "See :option:`--mode` for details.",
    "notImp": false
  },
  {
    "name": "disable_hot_restart",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "boolean",
    "enums": null,
    "comment": "See :option:`--disable-hot-restart` for details.",
    "notImp": false
  },
  {
    "name": "enable_mutex_tracing",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "boolean",
    "enums": null,
    "comment": "See :option:`--enable-mutex-tracing` for details.",
    "notImp": false
  },
  {
    "name": "restart_epoch",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "number",
    "enums": null,
    "comment": "See :option:`--restart-epoch` for details.",
    "notImp": false
  },
  {
    "name": "cpuset_threads",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "boolean",
    "enums": null,
    "comment": "See :option:`--cpuset-threads` for details.",
    "notImp": false
  },
  {
    "name": "disabled_extensions",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "string[]",
    "enums": null,
    "comment": "See :option:`--disable-extensions` for details.",
    "notImp": false
  },
  {
    "name": "enable_fine_grain_logging",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "boolean",
    "enums": null,
    "comment": "See :option:`--enable-fine-grain-logging` for details.",
    "notImp": false
  },
  {
    "name": "socket_path",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "string",
    "enums": null,
    "comment": "See :option:`--socket-path` for details.",
    "notImp": false
  },
  {
    "name": "socket_mode",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "number",
    "enums": null,
    "comment": "See :option:`--socket-mode` for details.",
    "notImp": false
  },
  {
    "name": "enable_core_dump",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "boolean",
    "enums": null,
    "comment": "See :option:`--enable-core-dump` for details.",
    "notImp": false
  },
  {
    "name": "stats_tag",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "string[]",
    "enums": null,
    "comment": "See :option:`--stats-tag` for details.",
    "notImp": false
  }
] };

export const CommandLineOptions_SingleFields = [
  "base_id",
  "use_dynamic_base_id",
  "skip_hot_restart_on_no_parent",
  "skip_hot_restart_parent_stats",
  "base_id_path",
  "concurrency",
  "config_path",
  "config_yaml",
  "allow_unknown_static_fields",
  "reject_unknown_dynamic_fields",
  "ignore_unknown_dynamic_fields",
  "skip_deprecated_logs",
  "admin_address_path",
  "local_address_ip_version",
  "log_level",
  "component_log_level",
  "log_format",
  "log_format_escaped",
  "log_path",
  "service_cluster",
  "service_node",
  "service_zone",
  "file_flush_interval",
  "file_flush_min_size",
  "drain_time",
  "drain_strategy",
  "parent_shutdown_time",
  "mode",
  "disable_hot_restart",
  "enable_mutex_tracing",
  "restart_epoch",
  "cpuset_threads",
  "disabled_extensions",
  "enable_fine_grain_logging",
  "socket_path",
  "socket_mode",
  "enable_core_dump",
  "stats_tag"
];

export const ServerInfo: OutType = { "ServerInfo": [
  {
    "name": "version",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "string",
    "enums": null,
    "comment": "Server version.",
    "notImp": false
  },
  {
    "name": "state",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "ServerInfo_State",
    "enums": [
      "LIVE",
      "DRAINING",
      "PRE_INITIALIZING",
      "INITIALIZING"
    ],
    "comment": "State of the server.",
    "notImp": false
  },
  {
    "name": "uptime_current_epoch",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "Duration",
    "enums": null,
    "comment": "Uptime since current epoch was started.",
    "notImp": false
  },
  {
    "name": "uptime_all_epochs",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "Duration",
    "enums": null,
    "comment": "Uptime since the start of the first epoch.",
    "notImp": false
  },
  {
    "name": "hot_restart_version",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "string",
    "enums": null,
    "comment": "Hot restart version.",
    "notImp": false
  },
  {
    "name": "command_line_options",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "CommandLineOptions",
    "enums": null,
    "comment": "Command line options the server is currently running with.",
    "notImp": false
  },
  {
    "name": "node",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "Node",
    "enums": null,
    "comment": "Populated node identity of this server.",
    "notImp": false
  }
] };

export const ServerInfo_SingleFields = [
  "version",
  "state",
  "uptime_current_epoch",
  "uptime_all_epochs",
  "hot_restart_version"
];