// Code generated by protoc-gen-ts_proto. DO NOT EDIT.
// versions:
//   protoc-gen-ts_proto  v2.2.7
//   protoc               unknown
// source: envoy/extensions/filters/http/grpc_http1_bridge/v3/config.proto

/* eslint-disable */
import { BinaryReader, BinaryWriter } from "@bufbuild/protobuf/wire";
import { messageTypeRegistry } from "../../../../../../typeRegistry";

export const protobufPackage = "envoy.extensions.filters.http.grpc_http1_bridge.v3";

/** gRPC HTTP/1.1 Bridge filter config. */
export interface Config {
  $type: "envoy.extensions.filters.http.grpc_http1_bridge.v3.Config";
  /**
   * If true then requests with content type set to ``application/x-protobuf`` will be automatically converted to gRPC.
   * This works by prepending the payload data with the gRPC header frame, as defined by the wiring format, and
   * Content-Type will be updated accordingly before sending the request.
   * For the requests that went through this upgrade the filter will also strip the frame before forwarding the
   * response to the client.
   */
  upgrade_protobuf_to_grpc?:
    | boolean
    | undefined;
  /** If true then query parameters in request's URL path will be removed. */
  ignore_query_parameters?: boolean | undefined;
}

function createBaseConfig(): Config {
  return { $type: "envoy.extensions.filters.http.grpc_http1_bridge.v3.Config" };
}

export const Config: MessageFns<Config, "envoy.extensions.filters.http.grpc_http1_bridge.v3.Config"> = {
  $type: "envoy.extensions.filters.http.grpc_http1_bridge.v3.Config" as const,

  encode(message: Config, writer: BinaryWriter = new BinaryWriter()): BinaryWriter {
    if (message.upgrade_protobuf_to_grpc !== undefined && message.upgrade_protobuf_to_grpc !== false) {
      writer.uint32(8).bool(message.upgrade_protobuf_to_grpc);
    }
    if (message.ignore_query_parameters !== undefined && message.ignore_query_parameters !== false) {
      writer.uint32(16).bool(message.ignore_query_parameters);
    }
    return writer;
  },

  decode(input: BinaryReader | Uint8Array, length?: number): Config {
    const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseConfig();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1: {
          if (tag !== 8) {
            break;
          }

          message.upgrade_protobuf_to_grpc = reader.bool();
          continue;
        }
        case 2: {
          if (tag !== 16) {
            break;
          }

          message.ignore_query_parameters = reader.bool();
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

  fromJSON(object: any): Config {
    return {
      $type: Config.$type,
      upgrade_protobuf_to_grpc: isSet(object.upgrade_protobuf_to_grpc)
        ? globalThis.Boolean(object.upgrade_protobuf_to_grpc)
        : undefined,
      ignore_query_parameters: isSet(object.ignore_query_parameters)
        ? globalThis.Boolean(object.ignore_query_parameters)
        : undefined,
    };
  },

  toJSON(message: Config): unknown {
    const obj: any = {};
    if (message.upgrade_protobuf_to_grpc !== undefined) {
      obj.upgrade_protobuf_to_grpc = message.upgrade_protobuf_to_grpc;
    }
    if (message.ignore_query_parameters !== undefined) {
      obj.ignore_query_parameters = message.ignore_query_parameters;
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<Config>, I>>(base?: I): Config {
    return Config.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<Config>, I>>(object: I): Config {
    const message = createBaseConfig();
    message.upgrade_protobuf_to_grpc = object.upgrade_protobuf_to_grpc ?? undefined;
    message.ignore_query_parameters = object.ignore_query_parameters ?? undefined;
    return message;
  },
};

messageTypeRegistry.set(Config.$type, Config);

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
