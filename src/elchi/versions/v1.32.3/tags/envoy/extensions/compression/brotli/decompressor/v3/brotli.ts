import {OutType} from '@/elchi/tags/tagsType';


export const Brotli: OutType = { "Brotli": [
  {
    "name": "disable_ring_buffer_reallocation",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "boolean",
    "enums": null,
    "comment": "If true, disables \"canny\" ring buffer allocation strategy. Ring buffer is allocated according to window size, despite the real size of the content.",
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

export const Brotli_SingleFields = [
  "disable_ring_buffer_reallocation",
  "chunk_size"
];