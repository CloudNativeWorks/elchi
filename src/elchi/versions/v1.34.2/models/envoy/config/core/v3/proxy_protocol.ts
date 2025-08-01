// Code generated by protoc-gen-ts_proto. DO NOT EDIT.
// versions:
//   protoc-gen-ts_proto  v2.2.7
//   protoc               unknown
// source: envoy/config/core/v3/proxy_protocol.proto

/* eslint-disable */
import { BinaryReader, BinaryWriter } from "@bufbuild/protobuf/wire";
import { messageTypeRegistry } from "../../../../typeRegistry";

export const protobufPackage = "envoy.config.core.v3";

export interface ProxyProtocolPassThroughTLVs {
  $type: "envoy.config.core.v3.ProxyProtocolPassThroughTLVs";
  /**
   * The strategy to pass through TLVs. Default is INCLUDE_ALL.
   * If INCLUDE_ALL is set, all TLVs will be passed through no matter the tlv_type field.
   */
  match_type?:
    | ProxyProtocolPassThroughTLVs_PassTLVsMatchType
    | undefined;
  /**
   * The TLV types that are applied based on match_type.
   * TLV type is defined as uint8_t in proxy protocol. See `the spec
   * <https://www.haproxy.org/download/2.1/doc/proxy-protocol.txt>`_ for details.
   */
  tlv_type?: number[] | undefined;
}

export enum ProxyProtocolPassThroughTLVs_PassTLVsMatchType {
  /** INCLUDE_ALL - Pass all TLVs. */
  INCLUDE_ALL = "INCLUDE_ALL",
  /** INCLUDE - Pass specific TLVs defined in tlv_type. */
  INCLUDE = "INCLUDE",
}

export function proxyProtocolPassThroughTLVs_PassTLVsMatchTypeFromJSON(
  object: any,
): ProxyProtocolPassThroughTLVs_PassTLVsMatchType {
  switch (object) {
    case 0:
    case "INCLUDE_ALL":
      return ProxyProtocolPassThroughTLVs_PassTLVsMatchType.INCLUDE_ALL;
    case 1:
    case "INCLUDE":
      return ProxyProtocolPassThroughTLVs_PassTLVsMatchType.INCLUDE;
    default:
      throw new globalThis.Error(
        "Unrecognized enum value " + object + " for enum ProxyProtocolPassThroughTLVs_PassTLVsMatchType",
      );
  }
}

export function proxyProtocolPassThroughTLVs_PassTLVsMatchTypeToJSON(
  object: ProxyProtocolPassThroughTLVs_PassTLVsMatchType,
): string {
  switch (object) {
    case ProxyProtocolPassThroughTLVs_PassTLVsMatchType.INCLUDE_ALL:
      return "INCLUDE_ALL";
    case ProxyProtocolPassThroughTLVs_PassTLVsMatchType.INCLUDE:
      return "INCLUDE";
    default:
      throw new globalThis.Error(
        "Unrecognized enum value " + object + " for enum ProxyProtocolPassThroughTLVs_PassTLVsMatchType",
      );
  }
}

export function proxyProtocolPassThroughTLVs_PassTLVsMatchTypeToNumber(
  object: ProxyProtocolPassThroughTLVs_PassTLVsMatchType,
): number {
  switch (object) {
    case ProxyProtocolPassThroughTLVs_PassTLVsMatchType.INCLUDE_ALL:
      return 0;
    case ProxyProtocolPassThroughTLVs_PassTLVsMatchType.INCLUDE:
      return 1;
    default:
      throw new globalThis.Error(
        "Unrecognized enum value " + object + " for enum ProxyProtocolPassThroughTLVs_PassTLVsMatchType",
      );
  }
}

/** Represents a single Type-Length-Value (TLV) entry. */
export interface TlvEntry {
  $type: "envoy.config.core.v3.TlvEntry";
  /** The type of the TLV. Must be a uint8 (0-255) as per the Proxy Protocol v2 specification. */
  type?:
    | number
    | undefined;
  /** The value of the TLV. Must be at least one byte long. */
  value?: Uint8Array | undefined;
}

