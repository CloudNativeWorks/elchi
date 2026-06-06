import {OutType} from '@elchi/tags/tagsType';


export const PreserveCaseFormatterConfig: OutType = { "PreserveCaseFormatterConfig": [
  {
    "name": "forward_reason_phrase",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "boolean",
    "enums": null,
    "comment": "Allows forwarding reason phrase text. This is off by default, and a standard reason phrase is used for a corresponding HTTP response code.",
    "notImp": false
  },
  {
    "name": "formatter_type_on_envoy_headers",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "PreserveCaseFormatterConfig_FormatterTypeOnEnvoyHeaders",
    "enums": [
      "DEFAULT",
      "PROPER_CASE"
    ],
    "comment": "Type of formatter to use on headers which are added by Envoy (which are lower case by default). The default type is DEFAULT, use LowerCase on Envoy headers.",
    "notImp": false
  }
] };

export const PreserveCaseFormatterConfig_SingleFields = [
  "forward_reason_phrase",
  "formatter_type_on_envoy_headers"
];