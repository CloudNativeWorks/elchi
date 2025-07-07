import {OutType} from '@/elchi/tags/tagsType';


export const InternalListener: OutType = { "InternalListener": [
  {
    "name": "buffer_size_kb",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "number",
    "enums": null,
    "comment": "The internal listener client connection buffer size in KiB. For example, if ``buffer_size_kb`` is set to 5, then the actual buffer size is 5 KiB = 5 * 1024 bytes. If the ``buffer_size_kb`` is not specified, the buffer size is set to 1024 KiB.",
    "notImp": false
  }
] };

export const InternalListener_SingleFields = [
  "buffer_size_kb"
];