// Code generated by protoc-gen-ts_proto. DO NOT EDIT.
// versions:
//   protoc-gen-ts_proto  v2.2.7
//   protoc               unknown
// source: envoy/service/secret/v3/sds.proto

/* eslint-disable */
import { BinaryReader, BinaryWriter } from "@bufbuild/protobuf/wire";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import { messageTypeRegistry } from "../../../../typeRegistry";
import {
  DeltaDiscoveryRequest,
  DeltaDiscoveryResponse,
  DiscoveryRequest,
  DiscoveryResponse,
} from "../../discovery/v3/discovery";

export const protobufPackage = "envoy.service.secret.v3";

/**
 * [#not-implemented-hide:] Not configuration. Workaround c++ protobuf issue with importing
 * services: https://github.com/google/protobuf/issues/4221
 */
export interface SdsDummy {
  $type: "envoy.service.secret.v3.SdsDummy";
}

function createBaseSdsDummy(): SdsDummy {
  return { $type: "envoy.service.secret.v3.SdsDummy" };
}

export const SdsDummy: MessageFns<SdsDummy, "envoy.service.secret.v3.SdsDummy"> = {
  $type: "envoy.service.secret.v3.SdsDummy" as const,

  encode(_: SdsDummy, writer: BinaryWriter = new BinaryWriter()): BinaryWriter {
    return writer;
  },

  decode(input: BinaryReader | Uint8Array, length?: number): SdsDummy {
    const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseSdsDummy();
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

  fromJSON(_: any): SdsDummy {
    return { $type: SdsDummy.$type };
  },

  toJSON(_: SdsDummy): unknown {
    const obj: any = {};
    return obj;
  },

  create<I extends Exact<DeepPartial<SdsDummy>, I>>(base?: I): SdsDummy {
    return SdsDummy.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<SdsDummy>, I>>(_: I): SdsDummy {
    const message = createBaseSdsDummy();
    return message;
  },
};

messageTypeRegistry.set(SdsDummy.$type, SdsDummy);

export interface SecretDiscoveryService {
  DeltaSecrets(request: Observable<DeltaDiscoveryRequest>): Observable<DeltaDiscoveryResponse>;
  StreamSecrets(request: Observable<DiscoveryRequest>): Observable<DiscoveryResponse>;
  FetchSecrets(request: DiscoveryRequest): Promise<DiscoveryResponse>;
}

export const SecretDiscoveryServiceServiceName = "envoy.service.secret.v3.SecretDiscoveryService";
export class SecretDiscoveryServiceClientImpl implements SecretDiscoveryService {
  private readonly rpc: Rpc;
  private readonly service: string;
  constructor(rpc: Rpc, opts?: { service?: string }) {
    this.service = opts?.service || SecretDiscoveryServiceServiceName;
    this.rpc = rpc;
    this.DeltaSecrets = this.DeltaSecrets.bind(this);
    this.StreamSecrets = this.StreamSecrets.bind(this);
    this.FetchSecrets = this.FetchSecrets.bind(this);
  }
  DeltaSecrets(request: Observable<DeltaDiscoveryRequest>): Observable<DeltaDiscoveryResponse> {
    const data = request.pipe(map((request) => DeltaDiscoveryRequest.encode(request).finish()));
    const result = this.rpc.bidirectionalStreamingRequest(this.service, "DeltaSecrets", data);
    return result.pipe(map((data) => DeltaDiscoveryResponse.decode(new BinaryReader(data))));
  }

  StreamSecrets(request: Observable<DiscoveryRequest>): Observable<DiscoveryResponse> {
    const data = request.pipe(map((request) => DiscoveryRequest.encode(request).finish()));
    const result = this.rpc.bidirectionalStreamingRequest(this.service, "StreamSecrets", data);
    return result.pipe(map((data) => DiscoveryResponse.decode(new BinaryReader(data))));
  }

  FetchSecrets(request: DiscoveryRequest): Promise<DiscoveryResponse> {
    const data = DiscoveryRequest.encode(request).finish();
    const promise = this.rpc.request(this.service, "FetchSecrets", data);
    return promise.then((data) => DiscoveryResponse.decode(new BinaryReader(data)));
  }
}

interface Rpc {
  request(service: string, method: string, data: Uint8Array): Promise<Uint8Array>;
  clientStreamingRequest(service: string, method: string, data: Observable<Uint8Array>): Promise<Uint8Array>;
  serverStreamingRequest(service: string, method: string, data: Uint8Array): Observable<Uint8Array>;
  bidirectionalStreamingRequest(service: string, method: string, data: Observable<Uint8Array>): Observable<Uint8Array>;
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

export interface MessageFns<T, V extends string> {
  readonly $type: V;
  encode(message: T, writer?: BinaryWriter): BinaryWriter;
  decode(input: BinaryReader | Uint8Array, length?: number): T;
  fromJSON(object: any): T;
  toJSON(message: T): unknown;
  create<I extends Exact<DeepPartial<T>, I>>(base?: I): T;
  fromPartial<I extends Exact<DeepPartial<T>, I>>(object: I): T;
}
