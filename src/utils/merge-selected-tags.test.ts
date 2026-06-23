/**
 * Diff-merge keeps user-toggled "pending" (empty) tags while honouring genuine
 * external store changes. These tests pin the behaviour that fixes the
 * HorizonTags / CustomAnchor "sibling disappears while typing" bug.
 */
import { describe, expect, it } from 'vitest';
import { mergeSelectedTags, mergeSelectedTagsIndexed } from './merge-selected-tags';

describe('mergeSelectedTags', () => {
    it('keeps a pending tag (never in store) — the reported bug', () => {
        // user toggled 'a' on (no value yet) -> stays selected
        expect(mergeSelectedTags(['a'], [], [])).toEqual(['a']);
    });

    it('keeps a pending sibling when another field gets a value', () => {
        // typed into 'a' (now in store), 'b' still pending -> both remain
        expect(mergeSelectedTags(['a', 'b'], [], ['a'])).toEqual(['a', 'b']);
    });

    it('drops a tag removed externally (had a value, now gone)', () => {
        expect(mergeSelectedTags(['a'], ['a'], [])).toEqual([]);
    });

    it('prunes a pending parent once a child appears (no duplicate)', () => {
        expect(mergeSelectedTags(['a.b'], [], ['a.b.c'])).toEqual(['a.b.c']);
    });

    it('surfaces newly stored values', () => {
        expect(mergeSelectedTags([], [], ['x'])).toEqual(['x']);
    });

    it('unions store-derived first, then pending, deduped', () => {
        expect(mergeSelectedTags(['p'], [], ['x'])).toEqual(['x', 'p']);
        expect(mergeSelectedTags(['x'], [], ['x'])).toEqual(['x']);
    });
});

describe('mergeSelectedTagsIndexed', () => {
    it('preserves pending per index while the shape is stable (typing)', () => {
        expect(
            mergeSelectedTagsIndexed({ 0: ['name', 'x'] }, { 0: ['name'] }, { 0: ['name'] }),
        ).toEqual({ 0: ['name', 'x'] });
    });

    it('falls back to store-derived on structural change (splice) — no orphan', () => {
        expect(
            mergeSelectedTagsIndexed(
                { 0: ['name'], 1: ['name'] },
                { 0: ['name'], 1: ['name'] },
                { 0: ['name'] },
            ),
        ).toEqual({ 0: ['name'] });
    });

    it('append self-heals via store-derived shape', () => {
        expect(
            mergeSelectedTagsIndexed({ 0: ['name'] }, { 0: ['name'] }, { 0: ['name'], 1: ['name'] }),
        ).toEqual({ 0: ['name'], 1: ['name'] });
    });
});
