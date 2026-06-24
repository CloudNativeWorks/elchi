import {OutType} from '@elchi/tags/tagsType';


export const Expr: OutType = { "Expr": [
  {
    "name": "id",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "number",
    "enums": null,
    "comment": "Required. An id assigned to this node by the parser which is unique in a given expression tree. This is used to associate type information and other attributes to a node in the parse tree.",
    "notImp": false
  },
  {
    "name": "expr_kind.const_expr",
    "isUnion": true,
    "isDeprecated": false,
    "fieldType": "Constant",
    "enums": null,
    "comment": "An abstract representation of a common expression.\n\nExpressions are abstractly represented as a collection of identifiers, select statements, function calls, literals, and comprehensions. All operators with the exception of the '.' operator are modelled as function calls. This makes it easy to represent new operators into the existing AST.\n\nAll references within expressions must resolve to a [Decl][google.api.expr.v1alpha1.Decl] provided at type-check for an expression to be valid. A reference may either be a bare identifier `name` or a qualified identifier `google.api.name`. References may either refer to a value or a function declaration.\n\nFor example, the expression `google.api.name.startsWith('expr')` references the declaration `google.api.name` within a [Expr.Select][google.api.expr.v1alpha1.Expr.Select] expression, and the function declaration `startsWith`.",
    "notImp": false
  },
  {
    "name": "expr_kind.ident_expr",
    "isUnion": true,
    "isDeprecated": false,
    "fieldType": "Expr_Ident",
    "enums": null,
    "comment": "An abstract representation of a common expression.\n\nExpressions are abstractly represented as a collection of identifiers, select statements, function calls, literals, and comprehensions. All operators with the exception of the '.' operator are modelled as function calls. This makes it easy to represent new operators into the existing AST.\n\nAll references within expressions must resolve to a [Decl][google.api.expr.v1alpha1.Decl] provided at type-check for an expression to be valid. A reference may either be a bare identifier `name` or a qualified identifier `google.api.name`. References may either refer to a value or a function declaration.\n\nFor example, the expression `google.api.name.startsWith('expr')` references the declaration `google.api.name` within a [Expr.Select][google.api.expr.v1alpha1.Expr.Select] expression, and the function declaration `startsWith`.",
    "notImp": false
  },
  {
    "name": "expr_kind.select_expr",
    "isUnion": true,
    "isDeprecated": false,
    "fieldType": "Expr_Select",
    "enums": null,
    "comment": "An abstract representation of a common expression.\n\nExpressions are abstractly represented as a collection of identifiers, select statements, function calls, literals, and comprehensions. All operators with the exception of the '.' operator are modelled as function calls. This makes it easy to represent new operators into the existing AST.\n\nAll references within expressions must resolve to a [Decl][google.api.expr.v1alpha1.Decl] provided at type-check for an expression to be valid. A reference may either be a bare identifier `name` or a qualified identifier `google.api.name`. References may either refer to a value or a function declaration.\n\nFor example, the expression `google.api.name.startsWith('expr')` references the declaration `google.api.name` within a [Expr.Select][google.api.expr.v1alpha1.Expr.Select] expression, and the function declaration `startsWith`.",
    "notImp": false
  },
  {
    "name": "expr_kind.call_expr",
    "isUnion": true,
    "isDeprecated": false,
    "fieldType": "Expr_Call",
    "enums": null,
    "comment": "An abstract representation of a common expression.\n\nExpressions are abstractly represented as a collection of identifiers, select statements, function calls, literals, and comprehensions. All operators with the exception of the '.' operator are modelled as function calls. This makes it easy to represent new operators into the existing AST.\n\nAll references within expressions must resolve to a [Decl][google.api.expr.v1alpha1.Decl] provided at type-check for an expression to be valid. A reference may either be a bare identifier `name` or a qualified identifier `google.api.name`. References may either refer to a value or a function declaration.\n\nFor example, the expression `google.api.name.startsWith('expr')` references the declaration `google.api.name` within a [Expr.Select][google.api.expr.v1alpha1.Expr.Select] expression, and the function declaration `startsWith`.",
    "notImp": false
  },
  {
    "name": "expr_kind.list_expr",
    "isUnion": true,
    "isDeprecated": false,
    "fieldType": "Expr_CreateList",
    "enums": null,
    "comment": "An abstract representation of a common expression.\n\nExpressions are abstractly represented as a collection of identifiers, select statements, function calls, literals, and comprehensions. All operators with the exception of the '.' operator are modelled as function calls. This makes it easy to represent new operators into the existing AST.\n\nAll references within expressions must resolve to a [Decl][google.api.expr.v1alpha1.Decl] provided at type-check for an expression to be valid. A reference may either be a bare identifier `name` or a qualified identifier `google.api.name`. References may either refer to a value or a function declaration.\n\nFor example, the expression `google.api.name.startsWith('expr')` references the declaration `google.api.name` within a [Expr.Select][google.api.expr.v1alpha1.Expr.Select] expression, and the function declaration `startsWith`.",
    "notImp": false
  },
  {
    "name": "expr_kind.struct_expr",
    "isUnion": true,
    "isDeprecated": false,
    "fieldType": "Expr_CreateStruct",
    "enums": null,
    "comment": "An abstract representation of a common expression.\n\nExpressions are abstractly represented as a collection of identifiers, select statements, function calls, literals, and comprehensions. All operators with the exception of the '.' operator are modelled as function calls. This makes it easy to represent new operators into the existing AST.\n\nAll references within expressions must resolve to a [Decl][google.api.expr.v1alpha1.Decl] provided at type-check for an expression to be valid. A reference may either be a bare identifier `name` or a qualified identifier `google.api.name`. References may either refer to a value or a function declaration.\n\nFor example, the expression `google.api.name.startsWith('expr')` references the declaration `google.api.name` within a [Expr.Select][google.api.expr.v1alpha1.Expr.Select] expression, and the function declaration `startsWith`.",
    "notImp": false
  },
  {
    "name": "expr_kind.comprehension_expr",
    "isUnion": true,
    "isDeprecated": false,
    "fieldType": "Expr_Comprehension",
    "enums": null,
    "comment": "An abstract representation of a common expression.\n\nExpressions are abstractly represented as a collection of identifiers, select statements, function calls, literals, and comprehensions. All operators with the exception of the '.' operator are modelled as function calls. This makes it easy to represent new operators into the existing AST.\n\nAll references within expressions must resolve to a [Decl][google.api.expr.v1alpha1.Decl] provided at type-check for an expression to be valid. A reference may either be a bare identifier `name` or a qualified identifier `google.api.name`. References may either refer to a value or a function declaration.\n\nFor example, the expression `google.api.name.startsWith('expr')` references the declaration `google.api.name` within a [Expr.Select][google.api.expr.v1alpha1.Expr.Select] expression, and the function declaration `startsWith`.",
    "notImp": false
  }
] };

