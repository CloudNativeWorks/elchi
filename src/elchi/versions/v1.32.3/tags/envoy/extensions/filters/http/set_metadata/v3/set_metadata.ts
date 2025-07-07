import {OutType} from '@/elchi/tags/tagsType';


export const Metadata: OutType = { "Metadata": [
  {
    "name": "metadata_namespace",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "string",
    "enums": null,
    "comment": "The metadata namespace.",
    "notImp": false
  },
  {
    "name": "allow_overwrite",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "boolean",
    "enums": null,
    "comment": "Allow the filter to overwrite or merge with an existing value in the namespace.",
    "notImp": false
  },
  {
    "name": "value",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "{ [key: string]: any; }",
    "enums": null,
    "comment": "The value to place at the namespace. If ``allow_overwrite``, this will overwrite or merge with any existing values in that namespace. See `the filter documentation` for more information on how this value is merged with potentially existing ones if ``allow_overwrite`` is configured. Only one of ``value`` and ``typed_value`` may be set.",
    "notImp": false
  },
  {
    "name": "typed_value",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "Any",
    "enums": null,
    "comment": "The value to place at the namespace. If ``allow_overwrite``, this will overwrite any existing values in that namespace. Only one of ``value`` and ``typed_value`` may be set.",
    "notImp": false
  }
] };

export const Metadata_SingleFields = [
  "metadata_namespace",
  "allow_overwrite"
];

export const Config: OutType = { "Config": [
  {
    "name": "metadata_namespace",
    "isUnion": false,
    "isDeprecated": true,
    "fieldType": "string",
    "enums": null,
    "comment": "The metadata namespace. This field is deprecated; please use ``metadata`` as replacement.",
    "notImp": false
  },
  {
    "name": "value",
    "isUnion": false,
    "isDeprecated": true,
    "fieldType": "{ [key: string]: any; }",
    "enums": null,
    "comment": "The untyped value to update the dynamic metadata namespace with. See `the filter documentation` for more information on how this value is merged with potentially existing ones. This field is deprecated; please use ``metadata`` as replacement.",
    "notImp": false
  },
  {
    "name": "metadata",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "Metadata[]",
    "enums": null,
    "comment": "Defines changes to be made to dynamic metadata.",
    "notImp": false
  }
] };