// Code generated by protoc-gen-ts_proto. DO NOT EDIT.
// versions:
//   protoc-gen-ts_proto  v2.2.7
//   protoc               unknown
// source: envoy/extensions/filters/network/thrift_proxy/v3/thrift_proxy.proto

/* eslint-disable */
import { BinaryReader, BinaryWriter } from "@bufbuild/protobuf/wire";
import { Any } from "../../../../../../google/protobuf/any";
import { UInt32Value } from "../../../../../../google/protobuf/wrappers";
import { messageTypeRegistry } from "../../../../../../typeRegistry";
import { AccessLog } from "../../../../../config/accesslog/v3/accesslog";
import { ConfigSource } from "../../../../../config/core/v3/config_source";
import { RouteConfiguration } from "./route";

export const protobufPackage = "envoy.extensions.filters.network.thrift_proxy.v3";

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
  /**
   * TWITTER - The Thrift proxy will use the Thrift "Twitter" protocol implemented by the finagle library.
   *
   * @deprecated
   */
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

export interface Trds {
  $type: "envoy.extensions.filters.network.thrift_proxy.v3.Trds";
  /**
   * Configuration source specifier.
   * In case of ``api_config_source`` only aggregated ``api_type`` is supported.
   */
  config_source?:
    | ConfigSource
    | undefined;
  /**
   * The name of the route configuration. This allows to use different route
   * configurations. Tells which route configuration should be fetched from the configuration source.
   * Leave unspecified is also valid and means the unnamed route configuration.
   */
  route_config_name?: string | undefined;
}

/** [#next-free-field: 11] */
export interface ThriftProxy {
  $type: "envoy.extensions.filters.network.thrift_proxy.v3.ThriftProxy";
  /**
   * Supplies the type of transport that the Thrift proxy should use. Defaults to
   * :ref:`AUTO_TRANSPORT<envoy_v3_api_enum_value_extensions.filters.network.thrift_proxy.v3.TransportType.AUTO_TRANSPORT>`.
   */
  transport?:
    | TransportType
    | undefined;
  /**
   * Supplies the type of protocol that the Thrift proxy should use. Defaults to
   * :ref:`AUTO_PROTOCOL<envoy_v3_api_enum_value_extensions.filters.network.thrift_proxy.v3.ProtocolType.AUTO_PROTOCOL>`.
   */
  protocol?:
    | ProtocolType
    | undefined;
  /** The human readable prefix to use when emitting statistics. */
  stat_prefix?:
    | string
    | undefined;
  /**
   * The route table for the connection manager is static and is specified in this property.
   * It is invalid to define both ``route_config`` and ``trds``.
   */
  route_config?:
    | RouteConfiguration
    | undefined;
  /** Use xDS to fetch the route configuration. It is invalid to define both ``route_config`` and ``trds``. */
  trds?:
    | Trds
    | undefined;
  /**
   * A list of individual Thrift filters that make up the filter chain for requests made to the
   * Thrift proxy. Order matters as the filters are processed sequentially. For backwards
   * compatibility, if no thrift_filters are specified, a default Thrift router filter
   * (``envoy.filters.thrift.router``) is used.
   * [#extension-category: envoy.thrift_proxy.filters]
   */
  thrift_filters?:
    | ThriftFilter[]
    | undefined;
  /**
   * If set to true, Envoy will try to skip decode data after metadata in the Thrift message.
   * This mode will only work if the upstream and downstream protocols are the same and the transports
   * are Framed or Header, and the protocol is not Twitter. Otherwise Envoy will
   * fallback to decode the data.
   */
  payload_passthrough?:
    | boolean
    | undefined;
  /** Optional maximum requests for a single downstream connection. If not specified, there is no limit. */
  max_requests_per_connection?:
    | number
    | undefined;
  /**
   * Configuration for :ref:`access logs <arch_overview_access_logs>`
   * emitted by Thrift proxy.
   */
  access_log?:
    | AccessLog[]
    | undefined;
  /**
   * If set to true, Envoy will preserve the case of Thrift header keys instead of serializing them to
   * lower case as per the default behavior. Note that NUL, CR and LF characters will also be preserved
   * as mandated by the Thrift spec.
   *
   * More info: https://github.com/apache/thrift/commit/e165fa3c85d00cb984f4d9635ed60909a1266ce1.
   */
  header_keys_preserve_case?: boolean | undefined;
}

/** ThriftFilter configures a Thrift filter. */
export interface ThriftFilter {
  $type: "envoy.extensions.filters.network.thrift_proxy.v3.ThriftFilter";
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
    { $case: "typed_config"; typed_config: Any }
    | undefined;
}

