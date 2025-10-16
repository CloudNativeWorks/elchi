import {OutType} from '@elchi/tags/tagsType';


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
    "comment": "If set, the header will be used to populate the region ISO code associated with the IP address. The least specific subdivision will be selected as the region value.",
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
    "isDeprecated": true,
    "fieldType": "string",
    "enums": null,
    "comment": "This field is deprecated; use ``anon`` instead.",
    "notImp": false
  },
  {
    "name": "anon",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "string",
    "enums": null,
    "comment": "If set, the IP address will be checked if it belongs to any type of anonymization network (e.g., VPN, public proxy). The header will be populated with the check result. Header value will be set to either ``true`` or ``false`` depending on the check result.",
    "notImp": false
  },
  {
    "name": "anon_vpn",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "string",
    "enums": null,
    "comment": "If set, the IP address will be checked if it belongs to a VPN and the header will be populated with the check result. Header value will be set to either ``true`` or ``false`` depending on the check result.",
    "notImp": false
  },
  {
    "name": "anon_hosting",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "string",
    "enums": null,
    "comment": "If set, the IP address will be checked if it belongs to a hosting provider and the header will be populated with the check result. Header value will be set to either ``true`` or ``false`` depending on the check result.",
    "notImp": false
  },
  {
    "name": "anon_tor",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "string",
    "enums": null,
    "comment": "If set, the IP address will be checked if it belongs to a TOR exit node and the header will be populated with the check result. Header value will be set to either ``true`` or ``false`` depending on the check result.",
    "notImp": false
  },
  {
    "name": "anon_proxy",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "string",
    "enums": null,
    "comment": "If set, the IP address will be checked if it belongs to a public proxy and the header will be populated with the check result. Header value will be set to either ``true`` or ``false`` depending on the check result.",
    "notImp": false
  },
  {
    "name": "isp",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "string",
    "enums": null,
    "comment": "If set, the header will be used to populate the ISP associated with the IP address.",
    "notImp": false
  },
  {
    "name": "apple_private_relay",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "string",
    "enums": null,
    "comment": "If set, the IP address will be checked if it belongs to the ISP named iCloud Private Relay and the header will be populated with the check result. Header value will be set to either ``true`` or ``false`` depending on the check result.",
    "notImp": false
  }
] };

export const CommonGeoipProviderConfig_GeolocationHeadersToAdd_SingleFields = [
  "country",
  "city",
  "region",
  "asn",
  "anon",
  "anon_vpn",
  "anon_hosting",
  "anon_tor",
  "anon_proxy",
  "isp",
  "apple_private_relay"
];

export const CommonGeoipProviderConfig: OutType = { "CommonGeoipProviderConfig": [
  {
    "name": "geo_headers_to_add",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "CommonGeoipProviderConfig_GeolocationHeadersToAdd",
    "enums": null,
    "comment": "Configuration for geolocation headers to add to the request.",
    "notImp": false
  }
] };