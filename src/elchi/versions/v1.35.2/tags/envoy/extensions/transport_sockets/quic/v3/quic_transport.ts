import {OutType} from '@elchi/tags/tagsType';


export const QuicDownstreamTransport: OutType = { "QuicDownstreamTransport": [
  {
    "name": "downstream_tls_context",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "DownstreamTlsContext",
    "enums": null,
    "comment": "",
    "notImp": false
  },
  {
    "name": "enable_early_data",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "boolean",
    "enums": null,
    "comment": "If false, QUIC will tell TLS to reject any early data and to stop issuing 0-RTT credentials with resumption session tickets. This will prevent clients from sending 0-RTT requests. Default to true.",
    "notImp": false
  }
] };

export const QuicDownstreamTransport_SingleFields = [
  "enable_early_data"
];

export const QuicUpstreamTransport: OutType = { "QuicUpstreamTransport": [
  {
    "name": "upstream_tls_context",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "UpstreamTlsContext",
    "enums": null,
    "comment": "",
    "notImp": false
  }
] };