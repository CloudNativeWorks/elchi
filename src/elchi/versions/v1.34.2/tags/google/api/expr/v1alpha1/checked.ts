import {OutType} from '@elchi/tags/tagsType';


export const CheckedExpr: OutType = { "CheckedExpr": [
  {
    "name": "reference_map",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "Map<number, Reference>",
    "enums": null,
    "comment": "A map from expression ids to resolved references.\n\nThe following entries are in this table:\n\n- An Ident or Select expression is represented here if it resolves to a declaration. For instance, if `a.b.c` is represented by `select(select(id(a), b), c)`, and `a.b` resolves to a declaration, while `c` is a field selection, then the reference is attached to the nested select expression (but not to the id or or the outer select). In turn, if `a` resolves to a declaration and `b.c` are field selections, the reference is attached to the ident expression. - Every Call expression has an entry here, identifying the function being called. - Every CreateStruct expression for a message has an entry, identifying the message.",
    "notImp": false
  },
  {
    "name": "type_map",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "Map<number, Type>",
    "enums": null,
    "comment": "A map from expression ids to types.\n\nEvery expression node which has a type different than DYN has a mapping here. If an expression has type DYN, it is omitted from this map to save space.",
    "notImp": false
  },
  {
    "name": "source_info",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "SourceInfo",
    "enums": null,
    "comment": "The source info derived from input that generated the parsed `expr` and any optimizations made during the type-checking pass.",
    "notImp": false
  },
  {
    "name": "expr_version",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "string",
    "enums": null,
    "comment": "The expr version indicates the major / minor version number of the `expr` representation.\n\nThe most common reason for a version change will be to indicate to the CEL runtimes that transformations have been performed on the expr during static analysis. In some cases, this will save the runtime the work of applying the same or similar transformations prior to evaluation.",
    "notImp": false
  },
  {
    "name": "expr",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "Expr",
    "enums": null,
    "comment": "The checked expression. Semantically equivalent to the parsed `expr`, but may have structural differences.",
    "notImp": false
  }
] };

export const CheckedExpr_SingleFields = [
  "expr_version"
];

export const Reference: OutType = { "Reference": [
  {
    "name": "name",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "string",
    "enums": null,
    "comment": "The fully qualified name of the declaration.",
    "notImp": false
  },
  {
    "name": "overload_id",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "string[]",
    "enums": null,
    "comment": "For references to functions, this is a list of `Overload.overload_id` values which match according to typing rules.\n\nIf the list has more than one element, overload resolution among the presented candidates must happen at runtime because of dynamic types. The type checker attempts to narrow down this list as much as possible.\n\nEmpty if this is not a reference to a [Decl.FunctionDecl][google.api.expr.v1alpha1.Decl.FunctionDecl].",
    "notImp": false
  },
  {
    "name": "value",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "Constant",
    "enums": null,
    "comment": "For references to constants, this may contain the value of the constant if known at compile time.",
    "notImp": false
  }
] };

export const Reference_SingleFields = [
  "name",
  "overload_id"
];

export const CheckedExpr_ReferenceMapEntry: OutType = { "CheckedExpr_ReferenceMapEntry": [
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
    "fieldType": "Reference",
    "enums": null,
    "comment": "",
    "notImp": false
  }
] };

export const CheckedExpr_ReferenceMapEntry_SingleFields = [
  "key"
];

