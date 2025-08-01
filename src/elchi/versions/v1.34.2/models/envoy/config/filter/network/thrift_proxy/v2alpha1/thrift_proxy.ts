// Code generated by protoc-gen-ts_proto. DO NOT EDIT.
// versions:
//   protoc-gen-ts_proto  v2.2.7
//   protoc               unknown
// source: envoy/config/filter/network/thrift_proxy/v2alpha1/thrift_proxy.proto

/* eslint-disable */
import { BinaryReader, BinaryWriter } from "@bufbuild/protobuf/wire";
import { Any } from "../../../../../../google/protobuf/any";
import { Struct } from "../../../../../../google/protobuf/struct";
import { messageTypeRegistry } from "../../../../../../typeRegistry";
import { RouteConfiguration } from "./route";

export const protobufPackage = "envoy.config.filter.network.thrift_proxy.v2alpha1";

/** Thrift transport types supported by Envoy. */
export enum TransportType {
  /**
   * AUTO_TRANSPORT - For downstream connections, the Thrift proxy will attempt to determine which transport to use.
   * For upstream connections, the Thrift proxy will use same transport as the downstream
   * connection.
   */
  AUTO_TRANSPORT = "AUTO_TRANSPORT",
  /** FRAMED - The Thrift proxy will use the Thrift framed transport. */
  FRAMED = "FRAMED",
  /** UNFRAMED - The Thrift proxy will use the Thrift unframed transport. */
  UNFRAMED = "UNFRAMED",
  /** HEADER - The Thrift proxy will assume the client is using the Thrift header transport. */
  HEADER = "HEADER",
}

export function transportTypeFromJSON(object: any): TransportType {
  switch (object) {
    case 0:
    case "AUTO_TRANSPORT":
      return TransportType.AUTO_TRANSPORT;
    case 1:
    case "FRAMED":
      return TransportType.FRAMED;
    case 2:
    case "UNFRAMED":
      return TransportType.UNFRAMED;
    case 3:
    case "HEADER":
      return TransportType.HEADER;
    default:
      throw new globalThis.Error("Unrecognized enum value " + object + " for enum TransportType");
  }
}

export function transportTypeToJSON(object: TransportType): string {
  switch (object) {
    case TransportType.AUTO_TRANSPORT:
      return "AUTO_TRANSPORT";
    case TransportType.FRAMED:
      return "FRAMED";
    case TransportType.UNFRAMED:
      return "UNFRAMED";
    case TransportType.HEADER:
      return "HEADER";
    default:
      throw new globalThis.Error("Unrecognized enum value " + object + " for enum TransportType");
  }
}

export function transportTypeToNumber(object: TransportType): number {
  switch (object) {
    case TransportType.AUTO_TRANSPORT:
      return 0;
    case TransportType.FRAMED:
      return 1;
    case TransportType.UNFRAMED:
      return 2;
    case TransportType.HEADER:
      return 3;
    default:
      throw new globalThis.Error("Unrecognized enum value " + object + " for enum TransportType");
  }
}

/** Thrift Protocol types supported by Envoy. */
export enum ProtocolType {
  /**
   * AUTO_PROTOCOL - For downstream connections, the Thrift proxy will attempt to determine which protocol to use.
   * Note that the older, non-strict (or lax) binary protocol is not included in automatic protocol
   * detection. For upstream connections, the Thrift proxy will use the same protocol as the
   * downstream connection.
   */
  AUTO_PROTOCOL = "AUTO_PROTOCOL",
  /** BINARY - The Thrift proxy will use the Thrift binary protocol. */
  BINARY = "BINARY",
  /** LAX_BINARY - The Thrift proxy will use Thrift non-strict binary protocol. */
  LAX_BINARY = "LAX_BINARY",
  /** COMPACT - The Thrift proxy will use the Thrift compact protocol. */
  COMPACT = "COMPACT",
  /** TWITTER - The Thrift proxy will use the Thrift "Twitter" protocol implemented by the finagle library. */
  TWITTER = "TWITTER",
}

