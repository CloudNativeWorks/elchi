import {OutType} from '@/elchi/tags/tagsType';


export const SimpleMetric: OutType = { "SimpleMetric": [
  {
    "name": "type",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "SimpleMetric_Type",
    "enums": [
      "COUNTER",
      "GAUGE"
    ],
    "comment": "Type of the metric represented.",
    "notImp": false
  },
  {
    "name": "value",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "number",
    "enums": null,
    "comment": "Current metric value.",
    "notImp": false
  },
  {
    "name": "name",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "string",
    "enums": null,
    "comment": "Name of the metric.",
    "notImp": false
  }
] };

export const SimpleMetric_SingleFields = [
  "type",
  "value",
  "name"
];