import {OutType} from '@/elchi/tags/tagsType';


export const ProcessingMode: OutType = { "ProcessingMode": [
  {
    "name": "request_header_mode",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "ProcessingMode_HeaderSendMode",
    "enums": [
      "DEFAULT",
      "SEND",
      "SKIP"
    ],
    "comment": "How to handle the request header. Default is \"SEND\".",
    "notImp": false
  },
  {
    "name": "response_header_mode",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "ProcessingMode_HeaderSendMode",
    "enums": [
      "DEFAULT",
      "SEND",
      "SKIP"
    ],
    "comment": "How to handle the response header. Default is \"SEND\".",
    "notImp": false
  },
  {
    "name": "request_body_mode",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "ProcessingMode_BodySendMode",
    "enums": [
      "NONE",
      "STREAMED",
      "BUFFERED",
      "BUFFERED_PARTIAL"
    ],
    "comment": "How to handle the request body. Default is \"NONE\".",
    "notImp": false
  },
  {
    "name": "response_body_mode",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "ProcessingMode_BodySendMode",
    "enums": [
      "NONE",
      "STREAMED",
      "BUFFERED",
      "BUFFERED_PARTIAL"
    ],
    "comment": "How do handle the response body. Default is \"NONE\".",
    "notImp": false
  },
  {
    "name": "request_trailer_mode",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "ProcessingMode_HeaderSendMode",
    "enums": [
      "DEFAULT",
      "SEND",
      "SKIP"
    ],
    "comment": "How to handle the request trailers. Default is \"SKIP\".",
    "notImp": false
  },
  {
    "name": "response_trailer_mode",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "ProcessingMode_HeaderSendMode",
    "enums": [
      "DEFAULT",
      "SEND",
      "SKIP"
    ],
    "comment": "How to handle the response trailers. Default is \"SKIP\".",
    "notImp": false
  }
] };

export const ProcessingMode_SingleFields = [
  "request_header_mode",
  "response_header_mode",
  "request_body_mode",
  "response_body_mode",
  "request_trailer_mode",
  "response_trailer_mode"
];