import {OutType} from '@elchi/tags/tagsType';


export const Matcher_OnMatch: OutType = { "Matcher_OnMatch": [
  {
    "name": "on_match.matcher",
    "isUnion": true,
    "isDeprecated": false,
    "fieldType": "Matcher",
    "enums": null,
    "comment": "What to do if a match is successful.",
    "notImp": false
  },
  {
    "name": "on_match.action",
    "isUnion": true,
    "isDeprecated": false,
    "fieldType": "TypedExtensionConfig",
    "enums": null,
    "comment": "What to do if a match is successful.",
    "notImp": false
  },
  {
    "name": "keep_matching",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "boolean",
    "enums": null,
    "comment": "If true, the action will be taken but the caller will behave as if no match was found. This applies both to actions directly encoded in the action field and to actions returned from a nested matcher tree in the matcher field. A subsequent matcher on_no_match action will be used instead.\n\nThis field is not supported in all contexts in which the matcher API is used. If this field is set in a context in which it's not supported, the resource will be rejected.",
    "notImp": false
  }
] };

export const Matcher_OnMatch_SingleFields = [
  "keep_matching"
];

export const Matcher: OutType = { "Matcher": [
  {
    "name": "matcher_type.matcher_list",
    "isUnion": true,
    "isDeprecated": false,
    "fieldType": "Matcher_MatcherList",
    "enums": null,
    "comment": "A matcher, which may traverse a matching tree in order to result in a match action. During matching, the tree will be traversed until a match is found, or if no match is found the action specified by the most specific on_no_match will be evaluated. As an on_no_match might result in another matching tree being evaluated, this process might repeat several times until the final OnMatch (or no match) is decided.\n\n:::note\nPlease use the syntactically equivalent `matching API`",
    "notImp": false
  },
  {
    "name": "matcher_type.matcher_tree",
    "isUnion": true,
    "isDeprecated": false,
    "fieldType": "Matcher_MatcherTree",
    "enums": null,
    "comment": "A matcher, which may traverse a matching tree in order to result in a match action. During matching, the tree will be traversed until a match is found, or if no match is found the action specified by the most specific on_no_match will be evaluated. As an on_no_match might result in another matching tree being evaluated, this process might repeat several times until the final OnMatch (or no match) is decided.\n\n:::note\nPlease use the syntactically equivalent `matching API`",
    "notImp": false
  },
  {
    "name": "on_no_match",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "Matcher_OnMatch",
    "enums": null,
    "comment": "Optional ``OnMatch`` to use if the matcher failed. If specified, the ``OnMatch`` is used, and the matcher is considered to have matched. If not specified, the matcher is considered not to have matched.",
    "notImp": false
  }
] };

export const Matcher_MatcherList: OutType = { "Matcher_MatcherList": [
  {
    "name": "matchers",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "Matcher_MatcherList_FieldMatcher[]",
    "enums": null,
    "comment": "A list of matchers. First match wins.",
    "notImp": false
  }
] };

export const Matcher_MatcherList_Predicate: OutType = { "Matcher_MatcherList_Predicate": [
  {
    "name": "match_type.single_predicate",
    "isUnion": true,
    "isDeprecated": false,
    "fieldType": "Matcher_MatcherList_Predicate_SinglePredicate",
    "enums": null,
    "comment": "Predicate to determine if a match is successful.",
    "notImp": false
  },
  {
    "name": "match_type.or_matcher",
    "isUnion": true,
    "isDeprecated": false,
    "fieldType": "Matcher_MatcherList_Predicate_PredicateList",
    "enums": null,
    "comment": "Predicate to determine if a match is successful.",
    "notImp": false
  },
  {
    "name": "match_type.and_matcher",
    "isUnion": true,
    "isDeprecated": false,
    "fieldType": "Matcher_MatcherList_Predicate_PredicateList",
    "enums": null,
    "comment": "Predicate to determine if a match is successful.",
    "notImp": false
  },
  {
    "name": "match_type.not_matcher",
    "isUnion": true,
    "isDeprecated": false,
    "fieldType": "Matcher_MatcherList_Predicate",
    "enums": null,
    "comment": "Predicate to determine if a match is successful.",
    "notImp": false
  }
] };

