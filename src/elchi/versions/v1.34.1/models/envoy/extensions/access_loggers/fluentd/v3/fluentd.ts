// Code generated by protoc-gen-ts_proto. DO NOT EDIT.
// versions:
//   protoc-gen-ts_proto  v2.2.7
//   protoc               unknown
// source: envoy/extensions/access_loggers/fluentd/v3/fluentd.proto

/* eslint-disable */
import { BinaryReader, BinaryWriter } from "@bufbuild/protobuf/wire";
import { Duration } from "../../../../../google/protobuf/duration";
import { Struct } from "../../../../../google/protobuf/struct";
import { UInt32Value } from "../../../../../google/protobuf/wrappers";
import { messageTypeRegistry } from "../../../../../typeRegistry";
import { BackoffStrategy } from "../../../../config/core/v3/backoff";
import { TypedExtensionConfig } from "../../../../config/core/v3/extension";

export const protobufPackage = "envoy.extensions.access_loggers.fluentd.v3";

/**
 * Configuration for the *envoy.access_loggers.fluentd* :ref:`AccessLog <envoy_v3_api_msg_config.accesslog.v3.AccessLog>`.
 * This access log extension will send the emitted access logs over a TCP connection to an upstream that is accepting
 * the Fluentd Forward Protocol as described in: `Fluentd Forward Protocol Specification
 * <https://github.com/fluent/fluentd/wiki/Forward-Protocol-Specification-v1>`_.
 * [#extension: envoy.access_loggers.fluentd]
 * [#next-free-field: 9]
 */
export interface FluentdAccessLogConfig {
  $type: "envoy.extensions.access_loggers.fluentd.v3.FluentdAccessLogConfig";
  /** The upstream cluster to connect to for streaming the Fluentd messages. */
  cluster?:
    | string
    | undefined;
  /**
   * A tag is a string separated with '.' (e.g. log.type) to categorize events.
   * See: https://github.com/fluent/fluentd/wiki/Forward-Protocol-Specification-v1#message-modes
   */
  tag?:
    | string
    | undefined;
  /** The prefix to use when emitting :ref:`statistics <config_access_log_stats>`. */
  stat_prefix?:
    | string
    | undefined;
  /**
   * Interval for flushing access logs to the TCP stream. Logger will flush requests every time
   * this interval is elapsed, or when batch size limit is hit, whichever comes first. Defaults to
   * 1 second.
   */
  buffer_flush_interval?:
    | Duration
    | undefined;
  /**
   * Soft size limit in bytes for access log entries buffer. The logger will buffer requests until
   * this limit it hit, or every time flush interval is elapsed, whichever comes first. When the buffer
   * limit is hit, the logger will immediately flush the buffer contents. Setting it to zero effectively
   * disables the batching. Defaults to 16384.
   */
  buffer_size_bytes?:
    | number
    | undefined;
  /**
   * A struct that represents the record that is sent for each log entry.
   * https://github.com/fluent/fluentd/wiki/Forward-Protocol-Specification-v1#entry
   * Values are rendered as strings, numbers, or boolean values as appropriate.
   * Nested JSON objects may be produced by some command operators (e.g. FILTER_STATE or DYNAMIC_METADATA).
   * See :ref:`format string<config_access_log_format_strings>` documentation for a specific command operator details.
   *
   * .. validated-code-block:: yaml
   *   :type-name: envoy.extensions.access_loggers.fluentd.v3.FluentdAccessLogConfig
   *
   *   record:
   *     status: "%RESPONSE_CODE%"
   *     message: "%LOCAL_REPLY_BODY%"
   *
   * The following msgpack record would be created:
   *
   * .. code-block:: json
   *
   *  {
   *    "status": 500,
   *    "message": "My error message"
   *  }
   */
  record?:
    | { [key: string]: any }
    | undefined;
  /**
   * Optional retry, in case upstream connection has failed. If this field is not set, the default values will be applied,
   * as specified in the :ref:`RetryOptions <envoy_v3_api_msg_extensions.access_loggers.fluentd.v3.FluentdAccessLogConfig.RetryOptions>`
   * configuration.
   */
  retry_options?:
    | FluentdAccessLogConfig_RetryOptions
    | undefined;
  /**
   * Specifies a collection of Formatter plugins that can be called from the access log configuration.
   * See the formatters extensions documentation for details.
   * [#extension-category: envoy.formatter]
   */
  formatters?: TypedExtensionConfig[] | undefined;
}

export interface FluentdAccessLogConfig_RetryOptions {
  $type: "envoy.extensions.access_loggers.fluentd.v3.FluentdAccessLogConfig.RetryOptions";
  /**
   * The number of times the logger will attempt to connect to the upstream during reconnects.
   * By default, there is no limit. The logger will attempt to reconnect to the upstream each time
   * connecting to the upstream failed or the upstream connection had been closed for any reason.
   */
  max_connect_attempts?:
    | number
    | undefined;
  /**
   * Sets the backoff strategy. If this value is not set, the default base backoff interval is 500
   * milliseconds and the default max backoff interval is 5 seconds (10 times the base interval).
   */
  backoff_options?: BackoffStrategy | undefined;
}

