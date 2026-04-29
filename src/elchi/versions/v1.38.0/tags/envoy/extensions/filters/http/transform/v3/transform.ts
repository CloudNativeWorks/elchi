import {OutType} from '@elchi/tags/tagsType';


export const BodyTransformation: OutType = { "BodyTransformation": [
  {
    "name": "body_format",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "SubstitutionFormatString",
    "enums": null,
    "comment": "Body transformation configuration. The substitution format string is used as the template to generate the transformed new body content. The `substitution format specifier` could be applied here. And except the commonly used format specifiers, the additional format specifiers ``%REQUEST_BODY(KEY*)%`` and ``%RESPONSE_BODY(KEY*)%`` could also be used here.",
    "notImp": false
  },
  {
    "name": "action",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "BodyTransformation_TransformAction",
    "enums": [
      "MERGE",
      "REPLACE"
    ],
    "comment": "The action to perform for new body content and original body content. For example, if ``MERGE`` is used, then the new body content generated from the ``body_format`` will be merged into the original body content.\n\nDefault is ``MERGE``.",
    "notImp": false
  }
] };

export const BodyTransformation_SingleFields = [
  "action"
];

export const Transformation: OutType = { "Transformation": [
  {
    "name": "headers_mutations",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "HeaderMutation[]",
    "enums": null,
    "comment": "The header mutations to perform. The `substitution format specifier` could be applied here. In addition to the commonly used format specifiers, this filter introduces additional format specifiers:\n\n* ``%REQUEST_BODY(KEY*)%``: the request body. And ``Key`` KEY is an optional lookup key in the namespace with the option of specifying nested keys separated by ':'. * ``%RESPONSE_BODY(KEY*)%``: the response body. And ``Key`` KEY is an optional lookup key in the namespace with the option of specifying nested keys separated by ':'.",
    "notImp": false
  },
  {
    "name": "body_transformation",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "BodyTransformation",
    "enums": null,
    "comment": "The body transformation configuration. If not set, no body transformation will be performed.",
    "notImp": false
  }
] };

export const TransformConfig: OutType = { "TransformConfig": [
  {
    "name": "request_transformation",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "Transformation",
    "enums": null,
    "comment": "Configuration for transforming request.\n\n:::note\n\nIf set then the entire request headers and body will always be buffered on a JSON request even if only headers are transformed.",
    "notImp": false
  },
  {
    "name": "response_transformation",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "Transformation",
    "enums": null,
    "comment": "Configuration for transforming response.\n\n:::note\n\nIf set then the entire response headers and body will always be buffered on a JSON response even if only headers are transformed.",
    "notImp": false
  },
  {
    "name": "clear_cluster_cache",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "boolean",
    "enums": null,
    "comment": "If true and the request headers are transformed, Envoy will re-evaluate the target cluster in the same route. Please ensure the cluster specifier in the route supports dynamic evaluation or this flag will have no effect, e.g. `matcher cluster specifier`.\n\nOnly one of ``clear_cluster_cache`` and ``clear_route_cache`` can be true.",
    "notImp": false
  },
  {
    "name": "clear_route_cache",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "boolean",
    "enums": null,
    "comment": "If true and the request headers are transformed, Envoy will clear the route cache for the current request and force re-evaluation of the route. This has performance penalty and should only be used when the route match criteria depends on the transformed headers.\n\nOnly one of ``clear_cluster_cache`` and ``clear_route_cache`` can be true.",
    "notImp": false
  }
] };

export const TransformConfig_SingleFields = [
  "clear_cluster_cache",
  "clear_route_cache"
];