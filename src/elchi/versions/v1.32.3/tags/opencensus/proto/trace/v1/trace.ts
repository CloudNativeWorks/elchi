import {OutType} from '@/elchi/tags/tagsType';


export const Span_Tracestate: OutType = { "Span_Tracestate": [
  {
    "name": "entries",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "Span_Tracestate_Entry[]",
    "enums": null,
    "comment": "A list of entries that represent the Tracestate.",
    "notImp": false
  }
] };

export const TruncatableString: OutType = { "TruncatableString": [
  {
    "name": "value",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "string",
    "enums": null,
    "comment": "The shortened string. For example, if the original string was 500 bytes long and the limit of the string was 128 bytes, then this value contains the first 128 bytes of the 500-byte string. Note that truncation always happens on a character boundary, to ensure that a truncated string is still valid UTF-8. Because it may contain multi-byte characters, the size of the truncated string may be less than the truncation limit.",
    "notImp": false
  },
  {
    "name": "truncated_byte_count",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "number",
    "enums": null,
    "comment": "The number of bytes removed from the original string. If this value is 0, then the string was not shortened.",
    "notImp": false
  }
] };

export const TruncatableString_SingleFields = [
  "value",
  "truncated_byte_count"
];

export const Span_Attributes: OutType = { "Span_Attributes": [
  {
    "name": "attribute_map",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "Map<string, AttributeValue>",
    "enums": null,
    "comment": "The set of attributes. The value can be a string, an integer, a double or the Boolean values `true` or `false`. Note, global attributes like server name can be set as tags using resource API. Examples of attributes:\n\n    \"/http/user_agent\": \"Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_2) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/71.0.3578.98 Safari/537.36\" \"/http/server_latency\": 300 \"abc.com/myattribute\": true \"abc.com/score\": 10.239",
    "notImp": false
  },
  {
    "name": "dropped_attributes_count",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "number",
    "enums": null,
    "comment": "The number of attributes that were discarded. Attributes can be discarded because their keys are too long or because there are too many attributes. If this value is 0, then no attributes were dropped.",
    "notImp": false
  }
] };

export const Span_Attributes_SingleFields = [
  "dropped_attributes_count"
];

export const StackTrace_StackFrames: OutType = { "StackTrace_StackFrames": [
  {
    "name": "frame",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "StackTrace_StackFrame[]",
    "enums": null,
    "comment": "Stack frames in this call stack.",
    "notImp": false
  },
  {
    "name": "dropped_frames_count",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "number",
    "enums": null,
    "comment": "The number of stack frames that were dropped because there were too many stack frames. If this value is 0, then no stack frames were dropped.",
    "notImp": false
  }
] };

export const StackTrace_StackFrames_SingleFields = [
  "dropped_frames_count"
];

export const StackTrace: OutType = { "StackTrace": [
  {
    "name": "stack_frames",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "StackTrace_StackFrames",
    "enums": null,
    "comment": "Stack frames in this stack trace.",
    "notImp": false
  },
  {
    "name": "stack_trace_hash_id",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "number",
    "enums": null,
    "comment": "The hash ID is used to conserve network bandwidth for duplicate stack traces within a single trace.\n\nOften multiple spans will have identical stack traces. The first occurrence of a stack trace should contain both `stack_frames` and a value in `stack_trace_hash_id`.\n\nSubsequent spans within the same request can refer to that stack trace by setting only `stack_trace_hash_id`.\n\nTODO: describe how to deal with the case where stack_trace_hash_id is zero because it was not set.",
    "notImp": false
  }
] };

export const StackTrace_SingleFields = [
  "stack_trace_hash_id"
];

export const Span_TimeEvents: OutType = { "Span_TimeEvents": [
  {
    "name": "time_event",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "Span_TimeEvent[]",
    "enums": null,
    "comment": "A collection of `TimeEvent`s.",
    "notImp": false
  },
  {
    "name": "dropped_annotations_count",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "number",
    "enums": null,
    "comment": "The number of dropped annotations in all the included time events. If the value is 0, then no annotations were dropped.",
    "notImp": false
  },
  {
    "name": "dropped_message_events_count",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "number",
    "enums": null,
    "comment": "The number of dropped message events in all the included time events. If the value is 0, then no message events were dropped.",
    "notImp": false
  }
] };

export const Span_TimeEvents_SingleFields = [
  "dropped_annotations_count",
  "dropped_message_events_count"
];

