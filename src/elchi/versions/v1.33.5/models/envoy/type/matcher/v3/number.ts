// Code generated by protoc-gen-ts_proto. DO NOT EDIT.
// versions:
//   protoc-gen-ts_proto  v2.2.7
//   protoc               unknown
// source: envoy/type/matcher/v3/number.proto

/* eslint-disable */
import { BinaryReader, BinaryWriter } from "@bufbuild/protobuf/wire";
import { messageTypeRegistry } from "../../../../typeRegistry";
import { DoubleRange } from "../../v3/range";

export const protobufPackage = "envoy.type.matcher.v3";

/** Specifies the way to match a double value. */
export interface DoubleMatcher {
  $type: "envoy.type.matcher.v3.DoubleMatcher";
  match_pattern?:
    | //
    /**
     * If specified, the input double value must be in the range specified here.
     * Note: The range is using half-open interval semantics [start, end).
     */
    { $case: "range"; range: DoubleRange }
    | //
    /** If specified, the input double value must be equal to the value specified here. */
    { $case: "exact"; exact: number }
    | undefined;
}

function createBaseDoubleMatcher(): DoubleMatcher {
  return { $type: "envoy.type.matcher.v3.DoubleMatcher", match_pattern: undefined };
}

export const DoubleMatcher: MessageFns<DoubleMatcher, "envoy.type.matcher.v3.DoubleMatcher"> = {
  $type: "envoy.type.matcher.v3.DoubleMatcher" as const,

  encode(message: DoubleMatcher, writer: BinaryWriter = new BinaryWriter()): BinaryWriter {
    switch (message.match_pattern?.$case) {
      case "range":
        DoubleRange.encode(message.match_pattern.range, writer.uint32(10).fork()).join();
        break;
      case "exact":
        writer.uint32(17).double(message.match_pattern.exact);
        break;
    }
    return writer;
  },

  decode(input: BinaryReader | Uint8Array, length?: number): DoubleMatcher {
    const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseDoubleMatcher();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1: {
          if (tag !== 10) {
            break;
          }

          message.match_pattern = { $case: "range", range: DoubleRange.decode(reader, reader.uint32()) };
          continue;
        }
        case 2: {
          if (tag !== 17) {
            break;
          }

          message.match_pattern = { $case: "exact", exact: reader.double() };
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

  fromJSON(object: any): DoubleMatcher {
    return {
      $type: DoubleMatcher.$type,
      match_pattern: isSet(object.range)
        ? { $case: "range", range: DoubleRange.fromJSON(object.range) }
        : isSet(object.exact)
        ? { $case: "exact", exact: globalThis.Number(object.exact) }
        : undefined,
    };
  },

  toJSON(message: DoubleMatcher): unknown {
    const obj: any = {};
    if (message.match_pattern?.$case === "range") {
      obj.range = DoubleRange.toJSON(message.match_pattern.range);
    }
    if (message.match_pattern?.$case === "exact") {
      obj.exact = message.match_pattern.exact;
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<DoubleMatcher>, I>>(base?: I): DoubleMatcher {
    return DoubleMatcher.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<DoubleMatcher>, I>>(object: I): DoubleMatcher {
    const message = createBaseDoubleMatcher();
    if (
      object.match_pattern?.$case === "range" &&
      object.match_pattern?.range !== undefined &&
      object.match_pattern?.range !== null
    ) {
      message.match_pattern = { $case: "range", range: DoubleRange.fromPartial(object.match_pattern.range) };
    }
    if (
      object.match_pattern?.$case === "exact" &&
      object.match_pattern?.exact !== undefined &&
      object.match_pattern?.exact !== null
    ) {
      message.match_pattern = { $case: "exact", exact: object.match_pattern.exact };
    }
    return message;
  },
};

messageTypeRegistry.set(DoubleMatcher.$type, DoubleMatcher);

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
