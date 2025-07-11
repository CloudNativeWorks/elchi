// Code generated by protoc-gen-ts_proto. DO NOT EDIT.
// versions:
//   protoc-gen-ts_proto  v2.2.7
//   protoc               unknown
// source: envoy/extensions/http/custom_response/redirect_policy/v3/redirect_policy.proto

/* eslint-disable */
import { BinaryReader, BinaryWriter } from "@bufbuild/protobuf/wire";
import { UInt32Value } from "../../../../../../google/protobuf/wrappers";
import { messageTypeRegistry } from "../../../../../../typeRegistry";
import { HeaderValueOption } from "../../../../../config/core/v3/base";
import { TypedExtensionConfig } from "../../../../../config/core/v3/extension";
import { RedirectAction } from "../../../../../config/route/v3/route_components";

export const protobufPackage = "envoy.extensions.http.custom_response.redirect_policy.v3";

/**
 * Custom response policy to internally redirect the original response to a different
 * upstream.
 * [#next-free-field: 7]
 */
export interface RedirectPolicy {
  $type: "envoy.extensions.http.custom_response.redirect_policy.v3.RedirectPolicy";
  redirect_action_specifier?:
    | //
    /**
     * The Http URI to redirect the original request to, to get the custom
     * response.
     * It should be a full FQDN with protocol, host and path.
     *
     * Example:
     *
     * .. code-block:: yaml
     *
     *    uri: https://www.mydomain.com/path/to/404.txt
     */
    { $case: "uri"; uri: string }
    | //
    /**
     * Specify elements of the redirect url individually.
     * Note: Do not specify the ``response_code`` field in ``redirect_action``, use
     * ``status_code`` instead.
     * The following fields in ``redirect_action`` are currently not supported,
     * and specifying them will cause the config to be rejected:
     * - ``prefix_rewrite``
     * - ``regex_rewrite``
     */
    { $case: "redirect_action"; redirect_action: RedirectAction }
    | undefined;
  /**
   * The new response status code if specified. This is used to override the
   * status code of the response from the new upstream if it is not an error status.
   */
  status_code?:
    | number
    | undefined;
  /**
   * HTTP headers to add to the response. This allows the
   * response policy to append, to add or to override headers of
   * the original response for local body, or the custom response from the
   * remote body, before it is sent to a downstream client.
   * Note that these are not applied if the redirected response is an error
   * response.
   */
  response_headers_to_add?:
    | HeaderValueOption[]
    | undefined;
  /** HTTP headers to add to the request before it is internally redirected. */
  request_headers_to_add?:
    | HeaderValueOption[]
    | undefined;
  /**
   * Custom action to modify request headers before selection of the
   * redirected route.
   * [#comment: TODO(pradeepcrao) add an extension category.]
   */
  modify_request_headers_action?: TypedExtensionConfig | undefined;
}

function createBaseRedirectPolicy(): RedirectPolicy {
  return {
    $type: "envoy.extensions.http.custom_response.redirect_policy.v3.RedirectPolicy",
    redirect_action_specifier: undefined,
  };
}

export const RedirectPolicy: MessageFns<
  RedirectPolicy,
  "envoy.extensions.http.custom_response.redirect_policy.v3.RedirectPolicy"
