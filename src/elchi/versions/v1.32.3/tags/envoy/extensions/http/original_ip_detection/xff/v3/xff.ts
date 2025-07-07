import {OutType} from '@/elchi/tags/tagsType';


export const XffTrustedCidrs: OutType = { "XffTrustedCidrs": [
  {
    "name": "cidrs",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "CidrRange[]",
    "enums": null,
    "comment": "The list of `CIDRs <https://tools.ietf.org/html/rfc4632>`_ from which remote connections are considered trusted.",
    "notImp": false
  }
] };

export const XffConfig: OutType = { "XffConfig": [
  {
    "name": "xff_num_trusted_hops",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "number",
    "enums": null,
    "comment": "The number of additional ingress proxy hops from the right side of the `config_http_conn_man_headers_x-forwarded-for` HTTP header to trust when determining the origin client's IP address. The default is zero if this option is not specified. See the documentation for `config_http_conn_man_headers_x-forwarded-for` for more information.\n\nOnly one of ``xff_num_trusted_hops`` and ``xff_trusted_cidrs`` can be set.",
    "notImp": false
  },
  {
    "name": "xff_trusted_cidrs",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "XffTrustedCidrs",
    "enums": null,
    "comment": "The `CIDR <https://tools.ietf.org/html/rfc4632>`_ ranges to trust when evaluating the remote IP address to determine the original client's IP address. This is used instead of `use_remote_address`. When the remote IP address matches a trusted CIDR and the `config_http_conn_man_headers_x-forwarded-for` header was sent, each entry in the ``x-forwarded-for`` header is evaluated from right to left and the first public non-trusted address is used as the original client address. If all addresses in ``x-forwarded-for`` are within the trusted list, the first (leftmost) entry is used.\n\nThis is typically used when requests are proxied by a `CDN <https://en.wikipedia.org/wiki/Content_delivery_network>`_.\n\nOnly one of ``xff_num_trusted_hops`` and ``xff_trusted_cidrs`` can be set.",
    "notImp": false
  },
  {
    "name": "skip_xff_append",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "boolean",
    "enums": null,
    "comment": "If set, Envoy will not append the remote address to the `config_http_conn_man_headers_x-forwarded-for` HTTP header.\n\n:::attention\n\nFor proper proxy behaviour it is not recommended to set this option. For backwards compatibility, if this option is unset it defaults to true. \n:::\n\nThis only applies when `use_remote_address` is false, otherwise `skip_xff_append` applies.",
    "notImp": false
  }
] };

export const XffConfig_SingleFields = [
  "xff_num_trusted_hops",
  "skip_xff_append"
];