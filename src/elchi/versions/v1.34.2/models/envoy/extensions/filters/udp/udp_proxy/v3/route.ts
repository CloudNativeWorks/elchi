// Code generated by protoc-gen-ts_proto. DO NOT EDIT.
// versions:
//   protoc-gen-ts_proto  v2.2.7
//   protoc               unknown
// source: envoy/extensions/filters/udp/udp_proxy/v3/route.proto

/* eslint-disable */
import { BinaryReader, BinaryWriter } from "@bufbuild/protobuf/wire";
import { messageTypeRegistry } from "../../../../../../typeRegistry";

export const protobufPackage = "envoy.extensions.filters.udp.udp_proxy.v3";

export interface Route {
  $type: "envoy.extensions.filters.udp.udp_proxy.v3.Route";
  /** Indicates the upstream cluster to which the request should be routed. */
  cluster?: string | undefined;
}

function createBaseRoute(): Route {
  return { $type: "envoy.extensions.filters.udp.udp_proxy.v3.Route" };
}

export const Route: MessageFns<Route, "envoy.extensions.filters.udp.udp_proxy.v3.Route"> = {
  $type: "envoy.extensions.filters.udp.udp_proxy.v3.Route" as const,

  encode(message: Route, writer: BinaryWriter = new BinaryWriter()): BinaryWriter {
    if (message.cluster !== undefined && message.cluster !== "") {
      writer.uint32(10).string(message.cluster);
    }
    return writer;
  },

  decode(input: BinaryReader | Uint8Array, length?: number): Route {
    const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseRoute();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1: {
          if (tag !== 10) {
            break;
          }

          message.cluster = reader.string();
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

  fromJSON(object: any): Route {
    return { $type: Route.$type, cluster: isSet(object.cluster) ? globalThis.String(object.cluster) : undefined };
  },

  toJSON(message: Route): unknown {
    const obj: any = {};
    if (message.cluster !== undefined) {
      obj.cluster = message.cluster;
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<Route>, I>>(base?: I): Route {
    return Route.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<Route>, I>>(object: I): Route {
    const message = createBaseRoute();
    message.cluster = object.cluster ?? undefined;
    return message;
  },
};

messageTypeRegistry.set(Route.$type, Route);

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
