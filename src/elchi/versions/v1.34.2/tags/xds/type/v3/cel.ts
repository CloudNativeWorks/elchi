import {OutType} from '@elchi/tags/tagsType';


export const CelExpression: OutType = { "CelExpression": [
  {
    "name": "expr_specifier.parsed_expr",
    "isUnion": true,
    "isDeprecated": false,
    "fieldType": "ParsedExpr",
    "enums": null,
    "comment": "Parsed expression in abstract syntax tree (AST) form.",
    "notImp": false
  },
  {
    "name": "expr_specifier.checked_expr",
    "isUnion": true,
    "isDeprecated": false,
    "fieldType": "CheckedExpr",
    "enums": null,
    "comment": "Parsed expression in abstract syntax tree (AST) form that has been successfully type checked.",
    "notImp": false
  }
] };

export const CelExtractString: OutType = { "CelExtractString": [
  {
    "name": "expr_extract",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "CelExpression",
    "enums": null,
    "comment": "The CEL expression used to extract a string from the CEL environment. the \"subject string\") that should be replaced.",
    "notImp": false
  },
  {
    "name": "default_value",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "string",
    "enums": null,
    "comment": "If CEL expression evaluates to an error, this value is be returned to the caller. If not set, the error is propagated to the caller.",
    "notImp": false
  }
] };

export const CelExtractString_SingleFields = [
  "default_value"
];