import {OutType} from '@elchi/tags/tagsType';


export const MaxMindConfig: OutType = { "MaxMindConfig": [
  {
    "name": "city_db_path",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "string",
    "enums": null,
    "comment": "Full file path to the MaxMind city database, e.g., ``/etc/GeoLite2-City.mmdb``. Database file is expected to have ``.mmdb`` extension.",
    "notImp": false
  },
  {
    "name": "asn_db_path",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "string",
    "enums": null,
    "comment": "Full file path to the MaxMind ASN database, e.g., ``/etc/GeoLite2-ASN.mmdb``. Database file is expected to have ``.mmdb`` extension. When this is defined, the ASN information will always be fetched from the ``asn_db``.",
    "notImp": false
  },
  {
    "name": "anon_db_path",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "string",
    "enums": null,
    "comment": "Full file path to the MaxMind Anonymous IP database, e.g., ``/etc/GeoIP2-Anonymous-IP.mmdb``. Database file is expected to have ``.mmdb`` extension.",
    "notImp": false
  },
  {
    "name": "isp_db_path",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "string",
    "enums": null,
    "comment": "Full file path to the MaxMind ISP database, e.g., ``/etc/GeoLite2-ISP.mmdb``. Database file is expected to have ``.mmdb`` extension. If ``asn_db_path`` is not defined, ASN information will be fetched from ``isp_db`` instead.",
    "notImp": false
  },
  {
    "name": "country_db_path",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "string",
    "enums": null,
    "comment": "Full file path to the MaxMind Country database, e.g., ``/etc/GeoLite2-Country.mmdb``. Database file is expected to have ``.mmdb`` extension.\n\nIf ``country_db_path`` is not specified, country information will be fetched from ``city_db`` if ``city_db`` is configured.",
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
  "isp_db_path",
  "country_db_path"
];