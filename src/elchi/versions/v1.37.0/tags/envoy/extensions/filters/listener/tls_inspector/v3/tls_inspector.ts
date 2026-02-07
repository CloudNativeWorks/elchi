import {OutType} from '@elchi/tags/tagsType';


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
    "name": "enable_ja4_fingerprinting",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "boolean",
    "enums": null,
    "comment": "Populate ``JA4`` fingerprint hash using data from the TLS Client Hello packet. ``JA4`` is an improved version of ``JA3`` that includes TLS version, ciphers, extensions, and ALPN information in a hex format. Default is false.",
    "notImp": false
  },
  {
    "name": "initial_read_buffer_size",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "number",
    "enums": null,
    "comment": "The size in bytes of the initial buffer requested by the tls_inspector. If the filter needs to read additional bytes from the socket, the filter will double the buffer up to it's default maximum of 16KiB. If this size is not defined, defaults to maximum 16KiB that the tls inspector will consume.",
    "notImp": false
  },
  {
    "name": "close_connection_on_client_hello_parsing_errors",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "boolean",
    "enums": null,
    "comment": "Close connection when TLS ClientHello message could not be parsed. This flag should be enabled only if it is known that incoming connections are expected to use TLS protocol, as Envoy does not distinguish between a plain text message or a malformed TLS ClientHello message. By default this flag is false and TLS ClientHello parsing errors are interpreted as a plain text connection. Setting this to true will cause connections to be terminated and the ``client_hello_too_large`` counter to be incremented if the ClientHello message is over implementation defined limit (currently 16Kb).",
    "notImp": false
  },
  {
    "name": "max_client_hello_size",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "number",
    "enums": null,
    "comment": "The maximum size in bytes of the ClientHello that the tls_inspector will process. If the ClientHello is larger than this size, the tls_inspector will stop processing and indicate failure. If not defined, defaults to 16KiB.",
    "notImp": false
  }
] };

export const TlsInspector_SingleFields = [
  "enable_ja3_fingerprinting",
  "enable_ja4_fingerprinting",
  "initial_read_buffer_size",
  "close_connection_on_client_hello_parsing_errors",
  "max_client_hello_size"
];