export const Expr_SingleFields = [
  "id"
];

export const SourceInfo: OutType = { "SourceInfo": [
  {
    "name": "syntax_version",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "string",
    "enums": null,
    "comment": "The syntax version of the source, e.g. `cel1`.",
    "notImp": false
  },
  {
    "name": "location",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "string",
    "enums": null,
    "comment": "The location name. All position information attached to an expression is relative to this location.\n\nThe location could be a file, UI element, or similar. For example, `acme/app/AnvilPolicy.cel`.",
    "notImp": false
  },
  {
    "name": "line_offsets",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "number[]",
    "enums": null,
    "comment": "Monotonically increasing list of code point offsets where newlines `\\n` appear.\n\nThe line number of a given position is the index `i` where for a given `id` the `line_offsets[i] < id_positions[id] < line_offsets[i+1]`. The column may be derivd from `id_positions[id] - line_offsets[i]`.",
    "notImp": false
  },
  {
    "name": "positions",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "Map<number, number>",
    "enums": null,
    "comment": "A map from the parse node id (e.g. `Expr.id`) to the code point offset within the source.",
    "notImp": false
  },
  {
    "name": "macro_calls",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "Map<number, Expr>",
    "enums": null,
    "comment": "A map from the parse node id where a macro replacement was made to the call `Expr` that resulted in a macro expansion.\n\nFor example, `has(value.field)` is a function call that is replaced by a `test_only` field selection in the AST. Likewise, the call `list.exists(e, e > 10)` translates to a comprehension expression. The key in the map corresponds to the expression id of the expanded macro, and the value is the call `Expr` that was replaced.",
    "notImp": false
  }
] };

export const SourceInfo_SingleFields = [
  "syntax_version",
  "location",
  "line_offsets"
];

export const ParsedExpr: OutType = { "ParsedExpr": [
  {
    "name": "expr",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "Expr",
    "enums": null,
    "comment": "The parsed expression.",
    "notImp": false
  },
  {
    "name": "source_info",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "SourceInfo",
    "enums": null,
    "comment": "The source info derived from input that generated the parsed `expr`.",
    "notImp": false
  }
] };

