import { MetricConfig } from "../../MetricConfig";

const defaultWindowSecs = {
    default: 15,
    ranges: [
        { threshold: 2 * 24 * 60 * 60, value: 300 }, // 2 days
        { threshold: 24 * 60 * 60, value: 60 },      // 1 day
        { threshold: 1 * 60 * 60, value: 30 },       // 1 hour
    ]
}

export const COMPRESSOR_METRICS: MetricConfig[] = [
    {
        section: 'HTTP Filter - Compressor Metrics',
        title: 'Compressed Size',
        metric: 'extension_config_discovery_http_filter_(.+?)_compressor_(.+?)_(gzip|brotli|zstd)_compressed_bytes_total',
        description: '',
        groups: ['all', 'filters'],
        queryTemplate: `
            sum by (filter, compressor, algorithm) (
                rate(
                    label_replace(
                        label_replace(
                            label_replace(
                                {__name__=~"%{name}_%{project}_%{metric}"},
                                "filter", "$1", "__name__", ".*_%{metric}"
                            ),
                            "compressor", "$2", "__name__", ".*_%{metric}"
                        ),
                        "algorithm", "$3", "__name__", ".*_%{metric}"
                    )[%{window}s]
                )
            )
        `,
        span: 12,
        formatType: 'bytes',
        windowSecs: defaultWindowSecs,
        legendMapping: [{
            template: '%s',
            labelKeys: ['filter', 'compressor', 'algorithm']
        }]
    },
    {
        section: 'HTTP Filter - Compressor Metrics',
        title: 'Compressed Count',
        metric: 'extension_config_discovery_http_filter_(.+?)_compressor_(.+?)_(gzip|brotli|zstd)_compressed_total',
        description: '',
        groups: ['all', 'filters'],
        queryTemplate: `
            sum by (filter, compressor, algorithm) (
                ceil(
                    rate(
                        label_replace(
                            label_replace(
                                label_replace(
                                    {__name__=~"%{name}_%{project}_%{metric}"},
                                    "filter", "$1", "__name__", ".*_%{metric}"
                                ),
                                "compressor", "$2", "__name__", ".*_%{metric}"
                            ),
                            "algorithm", "$3", "__name__", ".*_%{metric}"
                        )[%{window}s]
                    )
                )
            )
        `,
        span: 12,
        formatType: 'number',
        windowSecs: defaultWindowSecs,
        legendMapping: [{
            template: '%s',
            labelKeys: ['filter', 'compressor', 'algorithm']
        }]
    },
    {
        section: 'HTTP Filter - Compressor Metrics',
        title: 'Content Length Too Small',
        metric: 'extension_config_discovery_http_filter_(.+?)_compressor_(.+?)_(gzip|brotli|zstd)_content_length_too_small_total',
        description: '',
        groups: ['all', 'filters', 'errors'],
        queryTemplate: `
            sum by (filter, compressor, algorithm) (
                ceil(
                    rate(
                        label_replace(
                            label_replace(
                                label_replace(
                                    {__name__=~"%{name}_%{project}_%{metric}"},
                                    "filter", "$1", "__name__", ".*_%{metric}"
                                ),
                                "compressor", "$2", "__name__", ".*_%{metric}"
                            ),
                            "algorithm", "$3", "__name__", ".*_%{metric}"
                        )[%{window}s]
                    )
                )
            )
        `,
        span: 12,
        formatType: 'number',
        windowSecs: defaultWindowSecs,
        legendMapping: [{
            template: '%s',
            labelKeys: ['filter', 'compressor', 'algorithm']
        }]
    },
    {
        section: 'HTTP Filter - Compressor Metrics',
        title: 'Header Compressor Used',
        metric: 'extension_config_discovery_http_filter_(.+?)_compressor_(.+?)_(gzip|brotli|zstd)_header_compressor_used_total',
        description: '',
        groups: ['all', 'filters'],
        queryTemplate: `
            sum by (filter, compressor, algorithm) (
                ceil(
                    rate(
                        label_replace(
                            label_replace(
                                label_replace(
                                    {__name__=~"%{name}_%{project}_%{metric}"},
                                    "filter", "$1", "__name__", ".*_%{metric}"
                                ),
                                "compressor", "$2", "__name__", ".*_%{metric}"
                            ),
                            "algorithm", "$3", "__name__", ".*_%{metric}"
                        )[%{window}s]
                    )
                )
            )
        `,
        span: 12,
        formatType: 'number',
        windowSecs: defaultWindowSecs,
        legendMapping: [{
            template: '%s',
            labelKeys: ['filter', 'compressor', 'algorithm']
        }]
    },
    {
        section: 'HTTP Filter - Compressor Metrics',
        title: 'Header Not Valid',
        metric: 'extension_config_discovery_http_filter_(.+?)_compressor_(.+?)_(gzip|brotli|zstd)_header_not_valid_total',
        description: '',
        groups: ['all', 'filters', 'errors'],
        queryTemplate: `
            sum by (filter, compressor, algorithm) (
                ceil(
                    rate(
                        label_replace(
                            label_replace(
                                label_replace(
                                    {__name__=~"%{name}_%{project}_%{metric}"},
                                    "filter", "$1", "__name__", ".*_%{metric}"
                                ),
                                "compressor", "$2", "__name__", ".*_%{metric}"
                            ),
                            "algorithm", "$3", "__name__", ".*_%{metric}"
                        )[%{window}s]
                    )
                )
            )
        `,
        span: 12,
        formatType: 'number',
        windowSecs: defaultWindowSecs,
        legendMapping: [{
            template: '%s',
            labelKeys: ['filter', 'compressor', 'algorithm']
        }]
    },
    {
        section: 'HTTP Filter - Compressor Metrics',
        title: 'No Accept Header',
        metric: 'extension_config_discovery_http_filter_(.+?)_compressor_(.+?)_(gzip|brotli|zstd)_no_accept_header_total',
        description: '',
        groups: ['all', 'filters', 'errors'],
        queryTemplate: `
            sum by (filter, compressor, algorithm) (
                ceil(
                    rate(
                        label_replace(
                            label_replace(
                                label_replace(
                                    {__name__=~"%{name}_%{project}_%{metric}"},
                                    "filter", "$1", "__name__", ".*_%{metric}"
                                ),
                                "compressor", "$2", "__name__", ".*_%{metric}"
                            ),
                            "algorithm", "$3", "__name__", ".*_%{metric}"
                        )[%{window}s]
                    )
                )
            )
        `,
        span: 12,
        formatType: 'number',
        windowSecs: defaultWindowSecs,
        legendMapping: [{
            template: '%s',
            labelKeys: ['filter', 'compressor', 'algorithm']
        }]
    },
    {
        section: 'HTTP Filter - Compressor Metrics',
        title: 'Not Compressed',
        metric: 'extension_config_discovery_http_filter_(.+?)_compressor_(.+?)_(gzip|brotli|zstd)_not_compressed_total',
        description: '',
        groups: ['all', 'filters', 'errors'],
        queryTemplate: `
            sum by (filter, compressor, algorithm) (
                ceil(
                    rate(
                        label_replace(
                            label_replace(
                                label_replace(
                                    {__name__=~"%{name}_%{project}_%{metric}"},
                                    "filter", "$1", "__name__", ".*_%{metric}"
                                ),
                                "compressor", "$2", "__name__", ".*_%{metric}"
                            ),
                            "algorithm", "$3", "__name__", ".*_%{metric}"
                        )[%{window}s]
                    )
                )
            )
        `,
        span: 12,
        formatType: 'number',
        windowSecs: defaultWindowSecs,
        legendMapping: [{
            template: '%s',
            labelKeys: ['filter', 'compressor', 'algorithm']
        }]
    },
    {
        section: 'HTTP Filter - Compressor Metrics',
        title: 'Request Not Compressed',
        metric: 'extension_config_discovery_http_filter_(.+?)_compressor_(.+?)_(gzip|brotli|zstd)_request_not_compressed_total',
        description: '',
        groups: ['all', 'filters', 'errors'],
        queryTemplate: `
            sum by (filter, compressor, algorithm) (
                ceil(
                    rate(
                        label_replace(
                            label_replace(
                                label_replace(
                                    {__name__=~"%{name}_%{project}_%{metric}"},
                                    "filter", "$1", "__name__", ".*_%{metric}"
                                ),
                                "compressor", "$2", "__name__", ".*_%{metric}"
                            ),
                            "algorithm", "$3", "__name__", ".*_%{metric}"
                        )[%{window}s]
                    )
                )
            )
        `,
        span: 12,
        formatType: 'number',
        windowSecs: defaultWindowSecs,
        legendMapping: [{
            template: '%s',
            labelKeys: ['filter', 'compressor', 'algorithm']
        }]
    },
    {
        section: 'HTTP Filter - Compressor Metrics',
        title: 'Uncompressed Size',
        metric: 'extension_config_discovery_http_filter_(.+?)_compressor_(.+?)_(gzip|brotli|zstd)_uncompressed_bytes_total',
        description: '',
        groups: ['all', 'filters', 'errors'],
        queryTemplate: `
            sum by (filter, compressor, algorithm) (
                rate(
                    label_replace(
                        label_replace(
                            label_replace(
                                {__name__=~"%{name}_%{project}_%{metric}"},
                                "filter", "$1", "__name__", ".*_%{metric}"
                            ),
                            "compressor", "$2", "__name__", ".*_%{metric}"
                        ),
                        "algorithm", "$3", "__name__", ".*_%{metric}"
                    )[%{window}s]
                )
            )
        `,
        span: 12,
        formatType: 'bytes',
        windowSecs: defaultWindowSecs,
        legendMapping: [{
            template: '%s',
            labelKeys: ['filter', 'compressor', 'algorithm']
        }]
    },
];
