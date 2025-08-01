// Code generated by protoc-gen-ts_proto. DO NOT EDIT.
// versions:
//   protoc-gen-ts_proto  v2.2.7
//   protoc               unknown
// source: envoy/extensions/outlier_detection_monitors/common/v3/error_types.proto

/* eslint-disable */
import { BinaryReader, BinaryWriter } from "@bufbuild/protobuf/wire";
import { messageTypeRegistry } from "../../../../../typeRegistry";
import { Int32Range } from "../../../../type/v3/range";

export const protobufPackage = "envoy.extensions.outlier_detection_monitors.common.v3";

/**
 * [#protodoc-title: Outlier detection error buckets]
 * Error bucket for HTTP codes.
 * [#not-implemented-hide:]
 */
export interface HttpErrors {
  $type: "envoy.extensions.outlier_detection_monitors.common.v3.HttpErrors";
  range?: Int32Range | undefined;
}

/**
 * Error bucket for locally originated errors.
 * [#not-implemented-hide:]
 */
export interface LocalOriginErrors {
  $type: "envoy.extensions.outlier_detection_monitors.common.v3.LocalOriginErrors";
}

/**
 * Error bucket for database errors.
 * Sub-parameters may be added later, like malformed response, error on write, etc.
 * [#not-implemented-hide:]
 */
export interface DatabaseErrors {
  $type: "envoy.extensions.outlier_detection_monitors.common.v3.DatabaseErrors";
}

/**
 * Union of possible error buckets.
 * [#not-implemented-hide:]
 */
export interface ErrorBuckets {
  $type: "envoy.extensions.outlier_detection_monitors.common.v3.ErrorBuckets";
  /** List of buckets "catching" HTTP codes. */
  http_errors?:
    | HttpErrors[]
    | undefined;
  /** List of buckets "catching" locally originated errors. */
  local_origin_errors?:
    | LocalOriginErrors[]
    | undefined;
  /** List of buckets "catching" database errors. */
  database_errors?: DatabaseErrors[] | undefined;
}

function createBaseHttpErrors(): HttpErrors {
  return { $type: "envoy.extensions.outlier_detection_monitors.common.v3.HttpErrors" };
}