export const Type: OutType = { "Type": [
  {
    "name": "type_kind.dyn",
    "isUnion": true,
    "isDeprecated": false,
    "fieldType": "Empty",
    "enums": null,
    "comment": "Dynamic type.",
    "notImp": false
  },
  {
    "name": "type_kind.null",
    "isUnion": true,
    "isDeprecated": false,
    "fieldType": "NullValue",
    "enums": [],
    "comment": "Null value.",
    "notImp": false
  },
  {
    "name": "type_kind.primitive",
    "isUnion": true,
    "isDeprecated": false,
    "fieldType": "Type_PrimitiveType",
    "enums": [
      "PRIMITIVE_TYPE_UNSPECIFIED",
      "BOOL",
      "INT64",
      "UINT64",
      "DOUBLE",
      "STRING",
      "BYTES"
    ],
    "comment": "Primitive types: `true`, `1u`, `-2.0`, `'string'`, `b'bytes'`.",
    "notImp": false
  },
  {
    "name": "type_kind.wrapper",
    "isUnion": true,
    "isDeprecated": false,
    "fieldType": "Type_PrimitiveType",
    "enums": [
      "PRIMITIVE_TYPE_UNSPECIFIED",
      "BOOL",
      "INT64",
      "UINT64",
      "DOUBLE",
      "STRING",
      "BYTES"
    ],
    "comment": "Wrapper of a primitive type, e.g. `google.protobuf.Int64Value`.",
    "notImp": false
  },
  {
    "name": "type_kind.well_known",
    "isUnion": true,
    "isDeprecated": false,
    "fieldType": "Type_WellKnownType",
    "enums": [
      "WELL_KNOWN_TYPE_UNSPECIFIED",
      "ANY",
      "TIMESTAMP",
      "DURATION"
    ],
    "comment": "Well-known protobuf type such as `google.protobuf.Timestamp`.",
    "notImp": false
  },
  {
    "name": "type_kind.list_type",
    "isUnion": true,
    "isDeprecated": false,
    "fieldType": "Type_ListType",
    "enums": null,
    "comment": "Parameterized list with elements of `list_type`, e.g. `list<timestamp>`.",
    "notImp": false
  },
  {
    "name": "type_kind.map_type",
    "isUnion": true,
    "isDeprecated": false,
    "fieldType": "Type_MapType",
    "enums": null,
    "comment": "Parameterized map with typed keys and values.",
    "notImp": false
  },
  {
    "name": "type_kind.function",
    "isUnion": true,
    "isDeprecated": false,
    "fieldType": "Type_FunctionType",
    "enums": null,
    "comment": "Function type.",
    "notImp": false
  },
  {
    "name": "type_kind.message_type",
    "isUnion": true,
    "isDeprecated": false,
    "fieldType": "string",
    "enums": null,
    "comment": "Protocol buffer message type.\n\nThe `message_type` string specifies the qualified message type name. For example, `google.plus.Profile`.",
    "notImp": false
  },
  {
    "name": "type_kind.type_param",
    "isUnion": true,
    "isDeprecated": false,
    "fieldType": "string",
    "enums": null,
    "comment": "Type param type.\n\nThe `type_param` string specifies the type parameter name, e.g. `list<E>` would be a `list_type` whose element type was a `type_param` type named `E`.",
    "notImp": false
  },
  {
    "name": "type_kind.type",
    "isUnion": true,
    "isDeprecated": false,
    "fieldType": "Type",
    "enums": null,
    "comment": "Type type.\n\nThe `type` value specifies the target type. e.g. int is type with a target type of `Primitive.INT`.",
    "notImp": false
  },
  {
    "name": "type_kind.error",
    "isUnion": true,
    "isDeprecated": false,
    "fieldType": "Empty",
    "enums": null,
    "comment": "Error type.\n\nDuring type-checking if an expression is an error, its type is propagated as the `ERROR` type. This permits the type-checker to discover other errors present in the expression.",
    "notImp": false
  },
  {
    "name": "type_kind.abstract_type",
    "isUnion": true,
    "isDeprecated": false,
    "fieldType": "Type_AbstractType",
    "enums": null,
    "comment": "Abstract, application defined type.",
    "notImp": false
  }
] };

export const Type_SingleFields = [
  "type_kind.null",
  "type_kind.primitive",
  "type_kind.wrapper",
  "type_kind.well_known",
  "type_kind.message_type",
  "type_kind.type_param"
];

export const CheckedExpr_TypeMapEntry: OutType = { "CheckedExpr_TypeMapEntry": [
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
    "fieldType": "Type",
    "enums": null,
    "comment": "",
    "notImp": false
  }
] };

export const CheckedExpr_TypeMapEntry_SingleFields = [
  "key"
];

export const Type_ListType: OutType = { "Type_ListType": [
  {
    "name": "elem_type",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "Type",
    "enums": null,
    "comment": "The element type.",
    "notImp": false
  }
] };

export const Type_MapType: OutType = { "Type_MapType": [
  {
    "name": "key_type",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "Type",
    "enums": null,
    "comment": "The type of the key.",
    "notImp": false
  },
  {
    "name": "value_type",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "Type",
    "enums": null,
    "comment": "The type of the value.",
    "notImp": false
  }
] };

export const Type_FunctionType: OutType = { "Type_FunctionType": [
  {
    "name": "result_type",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "Type",
    "enums": null,
    "comment": "Result type of the function.",
    "notImp": false
  },
  {
    "name": "arg_types",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "Type[]",
    "enums": null,
    "comment": "Argument types of the function.",
    "notImp": false
  }
] };

