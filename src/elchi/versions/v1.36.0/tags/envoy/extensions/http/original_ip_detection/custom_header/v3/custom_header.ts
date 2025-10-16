import {OutType} from '@elchi/tags/tagsType';


export const CustomHeaderConfig: OutType = { "CustomHeaderConfig": [
  {
    "name": "header_name",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "string",
    "enums": null,
    "comment": "The header name containing the original downstream remote address, if present.\n\nNote: in the case of a multi-valued header, only the first value is tried and the rest are ignored.",
    "notImp": false
  },
  {
    "name": "allow_extension_to_set_address_as_trusted",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "boolean",
    "enums": null,
    "comment": "If set to true, the extension could decide that the detected address should be treated as trusted by the HCM. If the address is considered `trusted`, it might be used as input to determine if the request is internal (among other things).",
    "notImp": false
  },
  {
    "name": "reject_with_status",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "HttpStatus",
    "enums": null,
    "comment": "If this is set, the request will be rejected when detection fails using it as the HTTP response status.\n\n:::note\nIf this is set to < 400 or > 511, the default status 403 will be used instead.",
    "notImp": false
  }
] };

export const CustomHeaderConfig_SingleFields = [
  "header_name",
  "allow_extension_to_set_address_as_trusted"
];