export function protocolTypeFromJSON(object: any): ProtocolType {
  switch (object) {
    case 0:
    case "AUTO_PROTOCOL":
      return ProtocolType.AUTO_PROTOCOL;
    case 1:
    case "BINARY":
      return ProtocolType.BINARY;
    case 2:
    case "LAX_BINARY":
      return ProtocolType.LAX_BINARY;
    case 3:
    case "COMPACT":
      return ProtocolType.COMPACT;
    case 4:
    case "TWITTER":
      return ProtocolType.TWITTER;
    default:
      throw new globalThis.Error("Unrecognized enum value " + object + " for enum ProtocolType");
  }
}

export function protocolTypeToJSON(object: ProtocolType): string {
  switch (object) {
    case ProtocolType.AUTO_PROTOCOL:
      return "AUTO_PROTOCOL";
    case ProtocolType.BINARY:
      return "BINARY";
    case ProtocolType.LAX_BINARY:
      return "LAX_BINARY";
    case ProtocolType.COMPACT:
      return "COMPACT";
    case ProtocolType.TWITTER:
      return "TWITTER";
    default:
      throw new globalThis.Error("Unrecognized enum value " + object + " for enum ProtocolType");
  }
}

export function protocolTypeToNumber(object: ProtocolType): number {
  switch (object) {
    case ProtocolType.AUTO_PROTOCOL:
      return 0;
    case ProtocolType.BINARY:
      return 1;
    case ProtocolType.LAX_BINARY:
      return 2;
    case ProtocolType.COMPACT:
      return 3;
    case ProtocolType.TWITTER:
      return 4;
    default:
      throw new globalThis.Error("Unrecognized enum value " + object + " for enum ProtocolType");
  }
}

/** [#next-free-field: 6] */
export interface ThriftProxy {
  $type: "envoy.config.filter.network.thrift_proxy.v2alpha1.ThriftProxy";
  /**
   * Supplies the type of transport that the Thrift proxy should use. Defaults to
   * :ref:`AUTO_TRANSPORT<envoy_api_enum_value_config.filter.network.thrift_proxy.v2alpha1.TransportType.AUTO_TRANSPORT>`.
   */
  transport?:
    | TransportType
    | undefined;
  /**
   * Supplies the type of protocol that the Thrift proxy should use. Defaults to
   * :ref:`AUTO_PROTOCOL<envoy_api_enum_value_config.filter.network.thrift_proxy.v2alpha1.ProtocolType.AUTO_PROTOCOL>`.
   */
  protocol?:
    | ProtocolType
    | undefined;
  /** The human readable prefix to use when emitting statistics. */
  stat_prefix?:
    | string
    | undefined;
  /** The route table for the connection manager is static and is specified in this property. */
  route_config?:
    | RouteConfiguration
    | undefined;
  /**
   * A list of individual Thrift filters that make up the filter chain for requests made to the
   * Thrift proxy. Order matters as the filters are processed sequentially. For backwards
   * compatibility, if no thrift_filters are specified, a default Thrift router filter
   * (`envoy.filters.thrift.router`) is used.
   */
  thrift_filters?: ThriftFilter[] | undefined;
}

/** ThriftFilter configures a Thrift filter. */
export interface ThriftFilter {
  $type: "envoy.config.filter.network.thrift_proxy.v2alpha1.ThriftFilter";
  /**
   * The name of the filter to instantiate. The name must match a supported
   * filter. The built-in filters are:
   *
   * [#comment:TODO(zuercher): Auto generate the following list]
   * * :ref:`envoy.filters.thrift.router <config_thrift_filters_router>`
   * * :ref:`envoy.filters.thrift.rate_limit <config_thrift_filters_rate_limit>`
   */
  name?:
    | string
    | undefined;
  /**
   * Filter specific configuration which depends on the filter being instantiated. See the supported
   * filters for further documentation.
   */
  config_type?:
    | //
    { $case: "config"; config: { [key: string]: any } | undefined }
    | //
    { $case: "typed_config"; typed_config: Any }
    | undefined;
}

