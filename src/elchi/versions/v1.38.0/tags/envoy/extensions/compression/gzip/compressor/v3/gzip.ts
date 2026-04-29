import {OutType} from '@elchi/tags/tagsType';


export const Gzip: OutType = { "Gzip": [
  {
    "name": "memory_level",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "number",
    "enums": null,
    "comment": "Value from 1 to 9 that controls the amount of internal memory used by zlib. Higher values use more memory, but are faster and produce better compression results.\n\nDefaults to ``5``.",
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
    "comment": "A value used for selecting the zlib compression level. This setting will affect speed and amount of compression applied to the content. ``BEST_COMPRESSION`` provides higher compression at the cost of higher latency and is equal to ``COMPRESSION_LEVEL_9``. ``BEST_SPEED`` provides lower compression with minimum impact on response time, the same as ``COMPRESSION_LEVEL_1``. ``DEFAULT_COMPRESSION`` provides an optimal result between speed and compression. According to zlib's manual, this level gives the same result as ``COMPRESSION_LEVEL_6``.\n\nDefaults to ``DEFAULT_COMPRESSION``.",
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
    "comment": "A value used for selecting the zlib compression strategy which is directly related to the characteristics of the content. Most of the time ``DEFAULT_STRATEGY`` will be the best choice, though there are situations when changing this parameter might produce better results. For example, run-length encoding (RLE) is typically used when the content is known for having sequences in which the same data occurs many consecutive times. For more information about each strategy, please refer to the `zlib manual <https://www.zlib.net/manual.html>`_.\n\nDefaults to ``DEFAULT_STRATEGY``.",
    "notImp": false
  },
  {
    "name": "window_bits",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "number",
    "enums": null,
    "comment": "Value from 9 to 15 that represents the base two logarithmic of the compressor's window size. Larger window results in better compression at the expense of memory usage. For more details about this parameter, please refer to the `zlib manual <https://www.zlib.net/manual.html>`_ for ``deflateInit2``.\n\nDefaults to ``12``, which will produce a 4096 bytes window.",
    "notImp": false
  },
  {
    "name": "chunk_size",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "number",
    "enums": null,
    "comment": "Value for zlib's next output buffer. See the `zlib manual <https://www.zlib.net/manual.html>`_ for more details. Also see `envoy#8448 <https://github.com/envoyproxy/envoy/issues/8448>`_ for context on this filter's performance.\n\nDefaults to ``4096``.",
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