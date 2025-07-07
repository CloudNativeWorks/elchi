import {OutType} from '@/elchi/tags/tagsType';


export const CdnLoopConfig: OutType = { "CdnLoopConfig": [
  {
    "name": "cdn_id",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "string",
    "enums": null,
    "comment": "The CDN identifier to use for loop checks and to append to the CDN-Loop header.\n\nRFC 8586 calls this the cdn-id. The cdn-id can either be a pseudonym or hostname the CDN is in control of.\n\ncdn_id must not be empty.",
    "notImp": false
  },
  {
    "name": "max_allowed_occurrences",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "number",
    "enums": null,
    "comment": "The maximum allowed count of cdn_id in the downstream CDN-Loop request header.\n\nThe default of 0 means a request can transit the CdnLoopFilter once. A value of 1 means that a request can transit the CdnLoopFilter twice and so on.",
    "notImp": false
  }
] };

export const CdnLoopConfig_SingleFields = [
  "cdn_id",
  "max_allowed_occurrences"
];