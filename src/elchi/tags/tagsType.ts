export type TagsType = { [key: string]: string[] };

export type InType = { name: string, isUnion: boolean, isDeprecated: boolean, fieldType: string, enums?: string[] | null, comment?: string, notImp: boolean };

export type OutType = { [key: string]: InType[] };
