// Code generated by protoc-gen-ts_proto. DO NOT EDIT.
// versions:
//   protoc-gen-ts_proto  v2.2.7
//   protoc               unknown
// source: envoy/extensions/filters/network/thrift_proxy/filters/payload_to_metadata/v3/payload_to_metadata.proto

/* eslint-disable */
import { BinaryReader, BinaryWriter } from "@bufbuild/protobuf/wire";
import { messageTypeRegistry } from "../../../../../../../../typeRegistry";
import { RegexMatchAndSubstitute } from "../../../../../../../type/matcher/v3/regex";

export const protobufPackage = "envoy.extensions.filters.network.thrift_proxy.filters.payload_to_metadata.v3";

export interface PayloadToMetadata {
  $type: "envoy.extensions.filters.network.thrift_proxy.filters.payload_to_metadata.v3.PayloadToMetadata";
  /** The list of rules to apply to requests. */
  request_rules?: PayloadToMetadata_Rule[] | undefined;
}

export enum PayloadToMetadata_ValueType {
  STRING = "STRING",
  NUMBER = "NUMBER",
}

export function payloadToMetadata_ValueTypeFromJSON(object: any): PayloadToMetadata_ValueType {
  switch (object) {
    case 0:
    case "STRING":
      return PayloadToMetadata_ValueType.STRING;
    case 1:
    case "NUMBER":
      return PayloadToMetadata_ValueType.NUMBER;
    default:
      throw new globalThis.Error("Unrecognized enum value " + object + " for enum PayloadToMetadata_ValueType");
  }
}

export function payloadToMetadata_ValueTypeToJSON(object: PayloadToMetadata_ValueType): string {
  switch (object) {
    case PayloadToMetadata_ValueType.STRING:
      return "STRING";
    case PayloadToMetadata_ValueType.NUMBER:
      return "NUMBER";
    default:
      throw new globalThis.Error("Unrecognized enum value " + object + " for enum PayloadToMetadata_ValueType");
  }
}

export function payloadToMetadata_ValueTypeToNumber(object: PayloadToMetadata_ValueType): number {
  switch (object) {
    case PayloadToMetadata_ValueType.STRING:
      return 0;
    case PayloadToMetadata_ValueType.NUMBER:
      return 1;
    default:
      throw new globalThis.Error("Unrecognized enum value " + object + " for enum PayloadToMetadata_ValueType");
  }
}

/** [#next-free-field: 6] */
export interface PayloadToMetadata_KeyValuePair {
  $type: "envoy.extensions.filters.network.thrift_proxy.filters.payload_to_metadata.v3.PayloadToMetadata.KeyValuePair";
  /** The namespace — if this is empty, the filter's namespace will be used. */
  metadata_namespace?:
    | string
    | undefined;
  /** The key to use within the namespace. */
  key?: string | undefined;
  value_type?:
    | //
    /**
     * The value to pair with the given key.
     *
     * When used for on_present case, if value is non-empty it'll be used instead
     * of the field value. If both are empty, the field value is used as-is.
     *
     * When used for on_missing case, a non-empty value must be provided.
     */
    { $case: "value"; value: string }
    | //
    /**
     * If present, the header's value will be matched and substituted with this.
     * If there is no match or substitution, the field value is used as-is.
     *
     * This is only used for on_present.
     */
    { $case: "regex_value_rewrite"; regex_value_rewrite: RegexMatchAndSubstitute }
    | undefined;
  /** The value's type — defaults to string. */
  type?: PayloadToMetadata_ValueType | undefined;
}

/**
 * A Rule defines what metadata to apply when a field is present or missing.
 * [#next-free-field: 6]
 */
