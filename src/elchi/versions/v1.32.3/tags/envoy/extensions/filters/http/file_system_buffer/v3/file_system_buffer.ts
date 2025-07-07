import {OutType} from '@/elchi/tags/tagsType';


export const BufferBehavior: OutType = { "BufferBehavior": [
  {
    "name": "behavior.stream_when_possible",
    "isUnion": true,
    "isDeprecated": false,
    "fieldType": "BufferBehavior_StreamWhenPossible",
    "enums": null,
    "comment": "Don't inject ``content-length`` header. Output immediately, buffer only if output is slower than input.",
    "notImp": false
  },
  {
    "name": "behavior.bypass",
    "isUnion": true,
    "isDeprecated": false,
    "fieldType": "BufferBehavior_Bypass",
    "enums": null,
    "comment": "Never buffer, do nothing.",
    "notImp": false
  },
  {
    "name": "behavior.inject_content_length_if_necessary",
    "isUnion": true,
    "isDeprecated": false,
    "fieldType": "BufferBehavior_InjectContentLengthIfNecessary",
    "enums": null,
    "comment": "If ``content-length`` is not present, buffer the entire input, inject ``content-length`` header, then output. If ``content-length`` is already present, act like ``stream_when_possible``.",
    "notImp": false
  },
  {
    "name": "behavior.fully_buffer_and_always_inject_content_length",
    "isUnion": true,
    "isDeprecated": false,
    "fieldType": "BufferBehavior_FullyBufferAndAlwaysInjectContentLength",
    "enums": null,
    "comment": "Always buffer the entire input, and inject ``content-length``, overwriting any provided content-length header.",
    "notImp": false
  },
  {
    "name": "behavior.fully_buffer",
    "isUnion": true,
    "isDeprecated": false,
    "fieldType": "BufferBehavior_FullyBuffer",
    "enums": null,
    "comment": "Always buffer the entire input, do not modify ``content-length``.",
    "notImp": false
  }
] };

export const StreamConfig: OutType = { "StreamConfig": [
  {
    "name": "behavior",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "BufferBehavior",
    "enums": null,
    "comment": "Whether to bypass / stream / fully buffer / etc. If unset in route, vhost and listener config, the default is ``stream_when_possible``.",
    "notImp": false
  },
  {
    "name": "memory_buffer_bytes_limit",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "number",
    "enums": null,
    "comment": "The amount stored in the memory buffer before buffering to disk. If unset in route, vhost and listener config, defaults to a hardcoded value of 1MiB",
    "notImp": false
  },
  {
    "name": "storage_buffer_bytes_limit",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "number",
    "enums": null,
    "comment": "The maximum storage (excluding memory) to be buffered in this filter. If unset in route, vhost and listener config, defaults to a hardcoded value of 32MiB",
    "notImp": false
  },
  {
    "name": "storage_buffer_queue_high_watermark_bytes",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "number",
    "enums": null,
    "comment": "The maximum amount that can be queued for writing to storage, above which the source is requested to pause. If unset, defaults to the same value as ``memory_buffer_bytes_limit``.\n\nFor example, assuming the recipient is not consuming data at all, if ``memory_buffer_bytes_limit`` was 32MiB, and ``storage_buffer_queue_high_watermark_bytes`` was 64MiB, and the filesystem is backed up so writes are not occurring promptly, then:\n\n* Any request less than 32MiB will eventually pass through without ever attempting to write to disk. * Any request with over 32MiB buffered will start trying to write to disk. If it reaches (32+64)MiB buffered in memory (write to disk isn't keeping up), a high watermark signal is sent to the source. * Any stream whose total size exceeds ``memory_buffer_bytes_limit + storage_buffer_bytes_limit`` will provoke an error. (Note, if the recipient *is* consuming data then it is possible for such an oversized request to pass through the buffer filter, provided the recipient isn't consuming data too slowly.)\n\nThe low watermark signal is sent when the memory buffer is at size ``memory_buffer_bytes_limit + (storage_buffer_queue_high_watermark_bytes / 2)``.",
    "notImp": false
  }
] };

export const StreamConfig_SingleFields = [
  "memory_buffer_bytes_limit",
  "storage_buffer_bytes_limit",
  "storage_buffer_queue_high_watermark_bytes"
];

export const FileSystemBufferFilterConfig: OutType = { "FileSystemBufferFilterConfig": [
  {
    "name": "manager_config",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "AsyncFileManagerConfig",
    "enums": null,
    "comment": "A configuration for an AsyncFileManager.\n\nIf unset in route, vhost and listener, and the behavior is not ``bypass`` in both directions, an Internal Server Error response will be sent.",
    "notImp": false
  },
  {
    "name": "storage_buffer_path",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "string",
    "enums": null,
    "comment": "An optional path to which the unlinked files should be written - this may determine which physical storage device will be used.\n\nIf unset in route, vhost and listener, will use the environment variable ``TMPDIR``, or, if that's also unset, will use ``/tmp``.",
    "notImp": false
  },
  {
    "name": "request",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "StreamConfig",
    "enums": null,
    "comment": "Optional configuration for how to buffer (or not) requests. If unset in route, vhost and listener, ``StreamConfig`` default values will be used (with behavior ``stream_when_possible``)",
    "notImp": false
  },
  {
    "name": "response",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "StreamConfig",
    "enums": null,
    "comment": "Optional configuration for how to buffer (or not) responses. If unset in route, vhost and listener, ``StreamConfig`` default values will be used (with behavior ``stream_when_possible``)",
    "notImp": false
  }
] };

export const FileSystemBufferFilterConfig_SingleFields = [
  "storage_buffer_path"
];