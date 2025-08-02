import { FieldTypes } from '@/common/statics/general';
import { navigateCases } from '@/elchi/helpers/navigate-cases';
import { getDurationValueAsNumber } from '@/elchi/helpers/duration';
import jwt_decode from 'jwt-decode';
import { UserDetail } from '@/common/types';
import { useLocation } from 'react-router';


export interface FieldConfigType {
    type: FieldTypes;
    tag: string;
    fieldPath: string;
    placeHolder?: string;
    tagPrefix?: string;
    keyPrefix?: string;
    values?: string[];
    navigate?: boolean;
    required?: boolean;
    spanNum?: number;
    condition?: boolean;
    drawerShow?: any;
    additionalTags?: string[];
    disabled?: boolean;
    range?: { start: string, end: string };
    hidden?: boolean;
}

export const DecodeToken = (token: string | undefined) => {
    try {
        const decodedToken: any = jwt_decode(token);
        const userdetail: UserDetail = {
            email: decodedToken.Email,
            user_id: decodedToken.UserId,
            username: decodedToken.Username,
            groups: decodedToken.Groups,
            projects: decodedToken.Projects,
            base_project: decodedToken.BaseProject,
            base_group: decodedToken.BaseGroup,
            exp: decodedToken.exp,
            role: decodedToken.Role
        }
        return userdetail
    } catch (error) {
        console.log(error)
        return {
            email: "",
            user_id: "",
            username: "",
            groups: [],
            projects: [],
            base_project: "",
            base_group: "",
            exp: 0,
            role: ""
        }
    }
};

export const matchesEndOrStartOf = (mainStr: string, list?: string[]): boolean => {
    if (!list || !mainStr) return false;
    return list.some(subStr => {
        if (!subStr) { return false }
        return mainStr === subStr ||
            subStr.startsWith(`${mainStr}.`) ||
            subStr.includes(`.${mainStr}.`);
    });
};

export const startsWithAny = (mainStr: string, list?: string[]): boolean => {
    if (!list) return false;
    return list.some(subStr => subStr.startsWith(mainStr) || subStr.startsWith(mainStr + "."));
}

export const startsWithAll = (mainStr: string, list?: string[]): boolean => {
    if (!list) return false;

    return list.some(subStr => {
        const parts = mainStr.split(".");
        if (parts.length > 1) {
            const beforeDot = parts[0];
            const afterDot = parts[1];

            return (
                subStr.startsWith(beforeDot) ||
                subStr.startsWith(afterDot) ||
                subStr.startsWith(mainStr)
            );
        }

        return subStr.startsWith(mainStr);
    });
};

export function removePrefix(str: string, prefix: string): string {
    if (str.startsWith(prefix)) {
        return str.slice(prefix.length + 1);
    }
    return str;
}

export const getMatchingPrefix = (orginTag: string, prefixes: string[], tag: string): string | null => {
    for (const prefix of prefixes) {
        if (orginTag === `${prefix}.${tag}`) {
            return prefix;
        }
    }
    return null;
};

export function prettyTag(tag: string) {
    return tag
        .split('.')
        .map((subTag) => {
            const words = subTag.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1));
            return words.join(' ');
        })
        .join(' -> ');
}

export function getApiPathFromLocation(apiPath: string): string {
    const location = useLocation();
    const segments = location.pathname.split('/');
    const lastSegment = segments.pop();
    const safeApiPath = apiPath ?? '';
    const safeLastSegment = lastSegment ?? '';

    const searchParams = new URLSearchParams(location.search);
    const resourceId = searchParams.get('resource_id');

    return `${safeApiPath}/${safeLastSegment}?resource_id=${resourceId}`;
}

export function replaceToEmpty(value: string | undefined, replace: string) {
    return value?.replace(replace, '')
}

export function clearUniqID(value: string | undefined) {
    let removedID = '';
    let remainingName = value;

    if (value && value.length >= 6) {
        removedID = value.slice(-6);
        remainingName = value.slice(0, -6);
    }

    return {
        remainingName,
        removedID
    };
}

export function generateUniqueId(length: number) {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    const charactersLength = characters.length;
    const array = new Uint32Array(length);
    window.crypto.getRandomValues(array);

    for (let i = 0; i < length; i++) {
        result += characters.charAt(array[i] % charactersLength);
    }

    return result;
}

export function insertDashBeforeUniqID(value: string | undefined) {
    if (value && value.length <= 6) {
        return value;
    }

    const partBeforeLastSix = value?.slice(0, -6);
    const lastSixChars = value?.slice(-6);

    return `${partBeforeLastSix}-${lastSixChars}`;
}

