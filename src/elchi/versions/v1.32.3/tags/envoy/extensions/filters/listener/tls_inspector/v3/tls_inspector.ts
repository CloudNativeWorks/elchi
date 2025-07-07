import {OutType} from '@/elchi/tags/tagsType';


export const TlsInspector: OutType = { "TlsInspector": [
  {
    "name": "enable_ja3_fingerprinting",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "boolean",
    "enums": null,
    "comment": "Populate ``JA3`` fingerprint hash using data from the TLS Client Hello packet. Default is false.",
    "notImp": false
  },
  {
    "name": "initial_read_buffer_size",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "number",
    "enums": null,
    "comment": "The size in bytes of the initial buffer requested by the tls_inspector. If the filter needs to read additional bytes from the socket, the filter will double the buffer up to it's default maximum of 64KiB. If this size is not defined, defaults to maximum 64KiB that the tls inspector will consume.",
    "notImp": false
  }
] };

export const TlsInspector_SingleFields = [
  "enable_ja3_fingerprinting",
  "initial_read_buffer_size"
];