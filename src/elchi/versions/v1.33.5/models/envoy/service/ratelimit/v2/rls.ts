// Code generated by protoc-gen-ts_proto. DO NOT EDIT.
// versions:
//   protoc-gen-ts_proto  v2.2.7
//   protoc               unknown
// source: envoy/service/ratelimit/v2/rls.proto

/* eslint-disable */
import { BinaryReader, BinaryWriter } from "@bufbuild/protobuf/wire";
import { messageTypeRegistry } from "../../../../typeRegistry";
import { HeaderValue } from "../../../api/v2/core/base";
import { RateLimitDescriptor } from "../../../api/v2/ratelimit/ratelimit";

export const protobufPackage = "envoy.service.ratelimit.v2";

/**
 * Main message for a rate limit request. The rate limit service is designed to be fully generic
 * in the sense that it can operate on arbitrary hierarchical key/value pairs. The loaded
 * configuration will parse the request and find the most specific limit to apply. In addition,
 * a RateLimitRequest can contain multiple "descriptors" to limit on. When multiple descriptors
 * are provided, the server will limit on *ALL* of them and return an OVER_LIMIT response if any
 * of them are over limit. This enables more complex application level rate limiting scenarios
 * if desired.
 */
export interface RateLimitRequest {
  $type: "envoy.service.ratelimit.v2.RateLimitRequest";
  /**
   * All rate limit requests must specify a domain. This enables the configuration to be per
   * application without fear of overlap. E.g., "envoy".
   */
  domain?:
    | string
    | undefined;
  /**
   * All rate limit requests must specify at least one RateLimitDescriptor. Each descriptor is
   * processed by the service (see below). If any of the descriptors are over limit, the entire
   * request is considered to be over limit.
   */
  descriptors?:
    | RateLimitDescriptor[]
    | undefined;
  /**
   * Rate limit requests can optionally specify the number of hits a request adds to the matched
   * limit. If the value is not set in the message, a request increases the matched limit by 1.
   */
  hits_addend?: number | undefined;
}

/** A response from a ShouldRateLimit call. */
export interface RateLimitResponse {
  $type: "envoy.service.ratelimit.v2.RateLimitResponse";
  /**
   * The overall response code which takes into account all of the descriptors that were passed
   * in the RateLimitRequest message.
   */
  overall_code?:
    | RateLimitResponse_Code
    | undefined;
  /**
   * A list of DescriptorStatus messages which matches the length of the descriptor list passed
   * in the RateLimitRequest. This can be used by the caller to determine which individual
   * descriptors failed and/or what the currently configured limits are for all of them.
   */
  statuses?:
    | RateLimitResponse_DescriptorStatus[]
    | undefined;
  /** A list of headers to add to the response */
  headers?:
    | HeaderValue[]
    | undefined;
  /** A list of headers to add to the request when forwarded */
  request_headers_to_add?: HeaderValue[] | undefined;
}

export enum RateLimitResponse_Code {
  /** UNKNOWN - The response code is not known. */
  UNKNOWN = "UNKNOWN",
  /** OK - The response code to notify that the number of requests are under limit. */
  OK = "OK",
  /** OVER_LIMIT - The response code to notify that the number of requests are over limit. */
  OVER_LIMIT = "OVER_LIMIT",
}

export function rateLimitResponse_CodeFromJSON(object: any): RateLimitResponse_Code {
  switch (object) {
    case 0:
    case "UNKNOWN":
      return RateLimitResponse_Code.UNKNOWN;
    case 1:
    case "OK":
      return RateLimitResponse_Code.OK;
    case 2:
    case "OVER_LIMIT":
      return RateLimitResponse_Code.OVER_LIMIT;
    default:
      throw new globalThis.Error("Unrecognized enum value " + object + " for enum RateLimitResponse_Code");
  }
}

export function rateLimitResponse_CodeToJSON(object: RateLimitResponse_Code): string {
  switch (object) {
    case RateLimitResponse_Code.UNKNOWN:
      return "UNKNOWN";
    case RateLimitResponse_Code.OK:
      return "OK";
    case RateLimitResponse_Code.OVER_LIMIT:
      return "OVER_LIMIT";
    default:
      throw new globalThis.Error("Unrecognized enum value " + object + " for enum RateLimitResponse_Code");
  }
}

