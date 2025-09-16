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
    "fieldType": "Gzip_CompressionLevel_Enum",
    "enums": [
      "DEFAULT",
      "BEST",
      "SPEED"
    ],
    "comment": "A value used for selecting the zlib compression level. This setting will affect speed and amount of compression applied to the content. \"BEST\" provides higher compression at the cost of higher latency, \"SPEED\" provides lower compression with minimum impact on response time. \"DEFAULT\" provides an optimal result between speed and compression. This field will be set to \"DEFAULT\" if not specified.",
    "notImp": false
  },
  {
    "name": "compression_strategy",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "Gzip_CompressionStrategy",
    "enums": [
      "DEFAULT",
      "FILTERED",
      "HUFFMAN",
      "RLE"
    ],
    "comment": "A value used for selecting the zlib compression strategy which is directly related to the characteristics of the content. Most of the time \"DEFAULT\" will be the best choice, though there are situations which changing this parameter might produce better results. For example, run-length encoding (RLE) is typically used when the content is known for having sequences which same data occurs many consecutive times. For more information about each strategy, please refer to zlib manual.",
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
    "name": "compressor",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "Compressor",
    "enums": null,
    "comment": "Set of configuration parameters common for all compression filters. You can define ``content_length``, ``content_type`` and other parameters in this field.",
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