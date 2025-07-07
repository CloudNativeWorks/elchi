import {OutType} from '@/elchi/tags/tagsType';


export const Http1CodecConfig: OutType = { "Http1CodecConfig": [
  {
    "name": "single_frame_mode",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "boolean",
    "enums": null,
    "comment": "If true, the codec will parse and serialize HTTP1 messages in a single frame per message.\n\nA frame is a minimal unit of data that can be processed by the generic proxy. If false, the codec will parse and serialize HTTP1 messages in a streaming way. In this case, the codec will output multiple frames for a single HTTP1 message to the generic proxy. If true, the codec will buffer the entire HTTP1 message body before sending it to the generic proxy. This may have better performance in small message scenarios and is more friendly to handle the HTTP1 message body. This also may result in higher memory usage and latency if the message body is large.\n\nDefault is true.",
    "notImp": false
  },
  {
    "name": "max_buffer_size",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "number",
    "enums": null,
    "comment": "The maximum size of the HTTP1 message body in bytes. If not set, 8*1024*1024 (8MB) is used. This only makes sense when single_frame_mode is true. If the HTTP1 message body size exceeds this value, this will result in a decoding error and the generic proxy will close the connection.",
    "notImp": false
  }
] };

export const Http1CodecConfig_SingleFields = [
  "single_frame_mode",
  "max_buffer_size"
];