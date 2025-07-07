import {OutType} from '@/elchi/tags/tagsType';


export const FilterStateValue: OutType = { "FilterStateValue": [
  {
    "name": "key.object_key",
    "isUnion": true,
    "isDeprecated": false,
    "fieldType": "string",
    "enums": null,
    "comment": "Filter state object key. The key is used to lookup the object factory, unless `factory_key` is set. See `the well-known filter state keys` for a list of valid object keys.",
    "notImp": false
  },
  {
    "name": "factory_key",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "string",
    "enums": null,
    "comment": "Optional filter object factory lookup key. See `the well-known filter state keys` for a list of valid factory keys.",
    "notImp": false
  },
  {
    "name": "value.format_string",
    "isUnion": true,
    "isDeprecated": false,
    "fieldType": "SubstitutionFormatString",
    "enums": null,
    "comment": "Uses the `format string` to instantiate the filter state object value.",
    "notImp": false
  },
  {
    "name": "read_only",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "boolean",
    "enums": null,
    "comment": "If marked as read-only, the filter state key value is locked, and cannot be overridden by any filter, including this filter.",
    "notImp": false
  },
  {
    "name": "shared_with_upstream",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "FilterStateValue_SharedWithUpstream",
    "enums": [
      "NONE",
      "ONCE",
      "TRANSITIVE"
    ],
    "comment": "Configures the object to be shared with the upstream internal connections. See `internal upstream transport` for more details on the filter state sharing with the internal connections.",
    "notImp": false
  },
  {
    "name": "skip_if_empty",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "boolean",
    "enums": null,
    "comment": "Skip the update if the value evaluates to an empty string. This option can be used to supply multiple alternatives for the same filter state object key.",
    "notImp": false
  }
] };

export const FilterStateValue_SingleFields = [
  "key.object_key",
  "factory_key",
  "read_only",
  "shared_with_upstream",
  "skip_if_empty"
];