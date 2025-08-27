import { TagsType } from "@/elchi/tags/tagsType";

export const modtag_http_protocol_options = [
    {
        alias: 'hpo',
        relativePath: 'envoy/extensions/upstreams/http/v3/http_protocol_options',
        names: ['HttpProtocolOptions'],
    },
    {
        alias: 'hpoeda',
        relativePath: 'envoy/extensions/upstreams/http/v3/http_protocol_options',
        names: ['HttpProtocolOptions_ExplicitHttpConfig', 'HttpProtocolOptions_UseDownstreamHttpConfig', 'HttpProtocolOptions_AutoHttpConfig'],
    },
];

export const modtag_chttp_protocol_options = [
    {
        alias: 'chpo',
        relativePath: 'envoy/config/core/v3/protocol',
        names: ['HttpProtocolOptions', 'HttpProtocolOptions_SingleFields'],
    },
];

export const modtag_upstream_http_protocol_options = [
    {
        alias: 'uhpo',
        relativePath: 'envoy/config/core/v3/protocol',
        names: ['UpstreamHttpProtocolOptions', 'UpstreamHttpProtocolOptions_SingleFields'],
    },
];

export const modtag_http1_protocol_options = [
    {
        alias: 'h1po',
        relativePath: 'envoy/config/core/v3/protocol',
        names: ['Http1ProtocolOptions', 'Http1ProtocolOptions_SingleFields'],
    },
];

export const modtag_http2_protocol_options = [
    {
        alias: 'h2po',
        relativePath: 'envoy/config/core/v3/protocol',
        names: ['Http2ProtocolOptions', 'Http2ProtocolOptions_SingleFields'],
    },
];

export const modtag_http3_protocol_options = [
    {
        alias: 'h3po',
        relativePath: 'envoy/config/core/v3/protocol',
        names: ['Http3ProtocolOptions', 'Http3ProtocolOptions_SingleFields'],
    },
];

export const modtag_explicit_http_config = [
    {
        alias: 'ehc',
        relativePath: 'envoy/extensions/upstreams/http/v3/http_protocol_options',
        names: ['HttpProtocolOptions_ExplicitHttpConfig'],
    },
];

export const modtag_use_downstream_http_config = [
    {
        alias: 'udhc',
        relativePath: 'envoy/extensions/upstreams/http/v3/http_protocol_options',
        names: ['HttpProtocolOptions_UseDownstreamHttpConfig'],
    },
];

export const modtag_auto_config = [
    {
        alias: 'ahc',
        relativePath: 'envoy/extensions/upstreams/http/v3/http_protocol_options',
        names: ['HttpProtocolOptions_AutoHttpConfig'],
    },
];

export const modtag_us_hpo: TagsType = {
    'HttpProtocolOptions': [
        'http_filters',
        'header_validation_config',
    ],
}
