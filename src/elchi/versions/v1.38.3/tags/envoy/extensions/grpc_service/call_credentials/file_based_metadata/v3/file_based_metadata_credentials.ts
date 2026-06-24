import {OutType} from '@elchi/tags/tagsType';


export const FileBasedMetadataCallCredentials: OutType = { "FileBasedMetadataCallCredentials": [
  {
    "name": "secret_data",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "DataSource",
    "enums": null,
    "comment": "Location or inline data of secret to use for authentication of the Google gRPC connection this secret will be attached to a header of the gRPC connection",
    "notImp": false
  },
  {
    "name": "header_key",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "string",
    "enums": null,
    "comment": "Metadata header key to use for sending the secret data if no header key is set, \"authorization\" header will be used",
    "notImp": false
  },
  {
    "name": "header_prefix",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "string",
    "enums": null,
    "comment": "Prefix to prepend to the secret in the metadata header if no prefix is set, the default is to use no prefix",
    "notImp": false
  }
] };

export const FileBasedMetadataCallCredentials_SingleFields = [
  "header_key",
  "header_prefix"
];