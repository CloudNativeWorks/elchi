// Code generated by protoc-gen-ts_proto. DO NOT EDIT.
// versions:
//   protoc-gen-ts_proto  v2.2.7
//   protoc               unknown
// source: envoy/extensions/config/validators/minimum_clusters/v3/minimum_clusters.proto

/* eslint-disable */
import { BinaryReader, BinaryWriter } from "@bufbuild/protobuf/wire";
import { messageTypeRegistry } from "../../../../../../typeRegistry";

export const protobufPackage = "envoy.extensions.config.validators.minimum_clusters.v3";

/**
 * Validates a CDS config, and ensures that the number of clusters is above the
 * set threshold.
 */
export interface MinimumClustersValidator {
  $type: "envoy.extensions.config.validators.minimum_clusters.v3.MinimumClustersValidator";
  /**
   * The minimal clusters threshold. Any CDS config update leading to less than
   * this number will be rejected.
   * Default value is 0.
   */
  min_clusters_num?: number | undefined;
}

function createBaseMinimumClustersValidator(): MinimumClustersValidator {
  return { $type: "envoy.extensions.config.validators.minimum_clusters.v3.MinimumClustersValidator" };
}

export const MinimumClustersValidator: MessageFns<
  MinimumClustersValidator,
  "envoy.extensions.config.validators.minimum_clusters.v3.MinimumClustersValidator"
> = {
  $type: "envoy.extensions.config.validators.minimum_clusters.v3.MinimumClustersValidator" as const,

  encode(message: MinimumClustersValidator, writer: BinaryWriter = new BinaryWriter()): BinaryWriter {
    if (message.min_clusters_num !== undefined && message.min_clusters_num !== 0) {
      writer.uint32(8).uint32(message.min_clusters_num);
    }
    return writer;
  },

  decode(input: BinaryReader | Uint8Array, length?: number): MinimumClustersValidator {
    const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseMinimumClustersValidator();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1: {
          if (tag !== 8) {
            break;
          }

          message.min_clusters_num = reader.uint32();
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

  fromJSON(object: any): MinimumClustersValidator {
    return {
      $type: MinimumClustersValidator.$type,
      min_clusters_num: isSet(object.min_clusters_num) ? globalThis.Number(object.min_clusters_num) : undefined,
    };
  },

  toJSON(message: MinimumClustersValidator): unknown {
    const obj: any = {};
    if (message.min_clusters_num !== undefined) {
      obj.min_clusters_num = Math.round(message.min_clusters_num);
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<MinimumClustersValidator>, I>>(base?: I): MinimumClustersValidator {
    return MinimumClustersValidator.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<MinimumClustersValidator>, I>>(object: I): MinimumClustersValidator {
    const message = createBaseMinimumClustersValidator();
    message.min_clusters_num = object.min_clusters_num ?? undefined;
    return message;
  },
};

messageTypeRegistry.set(MinimumClustersValidator.$type, MinimumClustersValidator);

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
