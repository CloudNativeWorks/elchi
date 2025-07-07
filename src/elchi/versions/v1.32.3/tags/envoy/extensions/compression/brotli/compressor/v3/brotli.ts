import {OutType} from '@/elchi/tags/tagsType';


export const Brotli: OutType = { "Brotli": [
  {
    "name": "quality",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "number",
    "enums": null,
    "comment": "Value from 0 to 11 that controls the main compression speed-density lever. The higher quality, the slower compression. The default value is 3.",
    "notImp": false
  },
  {
    "name": "encoder_mode",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "Brotli_EncoderMode",
    "enums": [
      "DEFAULT",
      "GENERIC",
      "TEXT",
      "FONT"
    ],
    "comment": "A value used to tune encoder for specific input. For more information about modes, please refer to brotli manual: https://brotli.org/encode.html#aa6f This field will be set to \"DEFAULT\" if not specified.",
    "notImp": false
  },
  {
    "name": "window_bits",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "number",
    "enums": null,
    "comment": "Value from 10 to 24 that represents the base two logarithmic of the compressor's window size. Larger window results in better compression at the expense of memory usage. The default is 18. For more details about this parameter, please refer to brotli manual: https://brotli.org/encode.html#a9a8",
    "notImp": false
  },
  {
    "name": "input_block_bits",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "number",
    "enums": null,
    "comment": "Value from 16 to 24 that represents the base two logarithmic of the compressor's input block size. Larger input block results in better compression at the expense of memory usage. The default is 24. For more details about this parameter, please refer to brotli manual: https://brotli.org/encode.html#a9a8",
    "notImp": false
  },
  {
    "name": "chunk_size",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "number",
    "enums": null,
    "comment": "Value for compressor's next output buffer. If not set, defaults to 4096.",
    "notImp": false
  },
  {
    "name": "disable_literal_context_modeling",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "boolean",
    "enums": null,
    "comment": "If true, disables \"literal context modeling\" format feature. This flag is a \"decoding-speed vs compression ratio\" trade-off.",
    "notImp": false
  }
] };

export const Brotli_SingleFields = [
  "quality",
  "encoder_mode",
  "window_bits",
  "input_block_bits",
  "chunk_size",
  "disable_literal_context_modeling"
];