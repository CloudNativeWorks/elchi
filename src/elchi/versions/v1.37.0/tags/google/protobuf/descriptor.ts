import {OutType} from '@elchi/tags/tagsType';


export const FileDescriptorSet: OutType = { "FileDescriptorSet": [
  {
    "name": "file",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "FileDescriptorProto[]",
    "enums": null,
    "comment": "",
    "notImp": false
  }
] };

export const FeatureSet: OutType = { "FeatureSet": [
  {
    "name": "field_presence",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "FeatureSet_FieldPresence",
    "enums": [
      "FIELD_PRESENCE_UNKNOWN",
      "EXPLICIT",
      "IMPLICIT",
      "LEGACY_REQUIRED"
    ],
    "comment": "",
    "notImp": false
  },
  {
    "name": "enum_type",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "FeatureSet_EnumType",
    "enums": [
      "ENUM_TYPE_UNKNOWN",
      "OPEN",
      "CLOSED"
    ],
    "comment": "",
    "notImp": false
  },
  {
    "name": "repeated_field_encoding",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "FeatureSet_RepeatedFieldEncoding",
    "enums": [
      "REPEATED_FIELD_ENCODING_UNKNOWN",
      "PACKED",
      "EXPANDED"
    ],
    "comment": "",
    "notImp": false
  },
  {
    "name": "utf8_validation",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "FeatureSet_Utf8Validation",
    "enums": [
      "UTF8_VALIDATION_UNKNOWN",
      "VERIFY",
      "NONE"
    ],
    "comment": "",
    "notImp": false
  },
  {
    "name": "message_encoding",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "FeatureSet_MessageEncoding",
    "enums": [
      "MESSAGE_ENCODING_UNKNOWN",
      "LENGTH_PREFIXED",
      "DELIMITED"
    ],
    "comment": "",
    "notImp": false
  },
  {
    "name": "json_format",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "FeatureSet_JsonFormat",
    "enums": [
      "JSON_FORMAT_UNKNOWN",
      "ALLOW",
      "LEGACY_BEST_EFFORT"
    ],
    "comment": "",
    "notImp": false
  },
  {
    "name": "enforce_naming_style",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "FeatureSet_EnforceNamingStyle",
    "enums": [
      "ENFORCE_NAMING_STYLE_UNKNOWN",
      "STYLE2024",
      "STYLE_LEGACY"
    ],
    "comment": "",
    "notImp": false
  },
  {
    "name": "default_symbol_visibility",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "FeatureSet_VisibilityFeature_DefaultSymbolVisibility",
    "enums": [
      "DEFAULT_SYMBOL_VISIBILITY_UNKNOWN",
      "EXPORT_ALL",
      "EXPORT_TOP_LEVEL",
      "LOCAL_ALL",
      "STRICT"
    ],
    "comment": "",
    "notImp": false
  }
] };

export const FeatureSet_SingleFields = [
  "field_presence",
  "enum_type",
  "repeated_field_encoding",
  "utf8_validation",
  "message_encoding",
  "json_format",
  "enforce_naming_style",
  "default_symbol_visibility"
];

export const FileOptions: OutType = { "FileOptions": [
  {
    "name": "java_package",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "string",
    "enums": null,
    "comment": "Sets the Java package where classes generated from this .proto will be placed.  By default, the proto package is used, but this is often inappropriate because proto packages do not normally start with backwards domain names.",
    "notImp": false
  },
  {
    "name": "java_outer_classname",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "string",
    "enums": null,
    "comment": "Controls the name of the wrapper Java class generated for the .proto file. That class will always contain the .proto file's getDescriptor() method as well as any top-level extensions defined in the .proto file. If java_multiple_files is disabled, then all the other classes from the .proto file will be nested inside the single wrapper outer class.",
    "notImp": false
  },
  {
    "name": "java_multiple_files",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "boolean",
    "enums": null,
    "comment": "If enabled, then the Java code generator will generate a separate .java file for each top-level message, enum, and service defined in the .proto file.  Thus, these types will *not* be nested inside the wrapper class named by java_outer_classname.  However, the wrapper class will still be generated to contain the file's getDescriptor() method as well as any top-level extensions defined in the file.",
    "notImp": false
  },
  {
    "name": "java_generate_equals_and_hash",
    "isUnion": false,
    "isDeprecated": true,
    "fieldType": "boolean",
    "enums": null,
    "comment": "This option does nothing.",
    "notImp": false
  },
  {
    "name": "java_string_check_utf8",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "boolean",
    "enums": null,
    "comment": "A proto2 file can set this to true to opt in to UTF-8 checking for Java, which will throw an exception if invalid UTF-8 is parsed from the wire or assigned to a string field.\n\nTODO: clarify exactly what kinds of field types this option applies to, and update these docs accordingly.\n\nProto3 files already perform these checks. Setting the option explicitly to false has no effect: it cannot be used to opt proto3 files out of UTF-8 checks.",
    "notImp": false
  },
  {
    "name": "optimize_for",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "FileOptions_OptimizeMode",
    "enums": [
      "SPEED",
      "CODE_SIZE",
      "LITE_RUNTIME"
    ],
    "comment": "",
    "notImp": false
  },
  {
    "name": "go_package",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "string",
    "enums": null,
    "comment": "Sets the Go package where structs generated from this .proto will be placed. If omitted, the Go package will be derived from the following: - The basename of the package import path, if provided. - Otherwise, the package statement in the .proto file, if present. - Otherwise, the basename of the .proto file, without extension.",
    "notImp": false
  },
  {
    "name": "cc_generic_services",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "boolean",
    "enums": null,
    "comment": "Should generic services be generated in each language?  \"Generic\" services are not specific to any particular RPC system.  They are generated by the main code generators in each language (without additional plugins). Generic services were the only kind of service generation supported by early versions of google.protobuf.\n\nGeneric services are now considered deprecated in favor of using plugins that generate code specific to your particular RPC system.  Therefore, these default to false.  Old code which depends on generic services should explicitly set them to true.",
    "notImp": false
  },
  {
    "name": "java_generic_services",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "boolean",
    "enums": null,
    "comment": "",
    "notImp": false
  },
  {
    "name": "py_generic_services",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "boolean",
    "enums": null,
    "comment": "",
    "notImp": false
  },
  {
    "name": "deprecated",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "boolean",
    "enums": null,
    "comment": "Is this file deprecated? Depending on the target platform, this can emit Deprecated annotations for everything in the file, or it will be completely ignored; in the very least, this is a formalization for deprecating files.",
    "notImp": false
  },
  {
    "name": "cc_enable_arenas",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "boolean",
    "enums": null,
    "comment": "Enables the use of arenas for the proto messages in this file. This applies only to generated classes for C++.",
    "notImp": false
  },
  {
    "name": "objc_class_prefix",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "string",
    "enums": null,
    "comment": "Sets the objective c class prefix which is prepended to all objective c generated classes from this .proto. There is no default.",
    "notImp": false
  },
  {
    "name": "csharp_namespace",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "string",
    "enums": null,
    "comment": "Namespace for generated classes; defaults to the package.",
    "notImp": false
  },
  {
    "name": "swift_prefix",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "string",
    "enums": null,
    "comment": "By default Swift generators will take the proto package and CamelCase it replacing '.' with underscore and use that to prefix the types/symbols defined. When this options is provided, they will use this value instead to prefix the types/symbols defined.",
    "notImp": false
  },
  {
    "name": "php_class_prefix",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "string",
    "enums": null,
    "comment": "Sets the php class prefix which is prepended to all php generated classes from this .proto. Default is empty.",
    "notImp": false
  },
  {
    "name": "php_namespace",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "string",
    "enums": null,
    "comment": "Use this option to change the namespace of php generated classes. Default is empty. When this option is empty, the package name will be used for determining the namespace.",
    "notImp": false
  },
  {
    "name": "php_metadata_namespace",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "string",
    "enums": null,
    "comment": "Use this option to change the namespace of php generated metadata classes. Default is empty. When this option is empty, the proto file name will be used for determining the namespace.",
    "notImp": false
  },
  {
    "name": "ruby_package",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "string",
    "enums": null,
    "comment": "Use this option to change the package of ruby generated classes. Default is empty. When this option is not set, the package name will be used for determining the ruby package.",
    "notImp": false
  },
  {
    "name": "features",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "FeatureSet",
    "enums": null,
    "comment": "Any features defined in the specific edition. WARNING: This field should only be used by protobuf plugins or special cases like the proto compiler. Other uses are discouraged and developers should rely on the protoreflect APIs for their client language.",
    "notImp": false
  },
  {
    "name": "uninterpreted_option",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "UninterpretedOption[]",
    "enums": null,
    "comment": "The parser stores options it doesn't recognize here. See the documentation for the \"Options\" section above.",
    "notImp": false
  }
] };

