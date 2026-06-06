import {OutType} from '@elchi/tags/tagsType';


export const IPTagging_IpTagHeader: OutType = { "IPTagging_IpTagHeader": [
  {
    "name": "header",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "string",
    "enums": null,
    "comment": "Header to use for ip-tagging.\n\nThis header will be sanitized based on the config in `action` rather than the defaults for x-envoy prefixed headers.",
    "notImp": false
  },
  {
    "name": "action",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "IPTagging_IpTagHeader_HeaderAction",
    "enums": [
      "SANITIZE",
      "APPEND_IF_EXISTS_OR_ADD"
    ],
    "comment": "Control if the `header` will be sanitized, or be appended to.\n\nDefault: *SANITIZE*.",
    "notImp": false
  }
] };

export const IPTagging_IpTagHeader_SingleFields = [
  "header",
  "action"
];

export const IPTagging: OutType = { "IPTagging": [
  {
    "name": "request_type",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "IPTagging_RequestType",
    "enums": [
      "BOTH",
      "INTERNAL",
      "EXTERNAL"
    ],
    "comment": "The type of request the filter should apply to.",
    "notImp": false
  },
  {
    "name": "ip_tags",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "IPTagging_IPTag[]",
    "enums": null,
    "comment": "The set of IP tags for the filter.",
    "notImp": false
  },
  {
    "name": "ip_tag_header",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "IPTagging_IpTagHeader",
    "enums": null,
    "comment": "Specify to which header the tags will be written.\n\nIf left unspecified, the tags will be appended to the ``x-envoy-ip-tags`` header.",
    "notImp": false
  }
] };

export const IPTagging_SingleFields = [
  "request_type"
];

export const IPTagging_IPTag: OutType = { "IPTagging_IPTag": [
  {
    "name": "ip_tag_name",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "string",
    "enums": null,
    "comment": "Specifies the IP tag name to apply.",
    "notImp": false
  },
  {
    "name": "ip_list",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "CidrRange[]",
    "enums": null,
    "comment": "A list of IP address subnets that will be tagged with ip_tag_name. Both IPv4 and IPv6 are supported.",
    "notImp": false
  }
] };

export const IPTagging_IPTag_SingleFields = [
  "ip_tag_name"
];