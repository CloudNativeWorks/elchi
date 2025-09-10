import {OutType} from '@elchi/tags/tagsType';


export const CidrRange: OutType = { "CidrRange": [
  {
    "name": "address_prefix",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "string",
    "enums": null,
    "comment": "IPv4 or IPv6 address, e.g. ``192.0.0.0`` or ``2001:db8::``.",
    "notImp": false
  },
  {
    "name": "prefix_len",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "number",
    "enums": null,
    "comment": "Length of prefix, e.g. 0, 32. Defaults to 0 when unset.",
    "notImp": false
  }
] };

export const CidrRange_SingleFields = [
  "address_prefix",
  "prefix_len"
];