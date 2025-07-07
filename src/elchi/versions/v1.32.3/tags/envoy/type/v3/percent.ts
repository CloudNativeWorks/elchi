import {OutType} from '@/elchi/tags/tagsType';


export const Percent: OutType = { "Percent": [
  {
    "name": "value",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "number",
    "enums": null,
    "comment": "",
    "notImp": false
  }
] };

export const Percent_SingleFields = [
  "value"
];

export const FractionalPercent: OutType = { "FractionalPercent": [
  {
    "name": "numerator",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "number",
    "enums": null,
    "comment": "Specifies the numerator. Defaults to 0.",
    "notImp": false
  },
  {
    "name": "denominator",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "FractionalPercent_DenominatorType",
    "enums": [
      "HUNDRED",
      "TEN_THOUSAND",
      "MILLION"
    ],
    "comment": "Specifies the denominator. If the denominator specified is less than the numerator, the final fractional percentage is capped at 1 (100%).",
    "notImp": false
  }
] };

export const FractionalPercent_SingleFields = [
  "numerator",
  "denominator"
];