export const Expr_Ident: OutType = { "Expr_Ident": [
  {
    "name": "name",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "string",
    "enums": null,
    "comment": "Required. Holds a single, unqualified identifier, possibly preceded by a '.'.\n\nQualified names are represented by the [Expr.Select][google.api.expr.v1alpha1.Expr.Select] expression.",
    "notImp": false
  }
] };

export const Expr_Ident_SingleFields = [
  "name"
];

export const Expr_Select: OutType = { "Expr_Select": [
  {
    "name": "operand",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "Expr",
    "enums": null,
    "comment": "Required. The target of the selection expression.\n\nFor example, in the select expression `request.auth`, the `request` portion of the expression is the `operand`.",
    "notImp": false
  },
  {
    "name": "field",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "string",
    "enums": null,
    "comment": "Required. The name of the field to select.\n\nFor example, in the select expression `request.auth`, the `auth` portion of the expression would be the `field`.",
    "notImp": false
  },
  {
    "name": "test_only",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "boolean",
    "enums": null,
    "comment": "Whether the select is to be interpreted as a field presence test.\n\nThis results from the macro `has(request.auth)`.",
    "notImp": false
  }
] };

export const Expr_Select_SingleFields = [
  "field",
  "test_only"
];

export const Expr_Call: OutType = { "Expr_Call": [
  {
    "name": "target",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "Expr",
    "enums": null,
    "comment": "The target of an method call-style expression. For example, `x` in `x.f()`.",
    "notImp": false
  },
  {
    "name": "function",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "string",
    "enums": null,
    "comment": "Required. The name of the function or method being called.",
    "notImp": false
  },
  {
    "name": "args",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "Expr[]",
    "enums": null,
    "comment": "The arguments.",
    "notImp": false
  }
] };

export const Expr_Call_SingleFields = [
  "function"
];

export const Expr_CreateList: OutType = { "Expr_CreateList": [
  {
    "name": "elements",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "Expr[]",
    "enums": null,
    "comment": "The elements part of the list.",
    "notImp": false
  }
] };

export const Expr_CreateStruct: OutType = { "Expr_CreateStruct": [
  {
    "name": "message_name",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "string",
    "enums": null,
    "comment": "The type name of the message to be created, empty when creating map literals.",
    "notImp": false
  },
  {
    "name": "entries",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "Expr_CreateStruct_Entry[]",
    "enums": null,
    "comment": "The entries in the creation expression.",
    "notImp": false
  }
] };

export const Expr_CreateStruct_SingleFields = [
  "message_name"
];

export const Expr_CreateStruct_Entry: OutType = { "Expr_CreateStruct_Entry": [
  {
    "name": "id",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "number",
    "enums": null,
    "comment": "Required. An id assigned to this node by the parser which is unique in a given expression tree. This is used to associate type information and other attributes to the node.",
    "notImp": false
  },
  {
    "name": "key_kind.field_key",
    "isUnion": true,
    "isDeprecated": false,
    "fieldType": "string",
    "enums": null,
    "comment": "Represents an entry.",
    "notImp": false
  },
  {
    "name": "key_kind.map_key",
    "isUnion": true,
    "isDeprecated": false,
    "fieldType": "Expr",
    "enums": null,
    "comment": "Represents an entry.",
    "notImp": false
  },
  {
    "name": "value",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "Expr",
    "enums": null,
    "comment": "Required. The value assigned to the key.",
    "notImp": false
  }
] };

export const Expr_CreateStruct_Entry_SingleFields = [
  "id",
  "key_kind.field_key"
];

export const Expr_Comprehension: OutType = { "Expr_Comprehension": [
  {
    "name": "iter_var",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "string",
    "enums": null,
    "comment": "The name of the iteration variable.",
    "notImp": false
  },
  {
    "name": "iter_range",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "Expr",
    "enums": null,
    "comment": "The range over which var iterates.",
    "notImp": false
  },
  {
    "name": "accu_var",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "string",
    "enums": null,
    "comment": "The name of the variable used for accumulation of the result.",
    "notImp": false
  },
  {
    "name": "accu_init",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "Expr",
    "enums": null,
    "comment": "The initial value of the accumulator.",
    "notImp": false
  },
  {
    "name": "loop_condition",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "Expr",
    "enums": null,
    "comment": "An expression which can contain iter_var and accu_var.\n\nReturns false when the result has been computed and may be used as a hint to short-circuit the remainder of the comprehension.",
    "notImp": false
  },
  {
    "name": "loop_step",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "Expr",
    "enums": null,
    "comment": "An expression which can contain iter_var and accu_var.\n\nComputes the next value of accu_var.",
    "notImp": false
  },
  {
    "name": "result",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "Expr",
    "enums": null,
    "comment": "An expression which can contain accu_var.\n\nComputes the result.",
    "notImp": false
  }
] };

