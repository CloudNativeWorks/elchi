import {OutType} from '@elchi/tags/tagsType';


export const ExpressionFilter: OutType = { "ExpressionFilter": [
  {
    "name": "expression",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "string",
    "enums": null,
    "comment": "Expression that, when evaluated, will be used to filter access logs. Expressions are based on the set of Envoy `attributes`. The provided expression must evaluate to true for logging (expression errors are considered false). Examples:\n\n* ``response.code >= 400`` * ``(connection.mtls && request.headers['x-log-mtls'] == 'true') || request.url_path.contains('v1beta3')``",
    "notImp": false
  },
  {
    "name": "cel_config",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "CelExpressionConfig",
    "enums": null,
    "comment": "CEL expression configuration that modifies the evaluation behavior of the ``expression`` field. If specified, string conversion, concatenation, and manipulation functions may be enabled for the filter expression. See `CelExpressionConfig` for more details.",
    "notImp": false
  }
] };

export const ExpressionFilter_SingleFields = [
  "expression"
];