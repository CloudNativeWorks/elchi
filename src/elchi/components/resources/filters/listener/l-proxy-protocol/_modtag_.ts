export const modtag_proxy_protocol = [
    {
        alias: 'pp',
        relativePath: 'envoy/extensions/filters/listener/proxy_protocol/v3/proxy_protocol',
        names: ['ProxyProtocol', 'ProxyProtocol_SingleFields'],
    },
];

export const modtag_proxy_protocol_rule = [
    {
        alias: 'ppr',
        relativePath: 'envoy/extensions/filters/listener/proxy_protocol/v3/proxy_protocol',
        names: ['ProxyProtocol_Rule', 'ProxyProtocol_Rule_SingleFields'],
    },
];

export const modtag_proxy_protocol_key_value_pair = [
    {
        alias: 'ppkvp',
        relativePath: 'envoy/extensions/filters/listener/proxy_protocol/v3/proxy_protocol',
        names: ['ProxyProtocol_KeyValuePair', 'ProxyProtocol_KeyValuePair_SingleFields'],
    },
];

export const modtag_proxy_protocol_pass_throught_lvs= [
    {
        alias: 'ppptl',
        relativePath: 'envoy/config/core/v3/proxy_protocol',
        names: ['ProxyProtocolPassThroughTLVs', 'ProxyProtocolPassThroughTLVs_SingleFields'],
    },
];
