// Code generated by protoc-gen-ts_proto. DO NOT EDIT.
// versions:
//   protoc-gen-ts_proto  v2.2.7
//   protoc               unknown
// source: envoy/admin/v2alpha/mutex_stats.proto

/* eslint-disable */
import { BinaryReader, BinaryWriter } from "@bufbuild/protobuf/wire";
import { messageTypeRegistry } from "../../../typeRegistry";

export const protobufPackage = "envoy.admin.v2alpha";

/**
 * Proto representation of the statistics collected upon absl::Mutex contention, if Envoy is run
 * under :option:`--enable-mutex-tracing`. For more information, see the `absl::Mutex`
 * [docs](https://abseil.io/about/design/mutex#extra-features).
 *
 * *NB*: The wait cycles below are measured by `absl::base_internal::CycleClock`, and may not
 * correspond to core clock frequency. For more information, see the `CycleClock`
 * [docs](https://github.com/abseil/abseil-cpp/blob/master/absl/base/internal/cycleclock.h).
 */
export interface MutexStats {
  $type: "envoy.admin.v2alpha.MutexStats";
  /** The number of individual mutex contentions which have occurred since startup. */
  num_contentions?:
    | number
    | undefined;
  /** The length of the current contention wait cycle. */
  current_wait_cycles?:
    | number
    | undefined;
  /** The lifetime total of all contention wait cycles. */
  lifetime_wait_cycles?: number | undefined;
}

function createBaseMutexStats(): MutexStats {
  return { $type: "envoy.admin.v2alpha.MutexStats" };
}

export const MutexStats: MessageFns<MutexStats, "envoy.admin.v2alpha.MutexStats"> = {
  $type: "envoy.admin.v2alpha.MutexStats" as const,

  encode(message: MutexStats, writer: BinaryWriter = new BinaryWriter()): BinaryWriter {
    if (message.num_contentions !== undefined && message.num_contentions !== 0) {
      writer.uint32(8).uint64(message.num_contentions);
    }
    if (message.current_wait_cycles !== undefined && message.current_wait_cycles !== 0) {
      writer.uint32(16).uint64(message.current_wait_cycles);
    }
    if (message.lifetime_wait_cycles !== undefined && message.lifetime_wait_cycles !== 0) {
      writer.uint32(24).uint64(message.lifetime_wait_cycles);
    }
    return writer;
  },

  decode(input: BinaryReader | Uint8Array, length?: number): MutexStats {
    const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseMutexStats();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1: {
          if (tag !== 8) {
            break;
          }

          message.num_contentions = longToNumber(reader.uint64());
          continue;
        }
        case 2: {
          if (tag !== 16) {
            break;
          }

          message.current_wait_cycles = longToNumber(reader.uint64());
          continue;
        }
        case 3: {
          if (tag !== 24) {
            break;
          }

          message.lifetime_wait_cycles = longToNumber(reader.uint64());
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

  fromJSON(object: any): MutexStats {
    return {
      $type: MutexStats.$type,
      num_contentions: isSet(object.num_contentions) ? globalThis.Number(object.num_contentions) : undefined,
      current_wait_cycles: isSet(object.current_wait_cycles)
        ? globalThis.Number(object.current_wait_cycles)
        : undefined,
      lifetime_wait_cycles: isSet(object.lifetime_wait_cycles)
        ? globalThis.Number(object.lifetime_wait_cycles)
        : undefined,
    };
  },

  toJSON(message: MutexStats): unknown {
    const obj: any = {};
    if (message.num_contentions !== undefined) {
      obj.num_contentions = Math.round(message.num_contentions);
    }
    if (message.current_wait_cycles !== undefined) {
      obj.current_wait_cycles = Math.round(message.current_wait_cycles);
    }
    if (message.lifetime_wait_cycles !== undefined) {
      obj.lifetime_wait_cycles = Math.round(message.lifetime_wait_cycles);
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<MutexStats>, I>>(base?: I): MutexStats {
    return MutexStats.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<MutexStats>, I>>(object: I): MutexStats {
    const message = createBaseMutexStats();
    message.num_contentions = object.num_contentions ?? undefined;
    message.current_wait_cycles = object.current_wait_cycles ?? undefined;
    message.lifetime_wait_cycles = object.lifetime_wait_cycles ?? undefined;
    return message;
  },
};

messageTypeRegistry.set(MutexStats.$type, MutexStats);

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
