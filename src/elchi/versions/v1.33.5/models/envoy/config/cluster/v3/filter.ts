// Code generated by protoc-gen-ts_proto. DO NOT EDIT.
// versions:
//   protoc-gen-ts_proto  v2.2.7
//   protoc               unknown
// source: envoy/config/cluster/v3/filter.proto

/* eslint-disable */
import { BinaryReader, BinaryWriter } from "@bufbuild/protobuf/wire";
import { Any } from "../../../../google/protobuf/any";
import { messageTypeRegistry } from "../../../../typeRegistry";
import { ExtensionConfigSource } from "../../core/v3/config_source";

export const protobufPackage = "envoy.config.cluster.v3";

export interface Filter {
  $type: "envoy.config.cluster.v3.Filter";
  /** The name of the filter configuration. */
  name?:
    | string
    | undefined;
  /**
   * Filter specific configuration which depends on the filter being
   * instantiated. See the supported filters for further documentation.
   * Note that Envoy's :ref:`downstream network
   * filters <config_network_filters>` are not valid upstream network filters.
   * Only one of typed_config or config_discovery can be used.
   */
  typed_config?:
    | Any
    | undefined;
  /**
   * Configuration source specifier for an extension configuration discovery
   * service. In case of a failure and without the default configuration, the
   * listener closes the connections.
   * Only one of typed_config or config_discovery can be used.
   */
  config_discovery?: ExtensionConfigSource | undefined;
}

function createBaseFilter(): Filter {
  return { $type: "envoy.config.cluster.v3.Filter" };
}

export const Filter: MessageFns<Filter, "envoy.config.cluster.v3.Filter"> = {
  $type: "envoy.config.cluster.v3.Filter" as const,

  encode(message: Filter, writer: BinaryWriter = new BinaryWriter()): BinaryWriter {
    if (message.name !== undefined && message.name !== "") {
      writer.uint32(10).string(message.name);
    }
    if (message.typed_config !== undefined) {
      Any.encode(message.typed_config, writer.uint32(18).fork()).join();
    }
    if (message.config_discovery !== undefined) {
      ExtensionConfigSource.encode(message.config_discovery, writer.uint32(26).fork()).join();
    }
    return writer;
  },

  decode(input: BinaryReader | Uint8Array, length?: number): Filter {
    const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseFilter();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1: {
          if (tag !== 10) {
            break;
          }

          message.name = reader.string();
          continue;
        }
        case 2: {
          if (tag !== 18) {
            break;
          }

          message.typed_config = Any.decode(reader, reader.uint32());
          continue;
        }
        case 3: {
          if (tag !== 26) {
            break;
          }

          message.config_discovery = ExtensionConfigSource.decode(reader, reader.uint32());
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

  fromJSON(object: any): Filter {
    return {
      $type: Filter.$type,
      name: isSet(object.name) ? globalThis.String(object.name) : undefined,
      typed_config: isSet(object.typed_config) ? Any.fromJSON(object.typed_config) : undefined,
      config_discovery: isSet(object.config_discovery)
        ? ExtensionConfigSource.fromJSON(object.config_discovery)
        : undefined,
    };
  },

  toJSON(message: Filter): unknown {
    const obj: any = {};
    if (message.name !== undefined) {
      obj.name = message.name;
    }
    if (message.typed_config !== undefined) {
      obj.typed_config = Any.toJSON(message.typed_config);
    }
    if (message.config_discovery !== undefined) {
      obj.config_discovery = ExtensionConfigSource.toJSON(message.config_discovery);
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<Filter>, I>>(base?: I): Filter {
    return Filter.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<Filter>, I>>(object: I): Filter {
    const message = createBaseFilter();
    message.name = object.name ?? undefined;
    message.typed_config = (object.typed_config !== undefined && object.typed_config !== null)
      ? Any.fromPartial(object.typed_config)
      : undefined;
    message.config_discovery = (object.config_discovery !== undefined && object.config_discovery !== null)
      ? ExtensionConfigSource.fromPartial(object.config_discovery)
      : undefined;
    return message;
  },
};

messageTypeRegistry.set(Filter.$type, Filter);

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
