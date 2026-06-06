import {OutType} from '@elchi/tags/tagsType';


export const Http11ProxyUpstreamTransport: OutType = { "Http11ProxyUpstreamTransport": [
  {
    "name": "transport_socket",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "TransportSocket",
    "enums": null,
    "comment": "The underlying transport socket being wrapped. Defaults to plaintext (raw_buffer) if unset.",
    "notImp": false
  },
  {
    "name": "default_proxy_address",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "Address",
    "enums": null,
    "comment": "Specifies the default proxy address to use if the proxy address is not present in the ``typed_filter_metadata`` of the endpoint.",
    "notImp": false
  }
] };