export function rateLimitResponse_CodeToNumber(object: RateLimitResponse_Code): number {
  switch (object) {
    case RateLimitResponse_Code.UNKNOWN:
      return 0;
    case RateLimitResponse_Code.OK:
      return 1;
    case RateLimitResponse_Code.OVER_LIMIT:
      return 2;
    default:
      throw new globalThis.Error("Unrecognized enum value " + object + " for enum RateLimitResponse_Code");
  }
}

/** Defines an actual rate limit in terms of requests per unit of time and the unit itself. */
export interface RateLimitResponse_RateLimit {
  $type: "envoy.service.ratelimit.v2.RateLimitResponse.RateLimit";
  /** A name or description of this limit. */
  name?:
    | string
    | undefined;
  /** The number of requests per unit of time. */
  requests_per_unit?:
    | number
    | undefined;
  /** The unit of time. */
  unit?: RateLimitResponse_RateLimit_Unit | undefined;
}

export enum RateLimitResponse_RateLimit_Unit {
  /** UNKNOWN - The time unit is not known. */
  UNKNOWN = "UNKNOWN",
  /** SECOND - The time unit representing a second. */
  SECOND = "SECOND",
  /** MINUTE - The time unit representing a minute. */
  MINUTE = "MINUTE",
  /** HOUR - The time unit representing an hour. */
  HOUR = "HOUR",
  /** DAY - The time unit representing a day. */
  DAY = "DAY",
}

export function rateLimitResponse_RateLimit_UnitFromJSON(object: any): RateLimitResponse_RateLimit_Unit {
  switch (object) {
    case 0:
    case "UNKNOWN":
      return RateLimitResponse_RateLimit_Unit.UNKNOWN;
    case 1:
    case "SECOND":
      return RateLimitResponse_RateLimit_Unit.SECOND;
    case 2:
    case "MINUTE":
      return RateLimitResponse_RateLimit_Unit.MINUTE;
    case 3:
    case "HOUR":
      return RateLimitResponse_RateLimit_Unit.HOUR;
    case 4:
    case "DAY":
      return RateLimitResponse_RateLimit_Unit.DAY;
    default:
      throw new globalThis.Error("Unrecognized enum value " + object + " for enum RateLimitResponse_RateLimit_Unit");
  }
}

export function rateLimitResponse_RateLimit_UnitToJSON(object: RateLimitResponse_RateLimit_Unit): string {
  switch (object) {
    case RateLimitResponse_RateLimit_Unit.UNKNOWN:
      return "UNKNOWN";
    case RateLimitResponse_RateLimit_Unit.SECOND:
      return "SECOND";
    case RateLimitResponse_RateLimit_Unit.MINUTE:
      return "MINUTE";
    case RateLimitResponse_RateLimit_Unit.HOUR:
      return "HOUR";
    case RateLimitResponse_RateLimit_Unit.DAY:
      return "DAY";
    default:
      throw new globalThis.Error("Unrecognized enum value " + object + " for enum RateLimitResponse_RateLimit_Unit");
  }
}

export function rateLimitResponse_RateLimit_UnitToNumber(object: RateLimitResponse_RateLimit_Unit): number {
  switch (object) {
    case RateLimitResponse_RateLimit_Unit.UNKNOWN:
      return 0;
    case RateLimitResponse_RateLimit_Unit.SECOND:
      return 1;
    case RateLimitResponse_RateLimit_Unit.MINUTE:
      return 2;
    case RateLimitResponse_RateLimit_Unit.HOUR:
      return 3;
    case RateLimitResponse_RateLimit_Unit.DAY:
      return 4;
    default:
      throw new globalThis.Error("Unrecognized enum value " + object + " for enum RateLimitResponse_RateLimit_Unit");
  }
}

