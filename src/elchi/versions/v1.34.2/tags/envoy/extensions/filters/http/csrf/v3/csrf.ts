import {OutType} from '@elchi/tags/tagsType';


export const CsrfPolicy: OutType = { "CsrfPolicy": [
  {
    "name": "filter_enabled",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "RuntimeFractionalPercent",
    "enums": null,
    "comment": "Specifies the % of requests for which the CSRF filter is enabled.\n\nIf `runtime_key` is specified, Envoy will lookup the runtime key to get the percentage of requests to filter.\n\n:::note\n\nThis field defaults to 100/`HUNDRED`.",
    "notImp": false
  },
  {
    "name": "shadow_enabled",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "RuntimeFractionalPercent",
    "enums": null,
    "comment": "Specifies that CSRF policies will be evaluated and tracked, but not enforced.\n\nThis is intended to be used when ``filter_enabled`` is off and will be ignored otherwise.\n\nIf `runtime_key` is specified, Envoy will lookup the runtime key to get the percentage of requests for which it will evaluate and track the request's ``Origin`` and ``Destination`` to determine if it's valid, but will not enforce any policies.",
    "notImp": false
  },
  {
    "name": "additional_origins",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "StringMatcher[]",
    "enums": null,
    "comment": "Specifies additional source origins that will be allowed in addition to the destination origin.\n\nMore information on how this can be configured via runtime can be found `here`.",
    "notImp": false
  }
] };