export const Expr_Comprehension_SingleFields = [
  "iter_var",
  "accu_var"
];

export const Constant: OutType = { "Constant": [
  {
    "name": "constant_kind.null_value",
    "isUnion": true,
    "isDeprecated": false,
    "fieldType": "NullValue",
    "enums": [],
    "comment": "Represents a primitive literal.\n\nNamed 'Constant' here for backwards compatibility.\n\nThis is similar as the primitives supported in the well-known type `google.protobuf.Value`, but richer so it can represent CEL's full range of primitives.\n\nLists and structs are not included as constants as these aggregate types may contain [Expr][google.api.expr.v1alpha1.Expr] elements which require evaluation and are thus not constant.\n\nExamples of literals include: `\"hello\"`, `b'bytes'`, `1u`, `4.2`, `-2`, `true`, `null`.",
    "notImp": false
  },
  {
    "name": "constant_kind.bool_value",
    "isUnion": true,
    "isDeprecated": false,
    "fieldType": "boolean",
    "enums": null,
    "comment": "Represents a primitive literal.\n\nNamed 'Constant' here for backwards compatibility.\n\nThis is similar as the primitives supported in the well-known type `google.protobuf.Value`, but richer so it can represent CEL's full range of primitives.\n\nLists and structs are not included as constants as these aggregate types may contain [Expr][google.api.expr.v1alpha1.Expr] elements which require evaluation and are thus not constant.\n\nExamples of literals include: `\"hello\"`, `b'bytes'`, `1u`, `4.2`, `-2`, `true`, `null`.",
    "notImp": false
  },
  {
    "name": "constant_kind.int64_value",
    "isUnion": true,
    "isDeprecated": false,
    "fieldType": "number",
    "enums": null,
    "comment": "Represents a primitive literal.\n\nNamed 'Constant' here for backwards compatibility.\n\nThis is similar as the primitives supported in the well-known type `google.protobuf.Value`, but richer so it can represent CEL's full range of primitives.\n\nLists and structs are not included as constants as these aggregate types may contain [Expr][google.api.expr.v1alpha1.Expr] elements which require evaluation and are thus not constant.\n\nExamples of literals include: `\"hello\"`, `b'bytes'`, `1u`, `4.2`, `-2`, `true`, `null`.",
    "notImp": false
  },
  {
    "name": "constant_kind.uint64_value",
    "isUnion": true,
    "isDeprecated": false,
    "fieldType": "number",
    "enums": null,
    "comment": "Represents a primitive literal.\n\nNamed 'Constant' here for backwards compatibility.\n\nThis is similar as the primitives supported in the well-known type `google.protobuf.Value`, but richer so it can represent CEL's full range of primitives.\n\nLists and structs are not included as constants as these aggregate types may contain [Expr][google.api.expr.v1alpha1.Expr] elements which require evaluation and are thus not constant.\n\nExamples of literals include: `\"hello\"`, `b'bytes'`, `1u`, `4.2`, `-2`, `true`, `null`.",
    "notImp": false
  },
  {
    "name": "constant_kind.double_value",
    "isUnion": true,
    "isDeprecated": false,
    "fieldType": "number",
    "enums": null,
    "comment": "Represents a primitive literal.\n\nNamed 'Constant' here for backwards compatibility.\n\nThis is similar as the primitives supported in the well-known type `google.protobuf.Value`, but richer so it can represent CEL's full range of primitives.\n\nLists and structs are not included as constants as these aggregate types may contain [Expr][google.api.expr.v1alpha1.Expr] elements which require evaluation and are thus not constant.\n\nExamples of literals include: `\"hello\"`, `b'bytes'`, `1u`, `4.2`, `-2`, `true`, `null`.",
    "notImp": false
  },
  {
    "name": "constant_kind.string_value",
    "isUnion": true,
    "isDeprecated": false,
    "fieldType": "string",
    "enums": null,
    "comment": "Represents a primitive literal.\n\nNamed 'Constant' here for backwards compatibility.\n\nThis is similar as the primitives supported in the well-known type `google.protobuf.Value`, but richer so it can represent CEL's full range of primitives.\n\nLists and structs are not included as constants as these aggregate types may contain [Expr][google.api.expr.v1alpha1.Expr] elements which require evaluation and are thus not constant.\n\nExamples of literals include: `\"hello\"`, `b'bytes'`, `1u`, `4.2`, `-2`, `true`, `null`.",
    "notImp": false
  },
  {
    "name": "constant_kind.bytes_value",
    "isUnion": true,
    "isDeprecated": false,
    "fieldType": "Uint8Array<ArrayBufferLike>",
    "enums": null,
    "comment": "Represents a primitive literal.\n\nNamed 'Constant' here for backwards compatibility.\n\nThis is similar as the primitives supported in the well-known type `google.protobuf.Value`, but richer so it can represent CEL's full range of primitives.\n\nLists and structs are not included as constants as these aggregate types may contain [Expr][google.api.expr.v1alpha1.Expr] elements which require evaluation and are thus not constant.\n\nExamples of literals include: `\"hello\"`, `b'bytes'`, `1u`, `4.2`, `-2`, `true`, `null`.",
    "notImp": false
  },
  {
    "name": "constant_kind.duration_value",
    "isUnion": true,
    "isDeprecated": false,
    "fieldType": "Duration",
    "enums": null,
    "comment": "Represents a primitive literal.\n\nNamed 'Constant' here for backwards compatibility.\n\nThis is similar as the primitives supported in the well-known type `google.protobuf.Value`, but richer so it can represent CEL's full range of primitives.\n\nLists and structs are not included as constants as these aggregate types may contain [Expr][google.api.expr.v1alpha1.Expr] elements which require evaluation and are thus not constant.\n\nExamples of literals include: `\"hello\"`, `b'bytes'`, `1u`, `4.2`, `-2`, `true`, `null`.",
    "notImp": false
  },
  {
    "name": "constant_kind.timestamp_value",
    "isUnion": true,
    "isDeprecated": false,
    "fieldType": "Date",
    "enums": null,
    "comment": "Represents a primitive literal.\n\nNamed 'Constant' here for backwards compatibility.\n\nThis is similar as the primitives supported in the well-known type `google.protobuf.Value`, but richer so it can represent CEL's full range of primitives.\n\nLists and structs are not included as constants as these aggregate types may contain [Expr][google.api.expr.v1alpha1.Expr] elements which require evaluation and are thus not constant.\n\nExamples of literals include: `\"hello\"`, `b'bytes'`, `1u`, `4.2`, `-2`, `true`, `null`.",
    "notImp": false
  }
] };

