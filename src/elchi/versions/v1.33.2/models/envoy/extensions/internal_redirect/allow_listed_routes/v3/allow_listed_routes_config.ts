// Code generated by protoc-gen-ts_proto. DO NOT EDIT.
// versions:
//   protoc-gen-ts_proto  v2.2.7
//   protoc               unknown
// source: envoy/extensions/internal_redirect/allow_listed_routes/v3/allow_listed_routes_config.proto

/* eslint-disable */
import { BinaryReader, BinaryWriter } from "@bufbuild/protobuf/wire";
import { messageTypeRegistry } from "../../../../../typeRegistry";

export const protobufPackage = "envoy.extensions.internal_redirect.allow_listed_routes.v3";

/**
 * An internal redirect predicate that accepts only explicitly allowed target routes.
 * [#extension: envoy.internal_redirect_predicates.allow_listed_routes]
 */
export interface AllowListedRoutesConfig {
  $type: "envoy.extensions.internal_redirect.allow_listed_routes.v3.AllowListedRoutesConfig";
  /**
   * The list of routes that's allowed as redirect target by this predicate,
   * identified by the route's :ref:`name <envoy_v3_api_field_config.route.v3.Route.route>`.
   * Empty route names are not allowed.
   */
  allowed_route_names?: string[] | undefined;
}

function createBaseAllowListedRoutesConfig(): AllowListedRoutesConfig {
  return { $type: "envoy.extensions.internal_redirect.allow_listed_routes.v3.AllowListedRoutesConfig" };
}

export const AllowListedRoutesConfig: MessageFns<
  AllowListedRoutesConfig,
  "envoy.extensions.internal_redirect.allow_listed_routes.v3.AllowListedRoutesConfig"
> = {
  $type: "envoy.extensions.internal_redirect.allow_listed_routes.v3.AllowListedRoutesConfig" as const,

  encode(message: AllowListedRoutesConfig, writer: BinaryWriter = new BinaryWriter()): BinaryWriter {
    if (message.allowed_route_names !== undefined && message.allowed_route_names.length !== 0) {
      for (const v of message.allowed_route_names) {
        writer.uint32(10).string(v!);
      }
    }
    return writer;
  },

  decode(input: BinaryReader | Uint8Array, length?: number): AllowListedRoutesConfig {
    const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseAllowListedRoutesConfig();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1: {
          if (tag !== 10) {
            break;
          }

          if (message.allowed_route_names === undefined) {
            message.allowed_route_names = [];
          }
          const el = reader.string();
          if (el !== undefined) {
            message.allowed_route_names!.push(el);
          }
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

  fromJSON(object: any): AllowListedRoutesConfig {
    return {
      $type: AllowListedRoutesConfig.$type,
      allowed_route_names: globalThis.Array.isArray(object?.allowed_route_names)
        ? object.allowed_route_names.map((e: any) => globalThis.String(e))
        : undefined,
    };
  },

  toJSON(message: AllowListedRoutesConfig): unknown {
    const obj: any = {};
    if (message.allowed_route_names?.length) {
      obj.allowed_route_names = message.allowed_route_names;
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<AllowListedRoutesConfig>, I>>(base?: I): AllowListedRoutesConfig {
    return AllowListedRoutesConfig.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<AllowListedRoutesConfig>, I>>(object: I): AllowListedRoutesConfig {
    const message = createBaseAllowListedRoutesConfig();
    message.allowed_route_names = object.allowed_route_names?.map((e) => e) || undefined;
    return message;
  },
};

messageTypeRegistry.set(AllowListedRoutesConfig.$type, AllowListedRoutesConfig);

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
