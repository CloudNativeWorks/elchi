type OutputObjectType = {
    [key: number]: string[];
};

const IGNORED_SUFFIXES = ['.seconds', '.nanos'];

function endsWithIgnoredSuffix(key: string): boolean {
    return IGNORED_SUFFIXES.some(suffix => key.endsWith(suffix));
}

function removeIgnoredSuffixes(key: string): string {
    for (const suffix of IGNORED_SUFFIXES) {
        if (key.endsWith(suffix)) {
            return key.slice(0, -suffix.length);
        }
    }
    return key;
}

function shouldIgnore(key: string): boolean {
    return key === '$case';
}

function getValidKeys(obj: { [key: string]: any } | null | undefined): string[] {
    if (!obj) return [];

    const validKeys: string[] = Object.keys(obj);

    for (const key in obj) {
        if (Object.hasOwn(obj, key)) {
            if (typeof obj[key] === "object" && obj[key] !== null) {
                validKeys.push(key);
            }
        }
    }

    return validKeys.filter((key) =>
        obj[key] !== undefined
    );
}

export const extractNestedKeys = (obj: any, base?: string): string[] => {
    const validKeys = getValidKeys(obj);
    const keys: Set<string> = new Set();

    validKeys.forEach(key => {
        if (!shouldIgnore(key)) {
            const newBase = base ? `${base}.${key}` : key;
            const sanitizedBase = endsWithIgnoredSuffix(newBase) ? removeIgnoredSuffixes(newBase) : newBase;


            if (key === "value" && obj["$type"] === "google.protobuf.Any" && obj["type_url"]) {
                keys.add(sanitizedBase);
                return;
            }

            if (typeof obj[key] === "object" && obj[key] !== null && Object.keys(obj[key]).length === 0) {
                keys.add(sanitizedBase);
            } else if (Array.isArray(obj[key]) && obj[key].length >= 1) {
                keys.add(sanitizedBase);
            } else if (typeof obj[key] === "object" && obj[key] !== null) {
                const nestedKeys = extractNestedKeys(obj[key], sanitizedBase);
                nestedKeys.forEach(nestedKey => keys.add(nestedKey));




                /* if (typeof obj[key] === "object" && obj[key] !== null) {
                    if (Object.keys(obj[key]).length === 0) {
                        keys.add(sanitizedBase);
                    } else if (Array.isArray(obj[key]) && obj[key].length >= 1) {
                        keys.add(sanitizedBase);
                    } else {
                        const nestedKeys = extractNestedKeys(obj[key], sanitizedBase);
                        nestedKeys.forEach(nestedKey => keys.add(nestedKey));
                    } */




            } else if (!shouldIgnore(sanitizedBase)) {
                keys.add(sanitizedBase);
            }
        }
    });

    return [...keys].filter(Boolean);
}

export const processArray = (data: any[] | undefined, base?: string): OutputObjectType => {
    const output: OutputObjectType = {};
    if (!data || data.length === 0 || Object.values(data).length === 0) return { 0: [] };

    data?.forEach((item, index) => {
        output[index] = extractNestedKeys(item, base);
    });

    return output;
}