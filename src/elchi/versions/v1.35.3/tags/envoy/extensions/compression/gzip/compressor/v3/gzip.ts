import {OutType} from '@elchi/tags/tagsType';


export const Gzip: OutType = { "Gzip": [
  {
    "name": "memory_level",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "number",
    "enums": null,
    "comment": "Value from 1 to 9 that controls the amount of internal memory used by zlib. Higher values use more memory, but are faster and produce better compression results. The default value is 5.",
    "notImp": false
  },
  {
    "name": "compression_level",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "Gzip_CompressionLevel",
    "enums": [
      "DEFAULT_COMPRESSION",
      "BEST_SPEED",
      "COMPRESSION_LEVEL_1",
      "COMPRESSION_LEVEL_2",
      "COMPRESSION_LEVEL_3",
      "COMPRESSION_LEVEL_4",
      "COMPRESSION_LEVEL_5",
      "COMPRESSION_LEVEL_6",
      "COMPRESSION_LEVEL_7",
      "COMPRESSION_LEVEL_8",
      "COMPRESSION_LEVEL_9",
      "BEST_COMPRESSION"
    ],
    "comment": "A value used for selecting the zlib compression level. This setting will affect speed and amount of compression applied to the content. \"BEST_COMPRESSION\" provides higher compression at the cost of higher latency and is equal to \"COMPRESSION_LEVEL_9\". \"BEST_SPEED\" provides lower compression with minimum impact on response time, the same as \"COMPRESSION_LEVEL_1\". \"DEFAULT_COMPRESSION\" provides an optimal result between speed and compression. According to zlib's manual this level gives the same result as \"COMPRESSION_LEVEL_6\". This field will be set to \"DEFAULT_COMPRESSION\" if not specified.",
    "notImp": false
  },
  {
    "name": "compression_strategy",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "Gzip_CompressionStrategy",
    "enums": [
      "DEFAULT_STRATEGY",
      "FILTERED",
      "HUFFMAN_ONLY",
      "RLE",
      "FIXED"
    ],
    "comment": "A value used for selecting the zlib compression strategy which is directly related to the characteristics of the content. Most of the time \"DEFAULT_STRATEGY\" will be the best choice, which is also the default value for the parameter, though there are situations when changing this parameter might produce better results. For example, run-length encoding (RLE) is typically used when the content is known for having sequences which same data occurs many consecutive times. For more information about each strategy, please refer to zlib manual.",
    "notImp": false
  },
  {
    "name": "window_bits",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "number",
    "enums": null,
    "comment": "Value from 9 to 15 that represents the base two logarithmic of the compressor's window size. Larger window results in better compression at the expense of memory usage. The default is 12 which will produce a 4096 bytes window. For more details about this parameter, please refer to zlib manual > deflateInit2.",
    "notImp": false
  },
  {
    "name": "chunk_size",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "number",
    "enums": null,
    "comment": "Value for Zlib's next output buffer. If not set, defaults to 4096. See https://www.zlib.net/manual.html for more details. Also see https://github.com/envoyproxy/envoy/issues/8448 for context on this filter's performance.",
    "notImp": false
  }
] };

export const Gzip_SingleFields = [
  "memory_level",
  "compression_level",
  "compression_strategy",
  "window_bits",
  "chunk_size"
];