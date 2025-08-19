export const processChangedValues = (
    basePath: string,
    changedValues: any,
    handleChange: any,
) => {
    const buildDotPath = (base: string, obj: any): [string, any][] => {
        const entries: [string, any][] = [];
        Object.entries(obj).forEach(([key, value]) => {
            if (typeof value === "object" && !Array.isArray(value)) {
                const nestedEntries = buildDotPath(`${base}.${key}`, value);
                entries.push(...nestedEntries);
            } else {
                entries.push([`${base}.${key}`, value]);
            }
        });
        return entries;
    };

    Object.entries(changedValues).forEach(([fieldName, value]) => {
        if (
            Array.isArray(value) &&
            value.every((item) => typeof item === "string" || typeof item === "number")
        ) {
            handleChange(`${basePath}.${fieldName}`, value);
        } else if (Array.isArray(value)) {
            value.forEach((item, index) => {
                if (typeof item === "object") {
                    buildDotPath(`${basePath}.${fieldName}.${index}`, item).forEach(([key, val]) => {
                        handleChange(key, val);
                    });
                } else {
                    handleChange(`${basePath}.${fieldName}.${index}`, item);
                }
            });
        } else if (typeof value === "object") {
            buildDotPath(`${basePath}.${fieldName}`, value).forEach(([key, val]) => {
                handleChange(key, val);
            });
        } else {
            handleChange(`${basePath}.${fieldName}`, value);
        }
    });
};