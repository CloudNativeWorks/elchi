import {OutType} from '@elchi/tags/tagsType';


export const FilterStateValue: OutType = { "FilterStateValue": [
  {
    "name": "key.object_key",
    "isUnion": true,
    "isDeprecated": false,
    "fieldType": "string",
    "enums": null,
    "comment": "A filter state key and value pair. [#next-free-field: 7]",
    "notImp": false
  },
  {
    "name": "factory_key",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "string",
    "enums": null,
    "comment": "Specifies which registered factory should be used to create the filter state object from the provided value. This field is required when `object_key` is a custom name not found in the `well-known filter state keys`.\n\nEach well-known key has a factory registered with the same name (e.g., the key ``envoy.tcp_proxy.cluster`` has a factory also named ``envoy.tcp_proxy.cluster``). For custom keys, use one of the following generic factories:\n\n* ``envoy.string``: Creates a generic string object. Use this for arbitrary string values that will be accessed via ``StringAccessor``.\n\nIf not specified, defaults to the value of ``object_key``.",
    "notImp": false
  },
  {
    "name": "value.format_string",
    "isUnion": true,
    "isDeprecated": false,
    "fieldType": "SubstitutionFormatString",
    "enums": null,
    "comment": "A filter state key and value pair. [#next-free-field: 7]",
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