import {OutType} from '@elchi/tags/tagsType';


export const HeaderMutationRules: OutType = { "HeaderMutationRules": [
  {
    "name": "allow_all_routing",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "boolean",
    "enums": null,
    "comment": "By default, certain headers that could affect processing of subsequent filters or request routing cannot be modified. These headers are ``host``, ``:authority``, ``:scheme``, and ``:method``. Setting this parameter to true allows these headers to be modified as well.",
    "notImp": false
  },
  {
    "name": "allow_envoy",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "boolean",
    "enums": null,
    "comment": "If true, allow modification of envoy internal headers. By default, these start with ``x-envoy`` but this may be overridden in the ``Bootstrap`` configuration using the `header_prefix` field. Default is false.",
    "notImp": false
  },
  {
    "name": "disallow_system",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "boolean",
    "enums": null,
    "comment": "If true, prevent modification of any system header, defined as a header that starts with a ``:`` character, regardless of any other settings. A processing server may still override the ``:status`` of an HTTP response using an ``ImmediateResponse`` message. Default is false.",
    "notImp": false
  },
  {
    "name": "disallow_all",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "boolean",
    "enums": null,
    "comment": "If true, prevent modifications of all header values, regardless of any other settings. A processing server may still override the ``:status`` of an HTTP response using an ``ImmediateResponse`` message. Default is false.",
    "notImp": false
  },
  {
    "name": "allow_expression",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "RegexMatcher",
    "enums": null,
    "comment": "If set, specifically allow any header that matches this regular expression. This overrides all other settings except for ``disallow_expression``.",
    "notImp": false
  },
  {
    "name": "disallow_expression",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "RegexMatcher",
    "enums": null,
    "comment": "If set, specifically disallow any header that matches this regular expression regardless of any other settings.",
    "notImp": false
  },
  {
    "name": "disallow_is_error",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "boolean",
    "enums": null,
    "comment": "If true, and if the rules in this list cause a header mutation to be disallowed, then the filter using this configuration will terminate the request with a 500 error. In addition, regardless of the setting of this parameter, any attempt to set, add, or modify a disallowed header will cause the ``rejected_header_mutations`` counter to be incremented. Default is false.",
    "notImp": false
  }
] };

export const HeaderMutationRules_SingleFields = [
  "allow_all_routing",
  "allow_envoy",
  "disallow_system",
  "disallow_all",
  "disallow_is_error"
];

export const HeaderMutation: OutType = { "HeaderMutation": [
  {
    "name": "action.remove",
    "isUnion": true,
    "isDeprecated": false,
    "fieldType": "string",
    "enums": null,
    "comment": "Remove the specified header if it exists.",
    "notImp": false
  },
  {
    "name": "action.append",
    "isUnion": true,
    "isDeprecated": false,
    "fieldType": "HeaderValueOption",
    "enums": null,
    "comment": "Append new header by the specified HeaderValueOption.",
    "notImp": false
  }
] };

export const HeaderMutation_SingleFields = [
  "action.remove"
];