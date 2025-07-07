import {OutType} from '@/elchi/tags/tagsType';


export const Certificates: OutType = { "Certificates": [
  {
    "name": "certificates",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "Certificate[]",
    "enums": null,
    "comment": "List of certificates known to an Envoy.",
    "notImp": false
  }
] };

export const Certificate: OutType = { "Certificate": [
  {
    "name": "ca_cert",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "CertificateDetails[]",
    "enums": null,
    "comment": "Details of CA certificate.",
    "notImp": false
  },
  {
    "name": "cert_chain",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "CertificateDetails[]",
    "enums": null,
    "comment": "Details of Certificate Chain",
    "notImp": false
  }
] };

export const CertificateDetails_OcspDetails: OutType = { "CertificateDetails_OcspDetails": [
  {
    "name": "valid_from",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "Date",
    "enums": null,
    "comment": "Indicates the time from which the OCSP response is valid.",
    "notImp": false
  },
  {
    "name": "expiration",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "Date",
    "enums": null,
    "comment": "Indicates the time at which the OCSP response expires.",
    "notImp": false
  }
] };

export const CertificateDetails: OutType = { "CertificateDetails": [
  {
    "name": "path",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "string",
    "enums": null,
    "comment": "Path of the certificate.",
    "notImp": false
  },
  {
    "name": "serial_number",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "string",
    "enums": null,
    "comment": "Certificate Serial Number.",
    "notImp": false
  },
  {
    "name": "subject_alt_names",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "SubjectAlternateName[]",
    "enums": null,
    "comment": "List of Subject Alternate names.",
    "notImp": false
  },
  {
    "name": "days_until_expiration",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "number",
    "enums": null,
    "comment": "Minimum of days until expiration of certificate and it's chain.",
    "notImp": false
  },
  {
    "name": "valid_from",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "Date",
    "enums": null,
    "comment": "Indicates the time from which the certificate is valid.",
    "notImp": false
  },
  {
    "name": "expiration_time",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "Date",
    "enums": null,
    "comment": "Indicates the time at which the certificate expires.",
    "notImp": false
  },
  {
    "name": "ocsp_details",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "CertificateDetails_OcspDetails",
    "enums": null,
    "comment": "Details related to the OCSP response associated with this certificate, if any.",
    "notImp": false
  }
] };

export const CertificateDetails_SingleFields = [
  "path",
  "serial_number",
  "days_until_expiration"
];

export const SubjectAlternateName: OutType = { "SubjectAlternateName": [
  {
    "name": "name.dns",
    "isUnion": true,
    "isDeprecated": false,
    "fieldType": "string",
    "enums": null,
    "comment": "Subject Alternate Name.",
    "notImp": false
  },
  {
    "name": "name.uri",
    "isUnion": true,
    "isDeprecated": false,
    "fieldType": "string",
    "enums": null,
    "comment": "Subject Alternate Name.",
    "notImp": false
  },
  {
    "name": "name.ip_address",
    "isUnion": true,
    "isDeprecated": false,
    "fieldType": "string",
    "enums": null,
    "comment": "Subject Alternate Name.",
    "notImp": false
  }
] };

export const SubjectAlternateName_SingleFields = [
  "name.dns",
  "name.uri",
  "name.ip_address"
];