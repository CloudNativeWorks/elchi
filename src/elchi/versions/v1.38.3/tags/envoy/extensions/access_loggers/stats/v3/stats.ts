import {OutType} from '@elchi/tags/tagsType';


export const Config: OutType = { "Config": [
  {
    "name": "stat_prefix",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "string",
    "enums": null,
    "comment": "The stat prefix for the generated stats.",
    "notImp": false
  },
  {
    "name": "histograms",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "Config_Histogram[]",
    "enums": null,
    "comment": "The histograms this logger will emit.",
    "notImp": false
  },
  {
    "name": "counters",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "Config_Counter[]",
    "enums": null,
    "comment": "The counters this logger will emit.",
    "notImp": false
  },
  {
    "name": "gauges",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "Config_Gauge[]",
    "enums": null,
    "comment": "The gauges this logger will emit.",
    "notImp": false
  }
] };

export const Config_SingleFields = [
  "stat_prefix"
];

export const Config_Tag: OutType = { "Config_Tag": [
  {
    "name": "name",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "string",
    "enums": null,
    "comment": "The name of the tag.",
    "notImp": false
  },
  {
    "name": "value_format",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "string",
    "enums": null,
    "comment": "The value of the tag, using `command operators`.",
    "notImp": false
  },
  {
    "name": "rules",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "Matcher",
    "enums": null,
    "comment": "The custom rules to generate the stat tags. Currently, the only supported input is `Stat tag value input`. The supported actions are - `Transform stat action`.",
    "notImp": false
  }
] };

export const Config_Tag_SingleFields = [
  "name",
  "value_format"
];

export const Config_Stat: OutType = { "Config_Stat": [
  {
    "name": "name",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "string",
    "enums": null,
    "comment": "The name of the stat.",
    "notImp": false
  },
  {
    "name": "tags",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "Config_Tag[]",
    "enums": null,
    "comment": "The tags for the stat.",
    "notImp": false
  }
] };

export const Config_Stat_SingleFields = [
  "name"
];

export const Config_Histogram: OutType = { "Config_Histogram": [
  {
    "name": "stat",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "Config_Stat",
    "enums": null,
    "comment": "The name and tags of this histogram.",
    "notImp": false
  },
  {
    "name": "unit",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "Config_Histogram_Unit",
    "enums": [
      "Unspecified",
      "Bytes",
      "Microseconds",
      "Milliseconds",
      "Percent"
    ],
    "comment": "The units for this histogram.",
    "notImp": false
  },
  {
    "name": "value_format",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "string",
    "enums": null,
    "comment": "The format string for the value of this histogram, using `command operators`. This must evaluate to a positive number.",
    "notImp": false
  }
] };

export const Config_Histogram_SingleFields = [
  "unit",
  "value_format"
];

export const Config_Counter: OutType = { "Config_Counter": [
  {
    "name": "stat",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "Config_Stat",
    "enums": null,
    "comment": "The name and tags of this counter.",
    "notImp": false
  },
  {
    "name": "value_format",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "string",
    "enums": null,
    "comment": "The format string for the value to add to this counter, using `command operators`. One of ``value_format`` or ``value_fixed`` must be configured.",
    "notImp": false
  },
  {
    "name": "value_fixed",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "number",
    "enums": null,
    "comment": "A fixed value to add to this counter. One of ``value_format`` or ``value_fixed`` must be configured.",
    "notImp": false
  }
] };

export const Config_Counter_SingleFields = [
  "value_format",
  "value_fixed"
];

export const Config_Gauge_PairedAddSubtract: OutType = { "Config_Gauge_PairedAddSubtract": [
  {
    "name": "add_log_type",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "AccessLogType",
    "enums": [
      "NotSet",
      "TcpUpstreamConnected",
      "TcpPeriodic",
      "TcpConnectionStart",
      "TcpConnectionEnd",
      "DownstreamStart",
      "DownstreamPeriodic",
      "DownstreamEnd",
      "UpstreamPoolReady",
      "UpstreamPeriodic",
      "UpstreamEnd",
      "DownstreamTunnelSuccessfullyEstablished",
      "UdpTunnelUpstreamConnected",
      "UdpPeriodic",
      "UdpSessionEnd"
    ],
    "comment": "The access log type to trigger the add operation.",
    "notImp": false
  },
  {
    "name": "sub_log_type",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "AccessLogType",
    "enums": [
      "NotSet",
      "TcpUpstreamConnected",
      "TcpPeriodic",
      "TcpConnectionStart",
      "TcpConnectionEnd",
      "DownstreamStart",
      "DownstreamPeriodic",
      "DownstreamEnd",
      "UpstreamPoolReady",
      "UpstreamPeriodic",
      "UpstreamEnd",
      "DownstreamTunnelSuccessfullyEstablished",
      "UdpTunnelUpstreamConnected",
      "UdpPeriodic",
      "UdpSessionEnd"
    ],
    "comment": "The access log type to trigger the subtract operation.",
    "notImp": false
  }
] };

export const Config_Gauge_PairedAddSubtract_SingleFields = [
  "add_log_type",
  "sub_log_type"
];

export const Config_Gauge_Set: OutType = { "Config_Gauge_Set": [
  {
    "name": "log_type",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "AccessLogType",
    "enums": [
      "NotSet",
      "TcpUpstreamConnected",
      "TcpPeriodic",
      "TcpConnectionStart",
      "TcpConnectionEnd",
      "DownstreamStart",
      "DownstreamPeriodic",
      "DownstreamEnd",
      "UpstreamPoolReady",
      "UpstreamPeriodic",
      "UpstreamEnd",
      "DownstreamTunnelSuccessfullyEstablished",
      "UdpTunnelUpstreamConnected",
      "UdpPeriodic",
      "UdpSessionEnd"
    ],
    "comment": "The access log type to trigger the operation.",
    "notImp": false
  }
] };

export const Config_Gauge_Set_SingleFields = [
  "log_type"
];

export const Config_Gauge: OutType = { "Config_Gauge": [
  {
    "name": "stat",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "Config_Stat",
    "enums": null,
    "comment": "The name and tags of this gauge.",
    "notImp": false
  },
  {
    "name": "value_format",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "string",
    "enums": null,
    "comment": "The format string for the value of this gauge, using `command operators`. This must evaluate to a positive number.",
    "notImp": false
  },
  {
    "name": "value_fixed",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "number",
    "enums": null,
    "comment": "A fixed value to add/subtract/set to this gauge. One of ``value_format`` or ``value_fixed`` must be configured.",
    "notImp": false
  },
  {
    "name": "add_subtract",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "Config_Gauge_PairedAddSubtract",
    "enums": null,
    "comment": "The PairedAddSubtract operation. Only one of PairedAddSubtract and Set can be defined.",
    "notImp": false
  },
  {
    "name": "set",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "Config_Gauge_Set",
    "enums": null,
    "comment": "The Set operation. Only one of PairedAddSubtract and Set can be defined.",
    "notImp": false
  }
] };

export const Config_Gauge_SingleFields = [
  "value_format",
  "value_fixed"
];