export interface RateLimitResponse_DescriptorStatus {
  $type: "envoy.service.ratelimit.v2.RateLimitResponse.DescriptorStatus";
  /** The response code for an individual descriptor. */
  code?:
    | RateLimitResponse_Code
    | undefined;
  /** The current limit as configured by the server. Useful for debugging, etc. */
  current_limit?:
    | RateLimitResponse_RateLimit
    | undefined;
  /** The limit remaining in the current time unit. */
  limit_remaining?: number | undefined;
}

function createBaseRateLimitRequest(): RateLimitRequest {
  return { $type: "envoy.service.ratelimit.v2.RateLimitRequest" };
}

export const RateLimitRequest: MessageFns<RateLimitRequest, "envoy.service.ratelimit.v2.RateLimitRequest"> = {
  $type: "envoy.service.ratelimit.v2.RateLimitRequest" as const,

  encode(message: RateLimitRequest, writer: BinaryWriter = new BinaryWriter()): BinaryWriter {
    if (message.domain !== undefined && message.domain !== "") {
      writer.uint32(10).string(message.domain);
    }
    if (message.descriptors !== undefined && message.descriptors.length !== 0) {
      for (const v of message.descriptors) {
        RateLimitDescriptor.encode(v!, writer.uint32(18).fork()).join();
      }
    }
    if (message.hits_addend !== undefined && message.hits_addend !== 0) {
      writer.uint32(24).uint32(message.hits_addend);
    }
    return writer;
  },

  decode(input: BinaryReader | Uint8Array, length?: number): RateLimitRequest {
    const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseRateLimitRequest();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1: {
          if (tag !== 10) {
            break;
          }

          message.domain = reader.string();
          continue;
        }
        case 2: {
          if (tag !== 18) {
            break;
          }

          if (message.descriptors === undefined) {
            message.descriptors = [];
          }
          const el = RateLimitDescriptor.decode(reader, reader.uint32());
          if (el !== undefined) {
            message.descriptors!.push(el);
          }
          continue;
        }
        case 3: {
          if (tag !== 24) {
            break;
          }

          message.hits_addend = reader.uint32();
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

  fromJSON(object: any): RateLimitRequest {
    return {
      $type: RateLimitRequest.$type,
      domain: isSet(object.domain) ? globalThis.String(object.domain) : undefined,
      descriptors: globalThis.Array.isArray(object?.descriptors)
        ? object.descriptors.map((e: any) => RateLimitDescriptor.fromJSON(e))
        : undefined,
      hits_addend: isSet(object.hits_addend) ? globalThis.Number(object.hits_addend) : undefined,
    };
  },

  toJSON(message: RateLimitRequest): unknown {
    const obj: any = {};
    if (message.domain !== undefined) {
      obj.domain = message.domain;
    }
    if (message.descriptors?.length) {
      obj.descriptors = message.descriptors.map((e) => RateLimitDescriptor.toJSON(e));
    }
    if (message.hits_addend !== undefined) {
      obj.hits_addend = Math.round(message.hits_addend);
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<RateLimitRequest>, I>>(base?: I): RateLimitRequest {
    return RateLimitRequest.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<RateLimitRequest>, I>>(object: I): RateLimitRequest {
    const message = createBaseRateLimitRequest();
    message.domain = object.domain ?? undefined;
    message.descriptors = object.descriptors?.map((e) => RateLimitDescriptor.fromPartial(e)) || undefined;
    message.hits_addend = object.hits_addend ?? undefined;
    return message;
  },
};

messageTypeRegistry.set(RateLimitRequest.$type, RateLimitRequest);

function createBaseRateLimitResponse(): RateLimitResponse {
  return { $type: "envoy.service.ratelimit.v2.RateLimitResponse" };
}

export const RateLimitResponse: MessageFns<RateLimitResponse, "envoy.service.ratelimit.v2.RateLimitResponse"> = {
  $type: "envoy.service.ratelimit.v2.RateLimitResponse" as const,

  encode(message: RateLimitResponse, writer: BinaryWriter = new BinaryWriter()): BinaryWriter {
    if (message.overall_code !== undefined && message.overall_code !== RateLimitResponse_Code.UNKNOWN) {
      writer.uint32(8).int32(rateLimitResponse_CodeToNumber(message.overall_code));
    }
    if (message.statuses !== undefined && message.statuses.length !== 0) {
      for (const v of message.statuses) {
        RateLimitResponse_DescriptorStatus.encode(v!, writer.uint32(18).fork()).join();
      }
    }
    if (message.headers !== undefined && message.headers.length !== 0) {
      for (const v of message.headers) {
        HeaderValue.encode(v!, writer.uint32(26).fork()).join();
      }
    }
    if (message.request_headers_to_add !== undefined && message.request_headers_to_add.length !== 0) {
      for (const v of message.request_headers_to_add) {
        HeaderValue.encode(v!, writer.uint32(34).fork()).join();
      }
    }
    return writer;
  },

  decode(input: BinaryReader | Uint8Array, length?: number): RateLimitResponse {
    const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseRateLimitResponse();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1: {
          if (tag !== 8) {
            break;
          }

          message.overall_code = rateLimitResponse_CodeFromJSON(reader.int32());
          continue;
        }
        case 2: {
          if (tag !== 18) {
            break;
          }

          if (message.statuses === undefined) {
            message.statuses = [];
          }
          const el = RateLimitResponse_DescriptorStatus.decode(reader, reader.uint32());
          if (el !== undefined) {
            message.statuses!.push(el);
          }
          continue;
        }
        case 3: {
          if (tag !== 26) {
            break;
          }

          if (message.headers === undefined) {
            message.headers = [];
          }
          const el = HeaderValue.decode(reader, reader.uint32());
          if (el !== undefined) {
            message.headers!.push(el);
          }
          continue;
        }
        case 4: {
          if (tag !== 34) {
            break;
          }

          if (message.request_headers_to_add === undefined) {
            message.request_headers_to_add = [];
          }
          const el = HeaderValue.decode(reader, reader.uint32());
          if (el !== undefined) {
            message.request_headers_to_add!.push(el);
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

  fromJSON(object: any): RateLimitResponse {
    return {
      $type: RateLimitResponse.$type,
      overall_code: isSet(object.overall_code) ? rateLimitResponse_CodeFromJSON(object.overall_code) : undefined,
      statuses: globalThis.Array.isArray(object?.statuses)
        ? object.statuses.map((e: any) => RateLimitResponse_DescriptorStatus.fromJSON(e))
        : undefined,
      headers: globalThis.Array.isArray(object?.headers)
        ? object.headers.map((e: any) => HeaderValue.fromJSON(e))
        : undefined,
      request_headers_to_add: globalThis.Array.isArray(object?.request_headers_to_add)
        ? object.request_headers_to_add.map((e: any) => HeaderValue.fromJSON(e))
        : undefined,
    };
  },

  toJSON(message: RateLimitResponse): unknown {
    const obj: any = {};
    if (message.overall_code !== undefined) {
      obj.overall_code = rateLimitResponse_CodeToJSON(message.overall_code);
    }
    if (message.statuses?.length) {
      obj.statuses = message.statuses.map((e) => RateLimitResponse_DescriptorStatus.toJSON(e));
    }
    if (message.headers?.length) {
      obj.headers = message.headers.map((e) => HeaderValue.toJSON(e));
    }
    if (message.request_headers_to_add?.length) {
      obj.request_headers_to_add = message.request_headers_to_add.map((e) => HeaderValue.toJSON(e));
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<RateLimitResponse>, I>>(base?: I): RateLimitResponse {
    return RateLimitResponse.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<RateLimitResponse>, I>>(object: I): RateLimitResponse {
    const message = createBaseRateLimitResponse();
    message.overall_code = object.overall_code ?? undefined;
    message.statuses = object.statuses?.map((e) => RateLimitResponse_DescriptorStatus.fromPartial(e)) || undefined;
    message.headers = object.headers?.map((e) => HeaderValue.fromPartial(e)) || undefined;
    message.request_headers_to_add = object.request_headers_to_add?.map((e) => HeaderValue.fromPartial(e)) || undefined;
    return message;
  },
};

messageTypeRegistry.set(RateLimitResponse.$type, RateLimitResponse);

function createBaseRateLimitResponse_RateLimit(): RateLimitResponse_RateLimit {
  return { $type: "envoy.service.ratelimit.v2.RateLimitResponse.RateLimit" };
}

export const RateLimitResponse_RateLimit: MessageFns<
  RateLimitResponse_RateLimit,
  "envoy.service.ratelimit.v2.RateLimitResponse.RateLimit"
> = {
  $type: "envoy.service.ratelimit.v2.RateLimitResponse.RateLimit" as const,

  encode(message: RateLimitResponse_RateLimit, writer: BinaryWriter = new BinaryWriter()): BinaryWriter {
    if (message.name !== undefined && message.name !== "") {
      writer.uint32(26).string(message.name);
    }
    if (message.requests_per_unit !== undefined && message.requests_per_unit !== 0) {
      writer.uint32(8).uint32(message.requests_per_unit);
    }
    if (message.unit !== undefined && message.unit !== RateLimitResponse_RateLimit_Unit.UNKNOWN) {
      writer.uint32(16).int32(rateLimitResponse_RateLimit_UnitToNumber(message.unit));
    }
    return writer;
  },

  decode(input: BinaryReader | Uint8Array, length?: number): RateLimitResponse_RateLimit {
    const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseRateLimitResponse_RateLimit();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 3: {
          if (tag !== 26) {
            break;
          }

          message.name = reader.string();
          continue;
        }
        case 1: {
          if (tag !== 8) {
            break;
          }

          message.requests_per_unit = reader.uint32();
          continue;
        }
        case 2: {
          if (tag !== 16) {
            break;
          }

          message.unit = rateLimitResponse_RateLimit_UnitFromJSON(reader.int32());
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

  fromJSON(object: any): RateLimitResponse_RateLimit {
    return {
      $type: RateLimitResponse_RateLimit.$type,
      name: isSet(object.name) ? globalThis.String(object.name) : undefined,
      requests_per_unit: isSet(object.requests_per_unit) ? globalThis.Number(object.requests_per_unit) : undefined,
      unit: isSet(object.unit) ? rateLimitResponse_RateLimit_UnitFromJSON(object.unit) : undefined,
    };
  },

  toJSON(message: RateLimitResponse_RateLimit): unknown {
    const obj: any = {};
    if (message.name !== undefined) {
      obj.name = message.name;
    }
    if (message.requests_per_unit !== undefined) {
      obj.requests_per_unit = Math.round(message.requests_per_unit);
    }
    if (message.unit !== undefined) {
      obj.unit = rateLimitResponse_RateLimit_UnitToJSON(message.unit);
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<RateLimitResponse_RateLimit>, I>>(base?: I): RateLimitResponse_RateLimit {
    return RateLimitResponse_RateLimit.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<RateLimitResponse_RateLimit>, I>>(object: I): RateLimitResponse_RateLimit {
    const message = createBaseRateLimitResponse_RateLimit();
    message.name = object.name ?? undefined;
    message.requests_per_unit = object.requests_per_unit ?? undefined;
    message.unit = object.unit ?? undefined;
    return message;
  },
};

messageTypeRegistry.set(RateLimitResponse_RateLimit.$type, RateLimitResponse_RateLimit);

function createBaseRateLimitResponse_DescriptorStatus(): RateLimitResponse_DescriptorStatus {
  return { $type: "envoy.service.ratelimit.v2.RateLimitResponse.DescriptorStatus" };
}

export const RateLimitResponse_DescriptorStatus: MessageFns<
  RateLimitResponse_DescriptorStatus,
  "envoy.service.ratelimit.v2.RateLimitResponse.DescriptorStatus"
> = {
  $type: "envoy.service.ratelimit.v2.RateLimitResponse.DescriptorStatus" as const,

  encode(message: RateLimitResponse_DescriptorStatus, writer: BinaryWriter = new BinaryWriter()): BinaryWriter {
    if (message.code !== undefined && message.code !== RateLimitResponse_Code.UNKNOWN) {
      writer.uint32(8).int32(rateLimitResponse_CodeToNumber(message.code));
    }
    if (message.current_limit !== undefined) {
      RateLimitResponse_RateLimit.encode(message.current_limit, writer.uint32(18).fork()).join();
    }
    if (message.limit_remaining !== undefined && message.limit_remaining !== 0) {
      writer.uint32(24).uint32(message.limit_remaining);
    }
    return writer;
  },

  decode(input: BinaryReader | Uint8Array, length?: number): RateLimitResponse_DescriptorStatus {
    const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseRateLimitResponse_DescriptorStatus();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1: {
          if (tag !== 8) {
            break;
          }

          message.code = rateLimitResponse_CodeFromJSON(reader.int32());
          continue;
        }
        case 2: {
          if (tag !== 18) {
            break;
          }

          message.current_limit = RateLimitResponse_RateLimit.decode(reader, reader.uint32());
          continue;
        }
        case 3: {
          if (tag !== 24) {
            break;
          }

          message.limit_remaining = reader.uint32();
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

  fromJSON(object: any): RateLimitResponse_DescriptorStatus {
    return {
      $type: RateLimitResponse_DescriptorStatus.$type,
      code: isSet(object.code) ? rateLimitResponse_CodeFromJSON(object.code) : undefined,
      current_limit: isSet(object.current_limit)
        ? RateLimitResponse_RateLimit.fromJSON(object.current_limit)
        : undefined,
      limit_remaining: isSet(object.limit_remaining) ? globalThis.Number(object.limit_remaining) : undefined,
    };
  },

  toJSON(message: RateLimitResponse_DescriptorStatus): unknown {
    const obj: any = {};
    if (message.code !== undefined) {
      obj.code = rateLimitResponse_CodeToJSON(message.code);
    }
    if (message.current_limit !== undefined) {
      obj.current_limit = RateLimitResponse_RateLimit.toJSON(message.current_limit);
    }
    if (message.limit_remaining !== undefined) {
      obj.limit_remaining = Math.round(message.limit_remaining);
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<RateLimitResponse_DescriptorStatus>, I>>(
    base?: I,
  ): RateLimitResponse_DescriptorStatus {
    return RateLimitResponse_DescriptorStatus.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<RateLimitResponse_DescriptorStatus>, I>>(
    object: I,
  ): RateLimitResponse_DescriptorStatus {
    const message = createBaseRateLimitResponse_DescriptorStatus();
    message.code = object.code ?? undefined;
    message.current_limit = (object.current_limit !== undefined && object.current_limit !== null)
      ? RateLimitResponse_RateLimit.fromPartial(object.current_limit)
      : undefined;
    message.limit_remaining = object.limit_remaining ?? undefined;
    return message;
  },
};

messageTypeRegistry.set(RateLimitResponse_DescriptorStatus.$type, RateLimitResponse_DescriptorStatus);

export interface RateLimitService {
  /** Determine whether rate limiting should take place. */
  ShouldRateLimit(request: RateLimitRequest): Promise<RateLimitResponse>;
}

export const RateLimitServiceServiceName = "envoy.service.ratelimit.v2.RateLimitService";
export class RateLimitServiceClientImpl implements RateLimitService {
  private readonly rpc: Rpc;
  private readonly service: string;
  constructor(rpc: Rpc, opts?: { service?: string }) {
    this.service = opts?.service || RateLimitServiceServiceName;
    this.rpc = rpc;
    this.ShouldRateLimit = this.ShouldRateLimit.bind(this);
  }
  ShouldRateLimit(request: RateLimitRequest): Promise<RateLimitResponse> {
    const data = RateLimitRequest.encode(request).finish();
    const promise = this.rpc.request(this.service, "ShouldRateLimit", data);
    return promise.then((data) => RateLimitResponse.decode(new BinaryReader(data)));
  }
}

interface Rpc {
  request(service: string, method: string, data: Uint8Array): Promise<Uint8Array>;
}

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
