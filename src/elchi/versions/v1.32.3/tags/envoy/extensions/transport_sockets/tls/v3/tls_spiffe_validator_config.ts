import {OutType} from '@/elchi/tags/tagsType';


export const SPIFFECertValidatorConfig: OutType = { "SPIFFECertValidatorConfig": [
  {
    "name": "trust_domains",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "SPIFFECertValidatorConfig_TrustDomain[]",
    "enums": null,
    "comment": "This field specifies trust domains used for validating incoming X.509-SVID(s).",
    "notImp": false
  }
] };

export const SPIFFECertValidatorConfig_TrustDomain: OutType = { "SPIFFECertValidatorConfig_TrustDomain": [
  {
    "name": "name",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "string",
    "enums": null,
    "comment": "Name of the trust domain, ``example.com``, ``foo.bar.gov`` for example. Note that this must *not* have \"spiffe://\" prefix.",
    "notImp": false
  },
  {
    "name": "trust_bundle",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "DataSource",
    "enums": null,
    "comment": "Specify a data source holding x.509 trust bundle used for validating incoming SVID(s) in this trust domain.",
    "notImp": false
  }
] };

export const SPIFFECertValidatorConfig_TrustDomain_SingleFields = [
  "name"
];