export const FileOptions_SingleFields = [
  "java_package",
  "java_outer_classname",
  "java_multiple_files",
  "java_string_check_utf8",
  "optimize_for",
  "go_package",
  "cc_generic_services",
  "java_generic_services",
  "py_generic_services",
  "deprecated",
  "cc_enable_arenas",
  "objc_class_prefix",
  "csharp_namespace",
  "swift_prefix",
  "php_class_prefix",
  "php_namespace",
  "php_metadata_namespace",
  "ruby_package"
];

export const SourceCodeInfo: OutType = { "SourceCodeInfo": [
  {
    "name": "location",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "SourceCodeInfo_Location[]",
    "enums": null,
    "comment": "A Location identifies a piece of source code in a .proto file which corresponds to a particular definition.  This information is intended to be useful to IDEs, code indexers, documentation generators, and similar tools.\n\nFor example, say we have a file like: message Foo { optional string foo = 1; } Let's look at just the field definition: optional string foo = 1; ^       ^^     ^^  ^  ^^^ a       bc     de  f  ghi We have the following locations: span   path               represents [a,i)  [ 4, 0, 2, 0 ]     The whole field definition. [a,b)  [ 4, 0, 2, 0, 4 ]  The label (optional). [c,d)  [ 4, 0, 2, 0, 5 ]  The type (string). [e,f)  [ 4, 0, 2, 0, 1 ]  The name (foo). [g,h)  [ 4, 0, 2, 0, 3 ]  The number (1).\n\nNotes: - A location may refer to a repeated field itself (i.e. not to any particular index within it).  This is used whenever a set of elements are logically enclosed in a single code segment.  For example, an entire extend block (possibly containing multiple extension definitions) will have an outer location whose path refers to the \"extensions\" repeated field without an index. - Multiple locations may have the same path.  This happens when a single logical declaration is spread out across multiple places.  The most obvious example is the \"extend\" block again -- there may be multiple extend blocks in the same scope, each of which will have the same path. - A location's span is not always a subset of its parent's span.  For example, the \"extendee\" of an extension declaration appears at the beginning of the \"extend\" block and is shared by all extensions within the block. - Just because a location's span is a subset of some other location's span does not mean that it is a descendant.  For example, a \"group\" defines both a type and a field in a single declaration.  Thus, the locations corresponding to the type and field and their components will overlap. - Code which tries to interpret locations should probably be designed to ignore those that it doesn't understand, as more types of locations could be recorded in the future.",
    "notImp": false
  }
] };

export const FileDescriptorProto: OutType = { "FileDescriptorProto": [
  {
    "name": "name",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "string",
    "enums": null,
    "comment": "file name, relative to root of source tree",
    "notImp": false
  },
  {
    "name": "package",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "string",
    "enums": null,
    "comment": "e.g. \"foo\", \"foo.bar\", etc.",
    "notImp": false
  },
  {
    "name": "dependency",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "string[]",
    "enums": null,
    "comment": "Names of files imported by this file.",
    "notImp": false
  },
  {
    "name": "public_dependency",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "number[]",
    "enums": null,
    "comment": "Indexes of the public imported files in the dependency list above.",
    "notImp": false
  },
  {
    "name": "weak_dependency",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "number[]",
    "enums": null,
    "comment": "Indexes of the weak imported files in the dependency list. For Google-internal migration only. Do not use.",
    "notImp": false
  },
  {
    "name": "option_dependency",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "string[]",
    "enums": null,
    "comment": "Names of files imported by this file purely for the purpose of providing option extensions. These are excluded from the dependency list above.",
    "notImp": false
  },
  {
    "name": "message_type",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "DescriptorProto[]",
    "enums": null,
    "comment": "All top-level definitions in this file.",
    "notImp": false
  },
  {
    "name": "enum_type",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "EnumDescriptorProto[]",
    "enums": null,
    "comment": "",
    "notImp": false
  },
  {
    "name": "service",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "ServiceDescriptorProto[]",
    "enums": null,
    "comment": "",
    "notImp": false
  },
  {
    "name": "extension",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "FieldDescriptorProto[]",
    "enums": null,
    "comment": "",
    "notImp": false
  },
  {
    "name": "options",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "FileOptions",
    "enums": null,
    "comment": "",
    "notImp": false
  },
  {
    "name": "source_code_info",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "SourceCodeInfo",
    "enums": null,
    "comment": "This field contains optional information about the original source code. You may safely remove this entire field without harming runtime functionality of the descriptors -- the information is needed only by development tools.",
    "notImp": false
  },
  {
    "name": "syntax",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "string",
    "enums": null,
    "comment": "The syntax of the proto file. The supported values are \"proto2\", \"proto3\", and \"editions\".\n\nIf `edition` is present, this value must be \"editions\". WARNING: This field should only be used by protobuf plugins or special cases like the proto compiler. Other uses are discouraged and developers should rely on the protoreflect APIs for their client language.",
    "notImp": false
  },
  {
    "name": "edition",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "Edition",
    "enums": [
      "EDITION_UNKNOWN",
      "EDITION_LEGACY",
      "EDITION_PROTO2",
      "EDITION_PROTO3",
      "EDITION_2023",
      "EDITION_2024",
      "EDITION_1_TEST_ONLY",
      "EDITION_2_TEST_ONLY",
      "EDITION_99997_TEST_ONLY",
      "EDITION_99998_TEST_ONLY",
      "EDITION_99999_TEST_ONLY",
      "EDITION_MAX"
    ],
    "comment": "The edition of the proto file. WARNING: This field should only be used by protobuf plugins or special cases like the proto compiler. Other uses are discouraged and developers should rely on the protoreflect APIs for their client language.",
    "notImp": false
  }
] };