export interface ProxyProtocolConfig {
  $type: "envoy.config.core.v3.ProxyProtocolConfig";
  /** The PROXY protocol version to use. See https://www.haproxy.org/download/2.1/doc/proxy-protocol.txt for details */
  version?:
    | ProxyProtocolConfig_Version
    | undefined;
  /**
   * This config controls which TLVs can be passed to upstream if it is Proxy Protocol
   * V2 header. If there is no setting for this field, no TLVs will be passed through.
   */
  pass_through_tlvs?:
    | ProxyProtocolPassThroughTLVs
    | undefined;
  /**
   * This config allows additional TLVs to be included in the upstream PROXY protocol
   * V2 header. Unlike ``pass_through_tlvs``, which passes TLVs from the downstream request,
   * ``added_tlvs`` provides an extension mechanism for defining new TLVs that are included
   * with the upstream request. These TLVs may not be present in the downstream request and
   * can be defined at either the transport socket level or the host level to provide more
   * granular control over the TLVs that are included in the upstream request.
   *
   * Host-level TLVs are specified in the ``metadata.typed_filter_metadata`` field under the
   * ``envoy.transport_sockets.proxy_protocol`` namespace.
   *
   * .. literalinclude:: /_configs/repo/proxy_protocol.yaml
   *    :language: yaml
   *    :lines: 49-57
   *    :linenos:
   *    :lineno-start: 49
   *    :caption: :download:`proxy_protocol.yaml </_configs/repo/proxy_protocol.yaml>`
   *
   * **Precedence behavior**:
   *
   * - When a TLV is defined at both the host level and the transport socket level, the value
   *   from the host level configuration takes precedence. This allows users to define default TLVs
   *   at the transport socket level and override them at the host level.
   * - Any TLV defined in the ``pass_through_tlvs`` field will be overridden by either the host-level
   *   or transport socket-level TLV.
   */
  added_tlvs?: TlvEntry[] | undefined;
}

export enum ProxyProtocolConfig_Version {
  /** V1 - PROXY protocol version 1. Human readable format. */
  V1 = "V1",
  /** V2 - PROXY protocol version 2. Binary format. */
  V2 = "V2",
}

export function proxyProtocolConfig_VersionFromJSON(object: any): ProxyProtocolConfig_Version {
  switch (object) {
    case 0:
    case "V1":
      return ProxyProtocolConfig_Version.V1;
    case 1:
    case "V2":
      return ProxyProtocolConfig_Version.V2;
    default:
      throw new globalThis.Error("Unrecognized enum value " + object + " for enum ProxyProtocolConfig_Version");
  }
}

export function proxyProtocolConfig_VersionToJSON(object: ProxyProtocolConfig_Version): string {
  switch (object) {
    case ProxyProtocolConfig_Version.V1:
      return "V1";
    case ProxyProtocolConfig_Version.V2:
      return "V2";
    default:
      throw new globalThis.Error("Unrecognized enum value " + object + " for enum ProxyProtocolConfig_Version");
  }
}

export function proxyProtocolConfig_VersionToNumber(object: ProxyProtocolConfig_Version): number {
  switch (object) {
    case ProxyProtocolConfig_Version.V1:
      return 0;
    case ProxyProtocolConfig_Version.V2:
      return 1;
    default:
      throw new globalThis.Error("Unrecognized enum value " + object + " for enum ProxyProtocolConfig_Version");
  }
}

export interface PerHostConfig {
  $type: "envoy.config.core.v3.PerHostConfig";
  /** Enables per-host configuration for Proxy Protocol. */
  added_tlvs?: TlvEntry[] | undefined;
}

function createBaseProxyProtocolPassThroughTLVs(): ProxyProtocolPassThroughTLVs {
  return { $type: "envoy.config.core.v3.ProxyProtocolPassThroughTLVs" };
}