export interface PayloadToMetadata_Rule {
  $type: "envoy.extensions.filters.network.thrift_proxy.filters.payload_to_metadata.v3.PayloadToMetadata.Rule";
  match_specifier?:
    | //
    /**
     * If specified, the route must exactly match the request method name. As a special case,
     * an empty string matches any request method name.
     */
    { $case: "method_name"; method_name: string }
    | //
    /**
     * If specified, the route must have the service name as the request method name prefix.
     * As a special case, an empty string matches any service name. Only relevant when service
     * multiplexing.
     */
    { $case: "service_name"; service_name: string }
    | undefined;
  /** Specifies that a match will be performed on the value of a field. */
  field_selector?:
    | PayloadToMetadata_FieldSelector
    | undefined;
  /** If the field is present, apply this metadata KeyValuePair. */
  on_present?:
    | PayloadToMetadata_KeyValuePair
    | undefined;
  /**
   * If the field is missing, apply this metadata KeyValuePair.
   *
   * The value in the KeyValuePair must be set, since it'll be used in lieu
   * of the missing field value.
   */
  on_missing?: PayloadToMetadata_KeyValuePair | undefined;
}

export interface PayloadToMetadata_FieldSelector {
  $type: "envoy.extensions.filters.network.thrift_proxy.filters.payload_to_metadata.v3.PayloadToMetadata.FieldSelector";
  /** field name to log */
  name?:
    | string
    | undefined;
  /** field id to match */
  id?:
    | number
    | undefined;
  /** next node of the field selector */
  child?: PayloadToMetadata_FieldSelector | undefined;
}

function createBasePayloadToMetadata(): PayloadToMetadata {
  return { $type: "envoy.extensions.filters.network.thrift_proxy.filters.payload_to_metadata.v3.PayloadToMetadata" };
}

export const PayloadToMetadata: MessageFns<
  PayloadToMetadata,
  "envoy.extensions.filters.network.thrift_proxy.filters.payload_to_metadata.v3.PayloadToMetadata"
