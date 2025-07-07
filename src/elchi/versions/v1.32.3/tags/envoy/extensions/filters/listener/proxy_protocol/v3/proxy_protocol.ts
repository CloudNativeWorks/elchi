import {OutType} from '@/elchi/tags/tagsType';


export const ProxyProtocol: OutType = { "ProxyProtocol": [
  {
    "name": "rules",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "ProxyProtocol_Rule[]",
    "enums": null,
    "comment": "The list of rules to apply to requests.",
    "notImp": false
  },
  {
    "name": "allow_requests_without_proxy_protocol",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "boolean",
    "enums": null,
    "comment": "Allow requests through that don't use proxy protocol. Defaults to false.\n\n:::attention\n\nThis breaks conformance with the specification. Only enable if ALL traffic to the listener comes from a trusted source. For more information on the security implications of this feature, see https://www.haproxy.org/download/2.1/doc/proxy-protocol.txt \n:::\n\n:::attention\n\nRequests of 12 or fewer bytes that match the proxy protocol v2 signature and requests of 6 or fewer bytes that match the proxy protocol v1 signature will timeout (Envoy is unable to differentiate these requests from incomplete proxy protocol requests).",
    "notImp": false
  },
  {
    "name": "pass_through_tlvs",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "ProxyProtocolPassThroughTLVs",
    "enums": null,
    "comment": "This config controls which TLVs can be passed to filter state if it is Proxy Protocol V2 header. If there is no setting for this field, no TLVs will be passed through.\n\n:::note\n\nIf this is configured, you likely also want to set `core.v3.ProxyProtocolConfig.pass_through_tlvs`, which controls pass-through for the upstream.",
    "notImp": false
  },
  {
    "name": "disallowed_versions",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "ProxyProtocolConfig_Version[]",
    "enums": null,
    "comment": "The PROXY protocol versions that won't be matched. Useful to limit the scope and attack surface of the filter.\n\nWhen the filter receives PROXY protocol data that is disallowed, it will reject the connection. By default, the filter will match all PROXY protocol versions. See https://www.haproxy.org/download/2.1/doc/proxy-protocol.txt for details.\n\n:::attention\n\nWhen used in conjunction with the `allow_requests_without_proxy_protocol`, the filter will not attempt to match signatures for the disallowed versions. For example, when ``disallowed_versions=V2``, ``allow_requests_without_proxy_protocol=true``, and an incoming request matches the V2 signature, the filter will allow the request through without any modification. The filter treats this request as if it did not have any PROXY protocol information.",
    "notImp": false
  },
  {
    "name": "stat_prefix",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "string",
    "enums": null,
    "comment": "The human readable prefix to use when emitting statistics for the filter. If not configured, statistics will be emitted without the prefix segment. See the `filter's statistics documentation` for more information.",
    "notImp": false
  }
] };

export const ProxyProtocol_SingleFields = [
  "allow_requests_without_proxy_protocol",
  "stat_prefix"
];

export const ProxyProtocol_KeyValuePair: OutType = { "ProxyProtocol_KeyValuePair": [
  {
    "name": "metadata_namespace",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "string",
    "enums": null,
    "comment": "The namespace — if this is empty, the filter's namespace will be used.",
    "notImp": false
  },
  {
    "name": "key",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "string",
    "enums": null,
    "comment": "The key to use within the namespace.",
    "notImp": false
  }
] };

export const ProxyProtocol_KeyValuePair_SingleFields = [
  "metadata_namespace",
  "key"
];

export const ProxyProtocol_Rule: OutType = { "ProxyProtocol_Rule": [
  {
    "name": "tlv_type",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "number",
    "enums": null,
    "comment": "The type that triggers the rule - required TLV type is defined as uint8_t in proxy protocol. See `the spec <https://www.haproxy.org/download/2.1/doc/proxy-protocol.txt>`_ for details.",
    "notImp": false
  },
  {
    "name": "on_tlv_present",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "ProxyProtocol_KeyValuePair",
    "enums": null,
    "comment": "If the TLV type is present, apply this metadata KeyValuePair.",
    "notImp": false
  }
] };

export const ProxyProtocol_Rule_SingleFields = [
  "tlv_type"
];