/**
 * ThriftProtocolOptions specifies Thrift upstream protocol options. This object is used in
 * in
 * :ref:`typed_extension_protocol_options<envoy_v3_api_field_config.cluster.v3.Cluster.typed_extension_protocol_options>`,
 * keyed by the name ``envoy.filters.network.thrift_proxy``.
 */
export interface ThriftProtocolOptions {
  $type: "envoy.extensions.filters.network.thrift_proxy.v3.ThriftProtocolOptions";
  /**
   * Supplies the type of transport that the Thrift proxy should use for upstream connections.
   * Selecting
   * :ref:`AUTO_TRANSPORT<envoy_v3_api_enum_value_extensions.filters.network.thrift_proxy.v3.TransportType.AUTO_TRANSPORT>`,
   * which is the default, causes the proxy to use the same transport as the downstream connection.
   */
  transport?:
    | TransportType
    | undefined;
  /**
   * Supplies the type of protocol that the Thrift proxy should use for upstream connections.
   * Selecting
   * :ref:`AUTO_PROTOCOL<envoy_v3_api_enum_value_extensions.filters.network.thrift_proxy.v3.ProtocolType.AUTO_PROTOCOL>`,
   * which is the default, causes the proxy to use the same protocol as the downstream connection.
   */
  protocol?: ProtocolType | undefined;
}

function createBaseTrds(): Trds {
  return { $type: "envoy.extensions.filters.network.thrift_proxy.v3.Trds" };
}

