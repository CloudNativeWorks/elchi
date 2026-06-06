import {OutType} from '@elchi/tags/tagsType';


export const MetadataExchange: OutType = { "MetadataExchange": [
  {
    "name": "protocol",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "string",
    "enums": null,
    "comment": "Protocol that Alpn should support on the server.",
    "notImp": false
  },
  {
    "name": "enable_discovery",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "boolean",
    "enums": null,
    "comment": "If true, will attempt to use WDS in case the prefix peer metadata is not available.",
    "notImp": false
  },
  {
    "name": "additional_labels",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "string[]",
    "enums": null,
    "comment": "Additional labels to be added to the peer metadata to help your understand the traffic. e.g. ``role``, ``location`` etc.",
    "notImp": false
  }
] };

export const MetadataExchange_SingleFields = [
  "protocol",
  "enable_discovery",
  "additional_labels"
];