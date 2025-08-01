// Code generated by protoc-gen-ts_proto. DO NOT EDIT.
// versions:
//   protoc-gen-ts_proto  v2.2.7
//   protoc               unknown
// source: envoy/extensions/quic/connection_id_generator/v3/envoy_deterministic_connection_id_generator.proto

/* eslint-disable */
import { BinaryReader, BinaryWriter } from "@bufbuild/protobuf/wire";
import { messageTypeRegistry } from "../../../../../typeRegistry";

export const protobufPackage = "envoy.extensions.quic.connection_id_generator.v3";

/** Configuration for a connection ID generator implementation which issues predictable CIDs with stable first 4 bytes. */
export interface DeterministicConnectionIdGeneratorConfig {
  $type: "envoy.extensions.quic.connection_id_generator.v3.DeterministicConnectionIdGeneratorConfig";
}

function createBaseDeterministicConnectionIdGeneratorConfig(): DeterministicConnectionIdGeneratorConfig {
  return { $type: "envoy.extensions.quic.connection_id_generator.v3.DeterministicConnectionIdGeneratorConfig" };
}

export const DeterministicConnectionIdGeneratorConfig: MessageFns<
  DeterministicConnectionIdGeneratorConfig,
  "envoy.extensions.quic.connection_id_generator.v3.DeterministicConnectionIdGeneratorConfig"
> = {
  $type: "envoy.extensions.quic.connection_id_generator.v3.DeterministicConnectionIdGeneratorConfig" as const,

  encode(_: DeterministicConnectionIdGeneratorConfig, writer: BinaryWriter = new BinaryWriter()): BinaryWriter {
    return writer;
  },

  decode(input: BinaryReader | Uint8Array, length?: number): DeterministicConnectionIdGeneratorConfig {
    const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseDeterministicConnectionIdGeneratorConfig();
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

  fromJSON(_: any): DeterministicConnectionIdGeneratorConfig {
    return { $type: DeterministicConnectionIdGeneratorConfig.$type };
  },

  toJSON(_: DeterministicConnectionIdGeneratorConfig): unknown {
    const obj: any = {};
    return obj;
  },

  create<I extends Exact<DeepPartial<DeterministicConnectionIdGeneratorConfig>, I>>(
    base?: I,
  ): DeterministicConnectionIdGeneratorConfig {
    return DeterministicConnectionIdGeneratorConfig.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<DeterministicConnectionIdGeneratorConfig>, I>>(
    _: I,
  ): DeterministicConnectionIdGeneratorConfig {
    const message = createBaseDeterministicConnectionIdGeneratorConfig();
    return message;
  },
};

messageTypeRegistry.set(DeterministicConnectionIdGeneratorConfig.$type, DeterministicConnectionIdGeneratorConfig);

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
