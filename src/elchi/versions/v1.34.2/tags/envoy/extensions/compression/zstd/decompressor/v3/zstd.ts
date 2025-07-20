import {OutType} from '@elchi/tags/tagsType';


export const Zstd: OutType = { "Zstd": [
  {
    "name": "dictionaries",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "DataSource[]",
    "enums": null,
    "comment": "Dictionaries for decompression. Zstd offers dictionary compression, which greatly improves efficiency on small files and messages. It is necessary to ensure that the dictionary used for decompression is the same as the compression dictionary. Multiple dictionaries can be set, and the dictionary will be automatically selected for decompression according to the dictionary ID in the source content. Please refer to `zstd manual <https://github.com/facebook/zstd/blob/dev/programs/zstd.1.md#dictionary-builder>`_ to train specific dictionaries for decompression.",
    "notImp": false
  },
  {
    "name": "chunk_size",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "number",
    "enums": null,
    "comment": "Value for decompressor's next output buffer. If not set, defaults to 4096.",
    "notImp": false
  }
] };

export const Zstd_SingleFields = [
  "chunk_size"
];