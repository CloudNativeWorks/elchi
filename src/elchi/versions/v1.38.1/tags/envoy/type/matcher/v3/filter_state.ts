import {OutType} from '@elchi/tags/tagsType';


export const FilterStateMatcher: OutType = { "FilterStateMatcher": [
  {
    "name": "key",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "string",
    "enums": null,
    "comment": "The filter state key to retrieve the object.",
    "notImp": false
  },
  {
    "name": "matcher.string_match",
    "isUnion": true,
    "isDeprecated": false,
    "fieldType": "StringMatcher",
    "enums": null,
    "comment": "FilterStateMatcher provides a general interface for matching the filter state objects.",
    "notImp": false
  },
  {
    "name": "matcher.address_match",
    "isUnion": true,
    "isDeprecated": false,
    "fieldType": "AddressMatcher",
    "enums": null,
    "comment": "FilterStateMatcher provides a general interface for matching the filter state objects.",
    "notImp": false
  }
] };

export const FilterStateMatcher_SingleFields = [
  "key"
];