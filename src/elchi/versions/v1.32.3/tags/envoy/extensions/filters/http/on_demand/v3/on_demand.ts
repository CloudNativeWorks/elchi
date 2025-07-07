import {OutType} from '@/elchi/tags/tagsType';


export const OnDemandCds: OutType = { "OnDemandCds": [
  {
    "name": "source",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "ConfigSource",
    "enums": null,
    "comment": "A configuration source for the service that will be used for on-demand cluster discovery.",
    "notImp": false
  },
  {
    "name": "resources_locator",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "string",
    "enums": null,
    "comment": "xdstp:// resource locator for on-demand cluster collection.",
    "notImp": false
  },
  {
    "name": "timeout",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "Duration",
    "enums": null,
    "comment": "The timeout for on demand cluster lookup. If not set, defaults to 5 seconds.",
    "notImp": false
  }
] };

export const OnDemandCds_SingleFields = [
  "resources_locator",
  "timeout"
];

export const OnDemand: OutType = { "OnDemand": [
  {
    "name": "odcds",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "OnDemandCds",
    "enums": null,
    "comment": "An optional configuration for on-demand cluster discovery service. If not specified, the on-demand cluster discovery will be disabled. When it's specified, the filter will pause the request to an unknown cluster and will begin a cluster discovery process. When the discovery is finished (successfully or not), the request will be resumed for further processing.",
    "notImp": false
  }
] };

export const PerRouteConfig: OutType = { "PerRouteConfig": [
  {
    "name": "odcds",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "OnDemandCds",
    "enums": null,
    "comment": "An optional configuration for on-demand cluster discovery service. If not specified, the on-demand cluster discovery will be disabled. When it's specified, the filter will pause the request to an unknown cluster and will begin a cluster discovery process. When the discovery is finished (successfully or not), the request will be resumed for further processing.",
    "notImp": false
  }
] };