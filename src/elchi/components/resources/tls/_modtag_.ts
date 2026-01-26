export const modtag_downstream_tls_context = [
    {
        alias: 'dtc',
        relativePath: 'envoy/extensions/transport_sockets/tls/v3/tls',
        names: ['DownstreamTlsContext', 'DownstreamTlsContext_SingleFields'],
    },
];

export const modtag_upstream_tls_context = [
    {
        alias: 'utc',
        relativePath: 'envoy/extensions/transport_sockets/tls/v3/tls',
        names: ['UpstreamTlsContext', 'UpstreamTlsContext_SingleFields'],
    },
];

export const modtag_common_tls_context = [
    {
        alias: 'ctc',
        relativePath: 'envoy/extensions/transport_sockets/tls/v3/tls',
        names: ['CommonTlsContext', 'CommonTlsContext_SingleFields'],
    },
];

export const modtag_tls_params = [
    {
        alias: 'tp',
        relativePath: 'envoy/extensions/transport_sockets/tls/v3/common',
        names: ['TlsParameters', 'TlsParameters_SingleFields'],
    },
];

export const modtag_quic_downstream_transport = [
    {
        alias: 'qdt',
        relativePath: 'envoy/extensions/transport_sockets/quic/v3/quic_transport',
        names: ['QuicDownstreamTransport', 'QuicDownstreamTransport_SingleFields'],
    },
];

export const modtag_quic_upstream_transport = [
    {
        alias: 'qut',
        relativePath: 'envoy/extensions/transport_sockets/quic/v3/quic_transport',
        names: ['QuicUpstreamTransport', 'QuicUpstreamTransport_SingleFields'],
    },
];

export const modtag_proxy_protocol_upstream_transport = [
    {
        alias: 'pput',
        relativePath: 'envoy/extensions/transport_sockets/proxy_protocol/v3/upstream_proxy_protocol',
        names: ['ProxyProtocolUpstreamTransport', 'ProxyProtocolUpstreamTransport_SingleFields'],
    },
];

export const modtag_proxy_protocol_config = [
    {
        alias: 'ppc',
        relativePath: 'envoy/config/core/v3/proxy_protocol',
        names: ['ProxyProtocolConfig', 'ProxyProtocolConfig_SingleFields', 'ProxyProtocolPassThroughTLVs', 'ProxyProtocolPassThroughTLVs_SingleFields', 'TlvEntry', 'TlvEntry_SingleFields'],
    },
];