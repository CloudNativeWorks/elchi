// Code generated by protoc-gen-ts_proto. DO NOT EDIT.
// versions:
//   protoc-gen-ts_proto  v2.2.7
//   protoc               unknown
// source: envoy/extensions/filters/network/ext_proc/v3/ext_proc.proto

/* eslint-disable */
import { BinaryReader, BinaryWriter } from "@bufbuild/protobuf/wire";
import { Duration } from "../../../../../../google/protobuf/duration";
import { messageTypeRegistry } from "../../../../../../typeRegistry";
import { GrpcService } from "../../../../../config/core/v3/grpc_service";

export const protobufPackage = "envoy.extensions.filters.network.ext_proc.v3";

/**
 * The Network External Processing filter allows an external service to process raw TCP/UDP traffic
 * in a flexible way using a bidirectional gRPC stream. Unlike the HTTP External Processing filter,
 * this filter operates at the L4 (transport) layer, giving access to raw network traffic.
 *
 * The filter communicates with an external gRPC service that can:
 * * Inspect traffic in both directions
 * * Modify the network traffic
 * * Control connection lifecycle (continue, close, or reset)
 *
 * By using the filter's processing mode, you can selectively choose which data
 * directions to process (read, write or both), allowing for efficient processing.
 */
export interface NetworkExternalProcessor {
  $type: "envoy.extensions.filters.network.ext_proc.v3.NetworkExternalProcessor";
  /**
   * The gRPC service that will process network traffic.
   * This service must implement the NetworkExternalProcessor service
   * defined in the proto file /envoy/service/network_ext_proc/v3/external_processor.proto.
   */
  grpc_service?:
    | GrpcService
    | undefined;
  /**
   * By default, if the gRPC stream cannot be established, or if it is closed
   * prematurely with an error, the filter will fail, leading to the close of connection.
   * With this parameter set to true, however, then if the gRPC stream is prematurely closed
   * or could not be opened, processing continues without error.
   * [#not-implemented-hide:]
   */
  failure_mode_allow?:
    | boolean
    | undefined;
  /**
   * Options for controlling processing behavior.
   * [#not-implemented-hide:]
   */
  processing_mode?:
    | ProcessingMode
    | undefined;
  /**
   * Specifies the timeout for each individual message sent on the stream and
   * when the filter is running in synchronous mode. Whenever
   * the proxy sends a message on the stream that requires a response, it will
   * reset this timer, and will stop processing and return an error (subject
   * to the processing mode) if the timer expires. Default is 200 ms.
   * [#not-implemented-hide:]
   */
  message_timeout?: Duration | undefined;
}

/**
 * Options for controlling processing behavior.
 * Filter will reject the config if both read and write are SKIP mode.
 */
export interface ProcessingMode {
  $type: "envoy.extensions.filters.network.ext_proc.v3.ProcessingMode";
  /**
   * Controls whether inbound (read) data from the client is sent to the external processor.
   * Default: STREAMED
   */
  process_read?:
    | ProcessingMode_DataSendMode
    | undefined;
  /**
   * Controls whether outbound (write) data to the client is sent to the external processor.
   * Default: STREAMED
   */
  process_write?: ProcessingMode_DataSendMode | undefined;
}

/** Defines how traffic should be handled by the external processor. */
export enum ProcessingMode_DataSendMode {
  /** STREAMED - Send the data to the external processor for processing whenever the data is ready. */
  STREAMED = "STREAMED",
  /** SKIP - Skip sending the data to the external processor. */
  SKIP = "SKIP",
}

export function processingMode_DataSendModeFromJSON(object: any): ProcessingMode_DataSendMode {
  switch (object) {
    case 0:
    case "STREAMED":
      return ProcessingMode_DataSendMode.STREAMED;
    case 1:
    case "SKIP":
      return ProcessingMode_DataSendMode.SKIP;
    default:
      throw new globalThis.Error("Unrecognized enum value " + object + " for enum ProcessingMode_DataSendMode");
  }
}