export const FileDescriptorProto_SingleFields = [
  "name",
  "package",
  "dependency",
  "public_dependency",
  "weak_dependency",
  "option_dependency",
  "syntax",
  "edition"
];

export const MessageOptions: OutType = { "MessageOptions": [
  {
    "name": "message_set_wire_format",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "boolean",
    "enums": null,
    "comment": "Set true to use the old proto1 MessageSet wire format for extensions. This is provided for backwards-compatibility with the MessageSet wire format.  You should not use this for any other reason:  It's less efficient, has fewer features, and is more complicated.\n\nThe message must be defined exactly as follows: message Foo { option message_set_wire_format = true; extensions 4 to max; } Note that the message cannot have any defined fields; MessageSets only have extensions.\n\nAll extensions of your type must be singular messages; e.g. they cannot be int32s, enums, or repeated messages.\n\nBecause this is an option, the above two restrictions are not enforced by the protocol compiler.",
    "notImp": false
  },
  {
    "name": "no_standard_descriptor_accessor",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "boolean",
    "enums": null,
    "comment": "Disables the generation of the standard \"descriptor()\" accessor, which can conflict with a field of the same name.  This is meant to make migration from proto1 easier; new code should avoid fields named \"descriptor\".",
    "notImp": false
  },
  {
    "name": "deprecated",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "boolean",
    "enums": null,
    "comment": "Is this message deprecated? Depending on the target platform, this can emit Deprecated annotations for the message, or it will be completely ignored; in the very least, this is a formalization for deprecating messages.",
    "notImp": false
  },
  {
    "name": "map_entry",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "boolean",
    "enums": null,
    "comment": "Whether the message is an automatically generated map entry type for the maps field.\n\nFor maps fields: map<KeyType, ValueType> map_field = 1; The parsed descriptor looks like: message MapFieldEntry { option map_entry = true; optional KeyType key = 1; optional ValueType value = 2; } repeated MapFieldEntry map_field = 1;\n\nImplementations may choose not to generate the map_entry=true message, but use a native map in the target language to hold the keys and values. The reflection APIs in such implementations still need to work as if the field is a repeated message field.\n\nNOTE: Do not set the option in .proto files. Always use the maps syntax instead. The option should only be implicitly set by the proto compiler parser.",
    "notImp": false
  },
  {
    "name": "deprecated_legacy_json_field_conflicts",
    "isUnion": false,
    "isDeprecated": true,
    "fieldType": "boolean",
    "enums": null,
    "comment": "Enable the legacy handling of JSON field name conflicts.  This lowercases and strips underscored from the fields before comparison in proto3 only. The new behavior takes `json_name` into account and applies to proto2 as well.\n\nThis should only be used as a temporary measure against broken builds due to the change in behavior for JSON field name conflicts.\n\nTODO This is legacy behavior we plan to remove once downstream teams have had time to migrate.",
    "notImp": false
  },
  {
    "name": "features",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "FeatureSet",
    "enums": null,
    "comment": "Any features defined in the specific edition. WARNING: This field should only be used by protobuf plugins or special cases like the proto compiler. Other uses are discouraged and developers should rely on the protoreflect APIs for their client language.",
    "notImp": false
  },
  {
    "name": "uninterpreted_option",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "UninterpretedOption[]",
    "enums": null,
    "comment": "The parser stores options it doesn't recognize here. See above.",
    "notImp": false
  }
] };

export const MessageOptions_SingleFields = [
  "message_set_wire_format",
  "no_standard_descriptor_accessor",
  "deprecated",
  "map_entry"
];

export const DescriptorProto: OutType = { "DescriptorProto": [
  {
    "name": "name",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "string",
    "enums": null,
    "comment": "",
    "notImp": false
  },
  {
    "name": "field",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "FieldDescriptorProto[]",
    "enums": null,
    "comment": "",
    "notImp": false
  },
  {
    "name": "extension",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "FieldDescriptorProto[]",
    "enums": null,
    "comment": "",
    "notImp": false
  },
  {
    "name": "nested_type",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "DescriptorProto[]",
    "enums": null,
    "comment": "",
    "notImp": false
  },
  {
    "name": "enum_type",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "EnumDescriptorProto[]",
    "enums": null,
    "comment": "",
    "notImp": false
  },
  {
    "name": "extension_range",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "DescriptorProto_ExtensionRange[]",
    "enums": null,
    "comment": "",
    "notImp": false
  },
  {
    "name": "oneof_decl",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "OneofDescriptorProto[]",
    "enums": null,
    "comment": "",
    "notImp": false
  },
  {
    "name": "options",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "MessageOptions",
    "enums": null,
    "comment": "",
    "notImp": false
  },
  {
    "name": "reserved_range",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "DescriptorProto_ReservedRange[]",
    "enums": null,
    "comment": "",
    "notImp": false
  },
  {
    "name": "reserved_name",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "string[]",
    "enums": null,
    "comment": "Reserved field names, which may not be used by fields in the same message. A given name may only be reserved once.",
    "notImp": false
  },
  {
    "name": "visibility",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "SymbolVisibility",
    "enums": [
      "VISIBILITY_UNSET",
      "VISIBILITY_LOCAL",
      "VISIBILITY_EXPORT"
    ],
    "comment": "Support for `export` and `local` keywords on enums.",
    "notImp": false
  }
] };

export const DescriptorProto_SingleFields = [
  "name",
  "reserved_name",
  "visibility"
];

export const ExtensionRangeOptions: OutType = { "ExtensionRangeOptions": [
  {
    "name": "uninterpreted_option",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "UninterpretedOption[]",
    "enums": null,
    "comment": "The parser stores options it doesn't recognize here. See above.",
    "notImp": false
  },
  {
    "name": "declaration",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "ExtensionRangeOptions_Declaration[]",
    "enums": null,
    "comment": "For external users: DO NOT USE. We are in the process of open sourcing extension declaration and executing internal cleanups before it can be used externally.",
    "notImp": false
  },
  {
    "name": "features",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "FeatureSet",
    "enums": null,
    "comment": "Any features defined in the specific edition.",
    "notImp": false
  },
  {
    "name": "verification",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "ExtensionRangeOptions_VerificationState",
    "enums": [
      "DECLARATION",
      "UNVERIFIED"
    ],
    "comment": "The verification state of the range. TODO: flip the default to DECLARATION once all empty ranges are marked as UNVERIFIED.",
    "notImp": false
  }
] };

