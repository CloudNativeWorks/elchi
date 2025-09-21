import {OutType} from '@elchi/tags/tagsType';


export const ClientSSLAuth: OutType = { "ClientSSLAuth": [
  {
    "name": "auth_api_cluster",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "string",
    "enums": null,
    "comment": "The `cluster manager` cluster that runs the authentication service. The filter will connect to the service every 60s to fetch the list of principals. The service must support the expected `REST API`.",
    "notImp": false
  },
  {
    "name": "stat_prefix",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "string",
    "enums": null,
    "comment": "The prefix to use when emitting `statistics`.",
    "notImp": false
  },
  {
    "name": "refresh_delay",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "Duration",
    "enums": null,
    "comment": "Time in milliseconds between principal refreshes from the authentication service. Default is 60000 (60s). The actual fetch time will be this value plus a random jittered value between 0-refresh_delay_ms milliseconds.",
    "notImp": false
  },
  {
    "name": "ip_white_list",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "CidrRange[]",
    "enums": null,
    "comment": "An optional list of IP address and subnet masks that should be white listed for access by the filter. If no list is provided, there is no IP allowlist.",
    "notImp": false
  }
] };

export const ClientSSLAuth_SingleFields = [
  "auth_api_cluster",
  "stat_prefix",
  "refresh_delay"
];