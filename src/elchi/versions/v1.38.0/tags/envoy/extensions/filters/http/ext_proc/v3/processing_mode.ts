import {OutType} from '@elchi/tags/tagsType';


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
    "comment": "How to handle the request header.\n\n:::note\n\nThis field is ignored in `mode_override`, since mode overrides can only affect messages exchanged after the request header is processed. \n:::\n\nDefaults to ``SEND``.",
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
    "comment": "How to handle the response header.\n\nDefaults to ``SEND``.",
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
      "BUFFERED_PARTIAL",
      "FULL_DUPLEX_STREAMED",
      "GRPC"
    ],
    "comment": "How to handle the request body.\n\nDefaults to ``NONE``.",
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
      "BUFFERED_PARTIAL",
      "FULL_DUPLEX_STREAMED",
      "GRPC"
    ],
    "comment": "How to handle the response body.\n\nDefaults to ``NONE``.",
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
    "comment": "How to handle the request trailers.\n\nDefaults to ``SKIP``.",
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
    "comment": "How to handle the response trailers.\n\nDefaults to ``SKIP``.",
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