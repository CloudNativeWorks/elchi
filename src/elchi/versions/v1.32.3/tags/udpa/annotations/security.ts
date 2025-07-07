import {OutType} from '@/elchi/tags/tagsType';


export const FieldSecurityAnnotation: OutType = { "FieldSecurityAnnotation": [
  {
    "name": "configure_for_untrusted_downstream",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "boolean",
    "enums": null,
    "comment": "Field should be set in the presence of untrusted downstreams.",
    "notImp": false
  },
  {
    "name": "configure_for_untrusted_upstream",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "boolean",
    "enums": null,
    "comment": "Field should be set in the presence of untrusted upstreams.",
    "notImp": false
  }
] };

export const FieldSecurityAnnotation_SingleFields = [
  "configure_for_untrusted_downstream",
  "configure_for_untrusted_upstream"
];