export const Matcher_MatcherList_Predicate_SinglePredicate: OutType = { "Matcher_MatcherList_Predicate_SinglePredicate": [
  {
    "name": "input",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "TypedExtensionConfig",
    "enums": null,
    "comment": "Protocol-specific specification of input field to match on. extension-category: envoy.matching.common_inputs",
    "notImp": false
  },
  {
    "name": "matcher.value_match",
    "isUnion": true,
    "isDeprecated": false,
    "fieldType": "StringMatcher",
    "enums": null,
    "comment": "Predicate for a single input field.",
    "notImp": false
  },
  {
    "name": "matcher.custom_match",
    "isUnion": true,
    "isDeprecated": false,
    "fieldType": "TypedExtensionConfig",
    "enums": null,
    "comment": "Predicate for a single input field.",
    "notImp": false
  }
] };

export const Matcher_MatcherList_Predicate_PredicateList: OutType = { "Matcher_MatcherList_Predicate_PredicateList": [
  {
    "name": "predicate",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "Matcher_MatcherList_Predicate[]",
    "enums": null,
    "comment": "",
    "notImp": false
  }
] };

export const Matcher_MatcherList_FieldMatcher: OutType = { "Matcher_MatcherList_FieldMatcher": [
  {
    "name": "predicate",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "Matcher_MatcherList_Predicate",
    "enums": null,
    "comment": "Determines if the match succeeds.",
    "notImp": false
  },
  {
    "name": "on_match",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "Matcher_OnMatch",
    "enums": null,
    "comment": "What to do if the match succeeds.",
    "notImp": false
  }
] };

export const Matcher_MatcherTree: OutType = { "Matcher_MatcherTree": [
  {
    "name": "input",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "TypedExtensionConfig",
    "enums": null,
    "comment": "Protocol-specific specification of input field to match on.",
    "notImp": false
  },
  {
    "name": "tree_type.exact_match_map",
    "isUnion": true,
    "isDeprecated": false,
    "fieldType": "Matcher_MatcherTree_MatchMap",
    "enums": null,
    "comment": "",
    "notImp": false
  },
  {
    "name": "tree_type.prefix_match_map",
    "isUnion": true,
    "isDeprecated": false,
    "fieldType": "Matcher_MatcherTree_MatchMap",
    "enums": null,
    "comment": "",
    "notImp": false
  },
  {
    "name": "tree_type.custom_match",
    "isUnion": true,
    "isDeprecated": false,
    "fieldType": "TypedExtensionConfig",
    "enums": null,
    "comment": "",
    "notImp": false
  }
] };

export const Matcher_MatcherTree_MatchMap: OutType = { "Matcher_MatcherTree_MatchMap": [
  {
    "name": "map",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "Map<string, Matcher_OnMatch>",
    "enums": null,
    "comment": "",
    "notImp": false
  }
] };

export const Matcher_MatcherTree_MatchMap_MapEntry: OutType = { "Matcher_MatcherTree_MatchMap_MapEntry": [
  {
    "name": "key",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "string",
    "enums": null,
    "comment": "",
    "notImp": false
  },
  {
    "name": "value",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "Matcher_OnMatch",
    "enums": null,
    "comment": "",
    "notImp": false
  }
] };

export const Matcher_MatcherTree_MatchMap_MapEntry_SingleFields = [
  "key"
];