export const getFieldValue = (reduxStore: any, fieldConfig: FieldConfigType, version: string) => {
    if (fieldConfig.type === FieldTypes.Duration) {
        if (fieldConfig.navigate) {
            return getDurationValueAsNumber(navigateCases(reduxStore, fieldConfig.fieldPath), version);
        }
        return getDurationValueAsNumber(reduxStore?.[fieldConfig.fieldPath], version);
    }

    if (fieldConfig.navigate) {
        return navigateCases(reduxStore, fieldConfig.fieldPath);
    }

    return reduxStore?.[fieldConfig.fieldPath];
};

/* export const getCondition = (reduxStore: any, fieldConfig: FieldConfigType) => {
    if (fieldConfig.navigate) {
        return navigateCases(reduxStore, fieldConfig.fieldPath)?.[0];
    } else {
        return reduxStore?.[fieldConfig.fieldPath]?.[0];
    }
} */

export const getCondition = (reduxStore: any, fieldConfig: FieldConfigType): boolean => {
    if (fieldConfig.type === FieldTypes.ArrayIcon) {
        if (fieldConfig.navigate) {
            const result = navigateCases(reduxStore, fieldConfig.fieldPath);
            if (result && typeof result === 'object') {
                if (Array.isArray(result)) {
                    return result.length > 0;
                } else {
                    return Object.keys(result).length > 0;
                }
            }
            return !!result;
        } else {
            if (reduxStore && typeof reduxStore === 'object') {
                const fieldValue = reduxStore[fieldConfig.fieldPath];
                if (fieldValue instanceof Map) {
                    return fieldValue.size > 0;
                }
                return !!fieldValue;
            } else {
                return reduxStore?.[fieldConfig.fieldPath]?.[0];
            }
        }
    }
}

export const getRange = (reduxStore: any, fieldConfig: FieldConfigType) => {
    let range = { start: 0, end: 0 }
    if (fieldConfig.range?.start && fieldConfig.range?.end) {
        range = { start: navigateCases(reduxStore, fieldConfig.range?.start), end: navigateCases(reduxStore, fieldConfig.range?.end) }
    }
    return range;
}

export function ToJson(obj: any): Record<string, any> {
    try {
        const jsonString = JSON.stringify(obj, null, 2);
        return JSON.parse(jsonString);
    } catch (error) {
        console.error('Error converting object to JSON:', error);
        return {};
    }
}

export function extractLastNumber(input: string): number | null {
    const parts = input.split('.');
    const lastPart = parts[parts.length - 1];
    const number = Number(lastPart);

    if (isNaN(number)) {
        return null;
    }

    return number;
}

export function dummyToJSON(object: any): any {
    try {
        if ('$type' in object) { delete object['$type']; }
        return JSON.parse(JSON.stringify(object));
    } catch (error) {
        console.error('Error converting to JSON:', error);
        return {};
    }
}

export function capitalizeWords(str: string): string {
    if (!str) return '';
    if (!str.trim()) return '';

    return str
        .split(' ')
        .map(word => word ? word.charAt(0).toUpperCase() + word.slice(1).toLowerCase() : '')
        .join(' ');
}

export function removePrefixes(selectedTags: string[], prefix: string): string[] {
    return selectedTags.map(tag => (tag.startsWith(prefix) ? tag.slice(prefix.length) : tag));
}

export const getRandomColor = (): string => {
    const r = Math.floor(Math.random() * 256);
    const g = Math.floor(Math.random() * 256);
    const b = Math.floor(Math.random() * 256);
    return `${r}, ${g}, ${b}`;
};


export const getHref = (tag: string, singleOptionKeys?: string[], headerOptionKeys?: string[], num?: number) => {
    let href = '';

    if (singleOptionKeys?.includes(tag)) {
        href = `single_options_${num || 0}`;
    } else if (headerOptionKeys?.includes(tag)) {
        href = `header_options_${num || 0}`;
    } else {
        href = `${tag}_${num || 0}`;
    }

    return `${href}`;
};

export const isOnlyOne = (orginTag: string, onlyOneTag: string[][] | undefined, selectedTags: string[]) => {
    let relatedGroup: string[] = [];
    for (const tagGroup of onlyOneTag || []) {
        if (tagGroup.includes(orginTag)) {
            relatedGroup = tagGroup;
            break;
        }
    }

    if (!relatedGroup) return false;
    return relatedGroup.some(t =>
        selectedTags?.some(selectedTag =>
            (selectedTag === t ||
                (selectedTag.startsWith(t) && selectedTag[t.length] === '.' && !selectedTag.startsWith(orginTag))) &&
            selectedTag !== orginTag
        )
    );
};

export const parseError = (error: string): string => {
    if (error?.includes("E11000 duplicate key error collection")) {
        const match = error.match(/general\.name:\s*["'](.*?)["']/i);
        const name = match ? match[1] : "unknown";
        return `Name '${name}' already using!`;
    }
    return error;
};

export const getLastDotPart = (str: string): string => {
    const parts = str.split('.');
    return parts[parts.length - 1];
};