export const Span_Links: OutType = { "Span_Links": [
  {
    "name": "link",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "Span_Link[]",
    "enums": null,
    "comment": "A collection of links.",
    "notImp": false
  },
  {
    "name": "dropped_links_count",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "number",
    "enums": null,
    "comment": "The number of dropped links after the maximum size was enforced. If this value is 0, then no links were dropped.",
    "notImp": false
  }
] };

export const Span_Links_SingleFields = [
  "dropped_links_count"
];

export const Status: OutType = { "Status": [
  {
    "name": "code",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "number",
    "enums": null,
    "comment": "The status code. This is optional field. It is safe to assume 0 (OK) when not set.",
    "notImp": false
  },
  {
    "name": "message",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "string",
    "enums": null,
    "comment": "A developer-facing error message, which should be in English.",
    "notImp": false
  }
] };

export const Status_SingleFields = [
  "code",
  "message"
];

export const Span: OutType = { "Span": [
  {
    "name": "trace_id",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "Uint8Array<ArrayBufferLike>",
    "enums": null,
    "comment": "A unique identifier for a trace. All spans from the same trace share the same `trace_id`. The ID is a 16-byte array. An ID with all zeroes is considered invalid.\n\nThis field is semantically required. Receiver should generate new random trace_id if empty or invalid trace_id was received.\n\nThis field is required.",
    "notImp": false
  },
  {
    "name": "span_id",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "Uint8Array<ArrayBufferLike>",
    "enums": null,
    "comment": "A unique identifier for a span within a trace, assigned when the span is created. The ID is an 8-byte array. An ID with all zeroes is considered invalid.\n\nThis field is semantically required. Receiver should generate new random span_id if empty or invalid span_id was received.\n\nThis field is required.",
    "notImp": false
  },
  {
    "name": "tracestate",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "Span_Tracestate",
    "enums": null,
    "comment": "The Tracestate on the span.",
    "notImp": false
  },
  {
    "name": "parent_span_id",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "Uint8Array<ArrayBufferLike>",
    "enums": null,
    "comment": "The `span_id` of this span's parent span. If this is a root span, then this field must be empty. The ID is an 8-byte array.",
    "notImp": false
  },
  {
    "name": "name",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "TruncatableString",
    "enums": null,
    "comment": "A description of the span's operation.\n\nFor example, the name can be a qualified method name or a file name and a line number where the operation is called. A best practice is to use the same display name at the same call point in an application. This makes it easier to correlate spans in different traces.\n\nThis field is semantically required to be set to non-empty string. When null or empty string received - receiver may use string \"name\" as a replacement. There might be smarted algorithms implemented by receiver to fix the empty span name.\n\nThis field is required.",
    "notImp": false
  },
  {
    "name": "kind",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "Span_SpanKind",
    "enums": [
      "SPAN_KIND_UNSPECIFIED",
      "SERVER",
      "CLIENT"
    ],
    "comment": "Distinguishes between spans generated in a particular context. For example, two spans with the same name may be distinguished using `CLIENT` (caller) and `SERVER` (callee) to identify queueing latency associated with the span.",
    "notImp": false
  },
  {
    "name": "start_time",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "Date",
    "enums": null,
    "comment": "The start time of the span. On the client side, this is the time kept by the local machine where the span execution starts. On the server side, this is the time when the server's application handler starts running.\n\nThis field is semantically required. When not set on receive - receiver should set it to the value of end_time field if it was set. Or to the current time if neither was set. It is important to keep end_time > start_time for consistency.\n\nThis field is required.",
    "notImp": false
  },
  {
    "name": "end_time",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "Date",
    "enums": null,
    "comment": "The end time of the span. On the client side, this is the time kept by the local machine where the span execution ends. On the server side, this is the time when the server application handler stops running.\n\nThis field is semantically required. When not set on receive - receiver should set it to start_time value. It is important to keep end_time > start_time for consistency.\n\nThis field is required.",
    "notImp": false
  },
  {
    "name": "attributes",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "Span_Attributes",
    "enums": null,
    "comment": "A set of attributes on the span.",
    "notImp": false
  },
  {
    "name": "stack_trace",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "StackTrace",
    "enums": null,
    "comment": "A stack trace captured at the start of the span.",
    "notImp": false
  },
  {
    "name": "time_events",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "Span_TimeEvents",
    "enums": null,
    "comment": "The included time events.",
    "notImp": false
  },
  {
    "name": "links",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "Span_Links",
    "enums": null,
    "comment": "The included links.",
    "notImp": false
  },
  {
    "name": "status",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "Status",
    "enums": null,
    "comment": "An optional final status for this span. Semantically when Status wasn't set it is means span ended without errors and assume Status.Ok (code = 0).",
    "notImp": false
  },
  {
    "name": "resource",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "Resource",
    "enums": null,
    "comment": "An optional resource that is associated with this span. If not set, this span should be part of a batch that does include the resource information, unless resource information is unknown.",
    "notImp": false
  },
  {
    "name": "same_process_as_parent_span",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "boolean",
    "enums": null,
    "comment": "A highly recommended but not required flag that identifies when a trace crosses a process boundary. True when the parent_span belongs to the same process as the current span. This flag is most commonly used to indicate the need to adjust time as clocks in different processes may not be synchronized.",
    "notImp": false
  },
  {
    "name": "child_span_count",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "number",
    "enums": null,
    "comment": "An optional number of child spans that were generated while this span was active. If set, allows an implementation to detect missing child spans.",
    "notImp": false
  }
] };

