export const DeleteNestedObject = (draft: any, keys: string[]) => {
    let temp = draft;
    for (let i = 0; i < keys.length - 1; i++) {
        temp = temp[keys[i]];

        if (typeof temp === 'undefined') {
            return;
        }
    }

    const lastKey = keys[keys.length - 1];
    if (Array.isArray(temp)) {
        temp.splice(Number(lastKey), 1);
    } else {
        delete temp[lastKey];
    }
};

export const DeleteConfigDiscoveryByParentName = (draft: any, parentName: string) => {
    const index = draft.findIndex((item: any) => item.parent_name === parentName);

    if (index !== -1) {
        draft.splice(index, 1);
    }
};

export const DeleteNestedObjectByParentName = (draft: any, keys: string[], parentName: string) => {
    let temp = draft;
    for (let i = 0; i < keys.length - 1; i++) {
        temp = temp[keys[i]];

        if (typeof temp === 'undefined') {
            return;
        }
    }

    const lastKey = keys[keys.length - 1];

    if (Array.isArray(temp[lastKey])) {
        const index = temp[lastKey].findIndex((item: any) => item.name === parentName);
        if (index !== -1) {
            temp[lastKey].splice(index, 1);
        }
    }
};

export const deleteValueInNestedArray = (draft: any, keys: string[], val: string) => {
    let temp = draft;
    for (const key of keys) {
        temp = temp[key];

        if (typeof temp === 'undefined') {
            return;
        }
    }

    if (!Array.isArray(temp)) {
        console.error('The final element is not an array.');
        return;
    }

    const index = temp.indexOf(val);

    if (index !== -1) {
        temp.splice(index, 1);
    } else {
        console.warn('Value not found in array.');
    }
};

export const UpdateNestedObject = (draft: any, keys: string[], value: any): void => {
    if (keys.length === 0) {
        Object.assign(draft, value);
        return;
    }

    const createNestedObject = (base: any, path: string[], value: any) => {
        path.slice(0, -1).reduce((acc, key, index) => {
            if (isNaN(Number(path[index + 1]))) {
                acc[key] = acc[key] || {};
            } else {
                acc[key] = acc[key] || [];
            }
            return acc[key];
        }, base)[path[path.length - 1]] = value;
    };

    createNestedObject(draft, keys, value);
};

export const UpdateMainListWithNewPriorities = (draft: any, updatedList: any): void => {
    const itemsToSort = draft.filter((mainItem: any) =>
        updatedList.some((updatedItem: any) => updatedItem.parent_name === mainItem.parent_name)
    );

    itemsToSort.forEach((item: any) => {
        const matchingItem = updatedList.find(
            (updatedItem: any) => updatedItem.parent_name === item.parent_name
        );
        if (matchingItem) {
            item.priority = matchingItem.priority;
        }
    });

    itemsToSort.sort((a: any, b: any) => a.priority - b.priority);

    const remainingItems = draft.filter(
        (mainItem: any) => !updatedList.some((updatedItem: any) => updatedItem.parent_name === mainItem.parent_name)
    );

    draft.splice(0, draft.length, ...remainingItems, ...itemsToSort);
}
/* 
export const UpdateNestedArray = (draft: any, keys: string[], value: any) => {
    if (keys.length === 0) {
        if (!Array.isArray(draft)) {
            draft = [];
        }
        draft.push(value);
        return;
    }

    const key = keys[0];

    if (keys.length === 1) {
        if (!isNaN(Number(key))) {
            const index = Number(key);

            if (!draft[key]) draft[key] = [];
            while (draft.length <= index) {
                draft.push(undefined);
            }
            draft[index] = value;
        } else if (!draft[key]) {
            draft[key] = [value];
        } else if (Array.isArray(draft[key])) {
            draft[key].push(value);
        } else {
            draft[key] = value;
        }

        return;
    }

    if (!draft[key]) {
        draft[key] = {};
    }

    UpdateNestedArray(draft[key], keys.slice(1), value);
};
 */

export const UpdateNestedArray = (draft: any, keys: string[], value: any) => {
    if (keys.length === 0) {
        addValueToDraft(draft, value);
        return;
    }

    const key = keys[0];

    if (keys.length === 1) {
        handleLastKey(draft, key, value);
        return;
    }

    if (!draft[key]) {
        draft[key] = {};
    }

    UpdateNestedArray(draft[key], keys.slice(1), value);
};

const addValueToDraft = (draft: any, value: any) => {
    if (!Array.isArray(draft)) {
        draft = [];
    }
    draft.push(value);
};

const handleLastKey = (draft: any, key: string, value: any) => {
    if (isNumericKey(key)) {
        handleNumericKey(draft, key, value);
    } else {
        handleNonNumericKey(draft, key, value);
    }
};

const isNumericKey = (key: string): boolean => !isNaN(Number(key));

const handleNumericKey = (draft: any, key: string, value: any) => {
    const index = Number(key);
    if (!draft[key]) draft[key] = [];
    ensureDraftHasIndex(draft, index);
    draft[index] = value;
};

const ensureDraftHasIndex = (draft: any, index: number) => {
    while (draft.length <= index) {
        draft.push(undefined);
    }
};

const handleNonNumericKey = (draft: any, key: string, value: any) => {
    if (!draft[key]) {
        draft[key] = [value];
    } else if (Array.isArray(draft[key])) {
        draft[key].push(value);
    } else {
        draft[key] = value;
    }
};