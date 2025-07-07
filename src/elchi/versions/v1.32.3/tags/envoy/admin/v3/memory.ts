import {OutType} from '@/elchi/tags/tagsType';


export const Memory: OutType = { "Memory": [
  {
    "name": "allocated",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "number",
    "enums": null,
    "comment": "The number of bytes allocated by the heap for Envoy. This is an alias for ``generic.current_allocated_bytes``.",
    "notImp": false
  },
  {
    "name": "heap_size",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "number",
    "enums": null,
    "comment": "The number of bytes reserved by the heap but not necessarily allocated. This is an alias for ``generic.heap_size``.",
    "notImp": false
  },
  {
    "name": "pageheap_unmapped",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "number",
    "enums": null,
    "comment": "The number of bytes in free, unmapped pages in the page heap. These bytes always count towards virtual memory usage, and depending on the OS, typically do not count towards physical memory usage. This is an alias for ``tcmalloc.pageheap_unmapped_bytes``.",
    "notImp": false
  },
  {
    "name": "pageheap_free",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "number",
    "enums": null,
    "comment": "The number of bytes in free, mapped pages in the page heap. These bytes always count towards virtual memory usage, and unless the underlying memory is swapped out by the OS, they also count towards physical memory usage. This is an alias for ``tcmalloc.pageheap_free_bytes``.",
    "notImp": false
  },
  {
    "name": "total_thread_cache",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "number",
    "enums": null,
    "comment": "The amount of memory used by the TCMalloc thread caches (for small objects). This is an alias for ``tcmalloc.current_total_thread_cache_bytes``.",
    "notImp": false
  },
  {
    "name": "total_physical_bytes",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "number",
    "enums": null,
    "comment": "The number of bytes of the physical memory usage by the allocator. This is an alias for ``generic.total_physical_bytes``.",
    "notImp": false
  }
] };

export const Memory_SingleFields = [
  "allocated",
  "heap_size",
  "pageheap_unmapped",
  "pageheap_free",
  "total_thread_cache",
  "total_physical_bytes"
];