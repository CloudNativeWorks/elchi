// Code generated by protoc-gen-ts_proto. DO NOT EDIT.
// versions:
//   protoc-gen-ts_proto  v2.2.7
//   protoc               unknown
// source: envoy/config/core/v3/socket_cmsg_headers.proto

/* eslint-disable */
import { BinaryReader, BinaryWriter } from "@bufbuild/protobuf/wire";
import { UInt32Value } from "../../../../google/protobuf/wrappers";
import { messageTypeRegistry } from "../../../../typeRegistry";

export const protobufPackage = "envoy.config.core.v3";

/**
 * Configuration for socket cmsg headers.
 * See `:ref:CMSG <https://man7.org/linux/man-pages/man3/cmsg.3.html>`_ for further information.
 */
export interface SocketCmsgHeaders {
  $type: "envoy.config.core.v3.SocketCmsgHeaders";
  /** cmsg level. Default is unset. */
  level?:
    | number
    | undefined;
  /** cmsg type. Default is unset. */
  type?:
    | number
    | undefined;
  /** Expected size of cmsg value. Default is zero. */
  expected_size?: number | undefined;
}

function createBaseSocketCmsgHeaders(): SocketCmsgHeaders {
  return { $type: "envoy.config.core.v3.SocketCmsgHeaders" };
}

export const SocketCmsgHeaders: MessageFns<SocketCmsgHeaders, "envoy.config.core.v3.SocketCmsgHeaders"> = {
  $type: "envoy.config.core.v3.SocketCmsgHeaders" as const,

  encode(message: SocketCmsgHeaders, writer: BinaryWriter = new BinaryWriter()): BinaryWriter {
    if (message.level !== undefined) {
      UInt32Value.encode({ $type: "google.protobuf.UInt32Value", value: message.level! }, writer.uint32(10).fork())
        .join();
    }
    if (message.type !== undefined) {
      UInt32Value.encode({ $type: "google.protobuf.UInt32Value", value: message.type! }, writer.uint32(18).fork())
        .join();
    }
    if (message.expected_size !== undefined && message.expected_size !== 0) {
      writer.uint32(24).uint32(message.expected_size);
    }
    return writer;
  },

  decode(input: BinaryReader | Uint8Array, length?: number): SocketCmsgHeaders {
    const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseSocketCmsgHeaders();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1: {
          if (tag !== 10) {
            break;
          }

          message.level = UInt32Value.decode(reader, reader.uint32()).value;
          continue;
        }
        case 2: {
          if (tag !== 18) {
            break;
          }

          message.type = UInt32Value.decode(reader, reader.uint32()).value;
          continue;
        }
        case 3: {
          if (tag !== 24) {
            break;
          }

          message.expected_size = reader.uint32();
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

  fromJSON(object: any): SocketCmsgHeaders {
    return {
      $type: SocketCmsgHeaders.$type,
      level: isSet(object.level) ? Number(object.level) : undefined,
      type: isSet(object.type) ? Number(object.type) : undefined,
      expected_size: isSet(object.expected_size) ? globalThis.Number(object.expected_size) : undefined,
    };
  },

  toJSON(message: SocketCmsgHeaders): unknown {
    const obj: any = {};
    if (message.level !== undefined) {
      obj.level = message.level;
    }
    if (message.type !== undefined) {
      obj.type = message.type;
    }
    if (message.expected_size !== undefined) {
      obj.expected_size = Math.round(message.expected_size);
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<SocketCmsgHeaders>, I>>(base?: I): SocketCmsgHeaders {
    return SocketCmsgHeaders.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<SocketCmsgHeaders>, I>>(object: I): SocketCmsgHeaders {
    const message = createBaseSocketCmsgHeaders();
    message.level = object.level ?? undefined;
    message.type = object.type ?? undefined;
    message.expected_size = object.expected_size ?? undefined;
    return message;
  },
};

messageTypeRegistry.set(SocketCmsgHeaders.$type, SocketCmsgHeaders);

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
