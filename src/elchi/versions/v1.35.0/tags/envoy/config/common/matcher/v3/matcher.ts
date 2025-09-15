import {OutType} from '@elchi/tags/tagsType';


export const Matcher_OnMatch: OutType = { "Matcher_OnMatch": [
  {
    "name": "on_match.matcher",
    "isUnion": true,
    "isDeprecated": false,
    "fieldType": "Matcher",
    "enums": null,
    "comment": "Nested matcher to evaluate. If the nested matcher does not match and does not specify on_no_match, then this matcher is considered not to have matched, even if a predicate at this level or above returned true.",
    "notImp": false
  },
  {
    "name": "on_match.action",
    "isUnion": true,
    "isDeprecated": false,
    "fieldType": "TypedExtensionConfig",
    "enums": null,
    "comment": "Protocol-specific action to take.",
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
    "comment": "A linear list of matchers to evaluate.",
    "notImp": false
  },
  {
    "name": "matcher_type.matcher_tree",
    "isUnion": true,
    "isDeprecated": false,
    "fieldType": "Matcher_MatcherTree",
    "enums": null,
    "comment": "A match tree to evaluate.",
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
    "comment": "A single predicate to evaluate.",
    "notImp": false
  },
  {
    "name": "match_type.or_matcher",
    "isUnion": true,
    "isDeprecated": false,
    "fieldType": "Matcher_MatcherList_Predicate_PredicateList",
    "enums": null,
    "comment": "A list of predicates to be OR-ed together.",
    "notImp": false
  },
  {
    "name": "match_type.and_matcher",
    "isUnion": true,
    "isDeprecated": false,
    "fieldType": "Matcher_MatcherList_Predicate_PredicateList",
    "enums": null,
    "comment": "A list of predicates to be AND-ed together.",
    "notImp": false
  },
  {
    "name": "match_type.not_matcher",
    "isUnion": true,
    "isDeprecated": false,
    "fieldType": "Matcher_MatcherList_Predicate",
    "enums": null,
    "comment": "The inverse of a predicate",
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
    "comment": "Built-in string matcher.",
    "notImp": false
  },
  {
    "name": "matcher.custom_match",
    "isUnion": true,
    "isDeprecated": false,
    "fieldType": "TypedExtensionConfig",
    "enums": null,
    "comment": "Extension for custom matching logic. extension-category: envoy.matching.input_matchers",
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
    "comment": "Exact or prefix match maps in which to look up the input value. If the lookup succeeds, the match is considered successful, and the corresponding OnMatch is used.",
    "notImp": false
  },
  {
    "name": "tree_type.prefix_match_map",
    "isUnion": true,
    "isDeprecated": false,
    "fieldType": "Matcher_MatcherTree_MatchMap",
    "enums": null,
    "comment": "Longest matching prefix wins.",
    "notImp": false
  },
  {
    "name": "tree_type.custom_match",
    "isUnion": true,
    "isDeprecated": false,
    "fieldType": "TypedExtensionConfig",
    "enums": null,
    "comment": "Extension for custom matching logic.",
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
    "comment": "A set that describes a logical OR. If any member of the set matches, the match configuration matches.",
    "notImp": false
  },
  {
    "name": "rule.and_match",
    "isUnion": true,
    "isDeprecated": false,
    "fieldType": "MatchPredicate_MatchSet",
    "enums": null,
    "comment": "A set that describes a logical AND. If all members of the set match, the match configuration matches.",
    "notImp": false
  },
  {
    "name": "rule.not_match",
    "isUnion": true,
    "isDeprecated": false,
    "fieldType": "MatchPredicate",
    "enums": null,
    "comment": "A negation match. The match configuration will match if the negated match condition matches.",
    "notImp": false
  },
  {
    "name": "rule.any_match",
    "isUnion": true,
    "isDeprecated": false,
    "fieldType": "boolean",
    "enums": null,
    "comment": "The match configuration will always match.",
    "notImp": false
  },
  {
    "name": "rule.http_request_headers_match",
    "isUnion": true,
    "isDeprecated": false,
    "fieldType": "HttpHeadersMatch",
    "enums": null,
    "comment": "HTTP request headers match configuration.",
    "notImp": false
  },
  {
    "name": "rule.http_request_trailers_match",
    "isUnion": true,
    "isDeprecated": false,
    "fieldType": "HttpHeadersMatch",
    "enums": null,
    "comment": "HTTP request trailers match configuration.",
    "notImp": false
  },
  {
    "name": "rule.http_response_headers_match",
    "isUnion": true,
    "isDeprecated": false,
    "fieldType": "HttpHeadersMatch",
    "enums": null,
    "comment": "HTTP response headers match configuration.",
    "notImp": false
  },
  {
    "name": "rule.http_response_trailers_match",
    "isUnion": true,
    "isDeprecated": false,
    "fieldType": "HttpHeadersMatch",
    "enums": null,
    "comment": "HTTP response trailers match configuration.",
    "notImp": false
  },
  {
    "name": "rule.http_request_generic_body_match",
    "isUnion": true,
    "isDeprecated": false,
    "fieldType": "HttpGenericBodyMatch",
    "enums": null,
    "comment": "HTTP request generic body match configuration.",
    "notImp": false
  },
  {
    "name": "rule.http_response_generic_body_match",
    "isUnion": true,
    "isDeprecated": false,
    "fieldType": "HttpGenericBodyMatch",
    "enums": null,
    "comment": "HTTP response generic body match configuration.",
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
    "comment": "Text string to be located in HTTP body.",
    "notImp": false
  },
  {
    "name": "rule.binary_match",
    "isUnion": true,
    "isDeprecated": false,
    "fieldType": "Uint8Array<ArrayBufferLike>",
    "enums": null,
    "comment": "Sequence of bytes to be located in HTTP body.",
    "notImp": false
  }
] };

export const HttpGenericBodyMatch_GenericTextMatch_SingleFields = [
  "rule.string_match"
];