export const Trds: MessageFns<Trds, "envoy.extensions.filters.network.thrift_proxy.v3.Trds"> = {
  $type: "envoy.extensions.filters.network.thrift_proxy.v3.Trds" as const,

  encode(message: Trds, writer: BinaryWriter = new BinaryWriter()): BinaryWriter {
    if (message.config_source !== undefined) {
      ConfigSource.encode(message.config_source, writer.uint32(10).fork()).join();
    }
    if (message.route_config_name !== undefined && message.route_config_name !== "") {
      writer.uint32(18).string(message.route_config_name);
    }
    return writer;
  },

  decode(input: BinaryReader | Uint8Array, length?: number): Trds {
    const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseTrds();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1: {
          if (tag !== 10) {
            break;
          }

          message.config_source = ConfigSource.decode(reader, reader.uint32());
          continue;
        }
        case 2: {
          if (tag !== 18) {
            break;
          }

          message.route_config_name = reader.string();
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

  fromJSON(object: any): Trds {
    return {
      $type: Trds.$type,
      config_source: isSet(object.config_source) ? ConfigSource.fromJSON(object.config_source) : undefined,
      route_config_name: isSet(object.route_config_name) ? globalThis.String(object.route_config_name) : undefined,
    };
  },

  toJSON(message: Trds): unknown {
    const obj: any = {};
    if (message.config_source !== undefined) {
      obj.config_source = ConfigSource.toJSON(message.config_source);
    }
    if (message.route_config_name !== undefined) {
      obj.route_config_name = message.route_config_name;
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<Trds>, I>>(base?: I): Trds {
    return Trds.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<Trds>, I>>(object: I): Trds {
    const message = createBaseTrds();
    message.config_source = (object.config_source !== undefined && object.config_source !== null)
      ? ConfigSource.fromPartial(object.config_source)
      : undefined;
    message.route_config_name = object.route_config_name ?? undefined;
    return message;
  },
};

messageTypeRegistry.set(Trds.$type, Trds);

function createBaseThriftProxy(): ThriftProxy {
  return { $type: "envoy.extensions.filters.network.thrift_proxy.v3.ThriftProxy" };
}

export const ThriftProxy: MessageFns<ThriftProxy, "envoy.extensions.filters.network.thrift_proxy.v3.ThriftProxy"> = {
  $type: "envoy.extensions.filters.network.thrift_proxy.v3.ThriftProxy" as const,

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
    if (message.trds !== undefined) {
      Trds.encode(message.trds, writer.uint32(66).fork()).join();
    }
    if (message.thrift_filters !== undefined && message.thrift_filters.length !== 0) {
      for (const v of message.thrift_filters) {
        ThriftFilter.encode(v!, writer.uint32(42).fork()).join();
      }
    }
    if (message.payload_passthrough !== undefined && message.payload_passthrough !== false) {
      writer.uint32(48).bool(message.payload_passthrough);
    }
    if (message.max_requests_per_connection !== undefined) {
      UInt32Value.encode(
        { $type: "google.protobuf.UInt32Value", value: message.max_requests_per_connection! },
        writer.uint32(58).fork(),
      ).join();
    }
    if (message.access_log !== undefined && message.access_log.length !== 0) {
      for (const v of message.access_log) {
        AccessLog.encode(v!, writer.uint32(74).fork()).join();
      }
    }
    if (message.header_keys_preserve_case !== undefined && message.header_keys_preserve_case !== false) {
      writer.uint32(80).bool(message.header_keys_preserve_case);
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
        case 8: {
          if (tag !== 66) {
            break;
          }

          message.trds = Trds.decode(reader, reader.uint32());
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
        case 6: {
          if (tag !== 48) {
            break;
          }

          message.payload_passthrough = reader.bool();
          continue;
        }
        case 7: {
          if (tag !== 58) {
            break;
          }

          message.max_requests_per_connection = UInt32Value.decode(reader, reader.uint32()).value;
          continue;
        }
        case 9: {
          if (tag !== 74) {
            break;
          }

          if (message.access_log === undefined) {
            message.access_log = [];
          }
          const el = AccessLog.decode(reader, reader.uint32());
          if (el !== undefined) {
            message.access_log!.push(el);
          }
          continue;
        }
        case 10: {
          if (tag !== 80) {
            break;
          }

          message.header_keys_preserve_case = reader.bool();
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
      trds: isSet(object.trds) ? Trds.fromJSON(object.trds) : undefined,
      thrift_filters: globalThis.Array.isArray(object?.thrift_filters)
        ? object.thrift_filters.map((e: any) => ThriftFilter.fromJSON(e))
        : undefined,
      payload_passthrough: isSet(object.payload_passthrough)
        ? globalThis.Boolean(object.payload_passthrough)
        : undefined,
      max_requests_per_connection: isSet(object.max_requests_per_connection)
        ? Number(object.max_requests_per_connection)
        : undefined,
      access_log: globalThis.Array.isArray(object?.access_log)
        ? object.access_log.map((e: any) => AccessLog.fromJSON(e))
        : undefined,
      header_keys_preserve_case: isSet(object.header_keys_preserve_case)
        ? globalThis.Boolean(object.header_keys_preserve_case)
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
    if (message.trds !== undefined) {
      obj.trds = Trds.toJSON(message.trds);
    }
    if (message.thrift_filters?.length) {
      obj.thrift_filters = message.thrift_filters.map((e) => ThriftFilter.toJSON(e));
    }
    if (message.payload_passthrough !== undefined) {
      obj.payload_passthrough = message.payload_passthrough;
    }
    if (message.max_requests_per_connection !== undefined) {
      obj.max_requests_per_connection = message.max_requests_per_connection;
    }
    if (message.access_log?.length) {
      obj.access_log = message.access_log.map((e) => AccessLog.toJSON(e));
    }
    if (message.header_keys_preserve_case !== undefined) {
      obj.header_keys_preserve_case = message.header_keys_preserve_case;
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
    message.trds = (object.trds !== undefined && object.trds !== null) ? Trds.fromPartial(object.trds) : undefined;
    message.thrift_filters = object.thrift_filters?.map((e) => ThriftFilter.fromPartial(e)) || undefined;
    message.payload_passthrough = object.payload_passthrough ?? undefined;
    message.max_requests_per_connection = object.max_requests_per_connection ?? undefined;
    message.access_log = object.access_log?.map((e) => AccessLog.fromPartial(e)) || undefined;
    message.header_keys_preserve_case = object.header_keys_preserve_case ?? undefined;
    return message;
  },
};

messageTypeRegistry.set(ThriftProxy.$type, ThriftProxy);

function createBaseThriftFilter(): ThriftFilter {
  return { $type: "envoy.extensions.filters.network.thrift_proxy.v3.ThriftFilter", config_type: undefined };
}

export const ThriftFilter: MessageFns<ThriftFilter, "envoy.extensions.filters.network.thrift_proxy.v3.ThriftFilter"> = {
  $type: "envoy.extensions.filters.network.thrift_proxy.v3.ThriftFilter" as const,

  encode(message: ThriftFilter, writer: BinaryWriter = new BinaryWriter()): BinaryWriter {
    if (message.name !== undefined && message.name !== "") {
      writer.uint32(10).string(message.name);
    }
    switch (message.config_type?.$case) {
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
      config_type: isSet(object.typed_config)
        ? { $case: "typed_config", typed_config: Any.fromJSON(object.typed_config) }
        : undefined,
    };
  },

  toJSON(message: ThriftFilter): unknown {
    const obj: any = {};
    if (message.name !== undefined) {
      obj.name = message.name;
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
  return { $type: "envoy.extensions.filters.network.thrift_proxy.v3.ThriftProtocolOptions" };
}

export const ThriftProtocolOptions: MessageFns<
  ThriftProtocolOptions,
  "envoy.extensions.filters.network.thrift_proxy.v3.ThriftProtocolOptions"
> = {
  $type: "envoy.extensions.filters.network.thrift_proxy.v3.ThriftProtocolOptions" as const,

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