/**
 * ThriftProtocolOptions specifies Thrift upstream protocol options. This object is used in
 * in
 * :ref:`typed_extension_protocol_options<envoy_api_field_Cluster.typed_extension_protocol_options>`,
 * keyed by the name `envoy.filters.network.thrift_proxy`.
 */
export interface ThriftProtocolOptions {
  $type: "envoy.config.filter.network.thrift_proxy.v2alpha1.ThriftProtocolOptions";
  /**
   * Supplies the type of transport that the Thrift proxy should use for upstream connections.
   * Selecting
   * :ref:`AUTO_TRANSPORT<envoy_api_enum_value_config.filter.network.thrift_proxy.v2alpha1.TransportType.AUTO_TRANSPORT>`,
   * which is the default, causes the proxy to use the same transport as the downstream connection.
   */
  transport?:
    | TransportType
    | undefined;
  /**
   * Supplies the type of protocol that the Thrift proxy should use for upstream connections.
   * Selecting
   * :ref:`AUTO_PROTOCOL<envoy_api_enum_value_config.filter.network.thrift_proxy.v2alpha1.ProtocolType.AUTO_PROTOCOL>`,
   * which is the default, causes the proxy to use the same protocol as the downstream connection.
   */
  protocol?: ProtocolType | undefined;
}

function createBaseThriftProxy(): ThriftProxy {
  return { $type: "envoy.config.filter.network.thrift_proxy.v2alpha1.ThriftProxy" };
}

