import {OutType} from '@elchi/tags/tagsType';


export const Timestamp: OutType = { "Timestamp": [
  {
    "name": "seconds",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "number",
    "enums": null,
    "comment": "Represents seconds of UTC time since Unix epoch 1970-01-01T00:00:00Z. Must be between -315576000000 and 315576000000 inclusive (which corresponds to 0001-01-01T00:00:00Z to 9999-12-31T23:59:59Z).",
    "notImp": false
  },
  {
    "name": "nanos",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "number",
    "enums": null,
    "comment": "Non-negative fractions of a second at nanosecond resolution. This field is the nanosecond portion of the duration, not an alternative to seconds. Negative second values with fractions must still have non-negative nanos values that count forward in time. Must be between 0 and 999,999,999 inclusive.",
    "notImp": false
  }
] };

export const Timestamp_SingleFields = [
  "seconds",
  "nanos"
];