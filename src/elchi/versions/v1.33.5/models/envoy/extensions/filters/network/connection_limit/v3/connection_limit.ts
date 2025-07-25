// Code generated by protoc-gen-ts_proto. DO NOT EDIT.
// versions:
//   protoc-gen-ts_proto  v2.2.7
//   protoc               unknown
// source: envoy/extensions/filters/network/connection_limit/v3/connection_limit.proto

/* eslint-disable */
import { BinaryReader, BinaryWriter } from "@bufbuild/protobuf/wire";
import { Duration } from "../../../../../../google/protobuf/duration";
import { UInt64Value } from "../../../../../../google/protobuf/wrappers";
import { messageTypeRegistry } from "../../../../../../typeRegistry";
import { RuntimeFeatureFlag } from "../../../../../config/core/v3/base";

export const protobufPackage = "envoy.extensions.filters.network.connection_limit.v3";

export interface ConnectionLimit {
  $type: "envoy.extensions.filters.network.connection_limit.v3.ConnectionLimit";
  /**
   * The prefix to use when emitting :ref:`statistics
   * <config_network_filters_connection_limit_stats>`.
   */
  stat_prefix?:
    | string
    | undefined;
  /**
   * The max connections configuration to use for new incoming connections that are processed
   * by the filter's filter chain. When max_connection is reached, the incoming connection
   * will be closed after delay duration.
   */
  max_connections?:
    | number
    | undefined;
  /**
   * The delay configuration to use for rejecting the connection after some specified time duration
   * instead of immediately rejecting the connection. That way, a malicious user is not able to
   * retry as fast as possible which provides a better DoS protection for Envoy. If this is not present,
   * the connection will be closed immediately.
   */
  delay?:
    | Duration
    | undefined;
  /**
   * Runtime flag that controls whether the filter is enabled or not. If not specified, defaults
   * to enabled.
   */
  runtime_enabled?: RuntimeFeatureFlag | undefined;
}

function createBaseConnectionLimit(): ConnectionLimit {
  return { $type: "envoy.extensions.filters.network.connection_limit.v3.ConnectionLimit" };
}

export const ConnectionLimit: MessageFns<
  ConnectionLimit,
  "envoy.extensions.filters.network.connection_limit.v3.ConnectionLimit"
> = {
  $type: "envoy.extensions.filters.network.connection_limit.v3.ConnectionLimit" as const,

  encode(message: ConnectionLimit, writer: BinaryWriter = new BinaryWriter()): BinaryWriter {
    if (message.stat_prefix !== undefined && message.stat_prefix !== "") {
      writer.uint32(10).string(message.stat_prefix);
    }
    if (message.max_connections !== undefined) {
      UInt64Value.encode(
        { $type: "google.protobuf.UInt64Value", value: message.max_connections! },
        writer.uint32(18).fork(),
      ).join();
    }
    if (message.delay !== undefined) {
      Duration.encode(message.delay, writer.uint32(26).fork()).join();
    }
    if (message.runtime_enabled !== undefined) {
      RuntimeFeatureFlag.encode(message.runtime_enabled, writer.uint32(34).fork()).join();
    }
    return writer;
  },

  decode(input: BinaryReader | Uint8Array, length?: number): ConnectionLimit {
    const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseConnectionLimit();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1: {
          if (tag !== 10) {
            break;
          }

          message.stat_prefix = reader.string();
          continue;
        }
        case 2: {
          if (tag !== 18) {
            break;
          }

          message.max_connections = UInt64Value.decode(reader, reader.uint32()).value;
          continue;
        }
        case 3: {
          if (tag !== 26) {
            break;
          }

          message.delay = Duration.decode(reader, reader.uint32());
          continue;
        }
        case 4: {
          if (tag !== 34) {
            break;
          }

          message.runtime_enabled = RuntimeFeatureFlag.decode(reader, reader.uint32());
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

  fromJSON(object: any): ConnectionLimit {
    return {
      $type: ConnectionLimit.$type,
      stat_prefix: isSet(object.stat_prefix) ? globalThis.String(object.stat_prefix) : undefined,
      max_connections: isSet(object.max_connections) ? Number(object.max_connections) : undefined,
      delay: isSet(object.delay) ? Duration.fromJSON(object.delay) : undefined,
      runtime_enabled: isSet(object.runtime_enabled) ? RuntimeFeatureFlag.fromJSON(object.runtime_enabled) : undefined,
    };
  },

  toJSON(message: ConnectionLimit): unknown {
    const obj: any = {};
    if (message.stat_prefix !== undefined) {
      obj.stat_prefix = message.stat_prefix;
    }
    if (message.max_connections !== undefined) {
      obj.max_connections = message.max_connections;
    }
    if (message.delay !== undefined) {
      obj.delay = Duration.toJSON(message.delay);
    }
    if (message.runtime_enabled !== undefined) {
      obj.runtime_enabled = RuntimeFeatureFlag.toJSON(message.runtime_enabled);
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<ConnectionLimit>, I>>(base?: I): ConnectionLimit {
    return ConnectionLimit.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<ConnectionLimit>, I>>(object: I): ConnectionLimit {
    const message = createBaseConnectionLimit();
    message.stat_prefix = object.stat_prefix ?? undefined;
    message.max_connections = object.max_connections ?? undefined;
    message.delay = (object.delay !== undefined && object.delay !== null)
      ? Duration.fromPartial(object.delay)
      : undefined;
    message.runtime_enabled = (object.runtime_enabled !== undefined && object.runtime_enabled !== null)
      ? RuntimeFeatureFlag.fromPartial(object.runtime_enabled)
      : undefined;
    return message;
  },
};

messageTypeRegistry.set(ConnectionLimit.$type, ConnectionLimit);

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