export const ExtensionRangeOptions_SingleFields = [
  "verification"
];

export const DescriptorProto_ExtensionRange: OutType = { "DescriptorProto_ExtensionRange": [
  {
    "name": "start",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "number",
    "enums": null,
    "comment": "Inclusive.",
    "notImp": false
  },
  {
    "name": "end",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "number",
    "enums": null,
    "comment": "Exclusive.",
    "notImp": false
  },
  {
    "name": "options",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "ExtensionRangeOptions",
    "enums": null,
    "comment": "",
    "notImp": false
  }
] };

export const DescriptorProto_ExtensionRange_SingleFields = [
  "start",
  "end"
];

export const DescriptorProto_ReservedRange: OutType = { "DescriptorProto_ReservedRange": [
  {
    "name": "start",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "number",
    "enums": null,
    "comment": "Inclusive.",
    "notImp": false
  },
  {
    "name": "end",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "number",
    "enums": null,
    "comment": "Exclusive.",
    "notImp": false
  }
] };

export const DescriptorProto_ReservedRange_SingleFields = [
  "start",
  "end"
];

export const ExtensionRangeOptions_Declaration: OutType = { "ExtensionRangeOptions_Declaration": [
  {
    "name": "number",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "number",
    "enums": null,
    "comment": "The extension number declared within the extension range.",
    "notImp": false
  },
  {
    "name": "full_name",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "string",
    "enums": null,
    "comment": "The fully-qualified name of the extension field. There must be a leading dot in front of the full name.",
    "notImp": false
  },
  {
    "name": "type",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "string",
    "enums": null,
    "comment": "The fully-qualified type name of the extension field. Unlike Metadata.type, Declaration.type must have a leading dot for messages and enums.",
    "notImp": false
  },
  {
    "name": "reserved",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "boolean",
    "enums": null,
    "comment": "If true, indicates that the number is reserved in the extension range, and any extension field with the number will fail to compile. Set this when a declared extension field is deleted.",
    "notImp": false
  },
  {
    "name": "repeated",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "boolean",
    "enums": null,
    "comment": "If true, indicates that the extension must be defined as repeated. Otherwise the extension must be defined as optional.",
    "notImp": false
  }
] };

export const ExtensionRangeOptions_Declaration_SingleFields = [
  "number",
  "full_name",
  "type",
  "reserved",
  "repeated"
];

export const FieldOptions_FeatureSupport: OutType = { "FieldOptions_FeatureSupport": [
  {
    "name": "edition_introduced",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "Edition",
    "enums": [
      "EDITION_UNKNOWN",
      "EDITION_LEGACY",
      "EDITION_PROTO2",
      "EDITION_PROTO3",
      "EDITION_2023",
      "EDITION_2024",
      "EDITION_1_TEST_ONLY",
      "EDITION_2_TEST_ONLY",
      "EDITION_99997_TEST_ONLY",
      "EDITION_99998_TEST_ONLY",
      "EDITION_99999_TEST_ONLY",
      "EDITION_MAX"
    ],
    "comment": "The edition that this feature was first available in.  In editions earlier than this one, the default assigned to EDITION_LEGACY will be used, and proto files will not be able to override it.",
    "notImp": false
  },
  {
    "name": "edition_deprecated",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "Edition",
    "enums": [
      "EDITION_UNKNOWN",
      "EDITION_LEGACY",
      "EDITION_PROTO2",
      "EDITION_PROTO3",
      "EDITION_2023",
      "EDITION_2024",
      "EDITION_1_TEST_ONLY",
      "EDITION_2_TEST_ONLY",
      "EDITION_99997_TEST_ONLY",
      "EDITION_99998_TEST_ONLY",
      "EDITION_99999_TEST_ONLY",
      "EDITION_MAX"
    ],
    "comment": "The edition this feature becomes deprecated in.  Using this after this edition may trigger warnings.",
    "notImp": false
  },
  {
    "name": "deprecation_warning",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "string",
    "enums": null,
    "comment": "The deprecation warning text if this feature is used after the edition it was marked deprecated in.",
    "notImp": false
  },
  {
    "name": "edition_removed",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "Edition",
    "enums": [
      "EDITION_UNKNOWN",
      "EDITION_LEGACY",
      "EDITION_PROTO2",
      "EDITION_PROTO3",
      "EDITION_2023",
      "EDITION_2024",
      "EDITION_1_TEST_ONLY",
      "EDITION_2_TEST_ONLY",
      "EDITION_99997_TEST_ONLY",
      "EDITION_99998_TEST_ONLY",
      "EDITION_99999_TEST_ONLY",
      "EDITION_MAX"
    ],
    "comment": "The edition this feature is no longer available in.  In editions after this one, the last default assigned will be used, and proto files will not be able to override it.",
    "notImp": false
  }
] };

export const FieldOptions_FeatureSupport_SingleFields = [
  "edition_introduced",
  "edition_deprecated",
  "deprecation_warning",
  "edition_removed"
];