export const ProxyProtocolPassThroughTLVs: MessageFns<
  ProxyProtocolPassThroughTLVs,
  "envoy.config.core.v3.ProxyProtocolPassThroughTLVs"
> = {
  $type: "envoy.config.core.v3.ProxyProtocolPassThroughTLVs" as const,

  encode(message: ProxyProtocolPassThroughTLVs, writer: BinaryWriter = new BinaryWriter()): BinaryWriter {
    if (
      message.match_type !== undefined &&
      message.match_type !== ProxyProtocolPassThroughTLVs_PassTLVsMatchType.INCLUDE_ALL
    ) {
      writer.uint32(8).int32(proxyProtocolPassThroughTLVs_PassTLVsMatchTypeToNumber(message.match_type));
    }
    if (message.tlv_type !== undefined && message.tlv_type.length !== 0) {
      writer.uint32(18).fork();
      for (const v of message.tlv_type) {
        writer.uint32(v);
      }
      writer.join();
    }
    return writer;
  },

  decode(input: BinaryReader | Uint8Array, length?: number): ProxyProtocolPassThroughTLVs {
    const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseProxyProtocolPassThroughTLVs();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1: {
          if (tag !== 8) {
            break;
          }

          message.match_type = proxyProtocolPassThroughTLVs_PassTLVsMatchTypeFromJSON(reader.int32());
          continue;
        }
        case 2: {
          if (tag === 16) {
            if (message.tlv_type === undefined) {
              message.tlv_type = [];
            }
            message.tlv_type!.push(reader.uint32());

            continue;
          }

          if (tag === 18) {
            if (message.tlv_type === undefined) {
              message.tlv_type = [];
            }
            const end2 = reader.uint32() + reader.pos;
            while (reader.pos < end2) {
              message.tlv_type!.push(reader.uint32());
            }

            continue;
          }

          break;
        }
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skip(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): ProxyProtocolPassThroughTLVs {
    return {
      $type: ProxyProtocolPassThroughTLVs.$type,
      match_type: isSet(object.match_type)
        ? proxyProtocolPassThroughTLVs_PassTLVsMatchTypeFromJSON(object.match_type)
        : undefined,
      tlv_type: globalThis.Array.isArray(object?.tlv_type)
        ? object.tlv_type.map((e: any) => globalThis.Number(e))
        : undefined,
    };
  },

  toJSON(message: ProxyProtocolPassThroughTLVs): unknown {
    const obj: any = {};
    if (message.match_type !== undefined) {
      obj.match_type = proxyProtocolPassThroughTLVs_PassTLVsMatchTypeToJSON(message.match_type);
    }
    if (message.tlv_type?.length) {
      obj.tlv_type = message.tlv_type.map((e) => Math.round(e));
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<ProxyProtocolPassThroughTLVs>, I>>(base?: I): ProxyProtocolPassThroughTLVs {
    return ProxyProtocolPassThroughTLVs.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<ProxyProtocolPassThroughTLVs>, I>>(object: I): ProxyProtocolPassThroughTLVs {
    const message = createBaseProxyProtocolPassThroughTLVs();
    message.match_type = object.match_type ?? undefined;
    message.tlv_type = object.tlv_type?.map((e) => e) || undefined;
    return message;
  },
};

messageTypeRegistry.set(ProxyProtocolPassThroughTLVs.$type, ProxyProtocolPassThroughTLVs);

function createBaseTlvEntry(): TlvEntry {
  return { $type: "envoy.config.core.v3.TlvEntry" };
}

export const TlvEntry: MessageFns<TlvEntry, "envoy.config.core.v3.TlvEntry"> = {
  $type: "envoy.config.core.v3.TlvEntry" as const,

  encode(message: TlvEntry, writer: BinaryWriter = new BinaryWriter()): BinaryWriter {
    if (message.type !== undefined && message.type !== 0) {
      writer.uint32(8).uint32(message.type);
    }
    if (message.value !== undefined && message.value.length !== 0) {
      writer.uint32(18).bytes(message.value);
    }
    return writer;
  },

  decode(input: BinaryReader | Uint8Array, length?: number): TlvEntry {
    const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseTlvEntry();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1: {
          if (tag !== 8) {
            break;
          }

          message.type = reader.uint32();
          continue;
        }
        case 2: {
          if (tag !== 18) {
            break;
          }

          message.value = reader.bytes();
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

  fromJSON(object: any): TlvEntry {
    return {
      $type: TlvEntry.$type,
      type: isSet(object.type) ? globalThis.Number(object.type) : undefined,
      value: isSet(object.value) ? bytesFromBase64(object.value) : undefined,
    };
  },

  toJSON(message: TlvEntry): unknown {
    const obj: any = {};
    if (message.type !== undefined) {
      obj.type = Math.round(message.type);
    }
    if (message.value !== undefined) {
      obj.value = base64FromBytes(message.value);
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<TlvEntry>, I>>(base?: I): TlvEntry {
    return TlvEntry.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<TlvEntry>, I>>(object: I): TlvEntry {
    const message = createBaseTlvEntry();
    message.type = object.type ?? undefined;
    message.value = object.value ?? undefined;
    return message;
  },
};

messageTypeRegistry.set(TlvEntry.$type, TlvEntry);

function createBaseProxyProtocolConfig(): ProxyProtocolConfig {
  return { $type: "envoy.config.core.v3.ProxyProtocolConfig" };
}

export const ProxyProtocolConfig: MessageFns<ProxyProtocolConfig, "envoy.config.core.v3.ProxyProtocolConfig"> = {
  $type: "envoy.config.core.v3.ProxyProtocolConfig" as const,

  encode(message: ProxyProtocolConfig, writer: BinaryWriter = new BinaryWriter()): BinaryWriter {
    if (message.version !== undefined && message.version !== ProxyProtocolConfig_Version.V1) {
      writer.uint32(8).int32(proxyProtocolConfig_VersionToNumber(message.version));
    }
    if (message.pass_through_tlvs !== undefined) {
      ProxyProtocolPassThroughTLVs.encode(message.pass_through_tlvs, writer.uint32(18).fork()).join();
    }
    if (message.added_tlvs !== undefined && message.added_tlvs.length !== 0) {
      for (const v of message.added_tlvs) {
        TlvEntry.encode(v!, writer.uint32(26).fork()).join();
      }
    }
    return writer;
  },

  decode(input: BinaryReader | Uint8Array, length?: number): ProxyProtocolConfig {
    const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseProxyProtocolConfig();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1: {
          if (tag !== 8) {
            break;
          }

          message.version = proxyProtocolConfig_VersionFromJSON(reader.int32());
          continue;
        }
        case 2: {
          if (tag !== 18) {
            break;
          }

          message.pass_through_tlvs = ProxyProtocolPassThroughTLVs.decode(reader, reader.uint32());
          continue;
        }
        case 3: {
          if (tag !== 26) {
            break;
          }

          if (message.added_tlvs === undefined) {
            message.added_tlvs = [];
          }
          const el = TlvEntry.decode(reader, reader.uint32());
          if (el !== undefined) {
            message.added_tlvs!.push(el);
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

  fromJSON(object: any): ProxyProtocolConfig {
    return {
      $type: ProxyProtocolConfig.$type,
      version: isSet(object.version) ? proxyProtocolConfig_VersionFromJSON(object.version) : undefined,
      pass_through_tlvs: isSet(object.pass_through_tlvs)
        ? ProxyProtocolPassThroughTLVs.fromJSON(object.pass_through_tlvs)
        : undefined,
      added_tlvs: globalThis.Array.isArray(object?.added_tlvs)
        ? object.added_tlvs.map((e: any) => TlvEntry.fromJSON(e))
        : undefined,
    };
  },

  toJSON(message: ProxyProtocolConfig): unknown {
    const obj: any = {};
    if (message.version !== undefined) {
      obj.version = proxyProtocolConfig_VersionToJSON(message.version);
    }
    if (message.pass_through_tlvs !== undefined) {
      obj.pass_through_tlvs = ProxyProtocolPassThroughTLVs.toJSON(message.pass_through_tlvs);
    }
    if (message.added_tlvs?.length) {
      obj.added_tlvs = message.added_tlvs.map((e) => TlvEntry.toJSON(e));
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<ProxyProtocolConfig>, I>>(base?: I): ProxyProtocolConfig {
    return ProxyProtocolConfig.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<ProxyProtocolConfig>, I>>(object: I): ProxyProtocolConfig {
    const message = createBaseProxyProtocolConfig();
    message.version = object.version ?? undefined;
    message.pass_through_tlvs = (object.pass_through_tlvs !== undefined && object.pass_through_tlvs !== null)
      ? ProxyProtocolPassThroughTLVs.fromPartial(object.pass_through_tlvs)
      : undefined;
    message.added_tlvs = object.added_tlvs?.map((e) => TlvEntry.fromPartial(e)) || undefined;
    return message;
  },
};

messageTypeRegistry.set(ProxyProtocolConfig.$type, ProxyProtocolConfig);

function createBasePerHostConfig(): PerHostConfig {
  return { $type: "envoy.config.core.v3.PerHostConfig" };
}

export const PerHostConfig: MessageFns<PerHostConfig, "envoy.config.core.v3.PerHostConfig"> = {
  $type: "envoy.config.core.v3.PerHostConfig" as const,

  encode(message: PerHostConfig, writer: BinaryWriter = new BinaryWriter()): BinaryWriter {
    if (message.added_tlvs !== undefined && message.added_tlvs.length !== 0) {
      for (const v of message.added_tlvs) {
        TlvEntry.encode(v!, writer.uint32(10).fork()).join();
      }
    }
    return writer;
  },

  decode(input: BinaryReader | Uint8Array, length?: number): PerHostConfig {
    const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBasePerHostConfig();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1: {
          if (tag !== 10) {
            break;
          }

          if (message.added_tlvs === undefined) {
            message.added_tlvs = [];
          }
          const el = TlvEntry.decode(reader, reader.uint32());
          if (el !== undefined) {
            message.added_tlvs!.push(el);
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

  fromJSON(object: any): PerHostConfig {
    return {
      $type: PerHostConfig.$type,
      added_tlvs: globalThis.Array.isArray(object?.added_tlvs)
        ? object.added_tlvs.map((e: any) => TlvEntry.fromJSON(e))
        : undefined,
    };
  },

  toJSON(message: PerHostConfig): unknown {
    const obj: any = {};
    if (message.added_tlvs?.length) {
      obj.added_tlvs = message.added_tlvs.map((e) => TlvEntry.toJSON(e));
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<PerHostConfig>, I>>(base?: I): PerHostConfig {
    return PerHostConfig.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<PerHostConfig>, I>>(object: I): PerHostConfig {
    const message = createBasePerHostConfig();
    message.added_tlvs = object.added_tlvs?.map((e) => TlvEntry.fromPartial(e)) || undefined;
    return message;
  },
};

messageTypeRegistry.set(PerHostConfig.$type, PerHostConfig);

function bytesFromBase64(b64: string): Uint8Array {
  if ((globalThis as any).Buffer) {
    return Uint8Array.from(globalThis.Buffer.from(b64, "base64"));
  } else {
    const bin = globalThis.atob(b64);
    const arr = new Uint8Array(bin.length);
    for (let i = 0; i < bin.length; ++i) {
      arr[i] = bin.charCodeAt(i);
    }
    return arr;
  }
}

function base64FromBytes(arr: Uint8Array): string {
  if ((globalThis as any).Buffer) {
    return globalThis.Buffer.from(arr).toString("base64");
  } else {
    const bin: string[] = [];
    arr.forEach((byte) => {
      bin.push(globalThis.String.fromCharCode(byte));
    });
    return globalThis.btoa(bin.join(""));
  }
}

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
