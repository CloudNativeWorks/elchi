import {OutType} from '@elchi/tags/tagsType';


export const Config: OutType = { "Config": [
  {
    "name": "on_new_connection",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "FilterStateValue[]",
    "enums": null,
    "comment": "A sequence of the filter state values to apply in the specified order when a new connection is received.",
    "notImp": false
  },
  {
    "name": "on_downstream_tls_handshake",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "FilterStateValue[]",
    "enums": null,
    "comment": "A sequence of the filter state values to apply in the specified order when the downstream TLS handshake is complete.\n\nFor non-TLS downstream connections (where there is no TLS handshake), this list is applied when a new connection is received.",
    "notImp": false
  }
] };