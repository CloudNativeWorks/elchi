// Code generated by protoc-gen-ts_proto. DO NOT EDIT.
// versions:
//   protoc-gen-ts_proto  v2.2.7
//   protoc               unknown
// source: envoy/extensions/transport_sockets/starttls/v3/starttls.proto

/* eslint-disable */
import { BinaryReader, BinaryWriter } from "@bufbuild/protobuf/wire";
import { messageTypeRegistry } from "../../../../../typeRegistry";
import { RawBuffer } from "../../raw_buffer/v3/raw_buffer";
import { DownstreamTlsContext, UpstreamTlsContext } from "../../tls/v3/tls";

export const protobufPackage = "envoy.extensions.transport_sockets.starttls.v3";

/**
 * Configuration for a downstream StartTls transport socket.
 * StartTls transport socket wraps two sockets:
 * * raw_buffer socket which is used at the beginning of the session
 * * TLS socket used when a protocol negotiates a switch to encrypted traffic.
 */
export interface StartTlsConfig {
  $type: "envoy.extensions.transport_sockets.starttls.v3.StartTlsConfig";
  /** (optional) Configuration for clear-text socket used at the beginning of the session. */
  cleartext_socket_config?:
    | RawBuffer
    | undefined;
  /** Configuration for a downstream TLS socket. */
  tls_socket_config?: DownstreamTlsContext | undefined;
}

/**
 * Configuration for an upstream StartTls transport socket.
 * StartTls transport socket wraps two sockets:
 * * raw_buffer socket which is used at the beginning of the session
 * * TLS socket used when a protocol negotiates a switch to encrypted traffic.
 */
export interface UpstreamStartTlsConfig {
  $type: "envoy.extensions.transport_sockets.starttls.v3.UpstreamStartTlsConfig";
  /** (optional) Configuration for clear-text socket used at the beginning of the session. */
  cleartext_socket_config?:
    | RawBuffer
    | undefined;
  /** Configuration for an upstream TLS socket. */
  tls_socket_config?: UpstreamTlsContext | undefined;
}

function createBaseStartTlsConfig(): StartTlsConfig {
  return { $type: "envoy.extensions.transport_sockets.starttls.v3.StartTlsConfig" };
}

export const StartTlsConfig: MessageFns<
  StartTlsConfig,
  "envoy.extensions.transport_sockets.starttls.v3.StartTlsConfig"
