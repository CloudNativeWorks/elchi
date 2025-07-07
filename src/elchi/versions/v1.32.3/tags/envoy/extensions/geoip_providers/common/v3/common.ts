import {OutType} from '@/elchi/tags/tagsType';


export const CommonGeoipProviderConfig_GeolocationHeadersToAdd: OutType = { "CommonGeoipProviderConfig_GeolocationHeadersToAdd": [
  {
    "name": "country",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "string",
    "enums": null,
    "comment": "If set, the header will be used to populate the country ISO code associated with the IP address.",
    "notImp": false
  },
  {
    "name": "city",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "string",
    "enums": null,
    "comment": "If set, the header will be used to populate the city associated with the IP address.",
    "notImp": false
  },
  {
    "name": "region",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "string",
    "enums": null,
    "comment": "If set, the header will be used to populate the region ISO code associated with the IP address. The least specific subdivision will be selected as region value.",
    "notImp": false
  },
  {
    "name": "asn",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "string",
    "enums": null,
    "comment": "If set, the header will be used to populate the ASN associated with the IP address.",
    "notImp": false
  },
  {
    "name": "is_anon",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "string",
    "enums": null,
    "comment": "If set, the IP address will be checked if it belongs to any type of anonymization network (e.g. VPN, public proxy etc) and header will be populated with the check result. Header value will be set to either \"true\" or \"false\" depending on the check result.",
    "notImp": false
  },
  {
    "name": "anon_vpn",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "string",
    "enums": null,
    "comment": "If set, the IP address will be checked if it belongs to a VPN and header will be populated with the check result. Header value will be set to either \"true\" or \"false\" depending on the check result.",
    "notImp": false
  },
  {
    "name": "anon_hosting",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "string",
    "enums": null,
    "comment": "If set, the IP address will be checked if it belongs to a hosting provider and header will be populated with the check result. Header value will be set to either \"true\" or \"false\" depending on the check result.",
    "notImp": false
  },
  {
    "name": "anon_tor",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "string",
    "enums": null,
    "comment": "If set, the IP address will be checked if it belongs to a TOR exit node and header will be populated with the check result. Header value will be set to either \"true\" or \"false\" depending on the check result.",
    "notImp": false
  },
  {
    "name": "anon_proxy",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "string",
    "enums": null,
    "comment": "If set, the IP address will be checked if it belongs to a public proxy and header will be populated with the check result. Header value will be set to either \"true\" or \"false\" depending on the check result.",
    "notImp": false
  }
] };

export const CommonGeoipProviderConfig_GeolocationHeadersToAdd_SingleFields = [
  "country",
  "city",
  "region",
  "asn",
  "is_anon",
  "anon_vpn",
  "anon_hosting",
  "anon_tor",
  "anon_proxy"
];

export const CommonGeoipProviderConfig: OutType = { "CommonGeoipProviderConfig": [
  {
    "name": "geo_headers_to_add",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "CommonGeoipProviderConfig_GeolocationHeadersToAdd",
    "enums": null,
    "comment": "Configuration for geolocation headers to add to request.",
    "notImp": false
  }
] };