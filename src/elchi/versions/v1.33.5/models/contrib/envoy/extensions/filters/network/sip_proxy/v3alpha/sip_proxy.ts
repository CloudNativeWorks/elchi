// Code generated by protoc-gen-ts_proto. DO NOT EDIT.
// versions:
//   protoc-gen-ts_proto  v2.2.7
//   protoc               unknown
// source: contrib/envoy/extensions/filters/network/sip_proxy/v3alpha/sip_proxy.proto

/* eslint-disable */
import { BinaryReader, BinaryWriter } from "@bufbuild/protobuf/wire";
import { Any } from "../../../../../../../google/protobuf/any";
import { Duration } from "../../../../../../../google/protobuf/duration";
import { messageTypeRegistry } from "../../../../../../../typeRegistry";
import { TraServiceConfig } from "../tra/v3alpha/tra";
import { RouteConfiguration } from "./route";

export const protobufPackage = "envoy.extensions.filters.network.sip_proxy.v3alpha";

export interface SipProxy {
  $type: "envoy.extensions.filters.network.sip_proxy.v3alpha.SipProxy";
  /** The human readable prefix to use when emitting statistics. */
  stat_prefix?:
    | string
    | undefined;
  /** The route table for the connection manager is static and is specified in this property. */
  route_config?:
    | RouteConfiguration
    | undefined;
  /**
   * A list of individual Sip filters that make up the filter chain for requests made to the
   * Sip proxy. Order matters as the filters are processed sequentially. For backwards
   * compatibility, if no sip_filters are specified, a default Sip router filter
   * (``envoy.filters.sip.router``) is used.
   * [#extension-category: envoy.sip_proxy.filters]
   */
  sip_filters?: SipFilter[] | undefined;
  settings?: SipProxy_SipSettings | undefined;
}

export interface SipProxy_SipSettings {
  $type: "envoy.extensions.filters.network.sip_proxy.v3alpha.SipProxy.SipSettings";
  /**
   * transaction timeout timer [Timer B] unit is milliseconds, default value 64*T1.
   *
   * Session Initiation Protocol (SIP) timer summary
   *
   * +---------+-------------------------+----------+------------------------------------------------------------------------------+
   * | Timer   | Default value           | Section  | Meaning                                                                      |
   * +=========+=========================+==========+==============================================================================+
   * | T1      | 500 ms                  | 17.1.1.1 | Round-trip time (RTT) estimate                                               |
   * +---------+-------------------------+----------+------------------------------------------------------------------------------+
   * | T2      | 4 sec                   | 17.1.2.2 | Maximum re-transmission interval for non-INVITE requests and INVITE responses|
   * +---------+-------------------------+----------+------------------------------------------------------------------------------+
   * | T4      | 5 sec                   | 17.1.2.2 | Maximum duration that a message can remain in the network                    |
   * +---------+-------------------------+----------+------------------------------------------------------------------------------+
   * | Timer A | initially T1            | 17.1.1.2 | INVITE request re-transmission interval, for UDP only                        |
   * +---------+-------------------------+----------+------------------------------------------------------------------------------+
   * | Timer B | 64*T1                   | 17.1.1.2 | INVITE transaction timeout timer                                             |
   * +---------+-------------------------+----------+------------------------------------------------------------------------------+
   * | Timer D | > 32 sec. for UDP       | 17.1.1.2 | Wait time for response re-transmissions                                      |
   * |         | 0 sec. for TCP and SCTP |          |                                                                              |
   * +---------+-------------------------+----------+------------------------------------------------------------------------------+
   * | Timer E | initially T1            | 17.1.2.2 | Non-INVITE request re-transmission interval, UDP only                        |
   * +---------+-------------------------+----------+------------------------------------------------------------------------------+
   * | Timer F | 64*T1                   | 17.1.2.2 | Non-INVITE transaction timeout timer                                         |
   * +---------+-------------------------+----------+------------------------------------------------------------------------------+
   * | Timer G | initially T1            | 17.2.1   | INVITE response re-transmission interval                                     |
   * +---------+-------------------------+----------+------------------------------------------------------------------------------+
   * | Timer H | 64*T1                   | 17.2.1   | Wait time for ACK receipt                                                    |
   * +---------+-------------------------+----------+------------------------------------------------------------------------------+
   * | Timer I | T4 for UDP              | 17.2.1   | Wait time for ACK re-transmissions                                           |
   * |         | 0 sec. for TCP and SCTP |          |                                                                              |
   * +---------+-------------------------+----------+------------------------------------------------------------------------------+
   * | Timer J | 64*T1 for UDP           | 17.2.2   | Wait time for re-transmissions of non-INVITE requests                        |
   * |         | 0 sec. for TCP and SCTP |          |                                                                              |
   * +---------+-------------------------+----------+------------------------------------------------------------------------------+
   * | Timer K | T4 for UDP              | 17.1.2.2 | Wait time for response re-transmissions                                      |
   * |         | 0 sec. for TCP and SCTP |          |                                                                              |
   * +---------+-------------------------+----------+------------------------------------------------------------------------------+
   */
  transaction_timeout?:
    | Duration
    | undefined;
  /** The service to match for ep insert */
  local_services?: LocalService[] | undefined;
  tra_service_config?:
    | TraServiceConfig
    | undefined;
  /**
   * Whether via header is operated, including add via for request and pop via for response
   * False: sip service proxy
   * True:  sip load balancer
   */
  operate_via?: boolean | undefined;
}

