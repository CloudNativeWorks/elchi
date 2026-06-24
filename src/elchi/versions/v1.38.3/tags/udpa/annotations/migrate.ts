import {OutType} from '@elchi/tags/tagsType';


export const MigrateAnnotation: OutType = { "MigrateAnnotation": [
  {
    "name": "rename",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "string",
    "enums": null,
    "comment": "Rename the message/enum/enum value in next version.",
    "notImp": false
  }
] };

export const MigrateAnnotation_SingleFields = [
  "rename"
];

export const FieldMigrateAnnotation: OutType = { "FieldMigrateAnnotation": [
  {
    "name": "rename",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "string",
    "enums": null,
    "comment": "Rename the field in next version.",
    "notImp": false
  },
  {
    "name": "oneof_promotion",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "string",
    "enums": null,
    "comment": "Add the field to a named oneof in next version. If this already exists, the field will join its siblings under the oneof, otherwise a new oneof will be created with the given name.",
    "notImp": false
  }
] };

export const FieldMigrateAnnotation_SingleFields = [
  "rename",
  "oneof_promotion"
];

export const FileMigrateAnnotation: OutType = { "FileMigrateAnnotation": [
  {
    "name": "move_to_package",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "string",
    "enums": null,
    "comment": "Move all types in the file to another package, this implies changing proto file path.",
    "notImp": false
  }
] };

export const FileMigrateAnnotation_SingleFields = [
  "move_to_package"
];