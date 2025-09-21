export const headerOptionFields = [
    "response_headers_to_add",
    "response_headers_to_remove",
    "request_headers_to_add",
    "request_headers_to_remove",
]

/* eslint-disable */
export enum FieldTypes {
    String = 'string',
    Boolean = 'boolean',
    Select = 'select',
    Number = 'number',
    Duration = 'duration',
    Range = 'range',
    TagsNum = 'number[]',
    ArrayIcon = 'arrayicon',
    EmptyObject = 'emptyObject',
    Regex = 'regex',
    Tags = 'tags',
    InputArea = 'inputArea',
    JSON = 'JSON',
    Lua = 'lua',
    SelectWithGtype = 'selectWithGtype',
}

export function mapToFieldType(fieldType: string): FieldTypes {
    switch (fieldType.toLowerCase()) {
        case 'string':
            return FieldTypes.String;
        case 'boolean':
            return FieldTypes.Boolean;
        case 'select':
            return FieldTypes.Select;
        case 'number':
            return FieldTypes.Number;
        case 'duration':
            return FieldTypes.Duration;
        case 'range':
            return FieldTypes.Range;
        case 'number[]':
            return FieldTypes.TagsNum;
        case 'string[]':
            return FieldTypes.Tags;
        case 'arrayicon':
            return FieldTypes.ArrayIcon;
        case 'emptyobject':
            return FieldTypes.EmptyObject;
        case 'regex':
            return FieldTypes.Regex;
        case 'tags':
            return FieldTypes.Tags;
        case 'inputarea':
            return FieldTypes.InputArea;
        case 'json':
            return FieldTypes.JSON;
        case 'selectwithgtype':
            return FieldTypes.SelectWithGtype;
        case 'Int32Range':
            return FieldTypes.Range;
        case 'Int64Range':
            return FieldTypes.Range;
        default:
            return FieldTypes.String;
    }
}
