// Code generated by protoc-gen-ts_proto. DO NOT EDIT.
// versions:
//   protoc-gen-ts_proto  v2.2.7
//   protoc               unknown
// source: envoy/extensions/matching/input_matchers/consistent_hashing/v3/consistent_hashing.proto

/* eslint-disable */
import { BinaryReader, BinaryWriter } from "@bufbuild/protobuf/wire";
import { messageTypeRegistry } from "../../../../../../typeRegistry";

export const protobufPackage = "envoy.extensions.matching.input_matchers.consistent_hashing.v3";

/**
 * The consistent hashing matchers computes a consistent hash from the input and matches if the resulting hash
 * is within the configured threshold.
 * More specifically, this matcher evaluates to true if hash(input, seed) % modulo >= threshold.
 * Note that the consistency of the match result relies on the internal hash function (xxhash) remaining
 * unchanged. While this is unlikely to happen intentionally, this could cause inconsistent match results
 * between deployments.
 */
export interface ConsistentHashing {
  $type: "envoy.extensions.matching.input_matchers.consistent_hashing.v3.ConsistentHashing";
  /**
   * The threshold the resulting hash must be over in order for this matcher to evaluate to true.
   * This value must be below the configured modulo value.
   * Setting this to 0 is equivalent to this matcher always matching.
   */
  threshold?:
    | number
    | undefined;
  /**
   * The value to use for the modulus in the calculation. This effectively  bounds the hash output,
   * specifying the range of possible values.
   * This value must be above the configured threshold.
   */
  modulo?:
    | number
    | undefined;
  /**
   * Optional seed passed through the hash function. This allows using additional information when computing
   * the hash value: by changing the seed value, a different partition of matching and non-matching inputs will
   * be created that remains consistent for that seed value.
   */
  seed?: number | undefined;
}

function createBaseConsistentHashing(): ConsistentHashing {
  return { $type: "envoy.extensions.matching.input_matchers.consistent_hashing.v3.ConsistentHashing" };
}

export const ConsistentHashing: MessageFns<
  ConsistentHashing,
  "envoy.extensions.matching.input_matchers.consistent_hashing.v3.ConsistentHashing"
> = {
  $type: "envoy.extensions.matching.input_matchers.consistent_hashing.v3.ConsistentHashing" as const,

  encode(message: ConsistentHashing, writer: BinaryWriter = new BinaryWriter()): BinaryWriter {
    if (message.threshold !== undefined && message.threshold !== 0) {
      writer.uint32(8).uint32(message.threshold);
    }
    if (message.modulo !== undefined && message.modulo !== 0) {
      writer.uint32(16).uint32(message.modulo);
    }
    if (message.seed !== undefined && message.seed !== 0) {
      writer.uint32(24).uint64(message.seed);
    }
    return writer;
  },

  decode(input: BinaryReader | Uint8Array, length?: number): ConsistentHashing {
    const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseConsistentHashing();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1: {
          if (tag !== 8) {
            break;
          }

          message.threshold = reader.uint32();
          continue;
        }
        case 2: {
          if (tag !== 16) {
            break;
          }

          message.modulo = reader.uint32();
          continue;
        }
        case 3: {
          if (tag !== 24) {
            break;
          }

          message.seed = longToNumber(reader.uint64());
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

  fromJSON(object: any): ConsistentHashing {
    return {
      $type: ConsistentHashing.$type,
      threshold: isSet(object.threshold) ? globalThis.Number(object.threshold) : undefined,
      modulo: isSet(object.modulo) ? globalThis.Number(object.modulo) : undefined,
      seed: isSet(object.seed) ? globalThis.Number(object.seed) : undefined,
    };
  },

  toJSON(message: ConsistentHashing): unknown {
    const obj: any = {};
    if (message.threshold !== undefined) {
      obj.threshold = Math.round(message.threshold);
    }
    if (message.modulo !== undefined) {
      obj.modulo = Math.round(message.modulo);
    }
    if (message.seed !== undefined) {
      obj.seed = Math.round(message.seed);
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<ConsistentHashing>, I>>(base?: I): ConsistentHashing {
    return ConsistentHashing.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<ConsistentHashing>, I>>(object: I): ConsistentHashing {
    const message = createBaseConsistentHashing();
    message.threshold = object.threshold ?? undefined;
    message.modulo = object.modulo ?? undefined;
    message.seed = object.seed ?? undefined;
    return message;
  },
};

messageTypeRegistry.set(ConsistentHashing.$type, ConsistentHashing);

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

function longToNumber(int64: { toString(): string }): number {
  const num = globalThis.Number(int64.toString());
  if (num > globalThis.Number.MAX_SAFE_INTEGER) {
    throw new globalThis.Error("Value is larger than Number.MAX_SAFE_INTEGER");
  }
  if (num < globalThis.Number.MIN_SAFE_INTEGER) {
    throw new globalThis.Error("Value is smaller than Number.MIN_SAFE_INTEGER");
  }
  return num;
}

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
