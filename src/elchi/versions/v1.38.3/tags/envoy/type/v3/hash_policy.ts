import {OutType} from '@elchi/tags/tagsType';


export const HashPolicy: OutType = { "HashPolicy": [
  {
    "name": "policy_specifier.source_ip",
    "isUnion": true,
    "isDeprecated": false,
    "fieldType": "HashPolicy_SourceIp",
    "enums": null,
    "comment": "Specifies the hash policy",
    "notImp": false
  },
  {
    "name": "policy_specifier.filter_state",
    "isUnion": true,
    "isDeprecated": false,
    "fieldType": "HashPolicy_FilterState",
    "enums": null,
    "comment": "Specifies the hash policy",
    "notImp": false
  }
] };

export const HashPolicy_FilterState: OutType = { "HashPolicy_FilterState": [
  {
    "name": "key",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "string",
    "enums": null,
    "comment": "The name of the Object in the filterState, which is an Envoy::Hashable object. If there is no data associated with the key, or the stored object is not Envoy::Hashable, no hash will be produced.",
    "notImp": false
  }
] };

export const HashPolicy_FilterState_SingleFields = [
  "key"
];