export const ThriftProxy: MessageFns<ThriftProxy, "envoy.config.filter.network.thrift_proxy.v2alpha1.ThriftProxy"> = {
  $type: "envoy.config.filter.network.thrift_proxy.v2alpha1.ThriftProxy" as const,

  encode(message: ThriftProxy, writer: BinaryWriter = new BinaryWriter()): BinaryWriter {
    if (message.transport !== undefined && message.transport !== TransportType.AUTO_TRANSPORT) {
      writer.uint32(16).int32(transportTypeToNumber(message.transport));
    }
    if (message.protocol !== undefined && message.protocol !== ProtocolType.AUTO_PROTOCOL) {
      writer.uint32(24).int32(protocolTypeToNumber(message.protocol));
    }
    if (message.stat_prefix !== undefined && message.stat_prefix !== "") {
      writer.uint32(10).string(message.stat_prefix);
    }
    if (message.route_config !== undefined) {
      RouteConfiguration.encode(message.route_config, writer.uint32(34).fork()).join();
    }
    if (message.thrift_filters !== undefined && message.thrift_filters.length !== 0) {
      for (const v of message.thrift_filters) {
        ThriftFilter.encode(v!, writer.uint32(42).fork()).join();
      }
    }
    return writer;
  },

  decode(input: BinaryReader | Uint8Array, length?: number): ThriftProxy {
    const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseThriftProxy();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 2: {
          if (tag !== 16) {
            break;
          }

          message.transport = transportTypeFromJSON(reader.int32());
          continue;
        }
        case 3: {
          if (tag !== 24) {
            break;
          }

          message.protocol = protocolTypeFromJSON(reader.int32());
          continue;
        }
        case 1: {
          if (tag !== 10) {
            break;
          }

          message.stat_prefix = reader.string();
          continue;
        }
        case 4: {
          if (tag !== 34) {
            break;
          }

          message.route_config = RouteConfiguration.decode(reader, reader.uint32());
          continue;
        }
        case 5: {
          if (tag !== 42) {
            break;
          }

          if (message.thrift_filters === undefined) {
            message.thrift_filters = [];
          }
          const el = ThriftFilter.decode(reader, reader.uint32());
          if (el !== undefined) {
            message.thrift_filters!.push(el);
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

  fromJSON(object: any): ThriftProxy {
    return {
      $type: ThriftProxy.$type,
      transport: isSet(object.transport) ? transportTypeFromJSON(object.transport) : undefined,
      protocol: isSet(object.protocol) ? protocolTypeFromJSON(object.protocol) : undefined,
      stat_prefix: isSet(object.stat_prefix) ? globalThis.String(object.stat_prefix) : undefined,
      route_config: isSet(object.route_config) ? RouteConfiguration.fromJSON(object.route_config) : undefined,
      thrift_filters: globalThis.Array.isArray(object?.thrift_filters)
        ? object.thrift_filters.map((e: any) => ThriftFilter.fromJSON(e))
        : undefined,
    };
  },

  toJSON(message: ThriftProxy): unknown {
    const obj: any = {};
    if (message.transport !== undefined) {
      obj.transport = transportTypeToJSON(message.transport);
    }
    if (message.protocol !== undefined) {
      obj.protocol = protocolTypeToJSON(message.protocol);
    }
    if (message.stat_prefix !== undefined) {
      obj.stat_prefix = message.stat_prefix;
    }
    if (message.route_config !== undefined) {
      obj.route_config = RouteConfiguration.toJSON(message.route_config);
    }
    if (message.thrift_filters?.length) {
      obj.thrift_filters = message.thrift_filters.map((e) => ThriftFilter.toJSON(e));
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<ThriftProxy>, I>>(base?: I): ThriftProxy {
    return ThriftProxy.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<ThriftProxy>, I>>(object: I): ThriftProxy {
    const message = createBaseThriftProxy();
    message.transport = object.transport ?? undefined;
    message.protocol = object.protocol ?? undefined;
    message.stat_prefix = object.stat_prefix ?? undefined;
    message.route_config = (object.route_config !== undefined && object.route_config !== null)
      ? RouteConfiguration.fromPartial(object.route_config)
      : undefined;
    message.thrift_filters = object.thrift_filters?.map((e) => ThriftFilter.fromPartial(e)) || undefined;
    return message;
  },
};

messageTypeRegistry.set(ThriftProxy.$type, ThriftProxy);

function createBaseThriftFilter(): ThriftFilter {
  return { $type: "envoy.config.filter.network.thrift_proxy.v2alpha1.ThriftFilter", config_type: undefined };
}

export const ThriftFilter: MessageFns<ThriftFilter, "envoy.config.filter.network.thrift_proxy.v2alpha1.ThriftFilter"> =
  {
    $type: "envoy.config.filter.network.thrift_proxy.v2alpha1.ThriftFilter" as const,

    encode(message: ThriftFilter, writer: BinaryWriter = new BinaryWriter()): BinaryWriter {
      if (message.name !== undefined && message.name !== "") {
        writer.uint32(10).string(message.name);
      }
      switch (message.config_type?.$case) {
        case "config":
          Struct.encode(Struct.wrap(message.config_type.config), writer.uint32(18).fork()).join();
          break;
        case "typed_config":
          Any.encode(message.config_type.typed_config, writer.uint32(26).fork()).join();
          break;
      }
      return writer;
    },

    decode(input: BinaryReader | Uint8Array, length?: number): ThriftFilter {
      const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
      let end = length === undefined ? reader.len : reader.pos + length;
      const message = createBaseThriftFilter();
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

            message.config_type = { $case: "config", config: Struct.unwrap(Struct.decode(reader, reader.uint32())) };
            continue;
          }
          case 3: {
            if (tag !== 26) {
              break;
            }

            message.config_type = { $case: "typed_config", typed_config: Any.decode(reader, reader.uint32()) };
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

    fromJSON(object: any): ThriftFilter {
      return {
        $type: ThriftFilter.$type,
        name: isSet(object.name) ? globalThis.String(object.name) : undefined,
        config_type: isSet(object.config)
          ? { $case: "config", config: object.config }
          : isSet(object.typed_config)
          ? { $case: "typed_config", typed_config: Any.fromJSON(object.typed_config) }
          : undefined,
      };
    },

    toJSON(message: ThriftFilter): unknown {
      const obj: any = {};
      if (message.name !== undefined) {
        obj.name = message.name;
      }
      if (message.config_type?.$case === "config") {
        obj.config = message.config_type.config;
      }
      if (message.config_type?.$case === "typed_config") {
        obj.typed_config = Any.toJSON(message.config_type.typed_config);
      }
      return obj;
    },

    create<I extends Exact<DeepPartial<ThriftFilter>, I>>(base?: I): ThriftFilter {
      return ThriftFilter.fromPartial(base ?? ({} as any));
    },
    fromPartial<I extends Exact<DeepPartial<ThriftFilter>, I>>(object: I): ThriftFilter {
      const message = createBaseThriftFilter();
      message.name = object.name ?? undefined;
      if (
        object.config_type?.$case === "config" &&
        object.config_type?.config !== undefined &&
        object.config_type?.config !== null
      ) {
        message.config_type = { $case: "config", config: object.config_type.config };
      }
      if (
        object.config_type?.$case === "typed_config" &&
        object.config_type?.typed_config !== undefined &&
        object.config_type?.typed_config !== null
      ) {
        message.config_type = { $case: "typed_config", typed_config: Any.fromPartial(object.config_type.typed_config) };
      }
      return message;
    },
  };

messageTypeRegistry.set(ThriftFilter.$type, ThriftFilter);

function createBaseThriftProtocolOptions(): ThriftProtocolOptions {
  return { $type: "envoy.config.filter.network.thrift_proxy.v2alpha1.ThriftProtocolOptions" };
}

export const ThriftProtocolOptions: MessageFns<
  ThriftProtocolOptions,
  "envoy.config.filter.network.thrift_proxy.v2alpha1.ThriftProtocolOptions"
> = {
  $type: "envoy.config.filter.network.thrift_proxy.v2alpha1.ThriftProtocolOptions" as const,

  encode(message: ThriftProtocolOptions, writer: BinaryWriter = new BinaryWriter()): BinaryWriter {
    if (message.transport !== undefined && message.transport !== TransportType.AUTO_TRANSPORT) {
      writer.uint32(8).int32(transportTypeToNumber(message.transport));
    }
    if (message.protocol !== undefined && message.protocol !== ProtocolType.AUTO_PROTOCOL) {
      writer.uint32(16).int32(protocolTypeToNumber(message.protocol));
    }
    return writer;
  },

  decode(input: BinaryReader | Uint8Array, length?: number): ThriftProtocolOptions {
    const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseThriftProtocolOptions();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1: {
          if (tag !== 8) {
            break;
          }

          message.transport = transportTypeFromJSON(reader.int32());
          continue;
        }
        case 2: {
          if (tag !== 16) {
            break;
          }

          message.protocol = protocolTypeFromJSON(reader.int32());
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

  fromJSON(object: any): ThriftProtocolOptions {
    return {
      $type: ThriftProtocolOptions.$type,
      transport: isSet(object.transport) ? transportTypeFromJSON(object.transport) : undefined,
      protocol: isSet(object.protocol) ? protocolTypeFromJSON(object.protocol) : undefined,
    };
  },

  toJSON(message: ThriftProtocolOptions): unknown {
    const obj: any = {};
    if (message.transport !== undefined) {
      obj.transport = transportTypeToJSON(message.transport);
    }
    if (message.protocol !== undefined) {
      obj.protocol = protocolTypeToJSON(message.protocol);
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<ThriftProtocolOptions>, I>>(base?: I): ThriftProtocolOptions {
    return ThriftProtocolOptions.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<ThriftProtocolOptions>, I>>(object: I): ThriftProtocolOptions {
    const message = createBaseThriftProtocolOptions();
    message.transport = object.transport ?? undefined;
    message.protocol = object.protocol ?? undefined;
    return message;
  },
};

messageTypeRegistry.set(ThriftProtocolOptions.$type, ThriftProtocolOptions);

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
