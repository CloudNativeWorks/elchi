// Code generated by protoc-gen-ts_proto. DO NOT EDIT.
// versions:
//   protoc-gen-ts_proto  v2.2.3
//   protoc               unknown
// source: google/protobuf/duration.proto

/* eslint-disable */
import { BinaryReader, BinaryWriter } from "@bufbuild/protobuf/wire";
import { messageTypeRegistry } from "../../typeRegistry";

export const protobufPackage = "google.protobuf";

/**
 * A Duration represents a signed, fixed-length span of time represented
 * as a count of seconds and fractions of seconds at nanosecond
 * resolution. It is independent of any calendar and concepts like "day"
 * or "month". It is related to Timestamp in that the difference between
 * two Timestamp values is a Duration and it can be added or subtracted
 * from a Timestamp. Range is approximately +-10,000 years.
 *
 * # Examples
 *
 * Example 1: Compute Duration from two Timestamps in pseudo code.
 *
 *     Timestamp start = ...;
 *     Timestamp end = ...;
 *     Duration duration = ...;
 *
 *     duration.seconds = end.seconds - start.seconds;
 *     duration.nanos = end.nanos - start.nanos;
 *
 *     if (duration.seconds < 0 && duration.nanos > 0) {
 *       duration.seconds += 1;
 *       duration.nanos -= 1000000000;
 *     } else if (duration.seconds > 0 && duration.nanos < 0) {
 *       duration.seconds -= 1;
 *       duration.nanos += 1000000000;
 *     }
 *
 * Example 2: Compute Timestamp from Timestamp + Duration in pseudo code.
 *
 *     Timestamp start = ...;
 *     Duration duration = ...;
 *     Timestamp end = ...;
 *
 *     end.seconds = start.seconds + duration.seconds;
 *     end.nanos = start.nanos + duration.nanos;
 *
 *     if (end.nanos < 0) {
 *       end.seconds -= 1;
 *       end.nanos += 1000000000;
 *     } else if (end.nanos >= 1000000000) {
 *       end.seconds += 1;
 *       end.nanos -= 1000000000;
 *     }
 *
 * Example 3: Compute Duration from datetime.timedelta in Python.
 *
 *     td = datetime.timedelta(days=3, minutes=10)
 *     duration = Duration()
 *     duration.FromTimedelta(td)
 *
 * # JSON Mapping
 *
 * In JSON format, the Duration type is encoded as a string rather than an
 * object, where the string ends in the suffix "s" (indicating seconds) and
 * is preceded by the number of seconds, with nanoseconds expressed as
 * fractional seconds. For example, 3 seconds with 0 nanoseconds should be
 * encoded in JSON format as "3s", while 3 seconds and 1 nanosecond should
 * be expressed in JSON format as "3.000000001s", and 3 seconds and 1
 * microsecond should be expressed in JSON format as "3.000001s".
 */
export interface Duration {
    $type: "google.protobuf.Duration";
    /**
     * Signed seconds of the span of time. Must be from -315,576,000,000
     * to +315,576,000,000 inclusive. Note: these bounds are computed from:
     * 60 sec/min * 60 min/hr * 24 hr/day * 365.25 days/year * 10000 years
     */
    seconds?:
    | number
    | undefined;
    /**
     * Signed fractions of a second at nanosecond resolution of the span
     * of time. Durations less than one second are represented with a 0
     * `seconds` field and a positive or negative `nanos` field. For durations
     * of one second or more, a non-zero value for the `nanos` field must be
     * of the same sign as the `seconds` field. Must be from -999,999,999
     * to +999,999,999 inclusive.
     */
    nanos?: number | undefined;
}

function createBaseDuration(): Duration {
    return { $type: "google.protobuf.Duration" };
}

export const Duration: MessageFns<Duration, "google.protobuf.Duration"> = {
    $type: "google.protobuf.Duration" as const,

    encode(message: Duration, writer: BinaryWriter = new BinaryWriter()): BinaryWriter {
        if (message.seconds !== undefined && message.seconds !== 0) {
            writer.uint32(8).int64(message.seconds);
        }
        if (message.nanos !== undefined && message.nanos !== 0) {
            writer.uint32(16).int32(message.nanos);
        }
        return writer;
    },

    decode(input: BinaryReader | Uint8Array, length?: number): Duration {
        const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = createBaseDuration();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1: {
                    if (tag !== 8) {
                        break;
                    }

                    message.seconds = longToNumber(reader.int64());
                    continue;
                }
                case 2: {
                    if (tag !== 16) {
                        break;
                    }

                    message.nanos = reader.int32();
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

    fromJSON(object: any): Duration {
        if (typeof object === 'string' && object.endsWith('s')) {
            const [secondsPart, nanosPart] = object.slice(0, -1).split('.');

            return {
                $type: Duration.$type,
                seconds: isSet(secondsPart) ? Number(secondsPart) : 0,
                nanos: isSet(nanosPart) ? Number(nanosPart) : 0,
            };
        } else {
            return {
                $type: Duration.$type,
                seconds: isSet(object.seconds) ? Number(object.seconds) : undefined,
                nanos: isSet(object.nanos) ? Number(object.nanos) : undefined,
            };
        }
    },

    toJSON(message: Duration): unknown {
        if (message.seconds === undefined && message.nanos === undefined) {
            return undefined;
        }

        const seconds = message.seconds ?? 0;
        const nanos = message.nanos ?? 0;

        if (nanos || seconds > 1) {
            return `${seconds}.${String(nanos)}s`;
        } else {
            return `${seconds}s`;
        }
    },

    create<I extends Exact<DeepPartial<Duration>, I>>(base?: I): Duration {
        return Duration.fromPartial(base ?? ({} as any));
    },
    fromPartial<I extends Exact<DeepPartial<Duration>, I>>(object: I): Duration {
        const message = createBaseDuration();
        message.seconds = object.seconds ?? undefined;
        message.nanos = object.nanos ?? undefined;
        return message;
    },
};

messageTypeRegistry.set(Duration.$type, Duration);

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
