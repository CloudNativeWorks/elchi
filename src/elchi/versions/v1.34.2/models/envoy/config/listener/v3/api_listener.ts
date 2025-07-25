// Code generated by protoc-gen-ts_proto. DO NOT EDIT.
// versions:
//   protoc-gen-ts_proto  v2.2.7
//   protoc               unknown
// source: envoy/config/listener/v3/api_listener.proto

/* eslint-disable */
import { BinaryReader, BinaryWriter } from "@bufbuild/protobuf/wire";
import { Any } from "../../../../google/protobuf/any";
import { messageTypeRegistry } from "../../../../typeRegistry";

export const protobufPackage = "envoy.config.listener.v3";

/**
 * Describes a type of API listener, which is used in non-proxy clients. The type of API
 * exposed to the non-proxy application depends on the type of API listener.
 */
export interface ApiListener {
  $type: "envoy.config.listener.v3.ApiListener";
  /**
   * The type in this field determines the type of API listener. At present, the following
   * types are supported:
   * envoy.extensions.filters.network.http_connection_manager.v3.HttpConnectionManager (HTTP)
   * envoy.extensions.filters.network.http_connection_manager.v3.EnvoyMobileHttpConnectionManager (HTTP)
   * [#next-major-version: In the v3 API, replace this Any field with a oneof containing the
   * specific config message for each type of API listener. We could not do this in v2 because
   * it would have caused circular dependencies for go protos: lds.proto depends on this file,
   * and http_connection_manager.proto depends on rds.proto, which is in the same directory as
   * lds.proto, so lds.proto cannot depend on this file.]
   */
  api_listener?: Any | undefined;
}

function createBaseApiListener(): ApiListener {
  return { $type: "envoy.config.listener.v3.ApiListener" };
}

export const ApiListener: MessageFns<ApiListener, "envoy.config.listener.v3.ApiListener"> = {
  $type: "envoy.config.listener.v3.ApiListener" as const,

  encode(message: ApiListener, writer: BinaryWriter = new BinaryWriter()): BinaryWriter {
    if (message.api_listener !== undefined) {
      Any.encode(message.api_listener, writer.uint32(10).fork()).join();
    }
    return writer;
  },

  decode(input: BinaryReader | Uint8Array, length?: number): ApiListener {
    const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseApiListener();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1: {
          if (tag !== 10) {
            break;
          }

          message.api_listener = Any.decode(reader, reader.uint32());
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

  fromJSON(object: any): ApiListener {
    return {
      $type: ApiListener.$type,
      api_listener: isSet(object.api_listener) ? Any.fromJSON(object.api_listener) : undefined,
    };
  },

  toJSON(message: ApiListener): unknown {
    const obj: any = {};
    if (message.api_listener !== undefined) {
      obj.api_listener = Any.toJSON(message.api_listener);
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<ApiListener>, I>>(base?: I): ApiListener {
    return ApiListener.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<ApiListener>, I>>(object: I): ApiListener {
    const message = createBaseApiListener();
    message.api_listener = (object.api_listener !== undefined && object.api_listener !== null)
      ? Any.fromPartial(object.api_listener)
      : undefined;
    return message;
  },
};

messageTypeRegistry.set(ApiListener.$type, ApiListener);

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
