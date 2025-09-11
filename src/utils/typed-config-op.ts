import { navigateCases } from "@/elchi/helpers/navigate-cases";


export interface TypedConfigB64 {
    name: string | undefined;
    typed_config: TypedConfigB64Per
}

export interface TypedConfigB64Per {
    type_url: any;
    value: {
        key: number | string;
    }
}

export interface DecodedTypedConfig {
    name: string | undefined;
    typed_config: {
        type_url: any;
        value: any;
    }
}

export interface DecodedTypedConfigPer {
    type_url: any;
    value: any;
}

export const ObjToBase64Per = (filter: TypedConfigB64Per): DecodedTypedConfigPer | undefined => {
    try {
        const byteValue = navigateCases(filter, "value");
        const base64Value = ValueToBase64Per(byteValue)

        const decodedFilter: DecodedTypedConfigPer = {
            ...filter,
            type_url: navigateCases(filter, "type_url"),
            value: base64Value
        };
        return decodedFilter;
    } catch (error) {
        console.error("Error Occurred:", error);
        return undefined;
    }
}

export const ValueToBase64Per = (filter: any): string | undefined => {
    try {
        const stringValue = JSON.stringify(filter);
        const base64Value = btoa(stringValue);

        return base64Value;
    } catch (error) {
        console.error("Error Occurred:", error);
        return undefined;
    }
}



export const ByteToObjPer = (filter: any): DecodedTypedConfigPer | undefined => {
    try {
        const byteValue = filter.value;
        const typeUrl = filter.type_url;

        if (!byteValue || byteValue.length === 0) {
            return {
                type_url: typeUrl,
                value: {}
            };
        }

        const decodedString = new TextDecoder().decode(byteValue);
        if (!decodedString || decodedString.trim() === "") {
            throw new Error("Empty string after decoding");
        }

        const decodedJSON = JSON.parse(decodedString);
        const decodedFilter: DecodedTypedConfigPer = {
            type_url: typeUrl,
            value: decodedJSON
        };

        return decodedFilter;
    } catch (error) {
        console.error("Error Occurred:", error);
        return undefined;
    }
}

export const ObjToBase64 = (filter: TypedConfigB64): DecodedTypedConfig | undefined => {
    try {
        const byteValue = navigateCases(filter, "typed_config.value");
        const stringValue = JSON.stringify(byteValue);
        const base64Value = btoa(stringValue);

        const decodedFilter: DecodedTypedConfig = {
            ...filter,
            typed_config: {
                type_url: navigateCases(filter, "typed_config.type_url"),
                value: base64Value
            }
        };
        return decodedFilter;
    } catch (error) {
        console.error("Error Occurred:", error);
        return undefined;
    }
}

export const ByteToObj = (filter: any): DecodedTypedConfig | DecodedTypedConfig[] | undefined => {
    const processFilter = (singleFilter: any): DecodedTypedConfig | undefined => {
        try {
            const byteValue = navigateCases(singleFilter, "config_type.typed_config.value") || navigateCases(singleFilter, "typed_config.value");

            if (!byteValue || byteValue.length === 0) {
                return {
                    ...singleFilter,
                    typed_config: {
                        type_url: "",
                        value: {}
                    }
                }
                /* throw new Error("Invalid byteValue"); */
            }

            const stringValue = new TextDecoder().decode(byteValue);

            if (!stringValue || stringValue.trim() === "") {
                throw new Error("Empty string after decoding");
            }

            const decodedJSON = JSON.parse(stringValue);

            const decodedFilter: DecodedTypedConfig = {
                ...singleFilter,
                typed_config: {
                    type_url: navigateCases(singleFilter, "typed_config.type_url"),
                    value: decodedJSON
                }
            };
            return decodedFilter;

        } catch (error) {
            console.error("Error Occurred:", error);
            return undefined;
        }
    };

    if (Array.isArray(filter)) {
        return filter.map(f => processFilter(f)).filter(f => f !== undefined);
    } else {
        return processFilter(filter);
    }
}

export function Base64FromBytes(buffer: ArrayBuffer): string {
    const arr = new Uint8Array(buffer);
    const bin: string[] = [];
    arr.forEach((byte) => {
        bin.push(String.fromCharCode(byte));
    });
    return btoa(bin.join(""));
}

export function BytesFromBase64(b64: string): Uint8Array {
    const binaryString = window.atob(b64);
    const len = binaryString.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
        bytes[i] = binaryString.charCodeAt(i);
    }
    return bytes;
}

