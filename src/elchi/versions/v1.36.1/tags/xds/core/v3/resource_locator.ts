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
    "comment": "Additional parameters that can be used to select resource variants. Matches must be exact, i.e. all context parameters must match exactly and there must be no additional context parameters set on the matched resource.",
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
    "comment": "An alternative resource locator for fallback if the resource is unavailable. For example, take the resource locator:\n\n  xdstp://foo/some-type/some-route-table#alt=xdstp://bar/some-type/another-route-table\n\nIf the data-plane load balancer is unable to reach `foo` to fetch the resource, it will fallback to `bar`. Alternative resources do not need to have equivalent content, but they should be functional substitutes.",
    "notImp": false
  },
  {
    "name": "directive.entry",
    "isUnion": true,
    "isDeprecated": false,
    "fieldType": "string",
    "enums": null,
    "comment": "List collections support inlining of resources via the entry field in Resource. These inlined Resource objects may have an optional name field specified. When specified, the entry directive allows ResourceLocator to directly reference these inlined resources, e.g. xdstp://.../foo#entry=bar.",
    "notImp": false
  }
] };

export const ResourceLocator_Directive_SingleFields = [
  "directive.entry"
];