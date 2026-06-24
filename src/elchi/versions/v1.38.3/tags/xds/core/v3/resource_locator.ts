import {OutType} from '@elchi/tags/tagsType';


export const ResourceLocator: OutType = { "ResourceLocator": [
  {
    "name": "scheme",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "ResourceLocator_Scheme",
    "enums": [
      "XDSTP",
      "HTTP",
      "FILE"
    ],
    "comment": "URI scheme.",
    "notImp": false
  },
  {
    "name": "id",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "string",
    "enums": null,
    "comment": "Opaque identifier for the resource. Any '/' will not be escaped during URI encoding and will form part of the URI path. This may end with ‘*’ for glob collection references.",
    "notImp": false
  },
  {
    "name": "authority",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "string",
    "enums": null,
    "comment": "Logical authority for resource (not necessarily transport network address). Authorities are opaque in the xDS API, data-plane load balancers will map them to concrete network transports such as an xDS management server, e.g. via envoy.config.core.v3.ConfigSource.",
    "notImp": false
  },
  {
    "name": "resource_type",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "string",
    "enums": null,
    "comment": "Fully qualified resource type (as in type URL without types.googleapis.com/ prefix).",
    "notImp": false
  },
  {
    "name": "context_param_specifier.exact_context",
    "isUnion": true,
    "isDeprecated": false,
    "fieldType": "ContextParams",
    "enums": null,
    "comment": "xDS resource locators identify a xDS resource name and instruct the data-plane load balancer on how the resource may be located.\n\nResource locators have a canonical xdstp:// URI representation:\n\n  xdstp://{authority}/{type_url}/{id}?{context_params}{#directive,*}\n\nwhere context_params take the form of URI query parameters.\n\nResource locators have a similar canonical http:// URI representation:\n\n  http://{authority}/{type_url}/{id}?{context_params}{#directive,*}\n\nResource locators also have a simplified file:// URI representation:\n\n  file:///{id}{#directive,*}",
    "notImp": false
  },
  {
    "name": "directives",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "ResourceLocator_Directive[]",
    "enums": null,
    "comment": "A list of directives that appear in the xDS resource locator #fragment.\n\nWhen encoding to URI form, directives are percent encoded with comma separation.",
    "notImp": false
  }
] };

export const ResourceLocator_SingleFields = [
  "scheme",
  "id",
  "authority",
  "resource_type"
];

export const ResourceLocator_Directive: OutType = { "ResourceLocator_Directive": [
  {
    "name": "directive.alt",
    "isUnion": true,
    "isDeprecated": false,
    "fieldType": "ResourceLocator",
    "enums": null,
    "comment": "Directives provide information to data-plane load balancers on how xDS resource names are to be interpreted and potentially further resolved. For example, they may provide alternative resource locators for when primary resolution fails. Directives are not part of resource names and do not appear in a xDS transport discovery request.\n\nWhen encoding to URIs, directives take the form:\n\n<directive name>=<string representation of directive value>\n\nFor example, we can have alt=xdstp://foo/bar or entry=some%20thing. Each directive value type may have its own string encoding, in the case of ResourceLocator there is a recursive URI encoding.\n\nPercent encoding applies to the URI encoding of the directive value. Multiple directives are comma-separated, so the reserved characters that require percent encoding in a directive value are [',', '#', '[', ']', '%']. These are the RFC3986 fragment reserved characters with the addition of the xDS scheme specific ','. See https://tools.ietf.org/html/rfc3986#page-49 for further details on URI ABNF and reserved characters.",
    "notImp": false
  },
  {
    "name": "directive.entry",
    "isUnion": true,
    "isDeprecated": false,
    "fieldType": "string",
    "enums": null,
    "comment": "Directives provide information to data-plane load balancers on how xDS resource names are to be interpreted and potentially further resolved. For example, they may provide alternative resource locators for when primary resolution fails. Directives are not part of resource names and do not appear in a xDS transport discovery request.\n\nWhen encoding to URIs, directives take the form:\n\n<directive name>=<string representation of directive value>\n\nFor example, we can have alt=xdstp://foo/bar or entry=some%20thing. Each directive value type may have its own string encoding, in the case of ResourceLocator there is a recursive URI encoding.\n\nPercent encoding applies to the URI encoding of the directive value. Multiple directives are comma-separated, so the reserved characters that require percent encoding in a directive value are [',', '#', '[', ']', '%']. These are the RFC3986 fragment reserved characters with the addition of the xDS scheme specific ','. See https://tools.ietf.org/html/rfc3986#page-49 for further details on URI ABNF and reserved characters.",
    "notImp": false
  }
] };

export const ResourceLocator_Directive_SingleFields = [
  "directive.entry"
];