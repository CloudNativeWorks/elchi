import { useEffect, useMemo, useRef, useState } from "react";
import { matchesEndOrStartOf } from "@/utils/tools";
import { extractNestedKeys, processArray } from "@/utils/get-active-tags";

/**
 * Why this module exists
 * ----------------------
 * `selectedTags` decides which config fields (and their inputs) are visible in
 * the HorizonTags / CustomAnchor field pickers. It used to be reset on every
 * redux change with `setSelectedTags(extractNestedKeys(reduxStore))`.
 *
 * Because toggling a field ON writes nothing to redux (only local state) and
 * `extractNestedKeys` only returns keys that already have a VALUE, typing into
 * one selected-but-empty field caused every other selected-but-empty sibling to
 * disappear (its key isn't in the store yet, so the reset dropped it).
 *
 * The fix is a diff-merge: keep user-toggled "pending" (still empty) tags while
 * still honouring genuinely external store changes (load / undo / oneof switch).
 *
 * A previous tag is kept as *pending* iff it is NOT represented in the new
 * store-derived set AND was NOT represented in the previous one. A tag that had
 * a value last tick and is gone now = externally removed → dropped.
 *
 * "Represented" reuses `matchesEndOrStartOf` — the same matching the UI uses for
 * `isChecked` — so a pending parent `a.b` is pruned once any `a.b.child` lands.
 */
export function mergeSelectedTags(
    prevSelected: string[],
    prevStoreTags: string[],
    nextStoreTags: string[],
): string[] {
    const pending = (prevSelected || []).filter(tag =>
        !matchesEndOrStartOf(tag, nextStoreTags) &&
        !matchesEndOrStartOf(tag, prevStoreTags)
    );
    const out = [...nextStoreTags];
    for (const tag of pending) {
        if (!out.includes(tag)) out.push(tag);
    }
    return out;
}

type IndexedTags = Record<number, string[]>;

export function mergeSelectedTagsIndexed(
    prevSelected: IndexedTags,
    prevStoreTags: IndexedTags,
    nextStoreTags: IndexedTags,
): IndexedTags {
    const prevIdx = Object.keys(prevStoreTags || {});
    const nextIdx = Object.keys(nextStoreTags || {});

    // STRUCTURAL CHANGE GUARD: an array append/remove shifts indices, so a
    // pending empty would land on the wrong slot. When the index set changes,
    // fall back to the store-derived set (the original behavior) — strictly no
    // worse than before, and it avoids cross-slot leakage.
    const sameShape =
        prevIdx.length === nextIdx.length &&
        prevIdx.every(k => Object.hasOwn(nextStoreTags, k));

    if (!sameShape) return { ...nextStoreTags };

    const out: IndexedTags = {};
    for (const key of nextIdx) {
        const i = Number(key);
        out[i] = mergeSelectedTags(
            prevSelected?.[i] ?? [],
            prevStoreTags?.[i] ?? [],
            nextStoreTags[i] ?? [],
        );
    }
    return out;
}

/**
 * Owns selectedTags state for the single (string[]) case. Drop-in replacement
 * for the `useState(extractNestedKeys) + useEffect(reset)` pattern.
 */
export function useSyncedSelectedTags(
    reduxStore: any,
): [string[], React.Dispatch<React.SetStateAction<string[]>>] {
    const fromStore = useMemo(() => extractNestedKeys(reduxStore), [reduxStore]);
    const prevStoreRef = useRef<string[]>(fromStore);
    const [selectedTags, setSelectedTags] = useState<string[]>(fromStore);

    useEffect(() => {
        setSelectedTags(prev => mergeSelectedTags(prev, prevStoreRef.current, fromStore));
        prevStoreRef.current = fromStore;
    }, [fromStore]);

    return [selectedTags, setSelectedTags];
}

/**
 * Owns selectedTags state for the indexed (Record<number, string[]>) case.
 */
export function useSyncedSelectedTagsIndexed(
    reduxStore: any[],
): [IndexedTags, React.Dispatch<React.SetStateAction<IndexedTags>>] {
    const fromStore = useMemo(
        () => (reduxStore ? (processArray(reduxStore) as IndexedTags) : {}),
        [reduxStore],
    );
    const prevStoreRef = useRef<IndexedTags>(fromStore);
    const [selectedTags, setSelectedTags] = useState<IndexedTags>(fromStore);

    useEffect(() => {
        setSelectedTags(prev => mergeSelectedTagsIndexed(prev, prevStoreRef.current, fromStore));
        prevStoreRef.current = fromStore;
    }, [fromStore]);

    return [selectedTags, setSelectedTags];
}
