// Code generated by protoc-gen-ts_proto. DO NOT EDIT.
// versions:
//   protoc-gen-ts_proto  v2.2.7
//   protoc               unknown
// source: envoy/config/core/v3/udp_socket_config.proto

/* eslint-disable */
import { BinaryReader, BinaryWriter } from "@bufbuild/protobuf/wire";
import { BoolValue, UInt64Value } from "../../../../google/protobuf/wrappers";
import { messageTypeRegistry } from "../../../../typeRegistry";

export const protobufPackage = "envoy.config.core.v3";

/** Generic UDP socket configuration. */
export interface UdpSocketConfig {
  $type: "envoy.config.core.v3.UdpSocketConfig";
  /**
   * The maximum size of received UDP datagrams. Using a larger size will cause Envoy to allocate
   * more memory per socket. Received datagrams above this size will be dropped. If not set
   * defaults to 1500 bytes.
   */
  max_rx_datagram_size?:
    | number
    | undefined;
  /**
   * Configures whether Generic Receive Offload (GRO)
   * <https://en.wikipedia.org/wiki/Large_receive_offload>_ is preferred when reading from the
   * UDP socket. The default is context dependent and is documented where UdpSocketConfig is used.
   * This option affects performance but not functionality. If GRO is not supported by the operating
   * system, non-GRO receive will be used.
   */
  prefer_gro?: boolean | undefined;
}

function createBaseUdpSocketConfig(): UdpSocketConfig {
  return { $type: "envoy.config.core.v3.UdpSocketConfig" };
}

export const UdpSocketConfig: MessageFns<UdpSocketConfig, "envoy.config.core.v3.UdpSocketConfig"> = {
  $type: "envoy.config.core.v3.UdpSocketConfig" as const,

  encode(message: UdpSocketConfig, writer: BinaryWriter = new BinaryWriter()): BinaryWriter {
    if (message.max_rx_datagram_size !== undefined) {
      UInt64Value.encode(
        { $type: "google.protobuf.UInt64Value", value: message.max_rx_datagram_size! },
        writer.uint32(10).fork(),
      ).join();
    }
    if (message.prefer_gro !== undefined) {
      BoolValue.encode({ $type: "google.protobuf.BoolValue", value: message.prefer_gro! }, writer.uint32(18).fork())
        .join();
    }
    return writer;
  },

  decode(input: BinaryReader | Uint8Array, length?: number): UdpSocketConfig {
    const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseUdpSocketConfig();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1: {
          if (tag !== 10) {
            break;
          }

          message.max_rx_datagram_size = UInt64Value.decode(reader, reader.uint32()).value;
          continue;
        }
        case 2: {
          if (tag !== 18) {
            break;
          }

          message.prefer_gro = BoolValue.decode(reader, reader.uint32()).value;
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

  fromJSON(object: any): UdpSocketConfig {
    return {
      $type: UdpSocketConfig.$type,
      max_rx_datagram_size: isSet(object.max_rx_datagram_size) ? Number(object.max_rx_datagram_size) : undefined,
      prefer_gro: isSet(object.prefer_gro) ? Boolean(object.prefer_gro) : undefined,
    };
  },

  toJSON(message: UdpSocketConfig): unknown {
    const obj: any = {};
    if (message.max_rx_datagram_size !== undefined) {
      obj.max_rx_datagram_size = message.max_rx_datagram_size;
    }
    if (message.prefer_gro !== undefined) {
      obj.prefer_gro = message.prefer_gro;
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<UdpSocketConfig>, I>>(base?: I): UdpSocketConfig {
    return UdpSocketConfig.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<UdpSocketConfig>, I>>(object: I): UdpSocketConfig {
    const message = createBaseUdpSocketConfig();
    message.max_rx_datagram_size = object.max_rx_datagram_size ?? undefined;
    message.prefer_gro = object.prefer_gro ?? undefined;
    return message;
  },
};

messageTypeRegistry.set(UdpSocketConfig.$type, UdpSocketConfig);

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
