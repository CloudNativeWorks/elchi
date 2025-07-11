// Code generated by protoc-gen-ts_proto. DO NOT EDIT.
// versions:
//   protoc-gen-ts_proto  v2.2.7
//   protoc               unknown
// source: envoy/extensions/clusters/dynamic_forward_proxy/v3/cluster.proto

/* eslint-disable */
import { BinaryReader, BinaryWriter } from "@bufbuild/protobuf/wire";
import { Duration } from "../../../../../google/protobuf/duration";
import { UInt32Value } from "../../../../../google/protobuf/wrappers";
import { messageTypeRegistry } from "../../../../../typeRegistry";
import {
  Cluster_LbPolicy,
  cluster_LbPolicyFromJSON,
  cluster_LbPolicyToJSON,
  cluster_LbPolicyToNumber,
} from "../../../../config/cluster/v3/cluster";
import { SocketAddress } from "../../../../config/core/v3/address";
import { DnsCacheConfig } from "../../../common/dynamic_forward_proxy/v3/dns_cache";

export const protobufPackage = "envoy.extensions.clusters.dynamic_forward_proxy.v3";

/**
 * Configuration for the dynamic forward proxy cluster. See the :ref:`architecture overview
 * <arch_overview_http_dynamic_forward_proxy>` for more information.
 * [#extension: envoy.clusters.dynamic_forward_proxy]
 */
export interface ClusterConfig {
  $type: "envoy.extensions.clusters.dynamic_forward_proxy.v3.ClusterConfig";
  cluster_implementation_specifier?:
    | //
    /**
     * The DNS cache configuration that the cluster will attach to. Note this configuration must
     * match that of associated :ref:`dynamic forward proxy HTTP filter configuration
     * <envoy_v3_api_field_extensions.filters.http.dynamic_forward_proxy.v3.FilterConfig.dns_cache_config>`.
     */
    { $case: "dns_cache_config"; dns_cache_config: DnsCacheConfig }
    | //
    /**
     * Configuration for sub clusters, when this configuration is enabled,
     * Envoy will create an independent sub cluster dynamically for each host:port.
     * Most of the configuration of a sub cluster is inherited from the current cluster,
     * i.e. health_checks, dns_resolvers and etc.
     * And the load_assignment will be set to the only one endpoint, host:port.
     *
     * Compared to the dns_cache_config, it has the following advantages:
     *
     * 1. sub clusters will be created with the STRICT_DNS DiscoveryType,
     *    so that Envoy will use all of the IPs resolved from the host.
     *
     * 2. each sub cluster is full featured cluster, with lb_policy and health check and etc enabled.
     */
    { $case: "sub_clusters_config"; sub_clusters_config: SubClustersConfig }
    | undefined;
  /**
   * If true allow the cluster configuration to disable the auto_sni and auto_san_validation options
   * in the :ref:`cluster's upstream_http_protocol_options
   * <envoy_v3_api_field_config.cluster.v3.Cluster.upstream_http_protocol_options>`
   */
  allow_insecure_cluster_options?:
    | boolean
    | undefined;
  /**
   * If true allow HTTP/2 and HTTP/3 connections to be reused for requests to different
   * origins than the connection was initially created for. This will only happen when the
   * resolved address for the new connection matches the peer address of the connection and
   * the TLS certificate is also valid for the new hostname. For example, if a connection
   * has previously been established to foo.example.com at IP 1.2.3.4 with a certificate
   * that is valid for ``*.example.com``, then this connection could be used for requests to
   * bar.example.com if that also resolved to 1.2.3.4.
   *
   * .. note::
   *   By design, this feature will maximize reuse of connections. This means that instead
   *   opening a new connection when an existing connection reaches the maximum number of
   *   concurrent streams, requests will instead be sent to the existing connection.
   *
   * .. note::
   *   The coalesced connections might be to upstreams that would not be otherwise
   *   selected by Envoy. See the section `Connection Reuse in RFC 7540
   *   <https://datatracker.ietf.org/doc/html/rfc7540#section-9.1.1>`_
   */
  allow_coalesced_connections?: boolean | undefined;
}

/** Configuration for sub clusters. Hard code STRICT_DNS cluster type now. */
export interface SubClustersConfig {
  $type: "envoy.extensions.clusters.dynamic_forward_proxy.v3.SubClustersConfig";
  /**
   * The :ref:`load balancer type <arch_overview_load_balancing_types>` to use
   * when picking a host in a sub cluster. Note that CLUSTER_PROVIDED is not allowed here.
   */
  lb_policy?:
    | Cluster_LbPolicy
    | undefined;
  /** The maximum number of sub clusters that the DFP cluster will hold. If not specified defaults to 1024. */
  max_sub_clusters?:
    | number
    | undefined;
  /**
   * The TTL for sub clusters that are unused. Sub clusters that have not been used in the configured time
   * interval will be purged. If not specified defaults to 5m.
   */
  sub_cluster_ttl?:
    | Duration
    | undefined;
  /**
   * Sub clusters that should be created & warmed upon creation. This might provide a
   * performance improvement, in the form of cache hits, for sub clusters that are going to be
   * warmed during steady state and are known at config load time.
   */
  preresolve_clusters?: SocketAddress[] | undefined;
}

