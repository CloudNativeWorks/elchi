import {OutType} from '@elchi/tags/tagsType';


export const Zstd: OutType = { "Zstd": [
  {
    "name": "compression_level",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "number",
    "enums": null,
    "comment": "Set compression parameters according to pre-defined compression level table. Note that exact compression parameters are dynamically determined, depending on both compression level and source content size (when known). Value 0 means default, and default level is 3. Setting a level does not automatically set all other compression parameters to default. Setting this will however eventually dynamically impact the compression parameters which have not been manually set. The manually set ones will 'stick'.",
    "notImp": false
  },
  {
    "name": "enable_checksum",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "boolean",
    "enums": null,
    "comment": "A 32-bits checksum of content is written at end of frame. If not set, defaults to false.",
    "notImp": false
  },
  {
    "name": "strategy",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "Zstd_Strategy",
    "enums": [
      "DEFAULT",
      "FAST",
      "DFAST",
      "GREEDY",
      "LAZY",
      "LAZY2",
      "BTLAZY2",
      "BTOPT",
      "BTULTRA",
      "BTULTRA2"
    ],
    "comment": "The higher the value of selected strategy, the more complex it is, resulting in stronger and slower compression. Special: value 0 means \"use default strategy\".",
    "notImp": false
  },
  {
    "name": "dictionary",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "DataSource",
    "enums": null,
    "comment": "A dictionary for compression. Zstd offers dictionary compression, which greatly improves efficiency on small files and messages. Each dictionary will be generated with a dictionary ID that can be used to search the same dictionary during decompression. Please refer to `zstd manual <https://github.com/facebook/zstd/blob/dev/programs/zstd.1.md#dictionary-builder>`_ to train a specific dictionary for compression.",
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
  }
] };

export const Zstd_SingleFields = [
  "compression_level",
  "enable_checksum",
  "strategy",
  "chunk_size"
];