import {OutType} from '@elchi/tags/tagsType';


export const VersioningAnnotation: OutType = { "VersioningAnnotation": [
  {
    "name": "previous_message_type",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "string",
    "enums": null,
    "comment": "Track the previous message type. E.g. this message might be udpa.foo.v3alpha.Foo and it was previously udpa.bar.v2.Bar. This information is consumed by UDPA via proto descriptors.",
    "notImp": false
  }
] };

export const VersioningAnnotation_SingleFields = [
  "previous_message_type"
];