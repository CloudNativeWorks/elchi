// Code generated by protoc-gen-ts_proto. DO NOT EDIT.
// versions:
//   protoc-gen-ts_proto  v2.2.7
//   protoc               unknown
// source: envoy/config/upstream/local_address_selector/v3/default_local_address_selector.proto

/* eslint-disable */
import { BinaryReader, BinaryWriter } from "@bufbuild/protobuf/wire";
import { messageTypeRegistry } from "../../../../../typeRegistry";

export const protobufPackage = "envoy.config.upstream.local_address_selector.v3";

/**
 * Default implementation of a local address selector. This implementation is
 * used if :ref:`local_address_selector
 * <envoy_v3_api_field_config.core.v3.BindConfig.local_address_selector>` is not
 * specified.
 * This implementation supports the specification of only one address in
 * :ref:`extra_source_addresses
 * <envoy_v3_api_field_config.core.v3.BindConfig.extra_source_addresses>` which
 * is appended to the address specified in the
 * :ref:`source_address <envoy_v3_api_field_config.core.v3.BindConfig.source_address>`
 * field. The extra address should have a different IP version than the address in the
 * ``source_address`` field. The address which has the same IP
 * version with the target host's address IP version will be used as bind address.
 * If there is no same IP version address found, the address in the ``source_address`` field will
 * be returned.
 */
export interface DefaultLocalAddressSelector {
  $type: "envoy.config.upstream.local_address_selector.v3.DefaultLocalAddressSelector";
}

function createBaseDefaultLocalAddressSelector(): DefaultLocalAddressSelector {
  return { $type: "envoy.config.upstream.local_address_selector.v3.DefaultLocalAddressSelector" };
}

export const DefaultLocalAddressSelector: MessageFns<
  DefaultLocalAddressSelector,
  "envoy.config.upstream.local_address_selector.v3.DefaultLocalAddressSelector"
> = {
  $type: "envoy.config.upstream.local_address_selector.v3.DefaultLocalAddressSelector" as const,

  encode(_: DefaultLocalAddressSelector, writer: BinaryWriter = new BinaryWriter()): BinaryWriter {
    return writer;
  },

  decode(input: BinaryReader | Uint8Array, length?: number): DefaultLocalAddressSelector {
    const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseDefaultLocalAddressSelector();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skip(tag & 7);
    }
    return message;
  },

  fromJSON(_: any): DefaultLocalAddressSelector {
    return { $type: DefaultLocalAddressSelector.$type };
  },

  toJSON(_: DefaultLocalAddressSelector): unknown {
    const obj: any = {};
    return obj;
  },

  create<I extends Exact<DeepPartial<DefaultLocalAddressSelector>, I>>(base?: I): DefaultLocalAddressSelector {
    return DefaultLocalAddressSelector.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<DefaultLocalAddressSelector>, I>>(_: I): DefaultLocalAddressSelector {
    const message = createBaseDefaultLocalAddressSelector();
    return message;
  },
};

messageTypeRegistry.set(DefaultLocalAddressSelector.$type, DefaultLocalAddressSelector);

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
