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
  }
] };

export const Matcher: OutType = { "Matcher": [
  {
    "name": "matcher_type.matcher_list",
    "isUnion": true,
    "isDeprecated": false,
    "fieldType": "Matcher_MatcherList",
    "enums": null,
    "comment": "A matcher, which may traverse a matching tree in order to result in a match action. During matching, the tree will be traversed until a match is found, or if no match is found the action specified by the most specific on_no_match will be evaluated. As an on_no_match might result in another matching tree being evaluated, this process might repeat several times until the final OnMatch (or no match) is decided.",
    "notImp": false
  },
  {
    "name": "matcher_type.matcher_tree",
    "isUnion": true,
    "isDeprecated": false,
    "fieldType": "Matcher_MatcherTree",
    "enums": null,
    "comment": "A matcher, which may traverse a matching tree in order to result in a match action. During matching, the tree will be traversed until a match is found, or if no match is found the action specified by the most specific on_no_match will be evaluated. As an on_no_match might result in another matching tree being evaluated, this process might repeat several times until the final OnMatch (or no match) is decided.",
    "notImp": false
  },
  {
    "name": "on_no_match",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "Matcher_OnMatch",
    "enums": null,
    "comment": "Optional OnMatch to use if no matcher above matched (e.g., if there are no matchers specified above, or if none of the matches specified above succeeded). If no matcher above matched and this field is not populated, the match will be considered unsuccessful.",
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