/* eslint-disable no-unused-vars */

type SetSelectedTagsFunction = (tags: string[]) => void;
type SetSelectedTagsFunction_A = (tags: Record<number, string[]>) => void;
type HandleChangeReduxFunction = (tag: string) => void;
type HandleChangeReduxFunction_A = ({ keys, index }: { keys?: string, index?: number }) => void;


export const handleAddRemoveTags = (
    keyPrefix: string | null,
    tagPrefix: string | null,
    tag: string,
    checked: boolean,
    selectedTags: string[],
    setSelectedTags: SetSelectedTagsFunction,
    handleChangeRedux?: HandleChangeReduxFunction,
    doNotChange?: boolean,
) => {
    if (!doNotChange) {
        const fullTag = tagPrefix ? `${tagPrefix}.${tag}` : tag
        const nextSelectedTags = checked
            ? [...selectedTags, fullTag]
            /* : (selectedTags as string[]).filter((t) => t !== fullTag && t !== `${fullTag}.$type`); */
            : selectedTags.filter((t) => {
                if (t !== fullTag && t !== `${fullTag}.$type`) {
                    if (!selectedTags.includes(fullTag)) {
                        return !t.startsWith(fullTag);
                    }
                    return true;
                }
                return false;
            });
        setSelectedTags(nextSelectedTags);
        if (!checked && handleChangeRedux) {
            handleChangeRedux(keyPrefix ? `${keyPrefix}.${tag}` : tag);
        }
    }
}

export const handleAddRemoveTags_A = (
    keyPrefix: string | null,
    tagPrefix: string | null,
    tag: string,
    index: number,
    checked: boolean,
    selectedTags: Record<number, string[]>,
    setSelectedTags: SetSelectedTagsFunction_A,
    handleChangeRedux?: HandleChangeReduxFunction_A,
    doNotChange?: boolean,
) => {
    if (!doNotChange) {
        const nextSelectedTags: Record<number, string[]> = { ...(selectedTags) };
        const fullTag = tagPrefix ? `${tagPrefix}.${tag}` : tag

        /* nextSelectedTags[index] = checked
            ? [...(nextSelectedTags[index] || []), fullTag]
            : (nextSelectedTags[index] || []).filter((t) => t !== fullTag && !t.startsWith(fullTag)); */
        nextSelectedTags[index] = checked
            ? [...(nextSelectedTags[index] || []), fullTag]
            : (nextSelectedTags[index] || []).filter((t) => {
                if (nextSelectedTags[index].includes(fullTag)) {
                    return t !== fullTag;
                } else {
                    return !t.startsWith(fullTag);
                }
            });
        setSelectedTags(nextSelectedTags);
        if (!checked && handleChangeRedux) {
            handleChangeRedux({
                keys: keyPrefix ? `${keyPrefix}.${tag}` : tag,
                index
            });
        }
    }
}