export const Span_SingleFields = [
  "kind",
  "same_process_as_parent_span",
  "child_span_count"
];

export const Span_Tracestate_Entry: OutType = { "Span_Tracestate_Entry": [
  {
    "name": "key",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "string",
    "enums": null,
    "comment": "The key must begin with a lowercase letter, and can only contain lowercase letters 'a'-'z', digits '0'-'9', underscores '_', dashes '-', asterisks '*', and forward slashes '/'.",
    "notImp": false
  },
  {
    "name": "value",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "string",
    "enums": null,
    "comment": "The value is opaque string up to 256 characters printable ASCII RFC0020 characters (i.e., the range 0x20 to 0x7E) except ',' and '='. Note that this also excludes tabs, newlines, carriage returns, etc.",
    "notImp": false
  }
] };

export const Span_Tracestate_Entry_SingleFields = [
  "key",
  "value"
];

export const AttributeValue: OutType = { "AttributeValue": [
  {
    "name": "value.string_value",
    "isUnion": true,
    "isDeprecated": false,
    "fieldType": "TruncatableString",
    "enums": null,
    "comment": "A string up to 256 bytes long.",
    "notImp": false
  },
  {
    "name": "value.int_value",
    "isUnion": true,
    "isDeprecated": false,
    "fieldType": "number",
    "enums": null,
    "comment": "A 64-bit signed integer.",
    "notImp": false
  },
  {
    "name": "value.bool_value",
    "isUnion": true,
    "isDeprecated": false,
    "fieldType": "boolean",
    "enums": null,
    "comment": "A Boolean value represented by `true` or `false`.",
    "notImp": false
  },
  {
    "name": "value.double_value",
    "isUnion": true,
    "isDeprecated": false,
    "fieldType": "number",
    "enums": null,
    "comment": "A double value.",
    "notImp": false
  }
] };

export const AttributeValue_SingleFields = [
  "value.int_value",
  "value.bool_value",
  "value.double_value"
];

export const Span_Attributes_AttributeMapEntry: OutType = { "Span_Attributes_AttributeMapEntry": [
  {
    "name": "key",
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
    "fieldType": "AttributeValue",
    "enums": null,
    "comment": "",
    "notImp": false
  }
] };

export const Span_Attributes_AttributeMapEntry_SingleFields = [
  "key"
];

export const Span_TimeEvent: OutType = { "Span_TimeEvent": [
  {
    "name": "time",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "Date",
    "enums": null,
    "comment": "The time the event occurred.",
    "notImp": false
  },
  {
    "name": "value.annotation",
    "isUnion": true,
    "isDeprecated": false,
    "fieldType": "Span_TimeEvent_Annotation",
    "enums": null,
    "comment": "A text annotation with a set of attributes.",
    "notImp": false
  },
  {
    "name": "value.message_event",
    "isUnion": true,
    "isDeprecated": false,
    "fieldType": "Span_TimeEvent_MessageEvent",
    "enums": null,
    "comment": "An event describing a message sent/received between Spans.",
    "notImp": false
  }
] };

export const Span_TimeEvent_Annotation: OutType = { "Span_TimeEvent_Annotation": [
  {
    "name": "description",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "TruncatableString",
    "enums": null,
    "comment": "A user-supplied message describing the event.",
    "notImp": false
  },
  {
    "name": "attributes",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "Span_Attributes",
    "enums": null,
    "comment": "A set of attributes on the annotation.",
    "notImp": false
  }
] };