export const FieldOptions: OutType = { "FieldOptions": [
  {
    "name": "ctype",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "FieldOptions_CType",
    "enums": [
      "STRING",
      "CORD",
      "STRING_PIECE"
    ],
    "comment": "NOTE: ctype is deprecated. Use `features.(pb.cpp).string_type` instead. The ctype option instructs the C++ code generator to use a different representation of the field than it normally would.  See the specific options below.  This option is only implemented to support use of [ctype=CORD] and [ctype=STRING] (the default) on non-repeated fields of type \"bytes\" in the open source release. TODO: make ctype actually deprecated.",
    "notImp": false
  },
  {
    "name": "packed",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "boolean",
    "enums": null,
    "comment": "The packed option can be enabled for repeated primitive fields to enable a more efficient representation on the wire. Rather than repeatedly writing the tag and type for each element, the entire array is encoded as a single length-delimited blob. In proto3, only explicit setting it to false will avoid using packed encoding.  This option is prohibited in Editions, but the `repeated_field_encoding` feature can be used to control the behavior.",
    "notImp": false
  },
  {
    "name": "jstype",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "FieldOptions_JSType",
    "enums": [
      "JS_NORMAL",
      "JS_STRING",
      "JS_NUMBER"
    ],
    "comment": "The jstype option determines the JavaScript type used for values of the field.  The option is permitted only for 64 bit integral and fixed types (int64, uint64, sint64, fixed64, sfixed64).  A field with jstype JS_STRING is represented as JavaScript string, which avoids loss of precision that can happen when a large value is converted to a floating point JavaScript. Specifying JS_NUMBER for the jstype causes the generated JavaScript code to use the JavaScript \"number\" type.  The behavior of the default option JS_NORMAL is implementation dependent.\n\nThis option is an enum to permit additional types to be added, e.g. goog.math.Integer.",
    "notImp": false
  },
  {
    "name": "lazy",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "boolean",
    "enums": null,
    "comment": "Should this field be parsed lazily?  Lazy applies only to message-type fields.  It means that when the outer message is initially parsed, the inner message's contents will not be parsed but instead stored in encoded form.  The inner message will actually be parsed when it is first accessed.\n\nThis is only a hint.  Implementations are free to choose whether to use eager or lazy parsing regardless of the value of this option.  However, setting this option true suggests that the protocol author believes that using lazy parsing on this field is worth the additional bookkeeping overhead typically needed to implement it.\n\nThis option does not affect the public interface of any generated code; all method signatures remain the same.  Furthermore, thread-safety of the interface is not affected by this option; const methods remain safe to call from multiple threads concurrently, while non-const methods continue to require exclusive access.\n\nNote that lazy message fields are still eagerly verified to check ill-formed wireformat or missing required fields. Calling IsInitialized() on the outer message would fail if the inner message has missing required fields. Failed verification would result in parsing failure (except when uninitialized messages are acceptable).",
    "notImp": false
  },
  {
    "name": "unverified_lazy",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "boolean",
    "enums": null,
    "comment": "unverified_lazy does no correctness checks on the byte stream. This should only be used where lazy with verification is prohibitive for performance reasons.",
    "notImp": false
  },
  {
    "name": "deprecated",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "boolean",
    "enums": null,
    "comment": "Is this field deprecated? Depending on the target platform, this can emit Deprecated annotations for accessors, or it will be completely ignored; in the very least, this is a formalization for deprecating fields.",
    "notImp": false
  },
  {
    "name": "weak",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "boolean",
    "enums": null,
    "comment": "For Google-internal migration only. Do not use.",
    "notImp": false
  },
  {
    "name": "debug_redact",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "boolean",
    "enums": null,
    "comment": "Indicate that the field value should not be printed out when using debug formats, e.g. when the field contains sensitive credentials.",
    "notImp": false
  },
  {
    "name": "retention",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "FieldOptions_OptionRetention",
    "enums": [
      "RETENTION_UNKNOWN",
      "RETENTION_RUNTIME",
      "RETENTION_SOURCE"
    ],
    "comment": "",
    "notImp": false
  },
  {
    "name": "targets",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "FieldOptions_OptionTargetType[]",
    "enums": null,
    "comment": "",
    "notImp": false
  },
  {
    "name": "edition_defaults",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "FieldOptions_EditionDefault[]",
    "enums": null,
    "comment": "",
    "notImp": false
  },
  {
    "name": "features",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "FeatureSet",
    "enums": null,
    "comment": "Any features defined in the specific edition. WARNING: This field should only be used by protobuf plugins or special cases like the proto compiler. Other uses are discouraged and developers should rely on the protoreflect APIs for their client language.",
    "notImp": false
  },
  {
    "name": "feature_support",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "FieldOptions_FeatureSupport",
    "enums": null,
    "comment": "",
    "notImp": false
  },
  {
    "name": "uninterpreted_option",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "UninterpretedOption[]",
    "enums": null,
    "comment": "The parser stores options it doesn't recognize here. See above.",
    "notImp": false
  }
] };

export const FieldOptions_SingleFields = [
  "ctype",
  "packed",
  "jstype",
  "lazy",
  "unverified_lazy",
  "deprecated",
  "weak",
  "debug_redact",
  "retention"
];

export const FieldDescriptorProto: OutType = { "FieldDescriptorProto": [
  {
    "name": "name",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "string",
    "enums": null,
    "comment": "",
    "notImp": false
  },
  {
    "name": "number",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "number",
    "enums": null,
    "comment": "",
    "notImp": false
  },
  {
    "name": "label",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "FieldDescriptorProto_Label",
    "enums": [
      "LABEL_OPTIONAL",
      "LABEL_REPEATED",
      "LABEL_REQUIRED"
    ],
    "comment": "",
    "notImp": false
  },
  {
    "name": "type",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "FieldDescriptorProto_Type",
    "enums": [
      "TYPE_DOUBLE",
      "TYPE_FLOAT",
      "TYPE_INT64",
      "TYPE_UINT64",
      "TYPE_INT32",
      "TYPE_FIXED64",
      "TYPE_FIXED32",
      "TYPE_BOOL",
      "TYPE_STRING",
      "TYPE_GROUP",
      "TYPE_MESSAGE",
      "TYPE_BYTES",
      "TYPE_UINT32",
      "TYPE_ENUM",
      "TYPE_SFIXED32",
      "TYPE_SFIXED64",
      "TYPE_SINT32",
      "TYPE_SINT64"
    ],
    "comment": "If type_name is set, this need not be set.  If both this and type_name are set, this must be one of TYPE_ENUM, TYPE_MESSAGE or TYPE_GROUP.",
    "notImp": false
  },
  {
    "name": "type_name",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "string",
    "enums": null,
    "comment": "For message and enum types, this is the name of the type.  If the name starts with a '.', it is fully-qualified.  Otherwise, C++-like scoping rules are used to find the type (i.e. first the nested types within this message are searched, then within the parent, on up to the root namespace).",
    "notImp": false
  },
  {
    "name": "extendee",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "string",
    "enums": null,
    "comment": "For extensions, this is the name of the type being extended.  It is resolved in the same manner as type_name.",
    "notImp": false
  },
  {
    "name": "default_value",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "string",
    "enums": null,
    "comment": "For numeric types, contains the original text representation of the value. For booleans, \"true\" or \"false\". For strings, contains the default text contents (not escaped in any way). For bytes, contains the C escaped value.  All bytes >= 128 are escaped.",
    "notImp": false
  },
  {
    "name": "oneof_index",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "number",
    "enums": null,
    "comment": "If set, gives the index of a oneof in the containing type's oneof_decl list.  This field is a member of that oneof.",
    "notImp": false
  },
  {
    "name": "json_name",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "string",
    "enums": null,
    "comment": "JSON name of this field. The value is set by protocol compiler. If the user has set a \"json_name\" option on this field, that option's value will be used. Otherwise, it's deduced from the field's name by converting it to camelCase.",
    "notImp": false
  },
  {
    "name": "options",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "FieldOptions",
    "enums": null,
    "comment": "",
    "notImp": false
  },
  {
    "name": "proto3_optional",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "boolean",
    "enums": null,
    "comment": "If true, this is a proto3 \"optional\". When a proto3 field is optional, it tracks presence regardless of field type.\n\nWhen proto3_optional is true, this field must belong to a oneof to signal to old proto3 clients that presence is tracked for this field. This oneof is known as a \"synthetic\" oneof, and this field must be its sole member (each proto3 optional field gets its own synthetic oneof). Synthetic oneofs exist in the descriptor only, and do not generate any API. Synthetic oneofs must be ordered after all \"real\" oneofs.\n\nFor message fields, proto3_optional doesn't create any semantic change, since non-repeated message fields always track presence. However it still indicates the semantic detail of whether the user wrote \"optional\" or not. This can be useful for round-tripping the .proto file. For consistency we give message fields a synthetic oneof also, even though it is not required to track presence. This is especially important because the parser can't tell if a field is a message or an enum, so it must always create a synthetic oneof.\n\nProto2 optional fields do not set this flag, because they already indicate optional with `LABEL_OPTIONAL`.",
    "notImp": false
  }
] };