export function processingMode_DataSendModeToJSON(object: ProcessingMode_DataSendMode): string {
  switch (object) {
    case ProcessingMode_DataSendMode.STREAMED:
      return "STREAMED";
    case ProcessingMode_DataSendMode.SKIP:
      return "SKIP";
    default:
      throw new globalThis.Error("Unrecognized enum value " + object + " for enum ProcessingMode_DataSendMode");
  }
}

export function processingMode_DataSendModeToNumber(object: ProcessingMode_DataSendMode): number {
  switch (object) {
    case ProcessingMode_DataSendMode.STREAMED:
      return 0;
    case ProcessingMode_DataSendMode.SKIP:
      return 1;
    default:
      throw new globalThis.Error("Unrecognized enum value " + object + " for enum ProcessingMode_DataSendMode");
  }
}

function createBaseNetworkExternalProcessor(): NetworkExternalProcessor {
  return { $type: "envoy.extensions.filters.network.ext_proc.v3.NetworkExternalProcessor" };
}

export const NetworkExternalProcessor: MessageFns<
  NetworkExternalProcessor,
  "envoy.extensions.filters.network.ext_proc.v3.NetworkExternalProcessor"
> = {
  $type: "envoy.extensions.filters.network.ext_proc.v3.NetworkExternalProcessor" as const,

  encode(message: NetworkExternalProcessor, writer: BinaryWriter = new BinaryWriter()): BinaryWriter {
    if (message.grpc_service !== undefined) {
      GrpcService.encode(message.grpc_service, writer.uint32(10).fork()).join();
    }
    if (message.failure_mode_allow !== undefined && message.failure_mode_allow !== false) {
      writer.uint32(16).bool(message.failure_mode_allow);
    }
    if (message.processing_mode !== undefined) {
      ProcessingMode.encode(message.processing_mode, writer.uint32(26).fork()).join();
    }
    if (message.message_timeout !== undefined) {
      Duration.encode(message.message_timeout, writer.uint32(34).fork()).join();
    }
    return writer;
  },

  decode(input: BinaryReader | Uint8Array, length?: number): NetworkExternalProcessor {
    const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseNetworkExternalProcessor();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1: {
          if (tag !== 10) {
            break;
          }

          message.grpc_service = GrpcService.decode(reader, reader.uint32());
          continue;
        }
        case 2: {
          if (tag !== 16) {
            break;
          }

          message.failure_mode_allow = reader.bool();
          continue;
        }
        case 3: {
          if (tag !== 26) {
            break;
          }

          message.processing_mode = ProcessingMode.decode(reader, reader.uint32());
          continue;
        }
        case 4: {
          if (tag !== 34) {
            break;
          }

          message.message_timeout = Duration.decode(reader, reader.uint32());
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

  fromJSON(object: any): NetworkExternalProcessor {
    return {
      $type: NetworkExternalProcessor.$type,
      grpc_service: isSet(object.grpc_service) ? GrpcService.fromJSON(object.grpc_service) : undefined,
      failure_mode_allow: isSet(object.failure_mode_allow) ? globalThis.Boolean(object.failure_mode_allow) : undefined,
      processing_mode: isSet(object.processing_mode) ? ProcessingMode.fromJSON(object.processing_mode) : undefined,
      message_timeout: isSet(object.message_timeout) ? Duration.fromJSON(object.message_timeout) : undefined,
    };
  },

  toJSON(message: NetworkExternalProcessor): unknown {
    const obj: any = {};
    if (message.grpc_service !== undefined) {
      obj.grpc_service = GrpcService.toJSON(message.grpc_service);
    }
    if (message.failure_mode_allow !== undefined) {
      obj.failure_mode_allow = message.failure_mode_allow;
    }
    if (message.processing_mode !== undefined) {
      obj.processing_mode = ProcessingMode.toJSON(message.processing_mode);
    }
    if (message.message_timeout !== undefined) {
      obj.message_timeout = Duration.toJSON(message.message_timeout);
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<NetworkExternalProcessor>, I>>(base?: I): NetworkExternalProcessor {
    return NetworkExternalProcessor.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<NetworkExternalProcessor>, I>>(object: I): NetworkExternalProcessor {
    const message = createBaseNetworkExternalProcessor();
    message.grpc_service = (object.grpc_service !== undefined && object.grpc_service !== null)
      ? GrpcService.fromPartial(object.grpc_service)
      : undefined;
    message.failure_mode_allow = object.failure_mode_allow ?? undefined;
    message.processing_mode = (object.processing_mode !== undefined && object.processing_mode !== null)
      ? ProcessingMode.fromPartial(object.processing_mode)
      : undefined;
    message.message_timeout = (object.message_timeout !== undefined && object.message_timeout !== null)
      ? Duration.fromPartial(object.message_timeout)
      : undefined;
    return message;
  },
};

messageTypeRegistry.set(NetworkExternalProcessor.$type, NetworkExternalProcessor);

function createBaseProcessingMode(): ProcessingMode {
  return { $type: "envoy.extensions.filters.network.ext_proc.v3.ProcessingMode" };
}

export const ProcessingMode: MessageFns<ProcessingMode, "envoy.extensions.filters.network.ext_proc.v3.ProcessingMode"> =
  {
    $type: "envoy.extensions.filters.network.ext_proc.v3.ProcessingMode" as const,

    encode(message: ProcessingMode, writer: BinaryWriter = new BinaryWriter()): BinaryWriter {
      if (message.process_read !== undefined && message.process_read !== ProcessingMode_DataSendMode.STREAMED) {
        writer.uint32(8).int32(processingMode_DataSendModeToNumber(message.process_read));
      }
      if (message.process_write !== undefined && message.process_write !== ProcessingMode_DataSendMode.STREAMED) {
        writer.uint32(16).int32(processingMode_DataSendModeToNumber(message.process_write));
      }
      return writer;
    },

    decode(input: BinaryReader | Uint8Array, length?: number): ProcessingMode {
      const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
      let end = length === undefined ? reader.len : reader.pos + length;
      const message = createBaseProcessingMode();
      while (reader.pos < end) {
        const tag = reader.uint32();
        switch (tag >>> 3) {
          case 1: {
            if (tag !== 8) {
              break;
            }

            message.process_read = processingMode_DataSendModeFromJSON(reader.int32());
            continue;
          }
          case 2: {
            if (tag !== 16) {
              break;
            }

            message.process_write = processingMode_DataSendModeFromJSON(reader.int32());
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

    fromJSON(object: any): ProcessingMode {
      return {
        $type: ProcessingMode.$type,
        process_read: isSet(object.process_read) ? processingMode_DataSendModeFromJSON(object.process_read) : undefined,
        process_write: isSet(object.process_write)
          ? processingMode_DataSendModeFromJSON(object.process_write)
          : undefined,
      };
    },

    toJSON(message: ProcessingMode): unknown {
      const obj: any = {};
      if (message.process_read !== undefined) {
        obj.process_read = processingMode_DataSendModeToJSON(message.process_read);
      }
      if (message.process_write !== undefined) {
        obj.process_write = processingMode_DataSendModeToJSON(message.process_write);
      }
      return obj;
    },

    create<I extends Exact<DeepPartial<ProcessingMode>, I>>(base?: I): ProcessingMode {
      return ProcessingMode.fromPartial(base ?? ({} as any));
    },
    fromPartial<I extends Exact<DeepPartial<ProcessingMode>, I>>(object: I): ProcessingMode {
      const message = createBaseProcessingMode();
      message.process_read = object.process_read ?? undefined;
      message.process_write = object.process_write ?? undefined;
      return message;
    },
  };

messageTypeRegistry.set(ProcessingMode.$type, ProcessingMode);

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
