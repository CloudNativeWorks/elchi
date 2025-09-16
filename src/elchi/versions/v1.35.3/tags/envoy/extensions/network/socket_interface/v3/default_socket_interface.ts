import {OutType} from '@elchi/tags/tagsType';


export const IoUringOptions: OutType = { "IoUringOptions": [
  {
    "name": "io_uring_size",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "number",
    "enums": null,
    "comment": "The size for io_uring submission queues (SQ). io_uring is built with a fixed size in each thread during configuration, and each io_uring operation creates a submission queue entry (SQE). The default is 1000.",
    "notImp": false
  },
  {
    "name": "enable_submission_queue_polling",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "boolean",
    "enums": null,
    "comment": "Enable io_uring submission queue polling (SQPOLL). io_uring SQPOLL mode polls all SQEs in the SQ in the kernel thread. io_uring SQPOLL mode may reduce latency and increase CPU usage as a cost. The default is false.",
    "notImp": false
  },
  {
    "name": "read_buffer_size",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "number",
    "enums": null,
    "comment": "The size of an io_uring socket's read buffer. Each io_uring read operation will allocate a buffer of the given size. If the given buffer is too small, the socket will have read multiple times for all the data. The default is 8192.",
    "notImp": false
  },
  {
    "name": "write_timeout_ms",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "number",
    "enums": null,
    "comment": "The write timeout of an io_uring socket on closing in ms. io_uring writes and closes asynchronously. If the remote stops reading, the io_uring write operation may never complete. The operation is canceled and the socket is closed after the timeout. The default is 1000.",
    "notImp": false
  }
] };

export const IoUringOptions_SingleFields = [
  "io_uring_size",
  "enable_submission_queue_polling",
  "read_buffer_size",
  "write_timeout_ms"
];

export const DefaultSocketInterface: OutType = { "DefaultSocketInterface": [
  {
    "name": "io_uring_options",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "IoUringOptions",
    "enums": null,
    "comment": "io_uring options. io_uring is only valid in Linux with at least kernel version 5.11. Otherwise, Envoy will fall back to use the default socket API. If not set then io_uring will not be enabled.",
    "notImp": false
  }
] };