export const Type_AbstractType: OutType = { "Type_AbstractType": [
  {
    "name": "name",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "string",
    "enums": null,
    "comment": "The fully qualified name of this abstract type.",
    "notImp": false
  },
  {
    "name": "parameter_types",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "Type[]",
    "enums": null,
    "comment": "Parameter types for this abstract type.",
    "notImp": false
  }
] };

export const Type_AbstractType_SingleFields = [
  "name"
];

export const Decl: OutType = { "Decl": [
  {
    "name": "name",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "string",
    "enums": null,
    "comment": "The fully qualified name of the declaration.\n\nDeclarations are organized in containers and this represents the full path to the declaration in its container, as in `google.api.expr.Decl`.\n\nDeclarations used as [FunctionDecl.Overload][google.api.expr.v1alpha1.Decl.FunctionDecl.Overload] parameters may or may not have a name depending on whether the overload is function declaration or a function definition containing a result [Expr][google.api.expr.v1alpha1.Expr].",
    "notImp": false
  },
  {
    "name": "decl_kind.ident",
    "isUnion": true,
    "isDeprecated": false,
    "fieldType": "Decl_IdentDecl",
    "enums": null,
    "comment": "Identifier declaration.",
    "notImp": false
  },
  {
    "name": "decl_kind.function",
    "isUnion": true,
    "isDeprecated": false,
    "fieldType": "Decl_FunctionDecl",
    "enums": null,
    "comment": "Function declaration.",
    "notImp": false
  }
] };

export const Decl_SingleFields = [
  "name"
];

export const Decl_IdentDecl: OutType = { "Decl_IdentDecl": [
  {
    "name": "type",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "Type",
    "enums": null,
    "comment": "Required. The type of the identifier.",
    "notImp": false
  },
  {
    "name": "value",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "Constant",
    "enums": null,
    "comment": "The constant value of the identifier. If not specified, the identifier must be supplied at evaluation time.",
    "notImp": false
  },
  {
    "name": "doc",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "string",
    "enums": null,
    "comment": "Documentation string for the identifier.",
    "notImp": false
  }
] };

export const Decl_IdentDecl_SingleFields = [
  "doc"
];

export const Decl_FunctionDecl: OutType = { "Decl_FunctionDecl": [
  {
    "name": "overloads",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "Decl_FunctionDecl_Overload[]",
    "enums": null,
    "comment": "Required. List of function overloads, must contain at least one overload.",
    "notImp": false
  }
] };

export const Decl_FunctionDecl_Overload: OutType = { "Decl_FunctionDecl_Overload": [
  {
    "name": "overload_id",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "string",
    "enums": null,
    "comment": "Required. Globally unique overload name of the function which reflects the function name and argument types.\n\nThis will be used by a [Reference][google.api.expr.v1alpha1.Reference] to indicate the `overload_id` that was resolved for the function `name`.",
    "notImp": false
  },
  {
    "name": "params",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "Type[]",
    "enums": null,
    "comment": "List of function parameter [Type][google.api.expr.v1alpha1.Type] values.\n\nParam types are disjoint after generic type parameters have been replaced with the type `DYN`. Since the `DYN` type is compatible with any other type, this means that if `A` is a type parameter, the function types `int<A>` and `int<int>` are not disjoint. Likewise, `map<string, string>` is not disjoint from `map<K, V>`.\n\nWhen the `result_type` of a function is a generic type param, the type param name also appears as the `type` of on at least one params.",
    "notImp": false
  },
  {
    "name": "type_params",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "string[]",
    "enums": null,
    "comment": "The type param names associated with the function declaration.\n\nFor example, `function ex<K,V>(K key, map<K, V> map) : V` would yield the type params of `K, V`.",
    "notImp": false
  },
  {
    "name": "result_type",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "Type",
    "enums": null,
    "comment": "Required. The result type of the function. For example, the operator `string.isEmpty()` would have `result_type` of `kind: BOOL`.",
    "notImp": false
  },
  {
    "name": "is_instance_function",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "boolean",
    "enums": null,
    "comment": "Whether the function is to be used in a method call-style `x.f(...)` or a function call-style `f(x, ...)`.\n\nFor methods, the first parameter declaration, `params[0]` is the expected type of the target receiver.",
    "notImp": false
  },
  {
    "name": "doc",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "string",
    "enums": null,
    "comment": "Documentation string for the overload.",
    "notImp": false
  }
] };

export const Decl_FunctionDecl_Overload_SingleFields = [
  "overload_id",
  "type_params",
  "is_instance_function",
  "doc"
];