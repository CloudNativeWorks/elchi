import {OutType} from '@elchi/tags/tagsType';


export const HttpService: OutType = { "HttpService": [
  {
    "name": "http_uri",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "HttpUri",
    "enums": null,
    "comment": "The service's HTTP URI. For example:\n\n```yaml\n\n   http_uri:\n     uri: https://www.myserviceapi.com/v1/data\n     cluster: www.myserviceapi.com|443",
    "notImp": false
  },
  {
    "name": "request_headers_to_add",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "HeaderValueOption[]",
    "enums": null,
    "comment": "Specifies a list of HTTP headers that should be added to each request handled by this virtual host. Substitution formatters are supported.",
    "notImp": false
  },
  {
    "name": "formatters",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "TypedExtensionConfig[]",
    "enums": null,
    "comment": "Specifies a collection of Formatter plugins that can be used in substitution formatters in ``request_headers_to_add``. See the formatters extensions documentation for details. extension-category: envoy.formatter",
    "notImp": false
  }
] };