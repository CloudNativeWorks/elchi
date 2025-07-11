// Code generated by protoc-gen-ts_proto. DO NOT EDIT.
// versions:
//   protoc-gen-ts_proto  v2.2.7
//   protoc               unknown
// source: udpa/annotations/migrate.proto

/* eslint-disable */
import { BinaryReader, BinaryWriter } from "@bufbuild/protobuf/wire";
import { messageTypeRegistry } from "../../typeRegistry";

export const protobufPackage = "udpa.annotations";

export interface MigrateAnnotation {
  $type: "udpa.annotations.MigrateAnnotation";
  /** Rename the message/enum/enum value in next version. */
  rename?: string | undefined;
}

export interface FieldMigrateAnnotation {
  $type: "udpa.annotations.FieldMigrateAnnotation";
  /** Rename the field in next version. */
  rename?:
    | string
    | undefined;
  /**
   * Add the field to a named oneof in next version. If this already exists, the
   * field will join its siblings under the oneof, otherwise a new oneof will be
   * created with the given name.
   */
  oneof_promotion?: string | undefined;
}

export interface FileMigrateAnnotation {
  $type: "udpa.annotations.FileMigrateAnnotation";
  /**
   * Move all types in the file to another package, this implies changing proto
   * file path.
   */
  move_to_package?: string | undefined;
}

function createBaseMigrateAnnotation(): MigrateAnnotation {
  return { $type: "udpa.annotations.MigrateAnnotation" };
}

export const MigrateAnnotation: MessageFns<MigrateAnnotation, "udpa.annotations.MigrateAnnotation"> = {
  $type: "udpa.annotations.MigrateAnnotation" as const,

  encode(message: MigrateAnnotation, writer: BinaryWriter = new BinaryWriter()): BinaryWriter {
    if (message.rename !== undefined && message.rename !== "") {
      writer.uint32(10).string(message.rename);
    }
    return writer;
  },

  decode(input: BinaryReader | Uint8Array, length?: number): MigrateAnnotation {
    const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseMigrateAnnotation();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1: {
          if (tag !== 10) {
            break;
          }

          message.rename = reader.string();
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

  fromJSON(object: any): MigrateAnnotation {
    return {
      $type: MigrateAnnotation.$type,
      rename: isSet(object.rename) ? globalThis.String(object.rename) : undefined,
    };
  },

  toJSON(message: MigrateAnnotation): unknown {
    const obj: any = {};
    if (message.rename !== undefined) {
      obj.rename = message.rename;
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<MigrateAnnotation>, I>>(base?: I): MigrateAnnotation {
    return MigrateAnnotation.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<MigrateAnnotation>, I>>(object: I): MigrateAnnotation {
    const message = createBaseMigrateAnnotation();
    message.rename = object.rename ?? undefined;
    return message;
  },
};

messageTypeRegistry.set(MigrateAnnotation.$type, MigrateAnnotation);

function createBaseFieldMigrateAnnotation(): FieldMigrateAnnotation {
  return { $type: "udpa.annotations.FieldMigrateAnnotation" };
}

export const FieldMigrateAnnotation: MessageFns<FieldMigrateAnnotation, "udpa.annotations.FieldMigrateAnnotation"> = {
  $type: "udpa.annotations.FieldMigrateAnnotation" as const,

  encode(message: FieldMigrateAnnotation, writer: BinaryWriter = new BinaryWriter()): BinaryWriter {
    if (message.rename !== undefined && message.rename !== "") {
      writer.uint32(10).string(message.rename);
    }
    if (message.oneof_promotion !== undefined && message.oneof_promotion !== "") {
      writer.uint32(18).string(message.oneof_promotion);
    }
    return writer;
  },

  decode(input: BinaryReader | Uint8Array, length?: number): FieldMigrateAnnotation {
    const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseFieldMigrateAnnotation();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1: {
          if (tag !== 10) {
            break;
          }

          message.rename = reader.string();
          continue;
        }
        case 2: {
          if (tag !== 18) {
            break;
          }

          message.oneof_promotion = reader.string();
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

  fromJSON(object: any): FieldMigrateAnnotation {
    return {
      $type: FieldMigrateAnnotation.$type,
      rename: isSet(object.rename) ? globalThis.String(object.rename) : undefined,
      oneof_promotion: isSet(object.oneof_promotion) ? globalThis.String(object.oneof_promotion) : undefined,
    };
  },

  toJSON(message: FieldMigrateAnnotation): unknown {
    const obj: any = {};
    if (message.rename !== undefined) {
      obj.rename = message.rename;
    }
    if (message.oneof_promotion !== undefined) {
      obj.oneof_promotion = message.oneof_promotion;
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<FieldMigrateAnnotation>, I>>(base?: I): FieldMigrateAnnotation {
    return FieldMigrateAnnotation.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<FieldMigrateAnnotation>, I>>(object: I): FieldMigrateAnnotation {
    const message = createBaseFieldMigrateAnnotation();
    message.rename = object.rename ?? undefined;
    message.oneof_promotion = object.oneof_promotion ?? undefined;
    return message;
  },
};

messageTypeRegistry.set(FieldMigrateAnnotation.$type, FieldMigrateAnnotation);

function createBaseFileMigrateAnnotation(): FileMigrateAnnotation {
  return { $type: "udpa.annotations.FileMigrateAnnotation" };
}

export const FileMigrateAnnotation: MessageFns<FileMigrateAnnotation, "udpa.annotations.FileMigrateAnnotation"> = {
  $type: "udpa.annotations.FileMigrateAnnotation" as const,

  encode(message: FileMigrateAnnotation, writer: BinaryWriter = new BinaryWriter()): BinaryWriter {
    if (message.move_to_package !== undefined && message.move_to_package !== "") {
      writer.uint32(18).string(message.move_to_package);
    }
    return writer;
  },

  decode(input: BinaryReader | Uint8Array, length?: number): FileMigrateAnnotation {
    const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseFileMigrateAnnotation();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 2: {
          if (tag !== 18) {
            break;
          }

          message.move_to_package = reader.string();
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

  fromJSON(object: any): FileMigrateAnnotation {
    return {
      $type: FileMigrateAnnotation.$type,
      move_to_package: isSet(object.move_to_package) ? globalThis.String(object.move_to_package) : undefined,
    };
  },

  toJSON(message: FileMigrateAnnotation): unknown {
    const obj: any = {};
    if (message.move_to_package !== undefined) {
      obj.move_to_package = message.move_to_package;
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<FileMigrateAnnotation>, I>>(base?: I): FileMigrateAnnotation {
    return FileMigrateAnnotation.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<FileMigrateAnnotation>, I>>(object: I): FileMigrateAnnotation {
    const message = createBaseFileMigrateAnnotation();
    message.move_to_package = object.move_to_package ?? undefined;
    return message;
  },
};

messageTypeRegistry.set(FileMigrateAnnotation.$type, FileMigrateAnnotation);

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
