import {OutType} from '@elchi/tags/tagsType';


export const CheckRequest: OutType = { "CheckRequest": [
  {
    "name": "attributes",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "AttributeContext",
    "enums": null,
    "comment": "The request attributes.",
    "notImp": false
  }
] };

export const DeniedHttpResponse: OutType = { "DeniedHttpResponse": [
  {
    "name": "status",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "HttpStatus",
    "enums": null,
    "comment": "This field allows the authorization service to send an HTTP response status code to the downstream client. If not set, Envoy sends ``403 Forbidden`` HTTP status code by default.",
    "notImp": false
  },
  {
    "name": "headers",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "HeaderValueOption[]",
    "enums": null,
    "comment": "This field allows the authorization service to send HTTP response headers to the downstream client. Note that the `append field in HeaderValueOption` defaults to false when used in this message.",
    "notImp": false
  },
  {
    "name": "body",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "string",
    "enums": null,
    "comment": "This field allows the authorization service to send a response body data to the downstream client.",
    "notImp": false
  }
] };

export const DeniedHttpResponse_SingleFields = [
  "body"
];

export const OkHttpResponse: OutType = { "OkHttpResponse": [
  {
    "name": "headers",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "HeaderValueOption[]",
    "enums": null,
    "comment": "HTTP entity headers in addition to the original request headers. This allows the authorization service to append, to add or to override headers from the original request before dispatching it to the upstream. Note that the `append field in HeaderValueOption` defaults to false when used in this message. By setting the ``append`` field to ``true``, the filter will append the correspondent header value to the matched request header. By leaving ``append`` as false, the filter will either add a new header, or override an existing one if there is a match.",
    "notImp": false
  },
  {
    "name": "headers_to_remove",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "string[]",
    "enums": null,
    "comment": "HTTP entity headers to remove from the original request before dispatching it to the upstream. This allows the authorization service to act on auth related headers (like ``Authorization``), process them, and consume them. Under this model, the upstream will either receive the request (if it's authorized) or not receive it (if it's not), but will not see headers containing authorization credentials.\n\nPseudo headers (such as ``:authority``, ``:method``, ``:path`` etc), as well as the header ``Host``, may not be removed as that would make the request malformed. If mentioned in ``headers_to_remove`` these special headers will be ignored.\n\nWhen using the HTTP service this must instead be set by the HTTP authorization service as a comma separated list like so: ``x-envoy-auth-headers-to-remove: one-auth-header, another-auth-header``.",
    "notImp": false
  },
  {
    "name": "dynamic_metadata",
    "isUnion": false,
    "isDeprecated": true,
    "fieldType": "{ [key: string]: any; }",
    "enums": null,
    "comment": "This field has been deprecated in favor of `CheckResponse.dynamic_metadata`. Until it is removed, setting this field overrides `CheckResponse.dynamic_metadata`.",
    "notImp": false
  },
  {
    "name": "response_headers_to_add",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "HeaderValueOption[]",
    "enums": null,
    "comment": "This field allows the authorization service to send HTTP response headers to the downstream client on success. Note that the `append field in HeaderValueOption` defaults to false when used in this message.",
    "notImp": false
  },
  {
    "name": "query_parameters_to_set",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "QueryParameter[]",
    "enums": null,
    "comment": "This field allows the authorization service to set (and overwrite) query string parameters on the original request before it is sent upstream.",
    "notImp": false
  },
  {
    "name": "query_parameters_to_remove",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "string[]",
    "enums": null,
    "comment": "This field allows the authorization service to specify which query parameters should be removed from the original request before it is sent upstream. Each element in this list is a case-sensitive query parameter name to be removed.",
    "notImp": false
  }
] };

export const OkHttpResponse_SingleFields = [
  "headers_to_remove",
  "query_parameters_to_remove"
];

export const CheckResponse: OutType = { "CheckResponse": [
  {
    "name": "status",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "Status",
    "enums": null,
    "comment": "Status ``OK`` allows the request. Any other status indicates the request should be denied, and for HTTP filter, if not overridden by `denied HTTP response status` Envoy sends ``403 Forbidden`` HTTP status code by default.",
    "notImp": false
  },
  {
    "name": "http_response.denied_response",
    "isUnion": true,
    "isDeprecated": false,
    "fieldType": "DeniedHttpResponse",
    "enums": null,
    "comment": "Supplies http attributes for a denied response.",
    "notImp": false
  },
  {
    "name": "http_response.ok_response",
    "isUnion": true,
    "isDeprecated": false,
    "fieldType": "OkHttpResponse",
    "enums": null,
    "comment": "Supplies http attributes for an ok response.",
    "notImp": false
  },
  {
    "name": "dynamic_metadata",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "{ [key: string]: any; }",
    "enums": null,
    "comment": "Optional response metadata that will be emitted as dynamic metadata to be consumed by the next filter. This metadata lives in a namespace specified by the canonical name of extension filter that requires it:\n\n- `envoy.filters.http.ext_authz` for HTTP filter. - `envoy.filters.network.ext_authz` for network filter.",
    "notImp": false
  }
] };