import {OutType} from '@elchi/tags/tagsType';


export const FileSystemHttpCacheV2Config: OutType = { "FileSystemHttpCacheV2Config": [
  {
    "name": "manager_config",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "AsyncFileManagerConfig",
    "enums": null,
    "comment": "Configuration of a manager for how the file system is used asynchronously.",
    "notImp": false
  },
  {
    "name": "cache_path",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "string",
    "enums": null,
    "comment": "Path at which the cache files will be stored.\n\nThis also doubles as the unique identifier for a cache, so a cache can be shared between different routes, or separate paths can be used to specify separate caches.\n\nIf the same ``cache_path`` is used in more than one ``CacheV2Config``, the rest of the ``FileSystemHttpCacheV2Config`` must also match, and will refer to the same cache instance.",
    "notImp": false
  },
  {
    "name": "max_cache_size_bytes",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "number",
    "enums": null,
    "comment": "The maximum size of the cache in bytes - when reached, cache eviction is triggered.\n\nThis is measured as the sum of file sizes, such that it includes headers, trailers, and metadata, but does not include e.g. file system overhead and block size padding.\n\nIf unset there is no limit except file system failure.",
    "notImp": false
  },
  {
    "name": "max_individual_cache_entry_size_bytes",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "number",
    "enums": null,
    "comment": "The maximum size of a cache entry in bytes - larger responses will not be cached.\n\nThis is measured as the file size for the cache entry, such that it includes headers, trailers, and metadata.\n\nIf unset there is no limit.\n\n[#not-implemented-hide:]",
    "notImp": true
  },
  {
    "name": "max_cache_entry_count",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "number",
    "enums": null,
    "comment": "The maximum number of cache entries - when reached, cache eviction is triggered.\n\nIf unset there is no limit.",
    "notImp": false
  },
  {
    "name": "cache_subdivisions",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "number",
    "enums": null,
    "comment": "A number of folders into which to subdivide the cache.\n\nSetting this can help with performance in file systems where a large number of inodes in a single branch degrades performance. The optimal value in that case would be ``sqrt(expected_cache_entry_count)``.\n\nOn file systems that perform well with many inodes, the default value of 1 should be used.\n\n[#not-implemented-hide:]",
    "notImp": true
  },
  {
    "name": "evict_fraction",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "number",
    "enums": null,
    "comment": "The amount of the maximum cache size or count to evict when cache eviction is triggered. For example, if ``max_cache_size_bytes`` is 10000000 and ``evict_fraction`` is 0.2, then when the cache exceeds 10MB, entries will be evicted until the cache size is less than or equal to 8MB.\n\nThe default value of 0 means when the cache exceeds 10MB, entries will be evicted only until the cache is less than or equal to 10MB.\n\nEvicting a larger fraction will mean the eviction thread will run less often (sparing CPU load) at the cost of more cache misses due to the extra evicted entries.\n\n[#not-implemented-hide:]",
    "notImp": true
  },
  {
    "name": "max_eviction_period",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "Duration",
    "enums": null,
    "comment": "The longest amount of time to wait before running a cache eviction pass. An eviction pass may not necessarily remove any files, but it will update the cache state to match the on-disk state. This can be important if multiple instances are accessing the same cache in parallel. (e.g. if two instances each independently added non-overlapping 10MB of content to a cache with a 15MB limit, neither instance would be aware that the limit was exceeded without this synchronizing pass.)\n\nIf an eviction pass has not happened within this duration, the eviction thread will be awoken and perform an eviction pass.\n\nIf unset, there will be no eviction passes except those triggered by cache limits.\n\n[#not-implemented-hide:]",
    "notImp": true
  },
  {
    "name": "min_eviction_period",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "Duration",
    "enums": null,
    "comment": "The shortest amount of time between cache eviction passes. This can be used to reduce eviction churn, if your cache max size can be flexible. If a cache eviction pass already occurred more recently than this period when another would be triggered, that new pass is cancelled.\n\nThis means the cache can potentially grow beyond ``max_cache_size_bytes`` by as much as can be written within the duration specified.\n\nGenerally you would use *either* ``min_eviction_period`` *or* ``evict_fraction`` to reduce churn. Both together will work but since they're both aiming for the same goal, it's simpler not to.\n\n[#not-implemented-hide:]",
    "notImp": true
  },
  {
    "name": "create_cache_path",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "boolean",
    "enums": null,
    "comment": "If true, and the cache path does not exist, attempt to create the cache path, including any missing directories leading up to it. On failure, the config is rejected.\n\nIf false, and the cache path does not exist, the config is rejected.\n\n[#not-implemented-hide:]",
    "notImp": true
  }
] };

export const FileSystemHttpCacheV2Config_SingleFields = [
  "cache_path",
  "max_cache_size_bytes",
  "max_individual_cache_entry_size_bytes",
  "max_cache_entry_count",
  "cache_subdivisions",
  "evict_fraction",
  "max_eviction_period",
  "min_eviction_period",
  "create_cache_path"
];