// Code generated by protoc-gen-ts_proto. DO NOT EDIT.
// versions:
//   protoc-gen-ts_proto  v2.2.7
//   protoc               unknown
// source: contrib/envoy/extensions/filters/network/rocketmq_proxy/v3/rocketmq_proxy.proto

/* eslint-disable */
import { BinaryReader, BinaryWriter } from "@bufbuild/protobuf/wire";
import { Duration } from "../../../../../../../google/protobuf/duration";
import { messageTypeRegistry } from "../../../../../../../typeRegistry";
import { RouteConfiguration } from "./route";

export const protobufPackage = "envoy.extensions.filters.network.rocketmq_proxy.v3";

export interface RocketmqProxy {
  $type: "envoy.extensions.filters.network.rocketmq_proxy.v3.RocketmqProxy";
  /** The human readable prefix to use when emitting statistics. */
  stat_prefix?:
    | string
    | undefined;
  /** The route table for the connection manager is specified in this property. */
  route_config?:
    | RouteConfiguration
    | undefined;
  /** The largest duration transient object expected to live, more than 10s is recommended. */
  transient_object_life_span?:
    | Duration
    | undefined;
  /**
   * If develop_mode is enabled, this proxy plugin may work without dedicated traffic intercepting
   * facility without considering backward compatibility of exiting RocketMQ client SDK.
   */
  develop_mode?: boolean | undefined;
}

function createBaseRocketmqProxy(): RocketmqProxy {
  return { $type: "envoy.extensions.filters.network.rocketmq_proxy.v3.RocketmqProxy" };
}

export const RocketmqProxy: MessageFns<
  RocketmqProxy,
  "envoy.extensions.filters.network.rocketmq_proxy.v3.RocketmqProxy"
> = {
  $type: "envoy.extensions.filters.network.rocketmq_proxy.v3.RocketmqProxy" as const,

  encode(message: RocketmqProxy, writer: BinaryWriter = new BinaryWriter()): BinaryWriter {
    if (message.stat_prefix !== undefined && message.stat_prefix !== "") {
      writer.uint32(10).string(message.stat_prefix);
    }
    if (message.route_config !== undefined) {
      RouteConfiguration.encode(message.route_config, writer.uint32(18).fork()).join();
    }
    if (message.transient_object_life_span !== undefined) {
      Duration.encode(message.transient_object_life_span, writer.uint32(26).fork()).join();
    }
    if (message.develop_mode !== undefined && message.develop_mode !== false) {
      writer.uint32(32).bool(message.develop_mode);
    }
    return writer;
  },

  decode(input: BinaryReader | Uint8Array, length?: number): RocketmqProxy {
    const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseRocketmqProxy();
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

          message.route_config = RouteConfiguration.decode(reader, reader.uint32());
          continue;
        }
        case 3: {
          if (tag !== 26) {
            break;
          }

          message.transient_object_life_span = Duration.decode(reader, reader.uint32());
          continue;
        }
        case 4: {
          if (tag !== 32) {
            break;
          }

          message.develop_mode = reader.bool();
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

  fromJSON(object: any): RocketmqProxy {
    return {
      $type: RocketmqProxy.$type,
      stat_prefix: isSet(object.stat_prefix) ? globalThis.String(object.stat_prefix) : undefined,
      route_config: isSet(object.route_config) ? RouteConfiguration.fromJSON(object.route_config) : undefined,
      transient_object_life_span: isSet(object.transient_object_life_span)
        ? Duration.fromJSON(object.transient_object_life_span)
        : undefined,
      develop_mode: isSet(object.develop_mode) ? globalThis.Boolean(object.develop_mode) : undefined,
    };
  },

  toJSON(message: RocketmqProxy): unknown {
    const obj: any = {};
    if (message.stat_prefix !== undefined) {
      obj.stat_prefix = message.stat_prefix;
    }
    if (message.route_config !== undefined) {
      obj.route_config = RouteConfiguration.toJSON(message.route_config);
    }
    if (message.transient_object_life_span !== undefined) {
      obj.transient_object_life_span = Duration.toJSON(message.transient_object_life_span);
    }
    if (message.develop_mode !== undefined) {
      obj.develop_mode = message.develop_mode;
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<RocketmqProxy>, I>>(base?: I): RocketmqProxy {
    return RocketmqProxy.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<RocketmqProxy>, I>>(object: I): RocketmqProxy {
    const message = createBaseRocketmqProxy();
    message.stat_prefix = object.stat_prefix ?? undefined;
    message.route_config = (object.route_config !== undefined && object.route_config !== null)
      ? RouteConfiguration.fromPartial(object.route_config)
      : undefined;
    message.transient_object_life_span =
      (object.transient_object_life_span !== undefined && object.transient_object_life_span !== null)
        ? Duration.fromPartial(object.transient_object_life_span)
        : undefined;
    message.develop_mode = object.develop_mode ?? undefined;
    return message;
  },
};

messageTypeRegistry.set(RocketmqProxy.$type, RocketmqProxy);

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
