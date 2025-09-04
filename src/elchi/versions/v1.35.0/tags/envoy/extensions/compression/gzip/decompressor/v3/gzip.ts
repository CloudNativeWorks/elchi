import {OutType} from '@elchi/tags/tagsType';


export const Gzip: OutType = { "Gzip": [
  {
    "name": "window_bits",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "number",
    "enums": null,
    "comment": "Value from 9 to 15 that represents the base two logarithmic of the decompressor's window size. The decompression window size needs to be equal or larger than the compression window size. The default window size is 15. This is so that the decompressor can decompress a response compressed by a compressor with any compression window size. For more details about this parameter, please refer to `zlib manual <https://www.zlib.net/manual.html>`_ > inflateInit2.",
    "notImp": false
  },
  {
    "name": "chunk_size",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "number",
    "enums": null,
    "comment": "Value for zlib's decompressor output buffer. If not set, defaults to 4096. See https://www.zlib.net/manual.html for more details.",
    "notImp": false
  },
  {
    "name": "max_inflate_ratio",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "number",
    "enums": null,
    "comment": "An upper bound to the number of times the output buffer is allowed to be bigger than the size of the accumulated input. This value is used to prevent decompression bombs. If not set, defaults to 100.",
    "notImp": false
  }
] };

export const Gzip_SingleFields = [
  "window_bits",
  "chunk_size",
  "max_inflate_ratio"
];