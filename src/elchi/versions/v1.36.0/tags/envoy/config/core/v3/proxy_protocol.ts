import {OutType} from '@elchi/tags/tagsType';


export const ProxyProtocolPassThroughTLVs: OutType = { "ProxyProtocolPassThroughTLVs": [
  {
    "name": "match_type",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "ProxyProtocolPassThroughTLVs_PassTLVsMatchType",
    "enums": [
      "INCLUDE_ALL",
      "INCLUDE"
    ],
    "comment": "The strategy to pass through TLVs. Default is INCLUDE_ALL. If INCLUDE_ALL is set, all TLVs will be passed through no matter the tlv_type field.",
    "notImp": false
  },
  {
    "name": "tlv_type",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "number[]",
    "enums": null,
    "comment": "The TLV types that are applied based on match_type. TLV type is defined as uint8_t in proxy protocol. See `the spec <https://www.haproxy.org/download/2.1/doc/proxy-protocol.txt>`_ for details.",
    "notImp": false
  }
] };

export const ProxyProtocolPassThroughTLVs_SingleFields = [
  "match_type",
  "tlv_type"
];

export const TlvEntry: OutType = { "TlvEntry": [
  {
    "name": "type",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "number",
    "enums": null,
    "comment": "The type of the TLV. Must be a uint8 (0-255) as per the Proxy Protocol v2 specification.",
    "notImp": false
  },
  {
    "name": "value",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "Uint8Array<ArrayBufferLike>",
    "enums": null,
    "comment": "The static value of the TLV. Only one of ``value`` or ``format_string`` may be set.",
    "notImp": false
  },
  {
    "name": "format_string",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "SubstitutionFormatString",
    "enums": null,
    "comment": "Uses the `format string` to dynamically populate the TLV value from stream information. This allows dynamic values such as metadata, filter state, or other stream properties to be included in the TLV.\n\nFor example:\n\n```yaml\n\n  type: 0xF0\n  format_string:\n    text_format_source:\n      inline_string: \"%DYNAMIC_METADATA(envoy.filters.network:key)%\"\n```\n\nThe formatted string will be used directly as the TLV value. Only one of ``value`` or ``format_string`` may be set.",
    "notImp": false
  }
] };

export const TlvEntry_SingleFields = [
  "type"
];

export const ProxyProtocolConfig: OutType = { "ProxyProtocolConfig": [
  {
    "name": "version",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "ProxyProtocolConfig_Version",
    "enums": [
      "V1",
      "V2"
    ],
    "comment": "The PROXY protocol version to use. See https://www.haproxy.org/download/2.1/doc/proxy-protocol.txt for details",
    "notImp": false
  },
  {
    "name": "pass_through_tlvs",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "ProxyProtocolPassThroughTLVs",
    "enums": null,
    "comment": "This config controls which TLVs can be passed to upstream if it is Proxy Protocol V2 header. If there is no setting for this field, no TLVs will be passed through.",
    "notImp": false
  },
  {
    "name": "added_tlvs",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "TlvEntry[]",
    "enums": null,
    "comment": "This config allows additional TLVs to be included in the upstream PROXY protocol V2 header. Unlike ``pass_through_tlvs``, which passes TLVs from the downstream request, ``added_tlvs`` provides an extension mechanism for defining new TLVs that are included with the upstream request. These TLVs may not be present in the downstream request and can be defined at either the transport socket level or the host level to provide more granular control over the TLVs that are included in the upstream request.\n\nHost-level TLVs are specified in the ``metadata.typed_filter_metadata`` field under the ``envoy.transport_sockets.proxy_protocol`` namespace.\n\n.. literalinclude:: /_configs/repo/proxy_protocol.yaml :language: yaml :lines: 49-57 :linenos: :lineno-start: 49 :caption: :download:`proxy_protocol.yaml </_configs/repo/proxy_protocol.yaml>`\n\n**Precedence behavior**:\n\n- When a TLV is defined at both the host level and the transport socket level, the value from the host level configuration takes precedence. This allows users to define default TLVs at the transport socket level and override them at the host level. - Any TLV defined in the ``pass_through_tlvs`` field will be overridden by either the host-level or transport socket-level TLV.",
    "notImp": false
  }
] };

export const ProxyProtocolConfig_SingleFields = [
  "version"
];

export const PerHostConfig: OutType = { "PerHostConfig": [
  {
    "name": "added_tlvs",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "TlvEntry[]",
    "enums": null,
    "comment": "Enables per-host configuration for Proxy Protocol.",
    "notImp": false
  }
] };