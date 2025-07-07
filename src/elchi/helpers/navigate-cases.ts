export function navigateCases(record: any, path: string): any {
    const keys = path.split('.');
    let currentObject = record;

    for (const key of keys) {
        currentObject = getNestedValue(currentObject, key);
        if (!currentObject) return undefined;
    }

    return currentObject;
}

export function getNestedValue(obj: any, key: string) {
    if (!obj || typeof obj !== 'object') return undefined;
    if (key in obj) return obj[key];
    const caseValue = obj['$case'];
    if (caseValue === key) return obj[key];
    return undefined;
}
