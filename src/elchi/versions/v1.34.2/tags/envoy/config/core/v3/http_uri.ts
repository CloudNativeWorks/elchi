import {OutType} from '@elchi/tags/tagsType';


export const HttpUri: OutType = { "HttpUri": [
  {
    "name": "uri",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "string",
    "enums": null,
    "comment": "The HTTP server URI. It should be a full FQDN with protocol, host and path.\n\nExample:\n\n```yaml\n\n   uri: https://www.googleapis.com/oauth2/v1/certs",
    "notImp": false
  },
  {
    "name": "http_upstream_type.cluster",
    "isUnion": true,
    "isDeprecated": false,
    "fieldType": "string",
    "enums": null,
    "comment": "A cluster is created in the Envoy \"cluster_manager\" config section. This field specifies the cluster name.\n\nExample:\n\n```yaml\n\n   cluster: jwks_cluster",
    "notImp": false
  },
  {
    "name": "timeout",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "Duration",
    "enums": null,
    "comment": "Sets the maximum duration in milliseconds that a response can take to arrive upon request.",
    "notImp": false
  }
] };

export const HttpUri_SingleFields = [
  "uri",
  "http_upstream_type.cluster",
  "timeout"
];