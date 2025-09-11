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
    "comment": "Matches the filter state object as a string value.",
    "notImp": false
  },
  {
    "name": "matcher.address_match",
    "isUnion": true,
    "isDeprecated": false,
    "fieldType": "AddressMatcher",
    "enums": null,
    "comment": "Matches the filter state object as a ip Instance.",
    "notImp": false
  }
] };

export const FilterStateMatcher_SingleFields = [
  "key"
];