/** SipFilter configures a Sip filter. */
export interface SipFilter {
  $type: "envoy.extensions.filters.network.sip_proxy.v3alpha.SipFilter";
  /**
   * The name of the filter to instantiate. The name must match a supported
   * filter. The built-in filters are:
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
 * SipProtocolOptions specifies Sip upstream protocol options. This object is used in
 * :ref:`typed_extension_protocol_options<envoy_v3_api_field_config.cluster.v3.Cluster.typed_extension_protocol_options>`,
 * keyed by the name ``envoy.filters.network.sip_proxy``.
 */
export interface SipProtocolOptions {
  $type: "envoy.extensions.filters.network.sip_proxy.v3alpha.SipProtocolOptions";
  /** All sip messages in one dialog should go to the same endpoint. */
  session_affinity?:
    | boolean
    | undefined;
  /** The Register with Authorization header should go to the same endpoint which send out the 401 Unauthorized. */
  registration_affinity?:
    | boolean
    | undefined;
  /** Customized affinity */
  customized_affinity?: CustomizedAffinity | undefined;
}

/** For affinity */
export interface CustomizedAffinity {
  $type: "envoy.extensions.filters.network.sip_proxy.v3alpha.CustomizedAffinity";
  /** Affinity rules to conclude the upstream endpoint */
  entries?:
    | CustomizedAffinityEntry[]
    | undefined;
  /** Configures whether load balance should be stopped or continued after affinity handling. */
  stop_load_balance?: boolean | undefined;
}

/** [#next-free-field: 6] */
export interface CustomizedAffinityEntry {
  $type: "envoy.extensions.filters.network.sip_proxy.v3alpha.CustomizedAffinityEntry";
  /** The header name to match, e.g. "From", if not specified, default is "Route" */
  header?:
    | string
    | undefined;
  /** Affinity key for TRA query/subscribe, e.g. "lskpmc", if key_name is "text" means use the header content as key. */
  key_name?:
    | string
    | undefined;
  /** Whether subscribe to TRA is required */
  subscribe?:
    | boolean
    | undefined;
  /** Whether query to TRA is required */
  query?:
    | boolean
    | undefined;
  /** Local cache */
  cache?: Cache | undefined;
}

export interface Cache {
  $type: "envoy.extensions.filters.network.sip_proxy.v3alpha.Cache";
  /** Affinity local cache item max number */
  max_cache_item?:
    | number
    | undefined;
  /** Whether query result can be added to local cache */
  add_query_to_cache?: boolean | undefined;
}

/** Local Service */
export interface LocalService {
  $type: "envoy.extensions.filters.network.sip_proxy.v3alpha.LocalService";
  /** The domain need to matched */
  domain?:
    | string
    | undefined;
  /** The parameter to get domain */
  parameter?: string | undefined;
}

function createBaseSipProxy(): SipProxy {
  return { $type: "envoy.extensions.filters.network.sip_proxy.v3alpha.SipProxy" };
}

export const SipProxy: MessageFns<SipProxy, "envoy.extensions.filters.network.sip_proxy.v3alpha.SipProxy"> = {
  $type: "envoy.extensions.filters.network.sip_proxy.v3alpha.SipProxy" as const,

  encode(message: SipProxy, writer: BinaryWriter = new BinaryWriter()): BinaryWriter {
    if (message.stat_prefix !== undefined && message.stat_prefix !== "") {
      writer.uint32(10).string(message.stat_prefix);
    }
    if (message.route_config !== undefined) {
      RouteConfiguration.encode(message.route_config, writer.uint32(18).fork()).join();
    }
    if (message.sip_filters !== undefined && message.sip_filters.length !== 0) {
      for (const v of message.sip_filters) {
        SipFilter.encode(v!, writer.uint32(26).fork()).join();
      }
    }
    if (message.settings !== undefined) {
      SipProxy_SipSettings.encode(message.settings, writer.uint32(34).fork()).join();
    }
    return writer;
  },

  decode(input: BinaryReader | Uint8Array, length?: number): SipProxy {
    const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseSipProxy();
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

          if (message.sip_filters === undefined) {
            message.sip_filters = [];
          }
          const el = SipFilter.decode(reader, reader.uint32());
          if (el !== undefined) {
            message.sip_filters!.push(el);
          }
          continue;
        }
        case 4: {
          if (tag !== 34) {
            break;
          }

          message.settings = SipProxy_SipSettings.decode(reader, reader.uint32());
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

  fromJSON(object: any): SipProxy {
    return {
      $type: SipProxy.$type,
      stat_prefix: isSet(object.stat_prefix) ? globalThis.String(object.stat_prefix) : undefined,
      route_config: isSet(object.route_config) ? RouteConfiguration.fromJSON(object.route_config) : undefined,
      sip_filters: globalThis.Array.isArray(object?.sip_filters)
        ? object.sip_filters.map((e: any) => SipFilter.fromJSON(e))
        : undefined,
      settings: isSet(object.settings) ? SipProxy_SipSettings.fromJSON(object.settings) : undefined,
    };
  },

  toJSON(message: SipProxy): unknown {
    const obj: any = {};
    if (message.stat_prefix !== undefined) {
      obj.stat_prefix = message.stat_prefix;
    }
    if (message.route_config !== undefined) {
      obj.route_config = RouteConfiguration.toJSON(message.route_config);
    }
    if (message.sip_filters?.length) {
      obj.sip_filters = message.sip_filters.map((e) => SipFilter.toJSON(e));
    }
    if (message.settings !== undefined) {
      obj.settings = SipProxy_SipSettings.toJSON(message.settings);
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<SipProxy>, I>>(base?: I): SipProxy {
    return SipProxy.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<SipProxy>, I>>(object: I): SipProxy {
    const message = createBaseSipProxy();
    message.stat_prefix = object.stat_prefix ?? undefined;
    message.route_config = (object.route_config !== undefined && object.route_config !== null)
      ? RouteConfiguration.fromPartial(object.route_config)
      : undefined;
    message.sip_filters = object.sip_filters?.map((e) => SipFilter.fromPartial(e)) || undefined;
    message.settings = (object.settings !== undefined && object.settings !== null)
      ? SipProxy_SipSettings.fromPartial(object.settings)
      : undefined;
    return message;
  },
};

messageTypeRegistry.set(SipProxy.$type, SipProxy);

function createBaseSipProxy_SipSettings(): SipProxy_SipSettings {
  return { $type: "envoy.extensions.filters.network.sip_proxy.v3alpha.SipProxy.SipSettings" };
}

export const SipProxy_SipSettings: MessageFns<
  SipProxy_SipSettings,
  "envoy.extensions.filters.network.sip_proxy.v3alpha.SipProxy.SipSettings"
> = {
  $type: "envoy.extensions.filters.network.sip_proxy.v3alpha.SipProxy.SipSettings" as const,

  encode(message: SipProxy_SipSettings, writer: BinaryWriter = new BinaryWriter()): BinaryWriter {
    if (message.transaction_timeout !== undefined) {
      Duration.encode(message.transaction_timeout, writer.uint32(10).fork()).join();
    }
    if (message.local_services !== undefined && message.local_services.length !== 0) {
      for (const v of message.local_services) {
        LocalService.encode(v!, writer.uint32(18).fork()).join();
      }
    }
    if (message.tra_service_config !== undefined) {
      TraServiceConfig.encode(message.tra_service_config, writer.uint32(26).fork()).join();
    }
    if (message.operate_via !== undefined && message.operate_via !== false) {
      writer.uint32(32).bool(message.operate_via);
    }
    return writer;
  },

  decode(input: BinaryReader | Uint8Array, length?: number): SipProxy_SipSettings {
    const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseSipProxy_SipSettings();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1: {
          if (tag !== 10) {
            break;
          }

          message.transaction_timeout = Duration.decode(reader, reader.uint32());
          continue;
        }
        case 2: {
          if (tag !== 18) {
            break;
          }

          if (message.local_services === undefined) {
            message.local_services = [];
          }
          const el = LocalService.decode(reader, reader.uint32());
          if (el !== undefined) {
            message.local_services!.push(el);
          }
          continue;
        }
        case 3: {
          if (tag !== 26) {
            break;
          }

          message.tra_service_config = TraServiceConfig.decode(reader, reader.uint32());
          continue;
        }
        case 4: {
          if (tag !== 32) {
            break;
          }

          message.operate_via = reader.bool();
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

  fromJSON(object: any): SipProxy_SipSettings {
    return {
      $type: SipProxy_SipSettings.$type,
      transaction_timeout: isSet(object.transaction_timeout)
        ? Duration.fromJSON(object.transaction_timeout)
        : undefined,
      local_services: globalThis.Array.isArray(object?.local_services)
        ? object.local_services.map((e: any) => LocalService.fromJSON(e))
        : undefined,
      tra_service_config: isSet(object.tra_service_config)
        ? TraServiceConfig.fromJSON(object.tra_service_config)
        : undefined,
      operate_via: isSet(object.operate_via) ? globalThis.Boolean(object.operate_via) : undefined,
    };
  },

  toJSON(message: SipProxy_SipSettings): unknown {
    const obj: any = {};
    if (message.transaction_timeout !== undefined) {
      obj.transaction_timeout = Duration.toJSON(message.transaction_timeout);
    }
    if (message.local_services?.length) {
      obj.local_services = message.local_services.map((e) => LocalService.toJSON(e));
    }
    if (message.tra_service_config !== undefined) {
      obj.tra_service_config = TraServiceConfig.toJSON(message.tra_service_config);
    }
    if (message.operate_via !== undefined) {
      obj.operate_via = message.operate_via;
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<SipProxy_SipSettings>, I>>(base?: I): SipProxy_SipSettings {
    return SipProxy_SipSettings.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<SipProxy_SipSettings>, I>>(object: I): SipProxy_SipSettings {
    const message = createBaseSipProxy_SipSettings();
    message.transaction_timeout = (object.transaction_timeout !== undefined && object.transaction_timeout !== null)
      ? Duration.fromPartial(object.transaction_timeout)
      : undefined;
    message.local_services = object.local_services?.map((e) => LocalService.fromPartial(e)) || undefined;
    message.tra_service_config = (object.tra_service_config !== undefined && object.tra_service_config !== null)
      ? TraServiceConfig.fromPartial(object.tra_service_config)
      : undefined;
    message.operate_via = object.operate_via ?? undefined;
    return message;
  },
};

messageTypeRegistry.set(SipProxy_SipSettings.$type, SipProxy_SipSettings);

function createBaseSipFilter(): SipFilter {
  return { $type: "envoy.extensions.filters.network.sip_proxy.v3alpha.SipFilter", config_type: undefined };
}

export const SipFilter: MessageFns<SipFilter, "envoy.extensions.filters.network.sip_proxy.v3alpha.SipFilter"> = {
  $type: "envoy.extensions.filters.network.sip_proxy.v3alpha.SipFilter" as const,

  encode(message: SipFilter, writer: BinaryWriter = new BinaryWriter()): BinaryWriter {
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

  decode(input: BinaryReader | Uint8Array, length?: number): SipFilter {
    const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseSipFilter();
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

  fromJSON(object: any): SipFilter {
    return {
      $type: SipFilter.$type,
      name: isSet(object.name) ? globalThis.String(object.name) : undefined,
      config_type: isSet(object.typed_config)
        ? { $case: "typed_config", typed_config: Any.fromJSON(object.typed_config) }
        : undefined,
    };
  },

  toJSON(message: SipFilter): unknown {
    const obj: any = {};
    if (message.name !== undefined) {
      obj.name = message.name;
    }
    if (message.config_type?.$case === "typed_config") {
      obj.typed_config = Any.toJSON(message.config_type.typed_config);
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<SipFilter>, I>>(base?: I): SipFilter {
    return SipFilter.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<SipFilter>, I>>(object: I): SipFilter {
    const message = createBaseSipFilter();
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

messageTypeRegistry.set(SipFilter.$type, SipFilter);

function createBaseSipProtocolOptions(): SipProtocolOptions {
  return { $type: "envoy.extensions.filters.network.sip_proxy.v3alpha.SipProtocolOptions" };
}

export const SipProtocolOptions: MessageFns<
  SipProtocolOptions,
  "envoy.extensions.filters.network.sip_proxy.v3alpha.SipProtocolOptions"
> = {
  $type: "envoy.extensions.filters.network.sip_proxy.v3alpha.SipProtocolOptions" as const,

  encode(message: SipProtocolOptions, writer: BinaryWriter = new BinaryWriter()): BinaryWriter {
    if (message.session_affinity !== undefined && message.session_affinity !== false) {
      writer.uint32(8).bool(message.session_affinity);
    }
    if (message.registration_affinity !== undefined && message.registration_affinity !== false) {
      writer.uint32(16).bool(message.registration_affinity);
    }
    if (message.customized_affinity !== undefined) {
      CustomizedAffinity.encode(message.customized_affinity, writer.uint32(26).fork()).join();
    }
    return writer;
  },

  decode(input: BinaryReader | Uint8Array, length?: number): SipProtocolOptions {
    const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseSipProtocolOptions();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1: {
          if (tag !== 8) {
            break;
          }

          message.session_affinity = reader.bool();
          continue;
        }
        case 2: {
          if (tag !== 16) {
            break;
          }

          message.registration_affinity = reader.bool();
          continue;
        }
        case 3: {
          if (tag !== 26) {
            break;
          }

          message.customized_affinity = CustomizedAffinity.decode(reader, reader.uint32());
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

  fromJSON(object: any): SipProtocolOptions {
    return {
      $type: SipProtocolOptions.$type,
      session_affinity: isSet(object.session_affinity) ? globalThis.Boolean(object.session_affinity) : undefined,
      registration_affinity: isSet(object.registration_affinity)
        ? globalThis.Boolean(object.registration_affinity)
        : undefined,
      customized_affinity: isSet(object.customized_affinity)
        ? CustomizedAffinity.fromJSON(object.customized_affinity)
        : undefined,
    };
  },

  toJSON(message: SipProtocolOptions): unknown {
    const obj: any = {};
    if (message.session_affinity !== undefined) {
      obj.session_affinity = message.session_affinity;
    }
    if (message.registration_affinity !== undefined) {
      obj.registration_affinity = message.registration_affinity;
    }
    if (message.customized_affinity !== undefined) {
      obj.customized_affinity = CustomizedAffinity.toJSON(message.customized_affinity);
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<SipProtocolOptions>, I>>(base?: I): SipProtocolOptions {
    return SipProtocolOptions.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<SipProtocolOptions>, I>>(object: I): SipProtocolOptions {
    const message = createBaseSipProtocolOptions();
    message.session_affinity = object.session_affinity ?? undefined;
    message.registration_affinity = object.registration_affinity ?? undefined;
    message.customized_affinity = (object.customized_affinity !== undefined && object.customized_affinity !== null)
      ? CustomizedAffinity.fromPartial(object.customized_affinity)
      : undefined;
    return message;
  },
};

messageTypeRegistry.set(SipProtocolOptions.$type, SipProtocolOptions);

function createBaseCustomizedAffinity(): CustomizedAffinity {
  return { $type: "envoy.extensions.filters.network.sip_proxy.v3alpha.CustomizedAffinity" };
}

export const CustomizedAffinity: MessageFns<
  CustomizedAffinity,
  "envoy.extensions.filters.network.sip_proxy.v3alpha.CustomizedAffinity"
> = {
  $type: "envoy.extensions.filters.network.sip_proxy.v3alpha.CustomizedAffinity" as const,

  encode(message: CustomizedAffinity, writer: BinaryWriter = new BinaryWriter()): BinaryWriter {
    if (message.entries !== undefined && message.entries.length !== 0) {
      for (const v of message.entries) {
        CustomizedAffinityEntry.encode(v!, writer.uint32(10).fork()).join();
      }
    }
    if (message.stop_load_balance !== undefined && message.stop_load_balance !== false) {
      writer.uint32(16).bool(message.stop_load_balance);
    }
    return writer;
  },

  decode(input: BinaryReader | Uint8Array, length?: number): CustomizedAffinity {
    const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseCustomizedAffinity();
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
          const el = CustomizedAffinityEntry.decode(reader, reader.uint32());
          if (el !== undefined) {
            message.entries!.push(el);
          }
          continue;
        }
        case 2: {
          if (tag !== 16) {
            break;
          }

          message.stop_load_balance = reader.bool();
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

  fromJSON(object: any): CustomizedAffinity {
    return {
      $type: CustomizedAffinity.$type,
      entries: globalThis.Array.isArray(object?.entries)
        ? object.entries.map((e: any) => CustomizedAffinityEntry.fromJSON(e))
        : undefined,
      stop_load_balance: isSet(object.stop_load_balance) ? globalThis.Boolean(object.stop_load_balance) : undefined,
    };
  },

  toJSON(message: CustomizedAffinity): unknown {
    const obj: any = {};
    if (message.entries?.length) {
      obj.entries = message.entries.map((e) => CustomizedAffinityEntry.toJSON(e));
    }
    if (message.stop_load_balance !== undefined) {
      obj.stop_load_balance = message.stop_load_balance;
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<CustomizedAffinity>, I>>(base?: I): CustomizedAffinity {
    return CustomizedAffinity.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<CustomizedAffinity>, I>>(object: I): CustomizedAffinity {
    const message = createBaseCustomizedAffinity();
    message.entries = object.entries?.map((e) => CustomizedAffinityEntry.fromPartial(e)) || undefined;
    message.stop_load_balance = object.stop_load_balance ?? undefined;
    return message;
  },
};

messageTypeRegistry.set(CustomizedAffinity.$type, CustomizedAffinity);

function createBaseCustomizedAffinityEntry(): CustomizedAffinityEntry {
  return { $type: "envoy.extensions.filters.network.sip_proxy.v3alpha.CustomizedAffinityEntry" };
}

export const CustomizedAffinityEntry: MessageFns<
  CustomizedAffinityEntry,
  "envoy.extensions.filters.network.sip_proxy.v3alpha.CustomizedAffinityEntry"
> = {
  $type: "envoy.extensions.filters.network.sip_proxy.v3alpha.CustomizedAffinityEntry" as const,

  encode(message: CustomizedAffinityEntry, writer: BinaryWriter = new BinaryWriter()): BinaryWriter {
    if (message.header !== undefined && message.header !== "") {
      writer.uint32(10).string(message.header);
    }
    if (message.key_name !== undefined && message.key_name !== "") {
      writer.uint32(18).string(message.key_name);
    }
    if (message.subscribe !== undefined && message.subscribe !== false) {
      writer.uint32(24).bool(message.subscribe);
    }
    if (message.query !== undefined && message.query !== false) {
      writer.uint32(32).bool(message.query);
    }
    if (message.cache !== undefined) {
      Cache.encode(message.cache, writer.uint32(42).fork()).join();
    }
    return writer;
  },

  decode(input: BinaryReader | Uint8Array, length?: number): CustomizedAffinityEntry {
    const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseCustomizedAffinityEntry();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1: {
          if (tag !== 10) {
            break;
          }

          message.header = reader.string();
          continue;
        }
        case 2: {
          if (tag !== 18) {
            break;
          }

          message.key_name = reader.string();
          continue;
        }
        case 3: {
          if (tag !== 24) {
            break;
          }

          message.subscribe = reader.bool();
          continue;
        }
        case 4: {
          if (tag !== 32) {
            break;
          }

          message.query = reader.bool();
          continue;
        }
        case 5: {
          if (tag !== 42) {
            break;
          }

          message.cache = Cache.decode(reader, reader.uint32());
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

  fromJSON(object: any): CustomizedAffinityEntry {
    return {
      $type: CustomizedAffinityEntry.$type,
      header: isSet(object.header) ? globalThis.String(object.header) : undefined,
      key_name: isSet(object.key_name) ? globalThis.String(object.key_name) : undefined,
      subscribe: isSet(object.subscribe) ? globalThis.Boolean(object.subscribe) : undefined,
      query: isSet(object.query) ? globalThis.Boolean(object.query) : undefined,
      cache: isSet(object.cache) ? Cache.fromJSON(object.cache) : undefined,
    };
  },

  toJSON(message: CustomizedAffinityEntry): unknown {
    const obj: any = {};
    if (message.header !== undefined) {
      obj.header = message.header;
    }
    if (message.key_name !== undefined) {
      obj.key_name = message.key_name;
    }
    if (message.subscribe !== undefined) {
      obj.subscribe = message.subscribe;
    }
    if (message.query !== undefined) {
      obj.query = message.query;
    }
    if (message.cache !== undefined) {
      obj.cache = Cache.toJSON(message.cache);
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<CustomizedAffinityEntry>, I>>(base?: I): CustomizedAffinityEntry {
    return CustomizedAffinityEntry.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<CustomizedAffinityEntry>, I>>(object: I): CustomizedAffinityEntry {
    const message = createBaseCustomizedAffinityEntry();
    message.header = object.header ?? undefined;
    message.key_name = object.key_name ?? undefined;
    message.subscribe = object.subscribe ?? undefined;
    message.query = object.query ?? undefined;
    message.cache = (object.cache !== undefined && object.cache !== null) ? Cache.fromPartial(object.cache) : undefined;
    return message;
  },
};

messageTypeRegistry.set(CustomizedAffinityEntry.$type, CustomizedAffinityEntry);

function createBaseCache(): Cache {
  return { $type: "envoy.extensions.filters.network.sip_proxy.v3alpha.Cache" };
}

export const Cache: MessageFns<Cache, "envoy.extensions.filters.network.sip_proxy.v3alpha.Cache"> = {
  $type: "envoy.extensions.filters.network.sip_proxy.v3alpha.Cache" as const,

  encode(message: Cache, writer: BinaryWriter = new BinaryWriter()): BinaryWriter {
    if (message.max_cache_item !== undefined && message.max_cache_item !== 0) {
      writer.uint32(8).int32(message.max_cache_item);
    }
    if (message.add_query_to_cache !== undefined && message.add_query_to_cache !== false) {
      writer.uint32(16).bool(message.add_query_to_cache);
    }
    return writer;
  },

  decode(input: BinaryReader | Uint8Array, length?: number): Cache {
    const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseCache();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1: {
          if (tag !== 8) {
            break;
          }

          message.max_cache_item = reader.int32();
          continue;
        }
        case 2: {
          if (tag !== 16) {
            break;
          }

          message.add_query_to_cache = reader.bool();
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

  fromJSON(object: any): Cache {
    return {
      $type: Cache.$type,
      max_cache_item: isSet(object.max_cache_item) ? globalThis.Number(object.max_cache_item) : undefined,
      add_query_to_cache: isSet(object.add_query_to_cache) ? globalThis.Boolean(object.add_query_to_cache) : undefined,
    };
  },

  toJSON(message: Cache): unknown {
    const obj: any = {};
    if (message.max_cache_item !== undefined) {
      obj.max_cache_item = Math.round(message.max_cache_item);
    }
    if (message.add_query_to_cache !== undefined) {
      obj.add_query_to_cache = message.add_query_to_cache;
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<Cache>, I>>(base?: I): Cache {
    return Cache.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<Cache>, I>>(object: I): Cache {
    const message = createBaseCache();
    message.max_cache_item = object.max_cache_item ?? undefined;
    message.add_query_to_cache = object.add_query_to_cache ?? undefined;
    return message;
  },
};

messageTypeRegistry.set(Cache.$type, Cache);

function createBaseLocalService(): LocalService {
  return { $type: "envoy.extensions.filters.network.sip_proxy.v3alpha.LocalService" };
}

export const LocalService: MessageFns<LocalService, "envoy.extensions.filters.network.sip_proxy.v3alpha.LocalService"> =
  {
    $type: "envoy.extensions.filters.network.sip_proxy.v3alpha.LocalService" as const,

    encode(message: LocalService, writer: BinaryWriter = new BinaryWriter()): BinaryWriter {
      if (message.domain !== undefined && message.domain !== "") {
        writer.uint32(10).string(message.domain);
      }
      if (message.parameter !== undefined && message.parameter !== "") {
        writer.uint32(18).string(message.parameter);
      }
      return writer;
    },

    decode(input: BinaryReader | Uint8Array, length?: number): LocalService {
      const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
      let end = length === undefined ? reader.len : reader.pos + length;
      const message = createBaseLocalService();
      while (reader.pos < end) {
        const tag = reader.uint32();
        switch (tag >>> 3) {
          case 1: {
            if (tag !== 10) {
              break;
            }

            message.domain = reader.string();
            continue;
          }
          case 2: {
            if (tag !== 18) {
              break;
            }

            message.parameter = reader.string();
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

    fromJSON(object: any): LocalService {
      return {
        $type: LocalService.$type,
        domain: isSet(object.domain) ? globalThis.String(object.domain) : undefined,
        parameter: isSet(object.parameter) ? globalThis.String(object.parameter) : undefined,
      };
    },

    toJSON(message: LocalService): unknown {
      const obj: any = {};
      if (message.domain !== undefined) {
        obj.domain = message.domain;
      }
      if (message.parameter !== undefined) {
        obj.parameter = message.parameter;
      }
      return obj;
    },

    create<I extends Exact<DeepPartial<LocalService>, I>>(base?: I): LocalService {
      return LocalService.fromPartial(base ?? ({} as any));
    },
    fromPartial<I extends Exact<DeepPartial<LocalService>, I>>(object: I): LocalService {
      const message = createBaseLocalService();
      message.domain = object.domain ?? undefined;
      message.parameter = object.parameter ?? undefined;
      return message;
    },
  };

messageTypeRegistry.set(LocalService.$type, LocalService);

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
