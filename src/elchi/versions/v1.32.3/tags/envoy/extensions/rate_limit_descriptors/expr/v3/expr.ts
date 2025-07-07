import {OutType} from '@/elchi/tags/tagsType';


export const Descriptor: OutType = { "Descriptor": [
  {
    "name": "descriptor_key",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "string",
    "enums": null,
    "comment": "The key to use in the descriptor entry.",
    "notImp": false
  },
  {
    "name": "skip_if_error",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "boolean",
    "enums": null,
    "comment": "If set to true, Envoy skips the descriptor if the expression evaluates to an error. By default, the rate limit is not applied when an expression produces an error.",
    "notImp": false
  },
  {
    "name": "expr_specifier.text",
    "isUnion": true,
    "isDeprecated": false,
    "fieldType": "string",
    "enums": null,
    "comment": "Expression in a text form, e.g. \"connection.requested_server_name\".",
    "notImp": false
  },
  {
    "name": "expr_specifier.parsed",
    "isUnion": true,
    "isDeprecated": false,
    "fieldType": "Expr",
    "enums": null,
    "comment": "Parsed expression in AST form.",
    "notImp": false
  }
] };

export const Descriptor_SingleFields = [
  "descriptor_key",
  "skip_if_error",
  "expr_specifier.text"
];