// Code generated by protoc-gen-ts_proto. DO NOT EDIT.
// versions:
//   protoc-gen-ts_proto  v2.2.7
//   protoc               unknown
// source: envoy/extensions/compression/zstd/decompressor/v3/zstd.proto

/* eslint-disable */
import { BinaryReader, BinaryWriter } from "@bufbuild/protobuf/wire";
import { UInt32Value } from "../../../../../../google/protobuf/wrappers";
import { messageTypeRegistry } from "../../../../../../typeRegistry";
import { DataSource } from "../../../../../config/core/v3/base";

export const protobufPackage = "envoy.extensions.compression.zstd.decompressor.v3";

export interface Zstd {
  $type: "envoy.extensions.compression.zstd.decompressor.v3.Zstd";
  /**
   * Dictionaries for decompression. Zstd offers dictionary compression, which greatly improves
   * efficiency on small files and messages. It is necessary to ensure that the dictionary used for
   * decompression is the same as the compression dictionary. Multiple dictionaries can be set, and the
   * dictionary will be automatically selected for decompression according to the dictionary ID in the
   * source content.
   * Please refer to `zstd manual <https://github.com/facebook/zstd/blob/dev/programs/zstd.1.md#dictionary-builder>`_
   * to train specific dictionaries for decompression.
   */
  dictionaries?:
    | DataSource[]
    | undefined;
  /** Value for decompressor's next output buffer. If not set, defaults to 4096. */
  chunk_size?: number | undefined;
}

function createBaseZstd(): Zstd {
  return { $type: "envoy.extensions.compression.zstd.decompressor.v3.Zstd" };
}

export const Zstd: MessageFns<Zstd, "envoy.extensions.compression.zstd.decompressor.v3.Zstd"> = {
  $type: "envoy.extensions.compression.zstd.decompressor.v3.Zstd" as const,

  encode(message: Zstd, writer: BinaryWriter = new BinaryWriter()): BinaryWriter {
    if (message.dictionaries !== undefined && message.dictionaries.length !== 0) {
      for (const v of message.dictionaries) {
        DataSource.encode(v!, writer.uint32(10).fork()).join();
      }
    }
    if (message.chunk_size !== undefined) {
      UInt32Value.encode({ $type: "google.protobuf.UInt32Value", value: message.chunk_size! }, writer.uint32(18).fork())
        .join();
    }
    return writer;
  },

  decode(input: BinaryReader | Uint8Array, length?: number): Zstd {
    const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseZstd();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1: {
          if (tag !== 10) {
            break;
          }

          if (message.dictionaries === undefined) {
            message.dictionaries = [];
          }
          const el = DataSource.decode(reader, reader.uint32());
          if (el !== undefined) {
            message.dictionaries!.push(el);
          }
          continue;
        }
        case 2: {
          if (tag !== 18) {
            break;
          }

          message.chunk_size = UInt32Value.decode(reader, reader.uint32()).value;
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

  fromJSON(object: any): Zstd {
    return {
      $type: Zstd.$type,
      dictionaries: globalThis.Array.isArray(object?.dictionaries)
        ? object.dictionaries.map((e: any) => DataSource.fromJSON(e))
        : undefined,
      chunk_size: isSet(object.chunk_size) ? Number(object.chunk_size) : undefined,
    };
  },

  toJSON(message: Zstd): unknown {
    const obj: any = {};
    if (message.dictionaries?.length) {
      obj.dictionaries = message.dictionaries.map((e) => DataSource.toJSON(e));
    }
    if (message.chunk_size !== undefined) {
      obj.chunk_size = message.chunk_size;
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<Zstd>, I>>(base?: I): Zstd {
    return Zstd.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<Zstd>, I>>(object: I): Zstd {
    const message = createBaseZstd();
    message.dictionaries = object.dictionaries?.map((e) => DataSource.fromPartial(e)) || undefined;
    message.chunk_size = object.chunk_size ?? undefined;
    return message;
  },
};

messageTypeRegistry.set(Zstd.$type, Zstd);

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
