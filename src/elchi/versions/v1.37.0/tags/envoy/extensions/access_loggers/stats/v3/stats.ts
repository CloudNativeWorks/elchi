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