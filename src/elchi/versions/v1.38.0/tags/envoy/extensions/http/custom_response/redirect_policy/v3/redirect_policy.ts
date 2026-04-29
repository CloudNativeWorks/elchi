import {OutType} from '@elchi/tags/tagsType';


export const RedirectPolicy: OutType = { "RedirectPolicy": [
  {
    "name": "redirect_action_specifier.uri",
    "isUnion": true,
    "isDeprecated": false,
    "fieldType": "string",
    "enums": null,
    "comment": "The Http URI to redirect the original request to, to get the custom response. It should be a full FQDN with protocol, host and path.\n\nExample:\n\n```yaml\n\n   uri: https://www.mydomain.com/path/to/404.txt",
    "notImp": false
  },
  {
    "name": "redirect_action_specifier.redirect_action",
    "isUnion": true,
    "isDeprecated": false,
    "fieldType": "RedirectAction",
    "enums": null,
    "comment": "Specify elements of the redirect url individually. Note: Do not specify the ``response_code`` field in ``redirect_action``, use ``status_code`` instead. The following fields in ``redirect_action`` are currently not supported, and specifying them will cause the config to be rejected: - ``prefix_rewrite`` - ``regex_rewrite``",
    "notImp": false
  },
  {
    "name": "status_code",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "number",
    "enums": null,
    "comment": "The new response status code if specified. This is used to override the status code of the response from the new upstream if it is not an error status.",
    "notImp": false
  },
  {
    "name": "response_headers_to_add",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "HeaderValueOption[]",
    "enums": null,
    "comment": "HTTP headers to add to the response. This allows the response policy to append, to add or to override headers of the original response for local body, or the custom response from the remote body, before it is sent to a downstream client. Note that these are not applied if the redirected response is an error response.",
    "notImp": false
  },
  {
    "name": "request_headers_to_add",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "HeaderValueOption[]",
    "enums": null,
    "comment": "HTTP headers to add to the request before it is internally redirected.",
    "notImp": false
  },
  {
    "name": "modify_request_headers_action",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "TypedExtensionConfig",
    "enums": null,
    "comment": "Custom action to modify request headers before selection of the redirected route.",
    "notImp": false
  }
] };

export const RedirectPolicy_SingleFields = [
  "redirect_action_specifier.uri",
  "status_code"
];