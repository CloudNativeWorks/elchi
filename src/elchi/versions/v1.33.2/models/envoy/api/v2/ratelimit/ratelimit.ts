// Code generated by protoc-gen-ts_proto. DO NOT EDIT.
// versions:
//   protoc-gen-ts_proto  v2.2.7
//   protoc               unknown
// source: envoy/api/v2/ratelimit/ratelimit.proto

/* eslint-disable */
import { BinaryReader, BinaryWriter } from "@bufbuild/protobuf/wire";
import { messageTypeRegistry } from "../../../../typeRegistry";

export const protobufPackage = "envoy.api.v2.ratelimit";

/**
 * A RateLimitDescriptor is a list of hierarchical entries that are used by the service to
 * determine the final rate limit key and overall allowed limit. Here are some examples of how
 * they might be used for the domain "envoy".
 *
 * .. code-block:: cpp
 *
 *   ["authenticated": "false"], ["remote_address": "10.0.0.1"]
 *
 * What it does: Limits all unauthenticated traffic for the IP address 10.0.0.1. The
 * configuration supplies a default limit for the *remote_address* key. If there is a desire to
 * raise the limit for 10.0.0.1 or block it entirely it can be specified directly in the
 * configuration.
 *
 * .. code-block:: cpp
 *
 *   ["authenticated": "false"], ["path": "/foo/bar"]
 *
 * What it does: Limits all unauthenticated traffic globally for a specific path (or prefix if
 * configured that way in the service).
 *
 * .. code-block:: cpp
 *
 *   ["authenticated": "false"], ["path": "/foo/bar"], ["remote_address": "10.0.0.1"]
 *
 * What it does: Limits unauthenticated traffic to a specific path for a specific IP address.
 * Like (1) we can raise/block specific IP addresses if we want with an override configuration.
 *
 * .. code-block:: cpp
 *
 *   ["authenticated": "true"], ["client_id": "foo"]
 *
 * What it does: Limits all traffic for an authenticated client "foo"
 *
 * .. code-block:: cpp
 *
 *   ["authenticated": "true"], ["client_id": "foo"], ["path": "/foo/bar"]
 *
 * What it does: Limits traffic to a specific path for an authenticated client "foo"
 *
 * The idea behind the API is that (1)/(2)/(3) and (4)/(5) can be sent in 1 request if desired.
 * This enables building complex application scenarios with a generic backend.
 */
export interface RateLimitDescriptor {
  $type: "envoy.api.v2.ratelimit.RateLimitDescriptor";
  /** Descriptor entries. */
  entries?: RateLimitDescriptor_Entry[] | undefined;
}

export interface RateLimitDescriptor_Entry {
  $type: "envoy.api.v2.ratelimit.RateLimitDescriptor.Entry";
  /** Descriptor key. */
  key?:
    | string
    | undefined;
  /** Descriptor value. */
  value?: string | undefined;
}

function createBaseRateLimitDescriptor(): RateLimitDescriptor {
  return { $type: "envoy.api.v2.ratelimit.RateLimitDescriptor" };
}

export const RateLimitDescriptor: MessageFns<RateLimitDescriptor, "envoy.api.v2.ratelimit.RateLimitDescriptor"> = {
  $type: "envoy.api.v2.ratelimit.RateLimitDescriptor" as const,

  encode(message: RateLimitDescriptor, writer: BinaryWriter = new BinaryWriter()): BinaryWriter {
    if (message.entries !== undefined && message.entries.length !== 0) {
      for (const v of message.entries) {
        RateLimitDescriptor_Entry.encode(v!, writer.uint32(10).fork()).join();
      }
    }
    return writer;
  },

  decode(input: BinaryReader | Uint8Array, length?: number): RateLimitDescriptor {
    const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseRateLimitDescriptor();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1: {
          if (tag !== 10) {
            break;
          }

          if (message.entries === undefined) {
            message.entries = [];
          }
          const el = RateLimitDescriptor_Entry.decode(reader, reader.uint32());
          if (el !== undefined) {
            message.entries!.push(el);
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

  fromJSON(object: any): RateLimitDescriptor {
    return {
      $type: RateLimitDescriptor.$type,
      entries: globalThis.Array.isArray(object?.entries)
        ? object.entries.map((e: any) => RateLimitDescriptor_Entry.fromJSON(e))
        : undefined,
    };
  },

  toJSON(message: RateLimitDescriptor): unknown {
    const obj: any = {};
    if (message.entries?.length) {
      obj.entries = message.entries.map((e) => RateLimitDescriptor_Entry.toJSON(e));
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<RateLimitDescriptor>, I>>(base?: I): RateLimitDescriptor {
    return RateLimitDescriptor.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<RateLimitDescriptor>, I>>(object: I): RateLimitDescriptor {
    const message = createBaseRateLimitDescriptor();
    message.entries = object.entries?.map((e) => RateLimitDescriptor_Entry.fromPartial(e)) || undefined;
    return message;
  },
};

messageTypeRegistry.set(RateLimitDescriptor.$type, RateLimitDescriptor);

function createBaseRateLimitDescriptor_Entry(): RateLimitDescriptor_Entry {
  return { $type: "envoy.api.v2.ratelimit.RateLimitDescriptor.Entry" };
}

export const RateLimitDescriptor_Entry: MessageFns<
  RateLimitDescriptor_Entry,
  "envoy.api.v2.ratelimit.RateLimitDescriptor.Entry"
> = {
  $type: "envoy.api.v2.ratelimit.RateLimitDescriptor.Entry" as const,

  encode(message: RateLimitDescriptor_Entry, writer: BinaryWriter = new BinaryWriter()): BinaryWriter {
    if (message.key !== undefined && message.key !== "") {
      writer.uint32(10).string(message.key);
    }
    if (message.value !== undefined && message.value !== "") {
      writer.uint32(18).string(message.value);
    }
    return writer;
  },

  decode(input: BinaryReader | Uint8Array, length?: number): RateLimitDescriptor_Entry {
    const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseRateLimitDescriptor_Entry();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1: {
          if (tag !== 10) {
            break;
          }

          message.key = reader.string();
          continue;
        }
        case 2: {
          if (tag !== 18) {
            break;
          }

          message.value = reader.string();
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

  fromJSON(object: any): RateLimitDescriptor_Entry {
    return {
      $type: RateLimitDescriptor_Entry.$type,
      key: isSet(object.key) ? globalThis.String(object.key) : undefined,
      value: isSet(object.value) ? globalThis.String(object.value) : undefined,
    };
  },

  toJSON(message: RateLimitDescriptor_Entry): unknown {
    const obj: any = {};
    if (message.key !== undefined) {
      obj.key = message.key;
    }
    if (message.value !== undefined) {
      obj.value = message.value;
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<RateLimitDescriptor_Entry>, I>>(base?: I): RateLimitDescriptor_Entry {
    return RateLimitDescriptor_Entry.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<RateLimitDescriptor_Entry>, I>>(object: I): RateLimitDescriptor_Entry {
    const message = createBaseRateLimitDescriptor_Entry();
    message.key = object.key ?? undefined;
    message.value = object.value ?? undefined;
    return message;
  },
};

messageTypeRegistry.set(RateLimitDescriptor_Entry.$type, RateLimitDescriptor_Entry);

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
