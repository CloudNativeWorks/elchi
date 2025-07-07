import {OutType} from '@/elchi/tags/tagsType';


export const Http: OutType = { "Http": [
  {
    "name": "rules",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "HttpRule[]",
    "enums": null,
    "comment": "A list of HTTP configuration rules that apply to individual API methods.\n\n**NOTE:** All service configuration rules follow \"last one wins\" order.",
    "notImp": false
  },
  {
    "name": "fully_decode_reserved_expansion",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "boolean",
    "enums": null,
    "comment": "When set to true, URL path parameters will be fully URI-decoded except in cases of single segment matches in reserved expansion, where \"%2F\" will be left encoded.\n\nThe default behavior is to not decode RFC 6570 reserved characters in multi segment matches.",
    "notImp": false
  }
] };

export const Http_SingleFields = [
  "fully_decode_reserved_expansion"
];

export const HttpRule: OutType = { "HttpRule": [
  {
    "name": "selector",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "string",
    "enums": null,
    "comment": "Selects a method to which this rule applies.\n\nRefer to [selector][google.api.DocumentationRule.selector] for syntax details.",
    "notImp": false
  },
  {
    "name": "pattern.get",
    "isUnion": true,
    "isDeprecated": false,
    "fieldType": "string",
    "enums": null,
    "comment": "Maps to HTTP GET. Used for listing and getting information about resources.",
    "notImp": false
  },
  {
    "name": "pattern.put",
    "isUnion": true,
    "isDeprecated": false,
    "fieldType": "string",
    "enums": null,
    "comment": "Maps to HTTP PUT. Used for replacing a resource.",
    "notImp": false
  },
  {
    "name": "pattern.post",
    "isUnion": true,
    "isDeprecated": false,
    "fieldType": "string",
    "enums": null,
    "comment": "Maps to HTTP POST. Used for creating a resource or performing an action.",
    "notImp": false
  },
  {
    "name": "pattern.delete",
    "isUnion": true,
    "isDeprecated": false,
    "fieldType": "string",
    "enums": null,
    "comment": "Maps to HTTP DELETE. Used for deleting a resource.",
    "notImp": false
  },
  {
    "name": "pattern.patch",
    "isUnion": true,
    "isDeprecated": false,
    "fieldType": "string",
    "enums": null,
    "comment": "Maps to HTTP PATCH. Used for updating a resource.",
    "notImp": false
  },
  {
    "name": "pattern.custom",
    "isUnion": true,
    "isDeprecated": false,
    "fieldType": "CustomHttpPattern",
    "enums": null,
    "comment": "The custom pattern is used for specifying an HTTP method that is not included in the `pattern` field, such as HEAD, or \"*\" to leave the HTTP method unspecified for this rule. The wild-card rule is useful for services that provide content to Web (HTML) clients.",
    "notImp": false
  },
  {
    "name": "body",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "string",
    "enums": null,
    "comment": "The name of the request field whose value is mapped to the HTTP request body, or `*` for mapping all request fields not captured by the path pattern to the HTTP body, or omitted for not having any HTTP request body.\n\nNOTE: the referred field must be present at the top-level of the request message type.",
    "notImp": false
  },
  {
    "name": "response_body",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "string",
    "enums": null,
    "comment": "Optional. The name of the response field whose value is mapped to the HTTP response body. When omitted, the entire response message will be used as the HTTP response body.\n\nNOTE: The referred field must be present at the top-level of the response message type.",
    "notImp": false
  },
  {
    "name": "additional_bindings",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "HttpRule[]",
    "enums": null,
    "comment": "Additional HTTP bindings for the selector. Nested bindings must not contain an `additional_bindings` field themselves (that is, the nesting may only be one level deep).",
    "notImp": false
  }
] };

export const HttpRule_SingleFields = [
  "selector",
  "pattern.get",
  "pattern.put",
  "pattern.post",
  "pattern.delete",
  "pattern.patch",
  "body",
  "response_body"
];

export const CustomHttpPattern: OutType = { "CustomHttpPattern": [
  {
    "name": "kind",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "string",
    "enums": null,
    "comment": "The name of this custom HTTP verb.",
    "notImp": false
  },
  {
    "name": "path",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "string",
    "enums": null,
    "comment": "The path matched by this custom verb.",
    "notImp": false
  }
] };

export const CustomHttpPattern_SingleFields = [
  "kind",
  "path"
];