export const HttpErrors: MessageFns<HttpErrors, "envoy.extensions.outlier_detection_monitors.common.v3.HttpErrors"> = {
  $type: "envoy.extensions.outlier_detection_monitors.common.v3.HttpErrors" as const,

  encode(message: HttpErrors, writer: BinaryWriter = new BinaryWriter()): BinaryWriter {
    if (message.range !== undefined) {
      Int32Range.encode(message.range, writer.uint32(10).fork()).join();
    }
    return writer;
  },

  decode(input: BinaryReader | Uint8Array, length?: number): HttpErrors {
    const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseHttpErrors();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1: {
          if (tag !== 10) {
            break;
          }

          message.range = Int32Range.decode(reader, reader.uint32());
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

  fromJSON(object: any): HttpErrors {
    return { $type: HttpErrors.$type, range: isSet(object.range) ? Int32Range.fromJSON(object.range) : undefined };
  },

  toJSON(message: HttpErrors): unknown {
    const obj: any = {};
    if (message.range !== undefined) {
      obj.range = Int32Range.toJSON(message.range);
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<HttpErrors>, I>>(base?: I): HttpErrors {
    return HttpErrors.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<HttpErrors>, I>>(object: I): HttpErrors {
    const message = createBaseHttpErrors();
    message.range = (object.range !== undefined && object.range !== null)
      ? Int32Range.fromPartial(object.range)
      : undefined;
    return message;
  },
};

messageTypeRegistry.set(HttpErrors.$type, HttpErrors);

function createBaseLocalOriginErrors(): LocalOriginErrors {
  return { $type: "envoy.extensions.outlier_detection_monitors.common.v3.LocalOriginErrors" };
}

export const LocalOriginErrors: MessageFns<
  LocalOriginErrors,
  "envoy.extensions.outlier_detection_monitors.common.v3.LocalOriginErrors"
> = {
  $type: "envoy.extensions.outlier_detection_monitors.common.v3.LocalOriginErrors" as const,

  encode(_: LocalOriginErrors, writer: BinaryWriter = new BinaryWriter()): BinaryWriter {
    return writer;
  },

  decode(input: BinaryReader | Uint8Array, length?: number): LocalOriginErrors {
    const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseLocalOriginErrors();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skip(tag & 7);
    }
    return message;
  },

  fromJSON(_: any): LocalOriginErrors {
    return { $type: LocalOriginErrors.$type };
  },

  toJSON(_: LocalOriginErrors): unknown {
    const obj: any = {};
    return obj;
  },

  create<I extends Exact<DeepPartial<LocalOriginErrors>, I>>(base?: I): LocalOriginErrors {
    return LocalOriginErrors.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<LocalOriginErrors>, I>>(_: I): LocalOriginErrors {
    const message = createBaseLocalOriginErrors();
    return message;
  },
};

messageTypeRegistry.set(LocalOriginErrors.$type, LocalOriginErrors);

function createBaseDatabaseErrors(): DatabaseErrors {
  return { $type: "envoy.extensions.outlier_detection_monitors.common.v3.DatabaseErrors" };
}

export const DatabaseErrors: MessageFns<
  DatabaseErrors,
  "envoy.extensions.outlier_detection_monitors.common.v3.DatabaseErrors"
> = {
  $type: "envoy.extensions.outlier_detection_monitors.common.v3.DatabaseErrors" as const,

  encode(_: DatabaseErrors, writer: BinaryWriter = new BinaryWriter()): BinaryWriter {
    return writer;
  },

  decode(input: BinaryReader | Uint8Array, length?: number): DatabaseErrors {
    const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseDatabaseErrors();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skip(tag & 7);
    }
    return message;
  },

  fromJSON(_: any): DatabaseErrors {
    return { $type: DatabaseErrors.$type };
  },

  toJSON(_: DatabaseErrors): unknown {
    const obj: any = {};
    return obj;
  },

  create<I extends Exact<DeepPartial<DatabaseErrors>, I>>(base?: I): DatabaseErrors {
    return DatabaseErrors.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<DatabaseErrors>, I>>(_: I): DatabaseErrors {
    const message = createBaseDatabaseErrors();
    return message;
  },
};

messageTypeRegistry.set(DatabaseErrors.$type, DatabaseErrors);

function createBaseErrorBuckets(): ErrorBuckets {
  return { $type: "envoy.extensions.outlier_detection_monitors.common.v3.ErrorBuckets" };
}

export const ErrorBuckets: MessageFns<
  ErrorBuckets,
  "envoy.extensions.outlier_detection_monitors.common.v3.ErrorBuckets"
> = {
  $type: "envoy.extensions.outlier_detection_monitors.common.v3.ErrorBuckets" as const,

  encode(message: ErrorBuckets, writer: BinaryWriter = new BinaryWriter()): BinaryWriter {
    if (message.http_errors !== undefined && message.http_errors.length !== 0) {
      for (const v of message.http_errors) {
        HttpErrors.encode(v!, writer.uint32(10).fork()).join();
      }
    }
    if (message.local_origin_errors !== undefined && message.local_origin_errors.length !== 0) {
      for (const v of message.local_origin_errors) {
        LocalOriginErrors.encode(v!, writer.uint32(18).fork()).join();
      }
    }
    if (message.database_errors !== undefined && message.database_errors.length !== 0) {
      for (const v of message.database_errors) {
        DatabaseErrors.encode(v!, writer.uint32(26).fork()).join();
      }
    }
    return writer;
  },

  decode(input: BinaryReader | Uint8Array, length?: number): ErrorBuckets {
    const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseErrorBuckets();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1: {
          if (tag !== 10) {
            break;
          }

          if (message.http_errors === undefined) {
            message.http_errors = [];
          }
          const el = HttpErrors.decode(reader, reader.uint32());
          if (el !== undefined) {
            message.http_errors!.push(el);
          }
          continue;
        }
        case 2: {
          if (tag !== 18) {
            break;
          }

          if (message.local_origin_errors === undefined) {
            message.local_origin_errors = [];
          }
          const el = LocalOriginErrors.decode(reader, reader.uint32());
          if (el !== undefined) {
            message.local_origin_errors!.push(el);
          }
          continue;
        }
        case 3: {
          if (tag !== 26) {
            break;
          }

          if (message.database_errors === undefined) {
            message.database_errors = [];
          }
          const el = DatabaseErrors.decode(reader, reader.uint32());
          if (el !== undefined) {
            message.database_errors!.push(el);
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

  fromJSON(object: any): ErrorBuckets {
    return {
      $type: ErrorBuckets.$type,
      http_errors: globalThis.Array.isArray(object?.http_errors)
        ? object.http_errors.map((e: any) => HttpErrors.fromJSON(e))
        : undefined,
      local_origin_errors: globalThis.Array.isArray(object?.local_origin_errors)
        ? object.local_origin_errors.map((e: any) => LocalOriginErrors.fromJSON(e))
        : undefined,
      database_errors: globalThis.Array.isArray(object?.database_errors)
        ? object.database_errors.map((e: any) => DatabaseErrors.fromJSON(e))
        : undefined,
    };
  },

  toJSON(message: ErrorBuckets): unknown {
    const obj: any = {};
    if (message.http_errors?.length) {
      obj.http_errors = message.http_errors.map((e) => HttpErrors.toJSON(e));
    }
    if (message.local_origin_errors?.length) {
      obj.local_origin_errors = message.local_origin_errors.map((e) => LocalOriginErrors.toJSON(e));
    }
    if (message.database_errors?.length) {
      obj.database_errors = message.database_errors.map((e) => DatabaseErrors.toJSON(e));
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<ErrorBuckets>, I>>(base?: I): ErrorBuckets {
    return ErrorBuckets.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<ErrorBuckets>, I>>(object: I): ErrorBuckets {
    const message = createBaseErrorBuckets();
    message.http_errors = object.http_errors?.map((e) => HttpErrors.fromPartial(e)) || undefined;
    message.local_origin_errors = object.local_origin_errors?.map((e) => LocalOriginErrors.fromPartial(e)) || undefined;
    message.database_errors = object.database_errors?.map((e) => DatabaseErrors.fromPartial(e)) || undefined;
    return message;
  },
};

messageTypeRegistry.set(ErrorBuckets.$type, ErrorBuckets);

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
