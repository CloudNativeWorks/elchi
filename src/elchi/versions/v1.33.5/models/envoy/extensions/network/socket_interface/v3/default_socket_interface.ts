// Code generated by protoc-gen-ts_proto. DO NOT EDIT.
// versions:
//   protoc-gen-ts_proto  v2.2.7
//   protoc               unknown
// source: envoy/extensions/network/socket_interface/v3/default_socket_interface.proto

/* eslint-disable */
import { BinaryReader, BinaryWriter } from "@bufbuild/protobuf/wire";
import { messageTypeRegistry } from "../../../../../typeRegistry";

export const protobufPackage = "envoy.extensions.network.socket_interface.v3";

/**
 * Configuration for default socket interface that relies on OS dependent syscall to create
 * sockets.
 */
export interface DefaultSocketInterface {
  $type: "envoy.extensions.network.socket_interface.v3.DefaultSocketInterface";
}

function createBaseDefaultSocketInterface(): DefaultSocketInterface {
  return { $type: "envoy.extensions.network.socket_interface.v3.DefaultSocketInterface" };
}

export const DefaultSocketInterface: MessageFns<
  DefaultSocketInterface,
  "envoy.extensions.network.socket_interface.v3.DefaultSocketInterface"
> = {
  $type: "envoy.extensions.network.socket_interface.v3.DefaultSocketInterface" as const,

  encode(_: DefaultSocketInterface, writer: BinaryWriter = new BinaryWriter()): BinaryWriter {
    return writer;
  },

  decode(input: BinaryReader | Uint8Array, length?: number): DefaultSocketInterface {
    const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseDefaultSocketInterface();
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

  fromJSON(_: any): DefaultSocketInterface {
    return { $type: DefaultSocketInterface.$type };
  },

  toJSON(_: DefaultSocketInterface): unknown {
    const obj: any = {};
    return obj;
  },

  create<I extends Exact<DeepPartial<DefaultSocketInterface>, I>>(base?: I): DefaultSocketInterface {
    return DefaultSocketInterface.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<DefaultSocketInterface>, I>>(_: I): DefaultSocketInterface {
    const message = createBaseDefaultSocketInterface();
    return message;
  },
};

messageTypeRegistry.set(DefaultSocketInterface.$type, DefaultSocketInterface);

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
