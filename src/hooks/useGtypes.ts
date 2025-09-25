import { getFieldsByGType, GTypeFieldsBase, GTypes } from '@/common/statics/gtypes';

export function useGTypeFields(gtype: GTypes): GTypeFieldsBase {
    const fields = getFieldsByGType(gtype);

    if (!fields) {
        throw new Error(`Unsupported GType: ${gtype}`);
    }

    return fields;
}

export function getGTypeFields(type: string): GTypes {
    return Object.values(GTypes).find((value) => value === type);
}