function createBaseClusterConfig(): ClusterConfig {
  return {
    $type: "envoy.extensions.clusters.dynamic_forward_proxy.v3.ClusterConfig",
    cluster_implementation_specifier: undefined,
  };
}

export const ClusterConfig: MessageFns<
  ClusterConfig,
  "envoy.extensions.clusters.dynamic_forward_proxy.v3.ClusterConfig"
> = {
  $type: "envoy.extensions.clusters.dynamic_forward_proxy.v3.ClusterConfig" as const,

  encode(message: ClusterConfig, writer: BinaryWriter = new BinaryWriter()): BinaryWriter {
    switch (message.cluster_implementation_specifier?.$case) {
      case "dns_cache_config":
        DnsCacheConfig.encode(message.cluster_implementation_specifier.dns_cache_config, writer.uint32(10).fork())
          .join();
        break;
      case "sub_clusters_config":
        SubClustersConfig.encode(message.cluster_implementation_specifier.sub_clusters_config, writer.uint32(34).fork())
          .join();
        break;
    }
    if (message.allow_insecure_cluster_options !== undefined && message.allow_insecure_cluster_options !== false) {
      writer.uint32(16).bool(message.allow_insecure_cluster_options);
    }
    if (message.allow_coalesced_connections !== undefined && message.allow_coalesced_connections !== false) {
      writer.uint32(24).bool(message.allow_coalesced_connections);
    }
    return writer;
  },

  decode(input: BinaryReader | Uint8Array, length?: number): ClusterConfig {
    const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseClusterConfig();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1: {
          if (tag !== 10) {
            break;
          }

          message.cluster_implementation_specifier = {
            $case: "dns_cache_config",
            dns_cache_config: DnsCacheConfig.decode(reader, reader.uint32()),
          };
          continue;
        }
        case 4: {
          if (tag !== 34) {
            break;
          }

          message.cluster_implementation_specifier = {
            $case: "sub_clusters_config",
            sub_clusters_config: SubClustersConfig.decode(reader, reader.uint32()),
          };
          continue;
        }
        case 2: {
          if (tag !== 16) {
            break;
          }

          message.allow_insecure_cluster_options = reader.bool();
          continue;
        }
        case 3: {
          if (tag !== 24) {
            break;
          }

          message.allow_coalesced_connections = reader.bool();
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

  fromJSON(object: any): ClusterConfig {
    return {
      $type: ClusterConfig.$type,
      cluster_implementation_specifier: isSet(object.dns_cache_config)
        ? { $case: "dns_cache_config", dns_cache_config: DnsCacheConfig.fromJSON(object.dns_cache_config) }
        : isSet(object.sub_clusters_config)
        ? { $case: "sub_clusters_config", sub_clusters_config: SubClustersConfig.fromJSON(object.sub_clusters_config) }
        : undefined,
      allow_insecure_cluster_options: isSet(object.allow_insecure_cluster_options)
        ? globalThis.Boolean(object.allow_insecure_cluster_options)
        : undefined,
      allow_coalesced_connections: isSet(object.allow_coalesced_connections)
        ? globalThis.Boolean(object.allow_coalesced_connections)
        : undefined,
    };
  },

  toJSON(message: ClusterConfig): unknown {
    const obj: any = {};
    if (message.cluster_implementation_specifier?.$case === "dns_cache_config") {
      obj.dns_cache_config = DnsCacheConfig.toJSON(message.cluster_implementation_specifier.dns_cache_config);
    }
    if (message.cluster_implementation_specifier?.$case === "sub_clusters_config") {
      obj.sub_clusters_config = SubClustersConfig.toJSON(message.cluster_implementation_specifier.sub_clusters_config);
    }
    if (message.allow_insecure_cluster_options !== undefined) {
      obj.allow_insecure_cluster_options = message.allow_insecure_cluster_options;
    }
    if (message.allow_coalesced_connections !== undefined) {
      obj.allow_coalesced_connections = message.allow_coalesced_connections;
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<ClusterConfig>, I>>(base?: I): ClusterConfig {
    return ClusterConfig.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<ClusterConfig>, I>>(object: I): ClusterConfig {
    const message = createBaseClusterConfig();
    if (
      object.cluster_implementation_specifier?.$case === "dns_cache_config" &&
      object.cluster_implementation_specifier?.dns_cache_config !== undefined &&
      object.cluster_implementation_specifier?.dns_cache_config !== null
    ) {
      message.cluster_implementation_specifier = {
        $case: "dns_cache_config",
        dns_cache_config: DnsCacheConfig.fromPartial(object.cluster_implementation_specifier.dns_cache_config),
      };
    }
    if (
      object.cluster_implementation_specifier?.$case === "sub_clusters_config" &&
      object.cluster_implementation_specifier?.sub_clusters_config !== undefined &&
      object.cluster_implementation_specifier?.sub_clusters_config !== null
    ) {
      message.cluster_implementation_specifier = {
        $case: "sub_clusters_config",
        sub_clusters_config: SubClustersConfig.fromPartial(object.cluster_implementation_specifier.sub_clusters_config),
      };
    }
    message.allow_insecure_cluster_options = object.allow_insecure_cluster_options ?? undefined;
    message.allow_coalesced_connections = object.allow_coalesced_connections ?? undefined;
    return message;
  },
};

messageTypeRegistry.set(ClusterConfig.$type, ClusterConfig);

function createBaseSubClustersConfig(): SubClustersConfig {
  return { $type: "envoy.extensions.clusters.dynamic_forward_proxy.v3.SubClustersConfig" };
}

export const SubClustersConfig: MessageFns<
  SubClustersConfig,
  "envoy.extensions.clusters.dynamic_forward_proxy.v3.SubClustersConfig"
> = {
  $type: "envoy.extensions.clusters.dynamic_forward_proxy.v3.SubClustersConfig" as const,

  encode(message: SubClustersConfig, writer: BinaryWriter = new BinaryWriter()): BinaryWriter {
    if (message.lb_policy !== undefined && message.lb_policy !== Cluster_LbPolicy.ROUND_ROBIN) {
      writer.uint32(8).int32(cluster_LbPolicyToNumber(message.lb_policy));
    }
    if (message.max_sub_clusters !== undefined) {
      UInt32Value.encode(
        { $type: "google.protobuf.UInt32Value", value: message.max_sub_clusters! },
        writer.uint32(18).fork(),
      ).join();
    }
    if (message.sub_cluster_ttl !== undefined) {
      Duration.encode(message.sub_cluster_ttl, writer.uint32(26).fork()).join();
    }
    if (message.preresolve_clusters !== undefined && message.preresolve_clusters.length !== 0) {
      for (const v of message.preresolve_clusters) {
        SocketAddress.encode(v!, writer.uint32(34).fork()).join();
      }
    }
    return writer;
  },

  decode(input: BinaryReader | Uint8Array, length?: number): SubClustersConfig {
    const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseSubClustersConfig();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1: {
          if (tag !== 8) {
            break;
          }

          message.lb_policy = cluster_LbPolicyFromJSON(reader.int32());
          continue;
        }
        case 2: {
          if (tag !== 18) {
            break;
          }

          message.max_sub_clusters = UInt32Value.decode(reader, reader.uint32()).value;
          continue;
        }
        case 3: {
          if (tag !== 26) {
            break;
          }

          message.sub_cluster_ttl = Duration.decode(reader, reader.uint32());
          continue;
        }
        case 4: {
          if (tag !== 34) {
            break;
          }

          if (message.preresolve_clusters === undefined) {
            message.preresolve_clusters = [];
          }
          const el = SocketAddress.decode(reader, reader.uint32());
          if (el !== undefined) {
            message.preresolve_clusters!.push(el);
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

  fromJSON(object: any): SubClustersConfig {
    return {
      $type: SubClustersConfig.$type,
      lb_policy: isSet(object.lb_policy) ? cluster_LbPolicyFromJSON(object.lb_policy) : undefined,
      max_sub_clusters: isSet(object.max_sub_clusters) ? Number(object.max_sub_clusters) : undefined,
      sub_cluster_ttl: isSet(object.sub_cluster_ttl) ? Duration.fromJSON(object.sub_cluster_ttl) : undefined,
      preresolve_clusters: globalThis.Array.isArray(object?.preresolve_clusters)
        ? object.preresolve_clusters.map((e: any) => SocketAddress.fromJSON(e))
        : undefined,
    };
  },

  toJSON(message: SubClustersConfig): unknown {
    const obj: any = {};
    if (message.lb_policy !== undefined) {
      obj.lb_policy = cluster_LbPolicyToJSON(message.lb_policy);
    }
    if (message.max_sub_clusters !== undefined) {
      obj.max_sub_clusters = message.max_sub_clusters;
    }
    if (message.sub_cluster_ttl !== undefined) {
      obj.sub_cluster_ttl = Duration.toJSON(message.sub_cluster_ttl);
    }
    if (message.preresolve_clusters?.length) {
      obj.preresolve_clusters = message.preresolve_clusters.map((e) => SocketAddress.toJSON(e));
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<SubClustersConfig>, I>>(base?: I): SubClustersConfig {
    return SubClustersConfig.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<SubClustersConfig>, I>>(object: I): SubClustersConfig {
    const message = createBaseSubClustersConfig();
    message.lb_policy = object.lb_policy ?? undefined;
    message.max_sub_clusters = object.max_sub_clusters ?? undefined;
    message.sub_cluster_ttl = (object.sub_cluster_ttl !== undefined && object.sub_cluster_ttl !== null)
      ? Duration.fromPartial(object.sub_cluster_ttl)
      : undefined;
    message.preresolve_clusters = object.preresolve_clusters?.map((e) => SocketAddress.fromPartial(e)) || undefined;
    return message;
  },
};

messageTypeRegistry.set(SubClustersConfig.$type, SubClustersConfig);

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
