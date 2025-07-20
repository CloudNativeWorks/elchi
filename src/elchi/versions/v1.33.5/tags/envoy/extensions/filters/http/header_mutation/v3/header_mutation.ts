import {OutType} from '@elchi/tags/tagsType';


export const Mutations: OutType = { "Mutations": [
  {
    "name": "request_mutations",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "HeaderMutation[]",
    "enums": null,
    "comment": "The request mutations are applied before the request is forwarded to the upstream cluster.",
    "notImp": false
  },
  {
    "name": "query_parameter_mutations",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "KeyValueMutation[]",
    "enums": null,
    "comment": "The ``path`` header query parameter mutations are applied after ``request_mutations`` and before the request is forwarded to the next filter in the filter chain.",
    "notImp": false
  },
  {
    "name": "response_mutations",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "HeaderMutation[]",
    "enums": null,
    "comment": "The response mutations are applied before the response is sent to the downstream client.",
    "notImp": false
  }
] };

export const HeaderMutationPerRoute: OutType = { "HeaderMutationPerRoute": [
  {
    "name": "mutations",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "Mutations",
    "enums": null,
    "comment": "",
    "notImp": false
  }
] };

export const HeaderMutation: OutType = { "HeaderMutation": [
  {
    "name": "mutations",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "Mutations",
    "enums": null,
    "comment": "",
    "notImp": false
  },
  {
    "name": "most_specific_header_mutations_wins",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "boolean",
    "enums": null,
    "comment": "If per route HeaderMutationPerRoute config is configured at multiple route levels, header mutations at all specified levels are evaluated. By default, the order is from most specific (i.e. route entry level) to least specific (i.e. route configuration level). Later header mutations may override earlier mutations.\n\nThis order can be reversed by setting this field to true. In other words, most specific level mutation is evaluated last.",
    "notImp": false
  }
] };

export const HeaderMutation_SingleFields = [
  "most_specific_header_mutations_wins"
];