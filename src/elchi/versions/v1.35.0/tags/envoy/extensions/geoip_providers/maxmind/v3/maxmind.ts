import {OutType} from '@elchi/tags/tagsType';


export const MaxMindConfig: OutType = { "MaxMindConfig": [
  {
    "name": "city_db_path",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "string",
    "enums": null,
    "comment": "Full file path to the Maxmind city database, e.g. /etc/GeoLite2-City.mmdb. Database file is expected to have .mmdb extension.",
    "notImp": false
  },
  {
    "name": "asn_db_path",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "string",
    "enums": null,
    "comment": "Full file path to the Maxmind ASN database, e.g. /etc/GeoLite2-ASN.mmdb. Database file is expected to have .mmdb extension. When is defined the ASN information will always be fetched from the ``asn_db``.",
    "notImp": false
  },
  {
    "name": "anon_db_path",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "string",
    "enums": null,
    "comment": "Full file path to the Maxmind anonymous IP database, e.g. /etc/GeoIP2-Anonymous-IP.mmdb. Database file is expected to have .mmdb extension.",
    "notImp": false
  },
  {
    "name": "isp_db_path",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "string",
    "enums": null,
    "comment": "Full file path to the Maxmind ISP database, e.g. /etc/GeoLite2-ISP.mmdb. Database file is expected to have .mmdb extension. If ``asn_db_path`` is not defined, ASN information will be fetched from ``isp_db`` instead.",
    "notImp": false
  },
  {
    "name": "common_provider_config",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "CommonGeoipProviderConfig",
    "enums": null,
    "comment": "Common provider configuration that specifies which geolocation headers will be populated with geolocation data.",
    "notImp": false
  }
] };

export const MaxMindConfig_SingleFields = [
  "city_db_path",
  "asn_db_path",
  "anon_db_path",
  "isp_db_path"
];