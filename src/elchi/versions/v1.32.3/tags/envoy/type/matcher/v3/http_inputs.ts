import {OutType} from '@/elchi/tags/tagsType';


export const HttpRequestHeaderMatchInput: OutType = { "HttpRequestHeaderMatchInput": [
  {
    "name": "header_name",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "string",
    "enums": null,
    "comment": "The request header to match on.",
    "notImp": false
  }
] };

export const HttpRequestHeaderMatchInput_SingleFields = [
  "header_name"
];

export const HttpRequestTrailerMatchInput: OutType = { "HttpRequestTrailerMatchInput": [
  {
    "name": "header_name",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "string",
    "enums": null,
    "comment": "The request trailer to match on.",
    "notImp": false
  }
] };

export const HttpRequestTrailerMatchInput_SingleFields = [
  "header_name"
];

export const HttpResponseHeaderMatchInput: OutType = { "HttpResponseHeaderMatchInput": [
  {
    "name": "header_name",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "string",
    "enums": null,
    "comment": "The response header to match on.",
    "notImp": false
  }
] };

export const HttpResponseHeaderMatchInput_SingleFields = [
  "header_name"
];

export const HttpResponseTrailerMatchInput: OutType = { "HttpResponseTrailerMatchInput": [
  {
    "name": "header_name",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "string",
    "enums": null,
    "comment": "The response trailer to match on.",
    "notImp": false
  }
] };

export const HttpResponseTrailerMatchInput_SingleFields = [
  "header_name"
];

export const HttpRequestQueryParamMatchInput: OutType = { "HttpRequestQueryParamMatchInput": [
  {
    "name": "query_param",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "string",
    "enums": null,
    "comment": "The query parameter to match on.",
    "notImp": false
  }
] };

export const HttpRequestQueryParamMatchInput_SingleFields = [
  "query_param"
];