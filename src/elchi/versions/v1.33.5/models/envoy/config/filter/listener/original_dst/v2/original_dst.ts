// Code generated by protoc-gen-ts_proto. DO NOT EDIT.
// versions:
//   protoc-gen-ts_proto  v2.2.7
//   protoc               unknown
// source: envoy/config/filter/listener/original_dst/v2/original_dst.proto

/* eslint-disable */
import { BinaryReader, BinaryWriter } from "@bufbuild/protobuf/wire";
import { messageTypeRegistry } from "../../../../../../typeRegistry";

export const protobufPackage = "envoy.config.filter.listener.original_dst.v2";

export interface OriginalDst {
  $type: "envoy.config.filter.listener.original_dst.v2.OriginalDst";
}

function createBaseOriginalDst(): OriginalDst {
  return { $type: "envoy.config.filter.listener.original_dst.v2.OriginalDst" };
}

export const OriginalDst: MessageFns<OriginalDst, "envoy.config.filter.listener.original_dst.v2.OriginalDst"> = {
  $type: "envoy.config.filter.listener.original_dst.v2.OriginalDst" as const,

  encode(_: OriginalDst, writer: BinaryWriter = new BinaryWriter()): BinaryWriter {
    return writer;
  },

  decode(input: BinaryReader | Uint8Array, length?: number): OriginalDst {
    const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseOriginalDst();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skip(tag & 7);
    }
    return message;
  },

  fromJSON(_: any): OriginalDst {
    return { $type: OriginalDst.$type };
  },

  toJSON(_: OriginalDst): unknown {
    const obj: any = {};
    return obj;
  },

  create<I extends Exact<DeepPartial<OriginalDst>, I>>(base?: I): OriginalDst {
    return OriginalDst.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<OriginalDst>, I>>(_: I): OriginalDst {
    const message = createBaseOriginalDst();
    return message;
  },
};

messageTypeRegistry.set(OriginalDst.$type, OriginalDst);

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

export interface MessageFns<T, V extends string> {
  readonly $type: V;
  encode(message: T, writer?: BinaryWriter): BinaryWriter;
  decode(input: BinaryReader | Uint8Array, length?: number): T;
  fromJSON(object: any): T;
  toJSON(message: T): unknown;
  create<I extends Exact<DeepPartial<T>, I>>(base?: I): T;
  fromPartial<I extends Exact<DeepPartial<T>, I>>(object: I): T;
}
