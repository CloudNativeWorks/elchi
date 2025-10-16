import {OutType} from '@elchi/tags/tagsType';


export const Alts: OutType = { "Alts": [
  {
    "name": "handshaker_service",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "string",
    "enums": null,
    "comment": "The location of a handshaker service, this is usually 169.254.169.254:8080 on GCE.",
    "notImp": false
  },
  {
    "name": "peer_service_accounts",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "string[]",
    "enums": null,
    "comment": "The acceptable service accounts from peer, peers not in the list will be rejected in the handshake validation step. If empty, no validation will be performed.",
    "notImp": false
  }
] };

export const Alts_SingleFields = [
  "handshaker_service",
  "peer_service_accounts"
];