export const FieldDescriptorProto_SingleFields = [
  "name",
  "number",
  "label",
  "type",
  "type_name",
  "extendee",
  "default_value",
  "oneof_index",
  "json_name",
  "proto3_optional"
];

export const OneofOptions: OutType = { "OneofOptions": [
  {
    "name": "features",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "FeatureSet",
    "enums": null,
    "comment": "Any features defined in the specific edition. WARNING: This field should only be used by protobuf plugins or special cases like the proto compiler. Other uses are discouraged and developers should rely on the protoreflect APIs for their client language.",
    "notImp": false
  },
  {
    "name": "uninterpreted_option",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "UninterpretedOption[]",
    "enums": null,
    "comment": "The parser stores options it doesn't recognize here. See above.",
    "notImp": false
  }
] };

export const OneofDescriptorProto: OutType = { "OneofDescriptorProto": [
  {
    "name": "name",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "string",
    "enums": null,
    "comment": "",
    "notImp": false
  },
  {
    "name": "options",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "OneofOptions",
    "enums": null,
    "comment": "",
    "notImp": false
  }
] };

export const OneofDescriptorProto_SingleFields = [
  "name"
];

export const EnumOptions: OutType = { "EnumOptions": [
  {
    "name": "allow_alias",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "boolean",
    "enums": null,
    "comment": "Set this option to true to allow mapping different tag names to the same value.",
    "notImp": false
  },
  {
    "name": "deprecated",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "boolean",
    "enums": null,
    "comment": "Is this enum deprecated? Depending on the target platform, this can emit Deprecated annotations for the enum, or it will be completely ignored; in the very least, this is a formalization for deprecating enums.",
    "notImp": false
  },
  {
    "name": "deprecated_legacy_json_field_conflicts",
    "isUnion": false,
    "isDeprecated": true,
    "fieldType": "boolean",
    "enums": null,
    "comment": "Enable the legacy handling of JSON field name conflicts.  This lowercases and strips underscored from the fields before comparison in proto3 only. The new behavior takes `json_name` into account and applies to proto2 as well. TODO Remove this legacy behavior once downstream teams have had time to migrate.",
    "notImp": false
  },
  {
    "name": "features",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "FeatureSet",
    "enums": null,
    "comment": "Any features defined in the specific edition. WARNING: This field should only be used by protobuf plugins or special cases like the proto compiler. Other uses are discouraged and developers should rely on the protoreflect APIs for their client language.",
    "notImp": false
  },
  {
    "name": "uninterpreted_option",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "UninterpretedOption[]",
    "enums": null,
    "comment": "The parser stores options it doesn't recognize here. See above.",
    "notImp": false
  }
] };

export const EnumOptions_SingleFields = [
  "allow_alias",
  "deprecated"
];

export const EnumDescriptorProto: OutType = { "EnumDescriptorProto": [
  {
    "name": "name",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "string",
    "enums": null,
    "comment": "",
    "notImp": false
  },
  {
    "name": "value",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "EnumValueDescriptorProto[]",
    "enums": null,
    "comment": "",
    "notImp": false
  },
  {
    "name": "options",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "EnumOptions",
    "enums": null,
    "comment": "",
    "notImp": false
  },
  {
    "name": "reserved_range",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "EnumDescriptorProto_EnumReservedRange[]",
    "enums": null,
    "comment": "Range of reserved numeric values. Reserved numeric values may not be used by enum values in the same enum declaration. Reserved ranges may not overlap.",
    "notImp": false
  },
  {
    "name": "reserved_name",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "string[]",
    "enums": null,
    "comment": "Reserved enum value names, which may not be reused. A given name may only be reserved once.",
    "notImp": false
  },
  {
    "name": "visibility",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "SymbolVisibility",
    "enums": [
      "VISIBILITY_UNSET",
      "VISIBILITY_LOCAL",
      "VISIBILITY_EXPORT"
    ],
    "comment": "Support for `export` and `local` keywords on enums.",
    "notImp": false
  }
] };

export const EnumDescriptorProto_SingleFields = [
  "name",
  "reserved_name",
  "visibility"
];

export const EnumDescriptorProto_EnumReservedRange: OutType = { "EnumDescriptorProto_EnumReservedRange": [
  {
    "name": "start",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "number",
    "enums": null,
    "comment": "Inclusive.",
    "notImp": false
  },
  {
    "name": "end",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "number",
    "enums": null,
    "comment": "Inclusive.",
    "notImp": false
  }
] };

export const EnumDescriptorProto_EnumReservedRange_SingleFields = [
  "start",
  "end"
];

export const EnumValueOptions: OutType = { "EnumValueOptions": [
  {
    "name": "deprecated",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "boolean",
    "enums": null,
    "comment": "Is this enum value deprecated? Depending on the target platform, this can emit Deprecated annotations for the enum value, or it will be completely ignored; in the very least, this is a formalization for deprecating enum values.",
    "notImp": false
  },
  {
    "name": "features",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "FeatureSet",
    "enums": null,
    "comment": "Any features defined in the specific edition. WARNING: This field should only be used by protobuf plugins or special cases like the proto compiler. Other uses are discouraged and developers should rely on the protoreflect APIs for their client language.",
    "notImp": false
  },
  {
    "name": "debug_redact",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "boolean",
    "enums": null,
    "comment": "Indicate that fields annotated with this enum value should not be printed out when using debug formats, e.g. when the field contains sensitive credentials.",
    "notImp": false
  },
  {
    "name": "feature_support",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "FieldOptions_FeatureSupport",
    "enums": null,
    "comment": "Information about the support window of a feature value.",
    "notImp": false
  },
  {
    "name": "uninterpreted_option",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "UninterpretedOption[]",
    "enums": null,
    "comment": "The parser stores options it doesn't recognize here. See above.",
    "notImp": false
  }
] };

export const EnumValueOptions_SingleFields = [
  "deprecated",
  "debug_redact"
];

export const EnumValueDescriptorProto: OutType = { "EnumValueDescriptorProto": [
  {
    "name": "name",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "string",
    "enums": null,
    "comment": "",
    "notImp": false
  },
  {
    "name": "number",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "number",
    "enums": null,
    "comment": "",
    "notImp": false
  },
  {
    "name": "options",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "EnumValueOptions",
    "enums": null,
    "comment": "",
    "notImp": false
  }
] };

export const EnumValueDescriptorProto_SingleFields = [
  "name",
  "number"
];

