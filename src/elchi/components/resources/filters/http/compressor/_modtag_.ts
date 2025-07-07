import { TagsType } from "@/elchi/tags/tagsType";

export const modtag_compressor = [
    {
        alias: 'cmp',
        relativePath: 'envoy/extensions/filters/http/compressor/v3/compressor',
        names: ['Compressor', 'Compressor_SingleFields'],
    },
];

export const modtag_compressor_per_route = [
    {
        alias: 'cpr',
        relativePath: 'envoy/extensions/filters/http/compressor/v3/compressor',
        names: ['CompressorPerRoute', 'CompressorPerRoute_SingleFields'],
    },
];

export const modtag_compressor_request_direction_config = [
    {
        alias: 'crdc',
        relativePath: 'envoy/extensions/filters/http/compressor/v3/compressor',
        names: ['Compressor_RequestDirectionConfig'],
    },
];

export const modtag_compressor_common_direction_config = [
    {
        alias: 'ccdc',
        relativePath: 'envoy/extensions/filters/http/compressor/v3/compressor',
        names: ['Compressor_CommonDirectionConfig', 'Compressor_CommonDirectionConfig_SingleFields'],
    },
];

export const modtag_compressor_response_direction_config = [
    {
        alias: 'crsdc',
        relativePath: 'envoy/extensions/filters/http/compressor/v3/compressor',
        names: ['Compressor_ResponseDirectionConfig', 'Compressor_ResponseDirectionConfig_SingleFields'],
    },
];

export const modtag_compressor_response_direction_overrides = [
    {
        alias: 'crdo',
        relativePath: 'envoy/extensions/filters/http/compressor/v3/compressor',
        names: ['ResponseDirectionOverrides', 'ResponseDirectionOverrides_SingleFields'],
    },
];

export const modtag_us_compressor: TagsType = {
    'Compressor': [
        'content_length',
        'content_type',
        'disable_on_etag_header',
        'remove_accept_encoding_header',
        'runtime_enabled',
    ],
}

