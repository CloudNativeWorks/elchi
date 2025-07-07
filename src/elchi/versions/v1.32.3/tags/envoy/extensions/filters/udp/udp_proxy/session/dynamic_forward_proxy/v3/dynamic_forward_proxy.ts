import {OutType} from '@/elchi/tags/tagsType';


export const FilterConfig_BufferOptions: OutType = { "FilterConfig_BufferOptions": [
  {
    "name": "max_buffered_datagrams",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "number",
    "enums": null,
    "comment": "If set, the filter will only buffer datagrams up to the requested limit, and will drop new UDP datagrams if the buffer contains the max_buffered_datagrams value at the time of a new datagram arrival. If not set, the default value is 1024 datagrams.",
    "notImp": false
  },
  {
    "name": "max_buffered_bytes",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "number",
    "enums": null,
    "comment": "If set, the filter will only buffer datagrams up to the requested total buffered bytes limit, and will drop new UDP datagrams if the buffer contains the max_buffered_datagrams value at the time of a new datagram arrival. If not set, the default value is 16,384 (16KB).",
    "notImp": false
  }
] };

export const FilterConfig_BufferOptions_SingleFields = [
  "max_buffered_datagrams",
  "max_buffered_bytes"
];

export const FilterConfig: OutType = { "FilterConfig": [
  {
    "name": "stat_prefix",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "string",
    "enums": null,
    "comment": "The prefix to use when emitting `statistics`.",
    "notImp": false
  },
  {
    "name": "implementation_specifier.dns_cache_config",
    "isUnion": true,
    "isDeprecated": false,
    "fieldType": "DnsCacheConfig",
    "enums": null,
    "comment": "The DNS cache configuration that the filter will attach to. Note this configuration must match that of associated `dynamic forward proxy cluster configuration`.",
    "notImp": false
  },
  {
    "name": "buffer_options",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "FilterConfig_BufferOptions",
    "enums": null,
    "comment": "If configured, the filter will buffer datagrams in case that it is waiting for a DNS response. If this field is not configured, there will be no buffering and downstream datagrams that arrive while the DNS resolution is in progress will be dropped. In case this field is set but the options are not configured, the default values will be applied as described in the ``BufferOptions``.",
    "notImp": false
  }
] };

export const FilterConfig_SingleFields = [
  "stat_prefix"
];