export const Constant_SingleFields = [
  "constant_kind.null_value",
  "constant_kind.bool_value",
  "constant_kind.int64_value",
  "constant_kind.uint64_value",
  "constant_kind.double_value",
  "constant_kind.string_value",
  "constant_kind.duration_value"
];

export const SourceInfo_PositionsEntry: OutType = { "SourceInfo_PositionsEntry": [
  {
    "name": "key",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "number",
    "enums": null,
    "comment": "",
    "notImp": false
  },
  {
    "name": "value",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "number",
    "enums": null,
    "comment": "",
    "notImp": false
  }
] };

export const SourceInfo_PositionsEntry_SingleFields = [
  "key",
  "value"
];

export const SourceInfo_MacroCallsEntry: OutType = { "SourceInfo_MacroCallsEntry": [
  {
    "name": "key",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "number",
    "enums": null,
    "comment": "",
    "notImp": false
  },
  {
    "name": "value",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "Expr",
    "enums": null,
    "comment": "",
    "notImp": false
  }
] };

export const SourceInfo_MacroCallsEntry_SingleFields = [
  "key"
];

export const SourcePosition: OutType = { "SourcePosition": [
  {
    "name": "location",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "string",
    "enums": null,
    "comment": "The soucre location name (e.g. file name).",
    "notImp": false
  },
  {
    "name": "offset",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "number",
    "enums": null,
    "comment": "The UTF-8 code unit offset.",
    "notImp": false
  },
  {
    "name": "line",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "number",
    "enums": null,
    "comment": "The 1-based index of the starting line in the source text where the issue occurs, or 0 if unknown.",
    "notImp": false
  },
  {
    "name": "column",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "number",
    "enums": null,
    "comment": "The 0-based index of the starting position within the line of source text where the issue occurs.  Only meaningful if line is nonzero.",
    "notImp": false
  }
] };

export const SourcePosition_SingleFields = [
  "location",
  "offset",
  "line",
  "column"
];