> = {
  $type: "envoy.extensions.filters.network.thrift_proxy.filters.payload_to_metadata.v3.PayloadToMetadata" as const,

  encode(message: PayloadToMetadata, writer: BinaryWriter = new BinaryWriter()): BinaryWriter {
    if (message.request_rules !== undefined && message.request_rules.length !== 0) {
      for (const v of message.request_rules) {
        PayloadToMetadata_Rule.encode(v!, writer.uint32(10).fork()).join();
      }
    }
    return writer;
  },

  decode(input: BinaryReader | Uint8Array, length?: number): PayloadToMetadata {
    const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBasePayloadToMetadata();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1: {
          if (tag !== 10) {
            break;
          }

          if (message.request_rules === undefined) {
            message.request_rules = [];
          }
          const el = PayloadToMetadata_Rule.decode(reader, reader.uint32());
          if (el !== undefined) {
            message.request_rules!.push(el);
          }
          continue;
        }
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skip(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): PayloadToMetadata {
    return {
      $type: PayloadToMetadata.$type,
      request_rules: globalThis.Array.isArray(object?.request_rules)
        ? object.request_rules.map((e: any) => PayloadToMetadata_Rule.fromJSON(e))
        : undefined,
    };
  },

  toJSON(message: PayloadToMetadata): unknown {
    const obj: any = {};
    if (message.request_rules?.length) {
      obj.request_rules = message.request_rules.map((e) => PayloadToMetadata_Rule.toJSON(e));
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<PayloadToMetadata>, I>>(base?: I): PayloadToMetadata {
    return PayloadToMetadata.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<PayloadToMetadata>, I>>(object: I): PayloadToMetadata {
    const message = createBasePayloadToMetadata();
    message.request_rules = object.request_rules?.map((e) => PayloadToMetadata_Rule.fromPartial(e)) || undefined;
    return message;
  },
};

messageTypeRegistry.set(PayloadToMetadata.$type, PayloadToMetadata);

function createBasePayloadToMetadata_KeyValuePair(): PayloadToMetadata_KeyValuePair {
  return {
    $type:
      "envoy.extensions.filters.network.thrift_proxy.filters.payload_to_metadata.v3.PayloadToMetadata.KeyValuePair",
    value_type: undefined,
  };
}

export const PayloadToMetadata_KeyValuePair: MessageFns<
  PayloadToMetadata_KeyValuePair,
  "envoy.extensions.filters.network.thrift_proxy.filters.payload_to_metadata.v3.PayloadToMetadata.KeyValuePair"
> = {
  $type:
    "envoy.extensions.filters.network.thrift_proxy.filters.payload_to_metadata.v3.PayloadToMetadata.KeyValuePair" as const,

  encode(message: PayloadToMetadata_KeyValuePair, writer: BinaryWriter = new BinaryWriter()): BinaryWriter {
    if (message.metadata_namespace !== undefined && message.metadata_namespace !== "") {
      writer.uint32(10).string(message.metadata_namespace);
    }
    if (message.key !== undefined && message.key !== "") {
      writer.uint32(18).string(message.key);
    }
    switch (message.value_type?.$case) {
      case "value":
        writer.uint32(26).string(message.value_type.value);
        break;
      case "regex_value_rewrite":
        RegexMatchAndSubstitute.encode(message.value_type.regex_value_rewrite, writer.uint32(34).fork()).join();
        break;
    }
    if (message.type !== undefined && message.type !== PayloadToMetadata_ValueType.STRING) {
      writer.uint32(40).int32(payloadToMetadata_ValueTypeToNumber(message.type));
    }
    return writer;
  },

  decode(input: BinaryReader | Uint8Array, length?: number): PayloadToMetadata_KeyValuePair {
    const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBasePayloadToMetadata_KeyValuePair();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1: {
          if (tag !== 10) {
            break;
          }

          message.metadata_namespace = reader.string();
          continue;
        }
        case 2: {
          if (tag !== 18) {
            break;
          }

          message.key = reader.string();
          continue;
        }
        case 3: {
          if (tag !== 26) {
            break;
          }

          message.value_type = { $case: "value", value: reader.string() };
          continue;
        }
        case 4: {
          if (tag !== 34) {
            break;
          }

          message.value_type = {
            $case: "regex_value_rewrite",
            regex_value_rewrite: RegexMatchAndSubstitute.decode(reader, reader.uint32()),
          };
          continue;
        }
        case 5: {
          if (tag !== 40) {
            break;
          }

          message.type = payloadToMetadata_ValueTypeFromJSON(reader.int32());
          continue;
        }
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skip(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): PayloadToMetadata_KeyValuePair {
    return {
      $type: PayloadToMetadata_KeyValuePair.$type,
      metadata_namespace: isSet(object.metadata_namespace) ? globalThis.String(object.metadata_namespace) : undefined,
      key: isSet(object.key) ? globalThis.String(object.key) : undefined,
      value_type: isSet(object.value)
        ? { $case: "value", value: globalThis.String(object.value) }
        : isSet(object.regex_value_rewrite)
        ? {
          $case: "regex_value_rewrite",
          regex_value_rewrite: RegexMatchAndSubstitute.fromJSON(object.regex_value_rewrite),
        }
        : undefined,
      type: isSet(object.type) ? payloadToMetadata_ValueTypeFromJSON(object.type) : undefined,
    };
  },

  toJSON(message: PayloadToMetadata_KeyValuePair): unknown {
    const obj: any = {};
    if (message.metadata_namespace !== undefined) {
      obj.metadata_namespace = message.metadata_namespace;
    }
    if (message.key !== undefined) {
      obj.key = message.key;
    }
    if (message.value_type?.$case === "value") {
      obj.value = message.value_type.value;
    }
    if (message.value_type?.$case === "regex_value_rewrite") {
      obj.regex_value_rewrite = RegexMatchAndSubstitute.toJSON(message.value_type.regex_value_rewrite);
    }
    if (message.type !== undefined) {
      obj.type = payloadToMetadata_ValueTypeToJSON(message.type);
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<PayloadToMetadata_KeyValuePair>, I>>(base?: I): PayloadToMetadata_KeyValuePair {
    return PayloadToMetadata_KeyValuePair.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<PayloadToMetadata_KeyValuePair>, I>>(
    object: I,
  ): PayloadToMetadata_KeyValuePair {
    const message = createBasePayloadToMetadata_KeyValuePair();
    message.metadata_namespace = object.metadata_namespace ?? undefined;
    message.key = object.key ?? undefined;
    if (
      object.value_type?.$case === "value" &&
      object.value_type?.value !== undefined &&
      object.value_type?.value !== null
    ) {
      message.value_type = { $case: "value", value: object.value_type.value };
    }
    if (
      object.value_type?.$case === "regex_value_rewrite" &&
      object.value_type?.regex_value_rewrite !== undefined &&
      object.value_type?.regex_value_rewrite !== null
    ) {
      message.value_type = {
        $case: "regex_value_rewrite",
        regex_value_rewrite: RegexMatchAndSubstitute.fromPartial(object.value_type.regex_value_rewrite),
      };
    }
    message.type = object.type ?? undefined;
    return message;
  },
};

messageTypeRegistry.set(PayloadToMetadata_KeyValuePair.$type, PayloadToMetadata_KeyValuePair);

function createBasePayloadToMetadata_Rule(): PayloadToMetadata_Rule {
  return {
    $type: "envoy.extensions.filters.network.thrift_proxy.filters.payload_to_metadata.v3.PayloadToMetadata.Rule",
    match_specifier: undefined,
  };
}

export const PayloadToMetadata_Rule: MessageFns<
  PayloadToMetadata_Rule,
  "envoy.extensions.filters.network.thrift_proxy.filters.payload_to_metadata.v3.PayloadToMetadata.Rule"
> = {
  $type: "envoy.extensions.filters.network.thrift_proxy.filters.payload_to_metadata.v3.PayloadToMetadata.Rule" as const,

  encode(message: PayloadToMetadata_Rule, writer: BinaryWriter = new BinaryWriter()): BinaryWriter {
    switch (message.match_specifier?.$case) {
      case "method_name":
        writer.uint32(10).string(message.match_specifier.method_name);
        break;
      case "service_name":
        writer.uint32(18).string(message.match_specifier.service_name);
        break;
    }
    if (message.field_selector !== undefined) {
      PayloadToMetadata_FieldSelector.encode(message.field_selector, writer.uint32(26).fork()).join();
    }
    if (message.on_present !== undefined) {
      PayloadToMetadata_KeyValuePair.encode(message.on_present, writer.uint32(34).fork()).join();
    }
    if (message.on_missing !== undefined) {
      PayloadToMetadata_KeyValuePair.encode(message.on_missing, writer.uint32(42).fork()).join();
    }
    return writer;
  },

  decode(input: BinaryReader | Uint8Array, length?: number): PayloadToMetadata_Rule {
    const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBasePayloadToMetadata_Rule();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1: {
          if (tag !== 10) {
            break;
          }

          message.match_specifier = { $case: "method_name", method_name: reader.string() };
          continue;
        }
        case 2: {
          if (tag !== 18) {
            break;
          }

          message.match_specifier = { $case: "service_name", service_name: reader.string() };
          continue;
        }
        case 3: {
          if (tag !== 26) {
            break;
          }

          message.field_selector = PayloadToMetadata_FieldSelector.decode(reader, reader.uint32());
          continue;
        }
        case 4: {
          if (tag !== 34) {
            break;
          }

          message.on_present = PayloadToMetadata_KeyValuePair.decode(reader, reader.uint32());
          continue;
        }
        case 5: {
          if (tag !== 42) {
            break;
          }

          message.on_missing = PayloadToMetadata_KeyValuePair.decode(reader, reader.uint32());
          continue;
        }
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skip(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): PayloadToMetadata_Rule {
    return {
      $type: PayloadToMetadata_Rule.$type,
      match_specifier: isSet(object.method_name)
        ? { $case: "method_name", method_name: globalThis.String(object.method_name) }
        : isSet(object.service_name)
        ? { $case: "service_name", service_name: globalThis.String(object.service_name) }
        : undefined,
      field_selector: isSet(object.field_selector)
        ? PayloadToMetadata_FieldSelector.fromJSON(object.field_selector)
        : undefined,
      on_present: isSet(object.on_present) ? PayloadToMetadata_KeyValuePair.fromJSON(object.on_present) : undefined,
      on_missing: isSet(object.on_missing) ? PayloadToMetadata_KeyValuePair.fromJSON(object.on_missing) : undefined,
    };
  },

  toJSON(message: PayloadToMetadata_Rule): unknown {
    const obj: any = {};
    if (message.match_specifier?.$case === "method_name") {
      obj.method_name = message.match_specifier.method_name;
    }
    if (message.match_specifier?.$case === "service_name") {
      obj.service_name = message.match_specifier.service_name;
    }
    if (message.field_selector !== undefined) {
      obj.field_selector = PayloadToMetadata_FieldSelector.toJSON(message.field_selector);
    }
    if (message.on_present !== undefined) {
      obj.on_present = PayloadToMetadata_KeyValuePair.toJSON(message.on_present);
    }
    if (message.on_missing !== undefined) {
      obj.on_missing = PayloadToMetadata_KeyValuePair.toJSON(message.on_missing);
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<PayloadToMetadata_Rule>, I>>(base?: I): PayloadToMetadata_Rule {
    return PayloadToMetadata_Rule.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<PayloadToMetadata_Rule>, I>>(object: I): PayloadToMetadata_Rule {
    const message = createBasePayloadToMetadata_Rule();
    if (
      object.match_specifier?.$case === "method_name" &&
      object.match_specifier?.method_name !== undefined &&
      object.match_specifier?.method_name !== null
    ) {
      message.match_specifier = { $case: "method_name", method_name: object.match_specifier.method_name };
    }
    if (
      object.match_specifier?.$case === "service_name" &&
      object.match_specifier?.service_name !== undefined &&
      object.match_specifier?.service_name !== null
    ) {
      message.match_specifier = { $case: "service_name", service_name: object.match_specifier.service_name };
    }
    message.field_selector = (object.field_selector !== undefined && object.field_selector !== null)
      ? PayloadToMetadata_FieldSelector.fromPartial(object.field_selector)
      : undefined;
    message.on_present = (object.on_present !== undefined && object.on_present !== null)
      ? PayloadToMetadata_KeyValuePair.fromPartial(object.on_present)
      : undefined;
    message.on_missing = (object.on_missing !== undefined && object.on_missing !== null)
      ? PayloadToMetadata_KeyValuePair.fromPartial(object.on_missing)
      : undefined;
    return message;
  },
};

messageTypeRegistry.set(PayloadToMetadata_Rule.$type, PayloadToMetadata_Rule);

function createBasePayloadToMetadata_FieldSelector(): PayloadToMetadata_FieldSelector {
  return {
    $type:
      "envoy.extensions.filters.network.thrift_proxy.filters.payload_to_metadata.v3.PayloadToMetadata.FieldSelector",
  };
}

export const PayloadToMetadata_FieldSelector: MessageFns<
  PayloadToMetadata_FieldSelector,
  "envoy.extensions.filters.network.thrift_proxy.filters.payload_to_metadata.v3.PayloadToMetadata.FieldSelector"
> = {
  $type:
    "envoy.extensions.filters.network.thrift_proxy.filters.payload_to_metadata.v3.PayloadToMetadata.FieldSelector" as const,

  encode(message: PayloadToMetadata_FieldSelector, writer: BinaryWriter = new BinaryWriter()): BinaryWriter {
    if (message.name !== undefined && message.name !== "") {
      writer.uint32(10).string(message.name);
    }
    if (message.id !== undefined && message.id !== 0) {
      writer.uint32(16).int32(message.id);
    }
    if (message.child !== undefined) {
      PayloadToMetadata_FieldSelector.encode(message.child, writer.uint32(26).fork()).join();
    }
    return writer;
  },

  decode(input: BinaryReader | Uint8Array, length?: number): PayloadToMetadata_FieldSelector {
    const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBasePayloadToMetadata_FieldSelector();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1: {
          if (tag !== 10) {
            break;
          }

          message.name = reader.string();
          continue;
        }
        case 2: {
          if (tag !== 16) {
            break;
          }

          message.id = reader.int32();
          continue;
        }
        case 3: {
          if (tag !== 26) {
            break;
          }

          message.child = PayloadToMetadata_FieldSelector.decode(reader, reader.uint32());
          continue;
        }
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skip(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): PayloadToMetadata_FieldSelector {
    return {
      $type: PayloadToMetadata_FieldSelector.$type,
      name: isSet(object.name) ? globalThis.String(object.name) : undefined,
      id: isSet(object.id) ? globalThis.Number(object.id) : undefined,
      child: isSet(object.child) ? PayloadToMetadata_FieldSelector.fromJSON(object.child) : undefined,
    };
  },

  toJSON(message: PayloadToMetadata_FieldSelector): unknown {
    const obj: any = {};
    if (message.name !== undefined) {
      obj.name = message.name;
    }
    if (message.id !== undefined) {
      obj.id = Math.round(message.id);
    }
    if (message.child !== undefined) {
      obj.child = PayloadToMetadata_FieldSelector.toJSON(message.child);
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<PayloadToMetadata_FieldSelector>, I>>(base?: I): PayloadToMetadata_FieldSelector {
    return PayloadToMetadata_FieldSelector.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<PayloadToMetadata_FieldSelector>, I>>(
    object: I,
  ): PayloadToMetadata_FieldSelector {
    const message = createBasePayloadToMetadata_FieldSelector();
    message.name = object.name ?? undefined;
    message.id = object.id ?? undefined;
    message.child = (object.child !== undefined && object.child !== null)
      ? PayloadToMetadata_FieldSelector.fromPartial(object.child)
      : undefined;
    return message;
  },
};

messageTypeRegistry.set(PayloadToMetadata_FieldSelector.$type, PayloadToMetadata_FieldSelector);

type Builtin = Date | Function | Uint8Array | string | number | boolean | undefined;

export type DeepPartial<T> = T extends Builtin ? T
  : T extends globalThis.Array<infer U> ? globalThis.Array<DeepPartial<U>>
  : T extends ReadonlyArray<infer U> ? ReadonlyArray<DeepPartial<U>>
  : T extends { $case: string } ? { [K in keyof Omit<T, "$case">]?: DeepPartial<T[K]> } & { $case: T["$case"] }
  : T extends {} ? { [K in Exclude<keyof T, "$type">]?: DeepPartial<T[K]> }
  : Partial<T>;

type KeysOfUnion<T> = T extends T ? keyof T : never;
export type Exact<P, I extends P> = P extends Builtin ? P
  : P & { [K in keyof P]: Exact<P[K], I[K]> } & { [K in Exclude<keyof I, KeysOfUnion<P> | "$type">]: never };

function isSet(value: any): boolean {
  return value !== null && value !== undefined;
}

export interface MessageFns<T, V extends string> {
  readonly $type: V;
  encode(message: T, writer?: BinaryWriter): BinaryWriter;
  decode(input: BinaryReader | Uint8Array, length?: number): T;
  fromJSON(object: any): T;
  toJSON(message: T): unknown;
  create<I extends Exact<DeepPartial<T>, I>>(base?: I): T;
  fromPartial<I extends Exact<DeepPartial<T>, I>>(object: I): T;
}