export const ServiceOptions: OutType = { "ServiceOptions": [
  {
    "name": "features",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "FeatureSet",
    "enums": null,
    "comment": "Any features defined in the specific edition. WARNING: This field should only be used by protobuf plugins or special cases like the proto compiler. Other uses are discouraged and developers should rely on the protoreflect APIs for their client language.",
    "notImp": false
  },
  {
    "name": "deprecated",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "boolean",
    "enums": null,
    "comment": "Is this service deprecated? Depending on the target platform, this can emit Deprecated annotations for the service, or it will be completely ignored; in the very least, this is a formalization for deprecating services.",
    "notImp": false
  },
  {
    "name": "uninterpreted_option",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "UninterpretedOption[]",
    "enums": null,
    "comment": "The parser stores options it doesn't recognize here. See above.",
    "notImp": false
  }
] };

export const ServiceOptions_SingleFields = [
  "deprecated"
];

export const ServiceDescriptorProto: OutType = { "ServiceDescriptorProto": [
  {
    "name": "name",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "string",
    "enums": null,
    "comment": "",
    "notImp": false
  },
  {
    "name": "method",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "MethodDescriptorProto[]",
    "enums": null,
    "comment": "",
    "notImp": false
  },
  {
    "name": "options",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "ServiceOptions",
    "enums": null,
    "comment": "",
    "notImp": false
  }
] };

export const ServiceDescriptorProto_SingleFields = [
  "name"
];

export const MethodOptions: OutType = { "MethodOptions": [
  {
    "name": "deprecated",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "boolean",
    "enums": null,
    "comment": "Is this method deprecated? Depending on the target platform, this can emit Deprecated annotations for the method, or it will be completely ignored; in the very least, this is a formalization for deprecating methods.",
    "notImp": false
  },
  {
    "name": "idempotency_level",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "MethodOptions_IdempotencyLevel",
    "enums": [
      "IDEMPOTENCY_UNKNOWN",
      "NO_SIDE_EFFECTS",
      "IDEMPOTENT"
    ],
    "comment": "",
    "notImp": false
  },
  {
    "name": "features",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "FeatureSet",
    "enums": null,
    "comment": "Any features defined in the specific edition. WARNING: This field should only be used by protobuf plugins or special cases like the proto compiler. Other uses are discouraged and developers should rely on the protoreflect APIs for their client language.",
    "notImp": false
  },
  {
    "name": "uninterpreted_option",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "UninterpretedOption[]",
    "enums": null,
    "comment": "The parser stores options it doesn't recognize here. See above.",
    "notImp": false
  }
] };

export const MethodOptions_SingleFields = [
  "deprecated",
  "idempotency_level"
];

export const MethodDescriptorProto: OutType = { "MethodDescriptorProto": [
  {
    "name": "name",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "string",
    "enums": null,
    "comment": "",
    "notImp": false
  },
  {
    "name": "input_type",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "string",
    "enums": null,
    "comment": "Input and output type names.  These are resolved in the same way as FieldDescriptorProto.type_name, but must refer to a message type.",
    "notImp": false
  },
  {
    "name": "output_type",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "string",
    "enums": null,
    "comment": "",
    "notImp": false
  },
  {
    "name": "options",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "MethodOptions",
    "enums": null,
    "comment": "",
    "notImp": false
  },
  {
    "name": "client_streaming",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "boolean",
    "enums": null,
    "comment": "Identifies if client streams multiple client messages",
    "notImp": false
  },
  {
    "name": "server_streaming",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "boolean",
    "enums": null,
    "comment": "Identifies if server streams multiple server messages",
    "notImp": false
  }
] };

export const MethodDescriptorProto_SingleFields = [
  "name",
  "input_type",
  "output_type",
  "client_streaming",
  "server_streaming"
];

export const FieldOptions_EditionDefault: OutType = { "FieldOptions_EditionDefault": [
  {
    "name": "edition",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "Edition",
    "enums": [
      "EDITION_UNKNOWN",
      "EDITION_LEGACY",
      "EDITION_PROTO2",
      "EDITION_PROTO3",
      "EDITION_2023",
      "EDITION_2024",
      "EDITION_1_TEST_ONLY",
      "EDITION_2_TEST_ONLY",
      "EDITION_99997_TEST_ONLY",
      "EDITION_99998_TEST_ONLY",
      "EDITION_99999_TEST_ONLY",
      "EDITION_MAX"
    ],
    "comment": "",
    "notImp": false
  },
  {
    "name": "value",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "string",
    "enums": null,
    "comment": "Textproto value.",
    "notImp": false
  }
] };

export const FieldOptions_EditionDefault_SingleFields = [
  "edition",
  "value"
];

export const UninterpretedOption: OutType = { "UninterpretedOption": [
  {
    "name": "name",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "UninterpretedOption_NamePart[]",
    "enums": null,
    "comment": "",
    "notImp": false
  },
  {
    "name": "identifier_value",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "string",
    "enums": null,
    "comment": "The value of the uninterpreted option, in whatever type the tokenizer identified it as during parsing. Exactly one of these should be set.",
    "notImp": false
  },
  {
    "name": "positive_int_value",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "number",
    "enums": null,
    "comment": "",
    "notImp": false
  },
  {
    "name": "negative_int_value",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "number",
    "enums": null,
    "comment": "",
    "notImp": false
  },
  {
    "name": "double_value",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "number",
    "enums": null,
    "comment": "",
    "notImp": false
  },
  {
    "name": "string_value",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "Uint8Array<ArrayBufferLike>",
    "enums": null,
    "comment": "",
    "notImp": false
  },
  {
    "name": "aggregate_value",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "string",
    "enums": null,
    "comment": "",
    "notImp": false
  }
] };

export const UninterpretedOption_SingleFields = [
  "identifier_value",
  "positive_int_value",
  "negative_int_value",
  "double_value",
  "aggregate_value"
];

export const UninterpretedOption_NamePart: OutType = { "UninterpretedOption_NamePart": [
  {
    "name": "name_part",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "string",
    "enums": null,
    "comment": "",
    "notImp": false
  },
  {
    "name": "is_extension",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "boolean",
    "enums": null,
    "comment": "",
    "notImp": false
  }
] };

export const UninterpretedOption_NamePart_SingleFields = [
  "name_part",
  "is_extension"
];