> = {
  $type: "envoy.extensions.transport_sockets.starttls.v3.StartTlsConfig" as const,

  encode(message: StartTlsConfig, writer: BinaryWriter = new BinaryWriter()): BinaryWriter {
    if (message.cleartext_socket_config !== undefined) {
      RawBuffer.encode(message.cleartext_socket_config, writer.uint32(10).fork()).join();
    }
    if (message.tls_socket_config !== undefined) {
      DownstreamTlsContext.encode(message.tls_socket_config, writer.uint32(18).fork()).join();
    }
    return writer;
  },

  decode(input: BinaryReader | Uint8Array, length?: number): StartTlsConfig {
    const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseStartTlsConfig();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1: {
          if (tag !== 10) {
            break;
          }

          message.cleartext_socket_config = RawBuffer.decode(reader, reader.uint32());
          continue;
        }
        case 2: {
          if (tag !== 18) {
            break;
          }

          message.tls_socket_config = DownstreamTlsContext.decode(reader, reader.uint32());
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

  fromJSON(object: any): StartTlsConfig {
    return {
      $type: StartTlsConfig.$type,
      cleartext_socket_config: isSet(object.cleartext_socket_config)
        ? RawBuffer.fromJSON(object.cleartext_socket_config)
        : undefined,
      tls_socket_config: isSet(object.tls_socket_config)
        ? DownstreamTlsContext.fromJSON(object.tls_socket_config)
        : undefined,
    };
  },

  toJSON(message: StartTlsConfig): unknown {
    const obj: any = {};
    if (message.cleartext_socket_config !== undefined) {
      obj.cleartext_socket_config = RawBuffer.toJSON(message.cleartext_socket_config);
    }
    if (message.tls_socket_config !== undefined) {
      obj.tls_socket_config = DownstreamTlsContext.toJSON(message.tls_socket_config);
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<StartTlsConfig>, I>>(base?: I): StartTlsConfig {
    return StartTlsConfig.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<StartTlsConfig>, I>>(object: I): StartTlsConfig {
    const message = createBaseStartTlsConfig();
    message.cleartext_socket_config =
      (object.cleartext_socket_config !== undefined && object.cleartext_socket_config !== null)
        ? RawBuffer.fromPartial(object.cleartext_socket_config)
        : undefined;
    message.tls_socket_config = (object.tls_socket_config !== undefined && object.tls_socket_config !== null)
      ? DownstreamTlsContext.fromPartial(object.tls_socket_config)
      : undefined;
    return message;
  },
};

messageTypeRegistry.set(StartTlsConfig.$type, StartTlsConfig);

function createBaseUpstreamStartTlsConfig(): UpstreamStartTlsConfig {
  return { $type: "envoy.extensions.transport_sockets.starttls.v3.UpstreamStartTlsConfig" };
}

export const UpstreamStartTlsConfig: MessageFns<
  UpstreamStartTlsConfig,
  "envoy.extensions.transport_sockets.starttls.v3.UpstreamStartTlsConfig"
> = {
  $type: "envoy.extensions.transport_sockets.starttls.v3.UpstreamStartTlsConfig" as const,

  encode(message: UpstreamStartTlsConfig, writer: BinaryWriter = new BinaryWriter()): BinaryWriter {
    if (message.cleartext_socket_config !== undefined) {
      RawBuffer.encode(message.cleartext_socket_config, writer.uint32(10).fork()).join();
    }
    if (message.tls_socket_config !== undefined) {
      UpstreamTlsContext.encode(message.tls_socket_config, writer.uint32(18).fork()).join();
    }
    return writer;
  },

  decode(input: BinaryReader | Uint8Array, length?: number): UpstreamStartTlsConfig {
    const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseUpstreamStartTlsConfig();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1: {
          if (tag !== 10) {
            break;
          }

          message.cleartext_socket_config = RawBuffer.decode(reader, reader.uint32());
          continue;
        }
        case 2: {
          if (tag !== 18) {
            break;
          }

          message.tls_socket_config = UpstreamTlsContext.decode(reader, reader.uint32());
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

  fromJSON(object: any): UpstreamStartTlsConfig {
    return {
      $type: UpstreamStartTlsConfig.$type,
      cleartext_socket_config: isSet(object.cleartext_socket_config)
        ? RawBuffer.fromJSON(object.cleartext_socket_config)
        : undefined,
      tls_socket_config: isSet(object.tls_socket_config)
        ? UpstreamTlsContext.fromJSON(object.tls_socket_config)
        : undefined,
    };
  },

  toJSON(message: UpstreamStartTlsConfig): unknown {
    const obj: any = {};
    if (message.cleartext_socket_config !== undefined) {
      obj.cleartext_socket_config = RawBuffer.toJSON(message.cleartext_socket_config);
    }
    if (message.tls_socket_config !== undefined) {
      obj.tls_socket_config = UpstreamTlsContext.toJSON(message.tls_socket_config);
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<UpstreamStartTlsConfig>, I>>(base?: I): UpstreamStartTlsConfig {
    return UpstreamStartTlsConfig.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<UpstreamStartTlsConfig>, I>>(object: I): UpstreamStartTlsConfig {
    const message = createBaseUpstreamStartTlsConfig();
    message.cleartext_socket_config =
      (object.cleartext_socket_config !== undefined && object.cleartext_socket_config !== null)
        ? RawBuffer.fromPartial(object.cleartext_socket_config)
        : undefined;
    message.tls_socket_config = (object.tls_socket_config !== undefined && object.tls_socket_config !== null)
      ? UpstreamTlsContext.fromPartial(object.tls_socket_config)
      : undefined;
    return message;
  },
};

messageTypeRegistry.set(UpstreamStartTlsConfig.$type, UpstreamStartTlsConfig);

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
