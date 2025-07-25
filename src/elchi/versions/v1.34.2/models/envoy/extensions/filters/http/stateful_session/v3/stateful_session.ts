// Code generated by protoc-gen-ts_proto. DO NOT EDIT.
// versions:
//   protoc-gen-ts_proto  v2.2.7
//   protoc               unknown
// source: envoy/extensions/filters/http/stateful_session/v3/stateful_session.proto

/* eslint-disable */
import { BinaryReader, BinaryWriter } from "@bufbuild/protobuf/wire";
import { messageTypeRegistry } from "../../../../../../typeRegistry";
import { TypedExtensionConfig } from "../../../../../config/core/v3/extension";

export const protobufPackage = "envoy.extensions.filters.http.stateful_session.v3";

export interface StatefulSession {
  $type: "envoy.extensions.filters.http.stateful_session.v3.StatefulSession";
  /**
   * Specifies the implementation of session state. This session state is used to store and retrieve the address of the
   * upstream host assigned to the session.
   *
   * [#extension-category: envoy.http.stateful_session]
   */
  session_state?:
    | TypedExtensionConfig
    | undefined;
  /**
   * Determines whether the HTTP request must be strictly routed to the requested destination. When set to ``true``,
   * if the requested destination is unavailable, Envoy will return a 503 status code. The default value is ``false``,
   * which allows Envoy to fall back to its load balancing mechanism. In this case, if the requested destination is not
   * found, the request will be routed according to the load balancing algorithm.
   */
  strict?: boolean | undefined;
}

export interface StatefulSessionPerRoute {
  $type: "envoy.extensions.filters.http.stateful_session.v3.StatefulSessionPerRoute";
  override?:
    | //
    /**
     * Disable the stateful session filter for this particular vhost or route. If disabled is
     * specified in multiple per-filter-configs, the most specific one will be used.
     */
    { $case: "disabled"; disabled: boolean }
    | //
    /** Per-route stateful session configuration that can be served by RDS or static route table. */
    { $case: "stateful_session"; stateful_session: StatefulSession }
    | undefined;
}

function createBaseStatefulSession(): StatefulSession {
  return { $type: "envoy.extensions.filters.http.stateful_session.v3.StatefulSession" };
}

export const StatefulSession: MessageFns<
  StatefulSession,
  "envoy.extensions.filters.http.stateful_session.v3.StatefulSession"
> = {
  $type: "envoy.extensions.filters.http.stateful_session.v3.StatefulSession" as const,

  encode(message: StatefulSession, writer: BinaryWriter = new BinaryWriter()): BinaryWriter {
    if (message.session_state !== undefined) {
      TypedExtensionConfig.encode(message.session_state, writer.uint32(10).fork()).join();
    }
    if (message.strict !== undefined && message.strict !== false) {
      writer.uint32(16).bool(message.strict);
    }
    return writer;
  },

  decode(input: BinaryReader | Uint8Array, length?: number): StatefulSession {
    const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseStatefulSession();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1: {
          if (tag !== 10) {
            break;
          }

          message.session_state = TypedExtensionConfig.decode(reader, reader.uint32());
          continue;
        }
        case 2: {
          if (tag !== 16) {
            break;
          }

          message.strict = reader.bool();
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

  fromJSON(object: any): StatefulSession {
    return {
      $type: StatefulSession.$type,
      session_state: isSet(object.session_state) ? TypedExtensionConfig.fromJSON(object.session_state) : undefined,
      strict: isSet(object.strict) ? globalThis.Boolean(object.strict) : undefined,
    };
  },

  toJSON(message: StatefulSession): unknown {
    const obj: any = {};
    if (message.session_state !== undefined) {
      obj.session_state = TypedExtensionConfig.toJSON(message.session_state);
    }
    if (message.strict !== undefined) {
      obj.strict = message.strict;
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<StatefulSession>, I>>(base?: I): StatefulSession {
    return StatefulSession.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<StatefulSession>, I>>(object: I): StatefulSession {
    const message = createBaseStatefulSession();
    message.session_state = (object.session_state !== undefined && object.session_state !== null)
      ? TypedExtensionConfig.fromPartial(object.session_state)
      : undefined;
    message.strict = object.strict ?? undefined;
    return message;
  },
};

messageTypeRegistry.set(StatefulSession.$type, StatefulSession);

function createBaseStatefulSessionPerRoute(): StatefulSessionPerRoute {
  return { $type: "envoy.extensions.filters.http.stateful_session.v3.StatefulSessionPerRoute", override: undefined };
}

export const StatefulSessionPerRoute: MessageFns<
  StatefulSessionPerRoute,
  "envoy.extensions.filters.http.stateful_session.v3.StatefulSessionPerRoute"
> = {
  $type: "envoy.extensions.filters.http.stateful_session.v3.StatefulSessionPerRoute" as const,

  encode(message: StatefulSessionPerRoute, writer: BinaryWriter = new BinaryWriter()): BinaryWriter {
    switch (message.override?.$case) {
      case "disabled":
        writer.uint32(8).bool(message.override.disabled);
        break;
      case "stateful_session":
        StatefulSession.encode(message.override.stateful_session, writer.uint32(18).fork()).join();
        break;
    }
    return writer;
  },

  decode(input: BinaryReader | Uint8Array, length?: number): StatefulSessionPerRoute {
    const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseStatefulSessionPerRoute();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1: {
          if (tag !== 8) {
            break;
          }

          message.override = { $case: "disabled", disabled: reader.bool() };
          continue;
        }
        case 2: {
          if (tag !== 18) {
            break;
          }

          message.override = {
            $case: "stateful_session",
            stateful_session: StatefulSession.decode(reader, reader.uint32()),
          };
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

  fromJSON(object: any): StatefulSessionPerRoute {
    return {
      $type: StatefulSessionPerRoute.$type,
      override: isSet(object.disabled)
        ? { $case: "disabled", disabled: globalThis.Boolean(object.disabled) }
        : isSet(object.stateful_session)
        ? { $case: "stateful_session", stateful_session: StatefulSession.fromJSON(object.stateful_session) }
        : undefined,
    };
  },

  toJSON(message: StatefulSessionPerRoute): unknown {
    const obj: any = {};
    if (message.override?.$case === "disabled") {
      obj.disabled = message.override.disabled;
    }
    if (message.override?.$case === "stateful_session") {
      obj.stateful_session = StatefulSession.toJSON(message.override.stateful_session);
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<StatefulSessionPerRoute>, I>>(base?: I): StatefulSessionPerRoute {
    return StatefulSessionPerRoute.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<StatefulSessionPerRoute>, I>>(object: I): StatefulSessionPerRoute {
    const message = createBaseStatefulSessionPerRoute();
    if (
      object.override?.$case === "disabled" &&
      object.override?.disabled !== undefined &&
      object.override?.disabled !== null
    ) {
      message.override = { $case: "disabled", disabled: object.override.disabled };
    }
    if (
      object.override?.$case === "stateful_session" &&
      object.override?.stateful_session !== undefined &&
      object.override?.stateful_session !== null
    ) {
      message.override = {
        $case: "stateful_session",
        stateful_session: StatefulSession.fromPartial(object.override.stateful_session),
      };
    }
    return message;
  },
};

messageTypeRegistry.set(StatefulSessionPerRoute.$type, StatefulSessionPerRoute);

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
