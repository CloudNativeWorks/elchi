// Code generated by protoc-gen-ts_proto. DO NOT EDIT.
// versions:
//   protoc-gen-ts_proto  v2.2.7
//   protoc               unknown
// source: envoy/extensions/http/header_formatters/preserve_case/v3/preserve_case.proto

/* eslint-disable */
import { BinaryReader, BinaryWriter } from "@bufbuild/protobuf/wire";
import { messageTypeRegistry } from "../../../../../../typeRegistry";

export const protobufPackage = "envoy.extensions.http.header_formatters.preserve_case.v3";

/**
 * Configuration for the preserve case header formatter.
 * See the :ref:`header casing <config_http_conn_man_header_casing>` configuration guide for more
 * information.
 */
export interface PreserveCaseFormatterConfig {
  $type: "envoy.extensions.http.header_formatters.preserve_case.v3.PreserveCaseFormatterConfig";
  /**
   * Allows forwarding reason phrase text.
   * This is off by default, and a standard reason phrase is used for a corresponding HTTP response code.
   */
  forward_reason_phrase?:
    | boolean
    | undefined;
  /**
   * Type of formatter to use on headers which are added by Envoy (which are lower case by default).
   * The default type is DEFAULT, use LowerCase on Envoy headers.
   */
  formatter_type_on_envoy_headers?: PreserveCaseFormatterConfig_FormatterTypeOnEnvoyHeaders | undefined;
}

export enum PreserveCaseFormatterConfig_FormatterTypeOnEnvoyHeaders {
  /** DEFAULT - Use LowerCase on Envoy added headers. */
  DEFAULT = "DEFAULT",
  /**
   * PROPER_CASE - Use ProperCaseHeaderKeyFormatter on Envoy added headers that upper cases the first character
   * in each word. The first character as well as any alpha character following a special
   * character is upper cased.
   */
  PROPER_CASE = "PROPER_CASE",
}

export function preserveCaseFormatterConfig_FormatterTypeOnEnvoyHeadersFromJSON(
  object: any,
): PreserveCaseFormatterConfig_FormatterTypeOnEnvoyHeaders {
  switch (object) {
    case 0:
    case "DEFAULT":
      return PreserveCaseFormatterConfig_FormatterTypeOnEnvoyHeaders.DEFAULT;
    case 1:
    case "PROPER_CASE":
      return PreserveCaseFormatterConfig_FormatterTypeOnEnvoyHeaders.PROPER_CASE;
    default:
      throw new globalThis.Error(
        "Unrecognized enum value " + object + " for enum PreserveCaseFormatterConfig_FormatterTypeOnEnvoyHeaders",
      );
  }
}

export function preserveCaseFormatterConfig_FormatterTypeOnEnvoyHeadersToJSON(
  object: PreserveCaseFormatterConfig_FormatterTypeOnEnvoyHeaders,
): string {
  switch (object) {
    case PreserveCaseFormatterConfig_FormatterTypeOnEnvoyHeaders.DEFAULT:
      return "DEFAULT";
    case PreserveCaseFormatterConfig_FormatterTypeOnEnvoyHeaders.PROPER_CASE:
      return "PROPER_CASE";
    default:
      throw new globalThis.Error(
        "Unrecognized enum value " + object + " for enum PreserveCaseFormatterConfig_FormatterTypeOnEnvoyHeaders",
      );
  }
}

export function preserveCaseFormatterConfig_FormatterTypeOnEnvoyHeadersToNumber(
  object: PreserveCaseFormatterConfig_FormatterTypeOnEnvoyHeaders,
): number {
  switch (object) {
    case PreserveCaseFormatterConfig_FormatterTypeOnEnvoyHeaders.DEFAULT:
      return 0;
    case PreserveCaseFormatterConfig_FormatterTypeOnEnvoyHeaders.PROPER_CASE:
      return 1;
    default:
      throw new globalThis.Error(
        "Unrecognized enum value " + object + " for enum PreserveCaseFormatterConfig_FormatterTypeOnEnvoyHeaders",
      );
  }
}

function createBasePreserveCaseFormatterConfig(): PreserveCaseFormatterConfig {
  return { $type: "envoy.extensions.http.header_formatters.preserve_case.v3.PreserveCaseFormatterConfig" };
}

export const PreserveCaseFormatterConfig: MessageFns<
  PreserveCaseFormatterConfig,
  "envoy.extensions.http.header_formatters.preserve_case.v3.PreserveCaseFormatterConfig"
> = {
  $type: "envoy.extensions.http.header_formatters.preserve_case.v3.PreserveCaseFormatterConfig" as const,

  encode(message: PreserveCaseFormatterConfig, writer: BinaryWriter = new BinaryWriter()): BinaryWriter {
    if (message.forward_reason_phrase !== undefined && message.forward_reason_phrase !== false) {
      writer.uint32(8).bool(message.forward_reason_phrase);
    }
    if (
      message.formatter_type_on_envoy_headers !== undefined &&
      message.formatter_type_on_envoy_headers !== PreserveCaseFormatterConfig_FormatterTypeOnEnvoyHeaders.DEFAULT
    ) {
      writer.uint32(16).int32(
        preserveCaseFormatterConfig_FormatterTypeOnEnvoyHeadersToNumber(message.formatter_type_on_envoy_headers),
      );
    }
    return writer;
  },

  decode(input: BinaryReader | Uint8Array, length?: number): PreserveCaseFormatterConfig {
    const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBasePreserveCaseFormatterConfig();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1: {
          if (tag !== 8) {
            break;
          }

          message.forward_reason_phrase = reader.bool();
          continue;
        }
        case 2: {
          if (tag !== 16) {
            break;
          }

          message.formatter_type_on_envoy_headers = preserveCaseFormatterConfig_FormatterTypeOnEnvoyHeadersFromJSON(
            reader.int32(),
          );
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

  fromJSON(object: any): PreserveCaseFormatterConfig {
    return {
      $type: PreserveCaseFormatterConfig.$type,
      forward_reason_phrase: isSet(object.forward_reason_phrase)
        ? globalThis.Boolean(object.forward_reason_phrase)
        : undefined,
      formatter_type_on_envoy_headers: isSet(object.formatter_type_on_envoy_headers)
        ? preserveCaseFormatterConfig_FormatterTypeOnEnvoyHeadersFromJSON(object.formatter_type_on_envoy_headers)
        : undefined,
    };
  },

  toJSON(message: PreserveCaseFormatterConfig): unknown {
    const obj: any = {};
    if (message.forward_reason_phrase !== undefined) {
      obj.forward_reason_phrase = message.forward_reason_phrase;
    }
    if (message.formatter_type_on_envoy_headers !== undefined) {
      obj.formatter_type_on_envoy_headers = preserveCaseFormatterConfig_FormatterTypeOnEnvoyHeadersToJSON(
        message.formatter_type_on_envoy_headers,
      );
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<PreserveCaseFormatterConfig>, I>>(base?: I): PreserveCaseFormatterConfig {
    return PreserveCaseFormatterConfig.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<PreserveCaseFormatterConfig>, I>>(object: I): PreserveCaseFormatterConfig {
    const message = createBasePreserveCaseFormatterConfig();
    message.forward_reason_phrase = object.forward_reason_phrase ?? undefined;
    message.formatter_type_on_envoy_headers = object.formatter_type_on_envoy_headers ?? undefined;
    return message;
  },
};

messageTypeRegistry.set(PreserveCaseFormatterConfig.$type, PreserveCaseFormatterConfig);

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
