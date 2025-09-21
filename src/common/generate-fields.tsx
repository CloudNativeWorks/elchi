import { InType } from "@/elchi/tags/tagsType";
import { FieldConfigType } from "@/utils/tools";
import { FieldTypes, mapToFieldType } from "./statics/general";


type FieldBeginType = {
    f: InType[]; // field list 
    sf: string[]; // single value field list
    e?: string[]; // exclude list
    r?: string[]; // required list
    sn?: number; // width of the form
    ssn?: { [key: string]: number }; // specific width of the form
    rwr?: Record<string, FieldTypes>; // type overwrite
    d?: string[]; // disable fields
    h?: string[]; // hide fields
}

export function generateFields({ f, sf, e, r, sn, ssn, rwr, d, h }: FieldBeginType): FieldConfigType[] {
    if (!f || !sf) { return [] }

    return f
        ?.filter(field => {
            const isValidType = sf?.includes(field.name) ?? false;
            const isExcluded = e?.includes(field.name) ?? false;
            return isValidType && !isExcluded;
        })
        ?.map(field => {
            const splitName = field.name.split('.');
            const fieldPath = splitName.pop() || field.name;
            const prefix = splitName.join('.') || '';

            const fields: FieldConfigType = {
                tag: fieldPath,
                type: mapToFieldType(field.enums ? 'select' : field.fieldType),
                placeHolder: `(${field.fieldType})`,
                fieldPath: field.name,
                values: field.enums || [],
                tagPrefix: prefix,
                navigate: field.isUnion,
            }

            if (d) {
                fields.disabled = d.includes(field.name);
            }

            if (r) {
                fields.required = r.includes(field.name);
            }

            if (sn) {
                fields.spanNum = sn;
            }

            if (ssn?.[field.name]) {
                fields.spanNum = ssn[field.name];
            }

            if (rwr?.[field.name]) {
                fields.type = rwr[field.name];
            }

            if (h) {
                fields.hidden = h.includes(field.name);
            }

            return fields;
        });
}
