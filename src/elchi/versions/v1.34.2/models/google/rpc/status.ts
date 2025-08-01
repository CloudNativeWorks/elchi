// Code generated by protoc-gen-ts_proto. DO NOT EDIT.
// versions:
//   protoc-gen-ts_proto  v2.2.7
//   protoc               unknown
// source: google/rpc/status.proto

/* eslint-disable */
import { BinaryReader, BinaryWriter } from "@bufbuild/protobuf/wire";
import { messageTypeRegistry } from "../../typeRegistry";
import { Any } from "../protobuf/any";

export const protobufPackage = "google.rpc";

/**
 * The `Status` type defines a logical error model that is suitable for
 * different programming environments, including REST APIs and RPC APIs. It is
 * used by [gRPC](https://github.com/grpc). Each `Status` message contains
 * three pieces of data: error code, error message, and error details.
 *
 * You can find out more about this error model and how to work with it in the
 * [API Design Guide](https://cloud.google.com/apis/design/errors).
 */
export interface Status {
  $type: "google.rpc.Status";
  /** The status code, which should be an enum value of [google.rpc.Code][google.rpc.Code]. */
  code?:
    | number
    | undefined;
  /**
   * A developer-facing error message, which should be in English. Any
   * user-facing error message should be localized and sent in the
   * [google.rpc.Status.details][google.rpc.Status.details] field, or localized by the client.
   */
  message?:
    | string
    | undefined;
  /**
   * A list of messages that carry the error details.  There is a common set of
   * message types for APIs to use.
   */
  details?: Any[] | undefined;
}

function createBaseStatus(): Status {
  return { $type: "google.rpc.Status" };
}

export const Status: MessageFns<Status, "google.rpc.Status"> = {
  $type: "google.rpc.Status" as const,

  encode(message: Status, writer: BinaryWriter = new BinaryWriter()): BinaryWriter {
    if (message.code !== undefined && message.code !== 0) {
      writer.uint32(8).int32(message.code);
    }
    if (message.message !== undefined && message.message !== "") {
      writer.uint32(18).string(message.message);
    }
    if (message.details !== undefined && message.details.length !== 0) {
      for (const v of message.details) {
        Any.encode(v!, writer.uint32(26).fork()).join();
      }
    }
    return writer;
  },

  decode(input: BinaryReader | Uint8Array, length?: number): Status {
    const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseStatus();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1: {
          if (tag !== 8) {
            break;
          }

          message.code = reader.int32();
          continue;
        }
        case 2: {
          if (tag !== 18) {
            break;
          }

          message.message = reader.string();
          continue;
        }
        case 3: {
          if (tag !== 26) {
            break;
          }

          if (message.details === undefined) {
            message.details = [];
          }
          const el = Any.decode(reader, reader.uint32());
          if (el !== undefined) {
            message.details!.push(el);
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

  fromJSON(object: any): Status {
    return {
      $type: Status.$type,
      code: isSet(object.code) ? globalThis.Number(object.code) : undefined,
      message: isSet(object.message) ? globalThis.String(object.message) : undefined,
      details: globalThis.Array.isArray(object?.details) ? object.details.map((e: any) => Any.fromJSON(e)) : undefined,
    };
  },

  toJSON(message: Status): unknown {
    const obj: any = {};
    if (message.code !== undefined) {
      obj.code = Math.round(message.code);
    }
    if (message.message !== undefined) {
      obj.message = message.message;
    }
    if (message.details?.length) {
      obj.details = message.details.map((e) => Any.toJSON(e));
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<Status>, I>>(base?: I): Status {
    return Status.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<Status>, I>>(object: I): Status {
    const message = createBaseStatus();
    message.code = object.code ?? undefined;
    message.message = object.message ?? undefined;
    message.details = object.details?.map((e) => Any.fromPartial(e)) || undefined;
    return message;
  },
};

messageTypeRegistry.set(Status.$type, Status);

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