export const MatchPredicate: OutType = { "MatchPredicate": [
  {
    "name": "rule.or_match",
    "isUnion": true,
    "isDeprecated": false,
    "fieldType": "MatchPredicate_MatchSet",
    "enums": null,
    "comment": "Match configuration. This is a recursive structure which allows complex nested match configurations to be built using various logical operators. [#next-free-field: 11]",
    "notImp": false
  },
  {
    "name": "rule.and_match",
    "isUnion": true,
    "isDeprecated": false,
    "fieldType": "MatchPredicate_MatchSet",
    "enums": null,
    "comment": "Match configuration. This is a recursive structure which allows complex nested match configurations to be built using various logical operators. [#next-free-field: 11]",
    "notImp": false
  },
  {
    "name": "rule.not_match",
    "isUnion": true,
    "isDeprecated": false,
    "fieldType": "MatchPredicate",
    "enums": null,
    "comment": "Match configuration. This is a recursive structure which allows complex nested match configurations to be built using various logical operators. [#next-free-field: 11]",
    "notImp": false
  },
  {
    "name": "rule.any_match",
    "isUnion": true,
    "isDeprecated": false,
    "fieldType": "boolean",
    "enums": null,
    "comment": "Match configuration. This is a recursive structure which allows complex nested match configurations to be built using various logical operators. [#next-free-field: 11]",
    "notImp": false
  },
  {
    "name": "rule.http_request_headers_match",
    "isUnion": true,
    "isDeprecated": false,
    "fieldType": "HttpHeadersMatch",
    "enums": null,
    "comment": "Match configuration. This is a recursive structure which allows complex nested match configurations to be built using various logical operators. [#next-free-field: 11]",
    "notImp": false
  },
  {
    "name": "rule.http_request_trailers_match",
    "isUnion": true,
    "isDeprecated": false,
    "fieldType": "HttpHeadersMatch",
    "enums": null,
    "comment": "Match configuration. This is a recursive structure which allows complex nested match configurations to be built using various logical operators. [#next-free-field: 11]",
    "notImp": false
  },
  {
    "name": "rule.http_response_headers_match",
    "isUnion": true,
    "isDeprecated": false,
    "fieldType": "HttpHeadersMatch",
    "enums": null,
    "comment": "Match configuration. This is a recursive structure which allows complex nested match configurations to be built using various logical operators. [#next-free-field: 11]",
    "notImp": false
  },
  {
    "name": "rule.http_response_trailers_match",
    "isUnion": true,
    "isDeprecated": false,
    "fieldType": "HttpHeadersMatch",
    "enums": null,
    "comment": "Match configuration. This is a recursive structure which allows complex nested match configurations to be built using various logical operators. [#next-free-field: 11]",
    "notImp": false
  },
  {
    "name": "rule.http_request_generic_body_match",
    "isUnion": true,
    "isDeprecated": false,
    "fieldType": "HttpGenericBodyMatch",
    "enums": null,
    "comment": "Match configuration. This is a recursive structure which allows complex nested match configurations to be built using various logical operators. [#next-free-field: 11]",
    "notImp": false
  },
  {
    "name": "rule.http_response_generic_body_match",
    "isUnion": true,
    "isDeprecated": false,
    "fieldType": "HttpGenericBodyMatch",
    "enums": null,
    "comment": "Match configuration. This is a recursive structure which allows complex nested match configurations to be built using various logical operators. [#next-free-field: 11]",
    "notImp": false
  }
] };

export const MatchPredicate_SingleFields = [
  "rule.any_match"
];

export const MatchPredicate_MatchSet: OutType = { "MatchPredicate_MatchSet": [
  {
    "name": "rules",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "MatchPredicate[]",
    "enums": null,
    "comment": "The list of rules that make up the set.",
    "notImp": false
  }
] };

export const HttpHeadersMatch: OutType = { "HttpHeadersMatch": [
  {
    "name": "headers",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "HeaderMatcher[]",
    "enums": null,
    "comment": "HTTP headers to match.",
    "notImp": false
  }
] };

export const HttpGenericBodyMatch: OutType = { "HttpGenericBodyMatch": [
  {
    "name": "bytes_limit",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "number",
    "enums": null,
    "comment": "Limits search to specified number of bytes - default zero (no limit - match entire captured buffer).",
    "notImp": false
  },
  {
    "name": "patterns",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "HttpGenericBodyMatch_GenericTextMatch[]",
    "enums": null,
    "comment": "List of patterns to match.",
    "notImp": false
  }
] };

export const HttpGenericBodyMatch_SingleFields = [
  "bytes_limit"
];

export const HttpGenericBodyMatch_GenericTextMatch: OutType = { "HttpGenericBodyMatch_GenericTextMatch": [
  {
    "name": "rule.string_match",
    "isUnion": true,
    "isDeprecated": false,
    "fieldType": "string",
    "enums": null,
    "comment": "",
    "notImp": false
  },
  {
    "name": "rule.binary_match",
    "isUnion": true,
    "isDeprecated": false,
    "fieldType": "Uint8Array<ArrayBufferLike>",
    "enums": null,
    "comment": "",
    "notImp": false
  }
] };

export const HttpGenericBodyMatch_GenericTextMatch_SingleFields = [
  "rule.string_match"
];