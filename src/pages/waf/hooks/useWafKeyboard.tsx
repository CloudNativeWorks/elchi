import { useEffect } from 'react';
import { useWafEditor } from '../state/wafEditorStore';

interface UseWafKeyboardOptions {
    onSave: () => void;
    enabled?: boolean;
}

/**
 * Page-level keyboard shortcuts.
 *   ⌘S / Ctrl+S          → save
 *   ⌘Z / Ctrl+Z          → undo
 *   ⌘⇧Z / Ctrl+⇧Z / ⌘Y  → redo
 *
 * Skips when the user is typing in an input/textarea/contenteditable so
 * native browser behavior (caret undo) keeps working inside text editors.
 */
export const useWafKeyboard = ({ onSave, enabled = true }: UseWafKeyboardOptions): void => {
    const { dispatch } = useWafEditor();

    useEffect(() => {
        if (!enabled) return;

        const isEditableTarget = (target: EventTarget | null): boolean => {
            if (!(target instanceof HTMLElement)) return false;
            const tag = target.tagName;
            if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') return true;
            if (target.isContentEditable) return true;
            // Monaco renders into a textarea inside .monaco-editor — skip those too.
            if (target.closest('.monaco-editor')) return true;
            return false;
        };

        const handler = (e: KeyboardEvent) => {
            const meta = e.metaKey || e.ctrlKey;
            if (!meta) return;
            const key = e.key.toLowerCase();

            // Save — fires regardless of focus, since users expect it.
            if (key === 's') {
                e.preventDefault();
                onSave();
                return;
            }

            // Undo / redo — skip when an editable element is focused.
            if (isEditableTarget(e.target)) return;

            if (key === 'z' && !e.shiftKey) {
                e.preventDefault();
                dispatch({ type: 'UNDO' });
                return;
            }
            if ((key === 'z' && e.shiftKey) || key === 'y') {
                e.preventDefault();
                dispatch({ type: 'REDO' });
                return;
            }
        };

        window.addEventListener('keydown', handler);
        return () => window.removeEventListener('keydown', handler);
    }, [dispatch, onSave, enabled]);
};