export const Span_TimeEvent_MessageEvent: OutType = { "Span_TimeEvent_MessageEvent": [
  {
    "name": "type",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "Span_TimeEvent_MessageEvent_Type",
    "enums": [
      "TYPE_UNSPECIFIED",
      "SENT",
      "RECEIVED"
    ],
    "comment": "The type of MessageEvent. Indicates whether the message was sent or received.",
    "notImp": false
  },
  {
    "name": "id",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "number",
    "enums": null,
    "comment": "An identifier for the MessageEvent's message that can be used to match SENT and RECEIVED MessageEvents. For example, this field could represent a sequence ID for a streaming RPC. It is recommended to be unique within a Span.",
    "notImp": false
  },
  {
    "name": "uncompressed_size",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "number",
    "enums": null,
    "comment": "The number of uncompressed bytes sent or received.",
    "notImp": false
  },
  {
    "name": "compressed_size",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "number",
    "enums": null,
    "comment": "The number of compressed bytes sent or received. If zero, assumed to be the same size as uncompressed.",
    "notImp": false
  }
] };

export const Span_TimeEvent_MessageEvent_SingleFields = [
  "type",
  "id",
  "uncompressed_size",
  "compressed_size"
];

export const Span_Link: OutType = { "Span_Link": [
  {
    "name": "trace_id",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "Uint8Array<ArrayBufferLike>",
    "enums": null,
    "comment": "A unique identifier of a trace that this linked span is part of. The ID is a 16-byte array.",
    "notImp": false
  },
  {
    "name": "span_id",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "Uint8Array<ArrayBufferLike>",
    "enums": null,
    "comment": "A unique identifier for the linked span. The ID is an 8-byte array.",
    "notImp": false
  },
  {
    "name": "type",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "Span_Link_Type",
    "enums": [
      "TYPE_UNSPECIFIED",
      "CHILD_LINKED_SPAN",
      "PARENT_LINKED_SPAN"
    ],
    "comment": "The relationship of the current span relative to the linked span.",
    "notImp": false
  },
  {
    "name": "attributes",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "Span_Attributes",
    "enums": null,
    "comment": "A set of attributes on the link.",
    "notImp": false
  },
  {
    "name": "tracestate",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "Span_Tracestate",
    "enums": null,
    "comment": "The Tracestate associated with the link.",
    "notImp": false
  }
] };

export const Span_Link_SingleFields = [
  "type"
];

export const Module: OutType = { "Module": [
  {
    "name": "module",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "TruncatableString",
    "enums": null,
    "comment": "TODO: document the meaning of this field. For example: main binary, kernel modules, and dynamic libraries such as libc.so, sharedlib.so.",
    "notImp": false
  },
  {
    "name": "build_id",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "TruncatableString",
    "enums": null,
    "comment": "A unique identifier for the module, usually a hash of its contents.",
    "notImp": false
  }
] };

export const StackTrace_StackFrame: OutType = { "StackTrace_StackFrame": [
  {
    "name": "function_name",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "TruncatableString",
    "enums": null,
    "comment": "The fully-qualified name that uniquely identifies the function or method that is active in this frame.",
    "notImp": false
  },
  {
    "name": "original_function_name",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "TruncatableString",
    "enums": null,
    "comment": "An un-mangled function name, if `function_name` is [mangled](http://www.avabodh.com/cxxin/namemangling.html). The name can be fully qualified.",
    "notImp": false
  },
  {
    "name": "file_name",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "TruncatableString",
    "enums": null,
    "comment": "The name of the source file where the function call appears.",
    "notImp": false
  },
  {
    "name": "line_number",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "number",
    "enums": null,
    "comment": "The line number in `file_name` where the function call appears.",
    "notImp": false
  },
  {
    "name": "column_number",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "number",
    "enums": null,
    "comment": "The column number where the function call appears, if available. This is important in JavaScript because of its anonymous functions.",
    "notImp": false
  },
  {
    "name": "load_module",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "Module",
    "enums": null,
    "comment": "The binary module from where the code was loaded.",
    "notImp": false
  },
  {
    "name": "source_version",
    "isUnion": false,
    "isDeprecated": false,
    "fieldType": "TruncatableString",
    "enums": null,
    "comment": "The version of the deployed source code.",
    "notImp": false
  }
] };

export const StackTrace_StackFrame_SingleFields = [
  "line_number",
  "column_number"
];