> = {
  $type: "envoy.extensions.http.custom_response.redirect_policy.v3.RedirectPolicy" as const,

  encode(message: RedirectPolicy, writer: BinaryWriter = new BinaryWriter()): BinaryWriter {
    switch (message.redirect_action_specifier?.$case) {
      case "uri":
        writer.uint32(10).string(message.redirect_action_specifier.uri);
        break;
      case "redirect_action":
        RedirectAction.encode(message.redirect_action_specifier.redirect_action, writer.uint32(18).fork()).join();
        break;
    }
    if (message.status_code !== undefined) {
      UInt32Value.encode(
        { $type: "google.protobuf.UInt32Value", value: message.status_code! },
        writer.uint32(26).fork(),
      ).join();
    }
    if (message.response_headers_to_add !== undefined && message.response_headers_to_add.length !== 0) {
      for (const v of message.response_headers_to_add) {
        HeaderValueOption.encode(v!, writer.uint32(34).fork()).join();
      }
    }
    if (message.request_headers_to_add !== undefined && message.request_headers_to_add.length !== 0) {
      for (const v of message.request_headers_to_add) {
        HeaderValueOption.encode(v!, writer.uint32(42).fork()).join();
      }
    }
    if (message.modify_request_headers_action !== undefined) {
      TypedExtensionConfig.encode(message.modify_request_headers_action, writer.uint32(50).fork()).join();
    }
    return writer;
  },

  decode(input: BinaryReader | Uint8Array, length?: number): RedirectPolicy {
    const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseRedirectPolicy();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1: {
          if (tag !== 10) {
            break;
          }

          message.redirect_action_specifier = { $case: "uri", uri: reader.string() };
          continue;
        }
        case 2: {
          if (tag !== 18) {
            break;
          }

          message.redirect_action_specifier = {
            $case: "redirect_action",
            redirect_action: RedirectAction.decode(reader, reader.uint32()),
          };
          continue;
        }
        case 3: {
          if (tag !== 26) {
            break;
          }

          message.status_code = UInt32Value.decode(reader, reader.uint32()).value;
          continue;
        }
        case 4: {
          if (tag !== 34) {
            break;
          }

          if (message.response_headers_to_add === undefined) {
            message.response_headers_to_add = [];
          }
          const el = HeaderValueOption.decode(reader, reader.uint32());
          if (el !== undefined) {
            message.response_headers_to_add!.push(el);
          }
          continue;
        }
        case 5: {
          if (tag !== 42) {
            break;
          }

          if (message.request_headers_to_add === undefined) {
            message.request_headers_to_add = [];
          }
          const el = HeaderValueOption.decode(reader, reader.uint32());
          if (el !== undefined) {
            message.request_headers_to_add!.push(el);
          }
          continue;
        }
        case 6: {
          if (tag !== 50) {
            break;
          }

          message.modify_request_headers_action = TypedExtensionConfig.decode(reader, reader.uint32());
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

  fromJSON(object: any): RedirectPolicy {
    return {
      $type: RedirectPolicy.$type,
      redirect_action_specifier: isSet(object.uri)
        ? { $case: "uri", uri: globalThis.String(object.uri) }
        : isSet(object.redirect_action)
        ? { $case: "redirect_action", redirect_action: RedirectAction.fromJSON(object.redirect_action) }
        : undefined,
      status_code: isSet(object.status_code) ? Number(object.status_code) : undefined,
      response_headers_to_add: globalThis.Array.isArray(object?.response_headers_to_add)
        ? object.response_headers_to_add.map((e: any) => HeaderValueOption.fromJSON(e))
        : undefined,
      request_headers_to_add: globalThis.Array.isArray(object?.request_headers_to_add)
        ? object.request_headers_to_add.map((e: any) => HeaderValueOption.fromJSON(e))
        : undefined,
      modify_request_headers_action: isSet(object.modify_request_headers_action)
        ? TypedExtensionConfig.fromJSON(object.modify_request_headers_action)
        : undefined,
    };
  },

  toJSON(message: RedirectPolicy): unknown {
    const obj: any = {};
    if (message.redirect_action_specifier?.$case === "uri") {
      obj.uri = message.redirect_action_specifier.uri;
    }
    if (message.redirect_action_specifier?.$case === "redirect_action") {
      obj.redirect_action = RedirectAction.toJSON(message.redirect_action_specifier.redirect_action);
    }
    if (message.status_code !== undefined) {
      obj.status_code = message.status_code;
    }
    if (message.response_headers_to_add?.length) {
      obj.response_headers_to_add = message.response_headers_to_add.map((e) => HeaderValueOption.toJSON(e));
    }
    if (message.request_headers_to_add?.length) {
      obj.request_headers_to_add = message.request_headers_to_add.map((e) => HeaderValueOption.toJSON(e));
    }
    if (message.modify_request_headers_action !== undefined) {
      obj.modify_request_headers_action = TypedExtensionConfig.toJSON(message.modify_request_headers_action);
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<RedirectPolicy>, I>>(base?: I): RedirectPolicy {
    return RedirectPolicy.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<RedirectPolicy>, I>>(object: I): RedirectPolicy {
    const message = createBaseRedirectPolicy();
    if (
      object.redirect_action_specifier?.$case === "uri" &&
      object.redirect_action_specifier?.uri !== undefined &&
      object.redirect_action_specifier?.uri !== null
    ) {
      message.redirect_action_specifier = { $case: "uri", uri: object.redirect_action_specifier.uri };
    }
    if (
      object.redirect_action_specifier?.$case === "redirect_action" &&
      object.redirect_action_specifier?.redirect_action !== undefined &&
      object.redirect_action_specifier?.redirect_action !== null
    ) {
      message.redirect_action_specifier = {
        $case: "redirect_action",
        redirect_action: RedirectAction.fromPartial(object.redirect_action_specifier.redirect_action),
      };
    }
    message.status_code = object.status_code ?? undefined;
    message.response_headers_to_add = object.response_headers_to_add?.map((e) => HeaderValueOption.fromPartial(e)) ||
      undefined;
    message.request_headers_to_add = object.request_headers_to_add?.map((e) => HeaderValueOption.fromPartial(e)) ||
      undefined;
    message.modify_request_headers_action =
      (object.modify_request_headers_action !== undefined && object.modify_request_headers_action !== null)
        ? TypedExtensionConfig.fromPartial(object.modify_request_headers_action)
        : undefined;
    return message;
  },
};

messageTypeRegistry.set(RedirectPolicy.$type, RedirectPolicy);

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
