import {OutType} from '@elchi/tags/tagsType';


export const Config: OutType = { "Config": [
  {
    "name": "san_matcher",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "SubjectAltNameMatcher",
    "enums": null,
    "comment": "Specifies a SAN that must be present in the validated peer certificate.",
    "notImp": false
  },
  {
    "name": "any_validated_client_certificate",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "boolean",
    "enums": null,
    "comment": "Only require that the peer certificate is present and valid.",
    "notImp": false
  }
] };

export const Config_SingleFields = [
  "any_validated_client_certificate"
];