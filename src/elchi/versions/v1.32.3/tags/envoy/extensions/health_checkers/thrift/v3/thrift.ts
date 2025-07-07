import {OutType} from '@/elchi/tags/tagsType';


export const Thrift: OutType = { "Thrift": [
  {
    "name": "method_name",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "string",
    "enums": null,
    "comment": "Specifies the method name that will be set on each health check request dispatched to an upstream host. Note that method name is case sensitive.",
    "notImp": false
  },
  {
    "name": "transport",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "TransportType",
    "enums": [
      "AUTO_TRANSPORT",
      "FRAMED",
      "UNFRAMED",
      "HEADER"
    ],
    "comment": "Configures the transport type to be used with the health checks. Note that `AUTO_TRANSPORT` is not supported, and we don't honor `ThriftProtocolOptions` since it's possible to set to `AUTO_TRANSPORT`. extension-category: envoy.filters.network",
    "notImp": false
  },
  {
    "name": "protocol",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "ProtocolType",
    "enums": [
      "AUTO_PROTOCOL",
      "BINARY",
      "LAX_BINARY",
      "COMPACT",
      "TWITTER"
    ],
    "comment": "Configures the protocol type to be used with the health checks. Note that `AUTO_PROTOCOL` and `TWITTER` are not supported, and we don't honor `ThriftProtocolOptions` since it's possible to set to `AUTO_PROTOCOL` or `TWITTER`.",
    "notImp": false
  }
] };

export const Thrift_SingleFields = [
  "method_name",
  "transport",
  "protocol"
];