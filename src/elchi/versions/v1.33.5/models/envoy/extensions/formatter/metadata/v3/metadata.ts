// Code generated by protoc-gen-ts_proto. DO NOT EDIT.
// versions:
//   protoc-gen-ts_proto  v2.2.7
//   protoc               unknown
// source: envoy/extensions/formatter/metadata/v3/metadata.proto

/* eslint-disable */
import { BinaryReader, BinaryWriter } from "@bufbuild/protobuf/wire";
import { messageTypeRegistry } from "../../../../../typeRegistry";

export const protobufPackage = "envoy.extensions.formatter.metadata.v3";

export interface Metadata {
  $type: "envoy.extensions.formatter.metadata.v3.Metadata";
}

function createBaseMetadata(): Metadata {
  return { $type: "envoy.extensions.formatter.metadata.v3.Metadata" };
}

export const Metadata: MessageFns<Metadata, "envoy.extensions.formatter.metadata.v3.Metadata"> = {
  $type: "envoy.extensions.formatter.metadata.v3.Metadata" as const,

  encode(_: Metadata, writer: BinaryWriter = new BinaryWriter()): BinaryWriter {
    return writer;
  },

  decode(input: BinaryReader | Uint8Array, length?: number): Metadata {
    const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseMetadata();
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

  fromJSON(_: any): Metadata {
    return { $type: Metadata.$type };
  },

  toJSON(_: Metadata): unknown {
    const obj: any = {};
    return obj;
  },

  create<I extends Exact<DeepPartial<Metadata>, I>>(base?: I): Metadata {
    return Metadata.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<Metadata>, I>>(_: I): Metadata {
    const message = createBaseMetadata();
    return message;
  },
};

messageTypeRegistry.set(Metadata.$type, Metadata);

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