export const FeatureSetDefaults: OutType = { "FeatureSetDefaults": [
  {
    "name": "defaults",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "FeatureSetDefaults_FeatureSetEditionDefault[]",
    "enums": null,
    "comment": "",
    "notImp": false
  },
  {
    "name": "minimum_edition",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "Edition",
    "enums": [
      "EDITION_UNKNOWN",
      "EDITION_LEGACY",
      "EDITION_PROTO2",
      "EDITION_PROTO3",
      "EDITION_2023",
      "EDITION_2024",
      "EDITION_1_TEST_ONLY",
      "EDITION_2_TEST_ONLY",
      "EDITION_99997_TEST_ONLY",
      "EDITION_99998_TEST_ONLY",
      "EDITION_99999_TEST_ONLY",
      "EDITION_MAX"
    ],
    "comment": "The minimum supported edition (inclusive) when this was constructed. Editions before this will not have defaults.",
    "notImp": false
  },
  {
    "name": "maximum_edition",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "Edition",
    "enums": [
      "EDITION_UNKNOWN",
      "EDITION_LEGACY",
      "EDITION_PROTO2",
      "EDITION_PROTO3",
      "EDITION_2023",
      "EDITION_2024",
      "EDITION_1_TEST_ONLY",
      "EDITION_2_TEST_ONLY",
      "EDITION_99997_TEST_ONLY",
      "EDITION_99998_TEST_ONLY",
      "EDITION_99999_TEST_ONLY",
      "EDITION_MAX"
    ],
    "comment": "The maximum known edition (inclusive) when this was constructed. Editions after this will not have reliable defaults.",
    "notImp": false
  }
] };

export const FeatureSetDefaults_SingleFields = [
  "minimum_edition",
  "maximum_edition"
];

export const FeatureSetDefaults_FeatureSetEditionDefault: OutType = { "FeatureSetDefaults_FeatureSetEditionDefault": [
  {
    "name": "edition",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "Edition",
    "enums": [
      "EDITION_UNKNOWN",
      "EDITION_LEGACY",
      "EDITION_PROTO2",
      "EDITION_PROTO3",
      "EDITION_2023",
      "EDITION_2024",
      "EDITION_1_TEST_ONLY",
      "EDITION_2_TEST_ONLY",
      "EDITION_99997_TEST_ONLY",
      "EDITION_99998_TEST_ONLY",
      "EDITION_99999_TEST_ONLY",
      "EDITION_MAX"
    ],
    "comment": "",
    "notImp": false
  },
  {
    "name": "overridable_features",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "FeatureSet",
    "enums": null,
    "comment": "Defaults of features that can be overridden in this edition.",
    "notImp": false
  },
  {
    "name": "fixed_features",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "FeatureSet",
    "enums": null,
    "comment": "Defaults of features that can't be overridden in this edition.",
    "notImp": false
  }
] };

export const FeatureSetDefaults_FeatureSetEditionDefault_SingleFields = [
  "edition"
];

export const SourceCodeInfo_Location: OutType = { "SourceCodeInfo_Location": [
  {
    "name": "path",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "number[]",
    "enums": null,
    "comment": "Identifies which part of the FileDescriptorProto was defined at this location.\n\nEach element is a field number or an index.  They form a path from the root FileDescriptorProto to the place where the definition appears. For example, this path: [ 4, 3, 2, 7, 1 ] refers to: file.message_type(3)  // 4, 3 .field(7)         // 2, 7 .name()           // 1 This is because FileDescriptorProto.message_type has field number 4: repeated DescriptorProto message_type = 4; and DescriptorProto.field has field number 2: repeated FieldDescriptorProto field = 2; and FieldDescriptorProto.name has field number 1: optional string name = 1;\n\nThus, the above path gives the location of a field name.  If we removed the last element: [ 4, 3, 2, 7 ] this path refers to the whole field declaration (from the beginning of the label to the terminating semicolon).",
    "notImp": false
  },
  {
    "name": "span",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "number[]",
    "enums": null,
    "comment": "Always has exactly three or four elements: start line, start column, end line (optional, otherwise assumed same as start line), end column. These are packed into a single field for efficiency.  Note that line and column numbers are zero-based -- typically you will want to add 1 to each before displaying to a user.",
    "notImp": false
  },
  {
    "name": "leading_comments",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "string",
    "enums": null,
    "comment": "If this SourceCodeInfo represents a complete declaration, these are any comments appearing before and after the declaration which appear to be attached to the declaration.\n\nA series of line comments appearing on consecutive lines, with no other tokens appearing on those lines, will be treated as a single comment.\n\nleading_detached_comments will keep paragraphs of comments that appear before (but not connected to) the current element. Each paragraph, separated by empty lines, will be one comment element in the repeated field.\n\nOnly the comment content is provided; comment markers (e.g. //) are stripped out.  For block comments, leading whitespace and an asterisk will be stripped from the beginning of each line other than the first. Newlines are included in the output.\n\nExamples:\n\n  optional int32 foo = 1;  // Comment attached to foo. // Comment attached to bar. optional int32 bar = 2;\n\n  optional string baz = 3; // Comment attached to baz. // Another line attached to baz.\n\n  // Comment attached to moo. // // Another line attached to moo. optional double moo = 4;\n\n  // Detached comment for corge. This is not leading or trailing comments // to moo or corge because there are blank lines separating it from // both.\n\n  // Detached comment for corge paragraph 2.\n\n  optional string corge = 5; /* Block comment attached * to corge.  Leading asterisks * will be removed. * / /* Block comment attached to * grault. * / optional int32 grault = 6;\n\n  // ignored detached comments.",
    "notImp": false
  },
  {
    "name": "trailing_comments",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "string",
    "enums": null,
    "comment": "",
    "notImp": false
  },
  {
    "name": "leading_detached_comments",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "string[]",
    "enums": null,
    "comment": "",
    "notImp": false
  }
] };

export const SourceCodeInfo_Location_SingleFields = [
  "path",
  "span",
  "leading_comments",
  "trailing_comments",
  "leading_detached_comments"
];

export const GeneratedCodeInfo: OutType = { "GeneratedCodeInfo": [
  {
    "name": "annotation",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "GeneratedCodeInfo_Annotation[]",
    "enums": null,
    "comment": "An Annotation connects some span of text in generated code to an element of its generating .proto file.",
    "notImp": false
  }
] };

export const GeneratedCodeInfo_Annotation: OutType = { "GeneratedCodeInfo_Annotation": [
  {
    "name": "path",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "number[]",
    "enums": null,
    "comment": "Identifies the element in the original source .proto file. This field is formatted the same as SourceCodeInfo.Location.path.",
    "notImp": false
  },
  {
    "name": "source_file",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "string",
    "enums": null,
    "comment": "Identifies the filesystem path to the original source .proto.",
    "notImp": false
  },
  {
    "name": "begin",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "number",
    "enums": null,
    "comment": "Identifies the starting offset in bytes in the generated code that relates to the identified object.",
    "notImp": false
  },
  {
    "name": "end",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "number",
    "enums": null,
    "comment": "Identifies the ending offset in bytes in the generated code that relates to the identified object. The end offset should be one past the last relevant byte (so the length of the text = end - begin).",
    "notImp": false
  },
  {
    "name": "semantic",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "GeneratedCodeInfo_Annotation_Semantic",
    "enums": [
      "NONE",
      "SET",
      "ALIAS"
    ],
    "comment": "",
    "notImp": false
  }
] };

export const GeneratedCodeInfo_Annotation_SingleFields = [
  "path",
  "source_file",
  "begin",
  "end",
  "semantic"
];