function createBaseFluentdAccessLogConfig(): FluentdAccessLogConfig {
  return { $type: "envoy.extensions.access_loggers.fluentd.v3.FluentdAccessLogConfig" };
}

export const FluentdAccessLogConfig: MessageFns<
  FluentdAccessLogConfig,
  "envoy.extensions.access_loggers.fluentd.v3.FluentdAccessLogConfig"
> = {
  $type: "envoy.extensions.access_loggers.fluentd.v3.FluentdAccessLogConfig" as const,

  encode(message: FluentdAccessLogConfig, writer: BinaryWriter = new BinaryWriter()): BinaryWriter {
    if (message.cluster !== undefined && message.cluster !== "") {
      writer.uint32(10).string(message.cluster);
    }
    if (message.tag !== undefined && message.tag !== "") {
      writer.uint32(18).string(message.tag);
    }
    if (message.stat_prefix !== undefined && message.stat_prefix !== "") {
      writer.uint32(26).string(message.stat_prefix);
    }
    if (message.buffer_flush_interval !== undefined) {
      Duration.encode(message.buffer_flush_interval, writer.uint32(34).fork()).join();
    }
    if (message.buffer_size_bytes !== undefined) {
      UInt32Value.encode(
        { $type: "google.protobuf.UInt32Value", value: message.buffer_size_bytes! },
        writer.uint32(42).fork(),
      ).join();
    }
    if (message.record !== undefined) {
      Struct.encode(Struct.wrap(message.record), writer.uint32(50).fork()).join();
    }
    if (message.retry_options !== undefined) {
      FluentdAccessLogConfig_RetryOptions.encode(message.retry_options, writer.uint32(58).fork()).join();
    }
    if (message.formatters !== undefined && message.formatters.length !== 0) {
      for (const v of message.formatters) {
        TypedExtensionConfig.encode(v!, writer.uint32(66).fork()).join();
      }
    }
    return writer;
  },

  decode(input: BinaryReader | Uint8Array, length?: number): FluentdAccessLogConfig {
    const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseFluentdAccessLogConfig();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1: {
          if (tag !== 10) {
            break;
          }

          message.cluster = reader.string();
          continue;
        }
        case 2: {
          if (tag !== 18) {
            break;
          }

          message.tag = reader.string();
          continue;
        }
        case 3: {
          if (tag !== 26) {
            break;
          }

          message.stat_prefix = reader.string();
          continue;
        }
        case 4: {
          if (tag !== 34) {
            break;
          }

          message.buffer_flush_interval = Duration.decode(reader, reader.uint32());
          continue;
        }
        case 5: {
          if (tag !== 42) {
            break;
          }

          message.buffer_size_bytes = UInt32Value.decode(reader, reader.uint32()).value;
          continue;
        }
        case 6: {
          if (tag !== 50) {
            break;
          }

          message.record = Struct.unwrap(Struct.decode(reader, reader.uint32()));
          continue;
        }
        case 7: {
          if (tag !== 58) {
            break;
          }

          message.retry_options = FluentdAccessLogConfig_RetryOptions.decode(reader, reader.uint32());
          continue;
        }
        case 8: {
          if (tag !== 66) {
            break;
          }

          if (message.formatters === undefined) {
            message.formatters = [];
          }
          const el = TypedExtensionConfig.decode(reader, reader.uint32());
          if (el !== undefined) {
            message.formatters!.push(el);
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

  fromJSON(object: any): FluentdAccessLogConfig {
    return {
      $type: FluentdAccessLogConfig.$type,
      cluster: isSet(object.cluster) ? globalThis.String(object.cluster) : undefined,
      tag: isSet(object.tag) ? globalThis.String(object.tag) : undefined,
      stat_prefix: isSet(object.stat_prefix) ? globalThis.String(object.stat_prefix) : undefined,
      buffer_flush_interval: isSet(object.buffer_flush_interval)
        ? Duration.fromJSON(object.buffer_flush_interval)
        : undefined,
      buffer_size_bytes: isSet(object.buffer_size_bytes) ? Number(object.buffer_size_bytes) : undefined,
      record: isObject(object.record) ? object.record : undefined,
      retry_options: isSet(object.retry_options)
        ? FluentdAccessLogConfig_RetryOptions.fromJSON(object.retry_options)
        : undefined,
      formatters: globalThis.Array.isArray(object?.formatters)
        ? object.formatters.map((e: any) => TypedExtensionConfig.fromJSON(e))
        : undefined,
    };
  },

  toJSON(message: FluentdAccessLogConfig): unknown {
    const obj: any = {};
    if (message.cluster !== undefined) {
      obj.cluster = message.cluster;
    }
    if (message.tag !== undefined) {
      obj.tag = message.tag;
    }
    if (message.stat_prefix !== undefined) {
      obj.stat_prefix = message.stat_prefix;
    }
    if (message.buffer_flush_interval !== undefined) {
      obj.buffer_flush_interval = Duration.toJSON(message.buffer_flush_interval);
    }
    if (message.buffer_size_bytes !== undefined) {
      obj.buffer_size_bytes = message.buffer_size_bytes;
    }
    if (message.record !== undefined) {
      obj.record = message.record;
    }
    if (message.retry_options !== undefined) {
      obj.retry_options = FluentdAccessLogConfig_RetryOptions.toJSON(message.retry_options);
    }
    if (message.formatters?.length) {
      obj.formatters = message.formatters.map((e) => TypedExtensionConfig.toJSON(e));
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<FluentdAccessLogConfig>, I>>(base?: I): FluentdAccessLogConfig {
    return FluentdAccessLogConfig.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<FluentdAccessLogConfig>, I>>(object: I): FluentdAccessLogConfig {
    const message = createBaseFluentdAccessLogConfig();
    message.cluster = object.cluster ?? undefined;
    message.tag = object.tag ?? undefined;
    message.stat_prefix = object.stat_prefix ?? undefined;
    message.buffer_flush_interval =
      (object.buffer_flush_interval !== undefined && object.buffer_flush_interval !== null)
        ? Duration.fromPartial(object.buffer_flush_interval)
        : undefined;
    message.buffer_size_bytes = object.buffer_size_bytes ?? undefined;
    message.record = object.record ?? undefined;
    message.retry_options = (object.retry_options !== undefined && object.retry_options !== null)
      ? FluentdAccessLogConfig_RetryOptions.fromPartial(object.retry_options)
      : undefined;
    message.formatters = object.formatters?.map((e) => TypedExtensionConfig.fromPartial(e)) || undefined;
    return message;
  },
};

messageTypeRegistry.set(FluentdAccessLogConfig.$type, FluentdAccessLogConfig);

function createBaseFluentdAccessLogConfig_RetryOptions(): FluentdAccessLogConfig_RetryOptions {
  return { $type: "envoy.extensions.access_loggers.fluentd.v3.FluentdAccessLogConfig.RetryOptions" };
}

export const FluentdAccessLogConfig_RetryOptions: MessageFns<
  FluentdAccessLogConfig_RetryOptions,
  "envoy.extensions.access_loggers.fluentd.v3.FluentdAccessLogConfig.RetryOptions"
> = {
  $type: "envoy.extensions.access_loggers.fluentd.v3.FluentdAccessLogConfig.RetryOptions" as const,

  encode(message: FluentdAccessLogConfig_RetryOptions, writer: BinaryWriter = new BinaryWriter()): BinaryWriter {
    if (message.max_connect_attempts !== undefined) {
      UInt32Value.encode(
        { $type: "google.protobuf.UInt32Value", value: message.max_connect_attempts! },
        writer.uint32(10).fork(),
      ).join();
    }
    if (message.backoff_options !== undefined) {
      BackoffStrategy.encode(message.backoff_options, writer.uint32(18).fork()).join();
    }
    return writer;
  },

  decode(input: BinaryReader | Uint8Array, length?: number): FluentdAccessLogConfig_RetryOptions {
    const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseFluentdAccessLogConfig_RetryOptions();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1: {
          if (tag !== 10) {
            break;
          }

          message.max_connect_attempts = UInt32Value.decode(reader, reader.uint32()).value;
          continue;
        }
        case 2: {
          if (tag !== 18) {
            break;
          }

          message.backoff_options = BackoffStrategy.decode(reader, reader.uint32());
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

  fromJSON(object: any): FluentdAccessLogConfig_RetryOptions {
    return {
      $type: FluentdAccessLogConfig_RetryOptions.$type,
      max_connect_attempts: isSet(object.max_connect_attempts) ? Number(object.max_connect_attempts) : undefined,
      backoff_options: isSet(object.backoff_options) ? BackoffStrategy.fromJSON(object.backoff_options) : undefined,
    };
  },

  toJSON(message: FluentdAccessLogConfig_RetryOptions): unknown {
    const obj: any = {};
    if (message.max_connect_attempts !== undefined) {
      obj.max_connect_attempts = message.max_connect_attempts;
    }
    if (message.backoff_options !== undefined) {
      obj.backoff_options = BackoffStrategy.toJSON(message.backoff_options);
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<FluentdAccessLogConfig_RetryOptions>, I>>(
    base?: I,
  ): FluentdAccessLogConfig_RetryOptions {
    return FluentdAccessLogConfig_RetryOptions.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<FluentdAccessLogConfig_RetryOptions>, I>>(
    object: I,
  ): FluentdAccessLogConfig_RetryOptions {
    const message = createBaseFluentdAccessLogConfig_RetryOptions();
    message.max_connect_attempts = object.max_connect_attempts ?? undefined;
    message.backoff_options = (object.backoff_options !== undefined && object.backoff_options !== null)
      ? BackoffStrategy.fromPartial(object.backoff_options)
      : undefined;
    return message;
  },
};

messageTypeRegistry.set(FluentdAccessLogConfig_RetryOptions.$type, FluentdAccessLogConfig_RetryOptions);

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

function isObject(value: any): boolean {
  return typeof value === "object" && value !== null;
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
