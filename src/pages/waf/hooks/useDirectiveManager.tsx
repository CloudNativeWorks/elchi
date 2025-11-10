/**
 * Directive Manager Hook
 * Manages directive CRUD operations with validation and formatting
 */

import { useState } from 'react';
import { App } from 'antd';
import { CheckOutlined } from '@ant-design/icons';

export interface UseDirectiveManagerProps {
    directiveSets: { [key: string]: string[] };
    onDirectiveSetsChange: (sets: { [key: string]: string[] }) => void;
}

export const useDirectiveManager = ({ directiveSets, onDirectiveSetsChange }: UseDirectiveManagerProps) => {
    const { message } = App.useApp();
    const [newDirective, setNewDirective] = useState<{ [key: string]: string }>({});
    const [editingDirective, setEditingDirective] = useState<{ setName: string; index: number } | null>(null);
    const [editValue, setEditValue] = useState('');
    const [formattingPreview, setFormattingPreview] = useState<{
        visible: boolean;
        setName: string;
        formatResult: any;
    } | null>(null);

    /**
     * Add directive to a set with validation and formatting
     */
    const addDirectiveToSet = (setName: string, directive: string, _skipValidation = false) => {
        const existing = directiveSets[setName] || [];

        if (existing.includes(directive.trim())) {
            message.warning('This directive is already added');
            return false;
        }

        onDirectiveSetsChange({
            ...directiveSets,
            [setName]: [...existing, directive.trim()]
        });

        message.success({
            content: 'Directive added successfully!',
            icon: <CheckOutlined style={{ color: '#52c41a' }} />
        });

        return true;
    };

    /**
     * Handle adding a new directive with validation
     */
    const handleAddDirective = (setName: string) => {
        let directive = newDirective[setName];
        if (!directive || !directive.trim()) return;

        // Skip validation and formatting - add directive as-is
        if (addDirectiveToSet(setName, directive.trim())) {
            setNewDirective({ ...newDirective, [setName]: '' });
        }
    };

    /**
     * Quick add directive (from common directives)
     */
    const handleQuickAddDirective = (setName: string, directive: string) => {
        addDirectiveToSet(setName, directive);
    };

    /**
     * Remove directive from set
     */
    const handleRemoveDirective = (setName: string, index: number) => {
        const newDirectives = [...directiveSets[setName]];
        newDirectives.splice(index, 1);
        onDirectiveSetsChange({
            ...directiveSets,
            [setName]: newDirectives
        });

        message.success({
            content: 'Directive removed successfully!',
            icon: <CheckOutlined style={{ color: '#52c41a' }} />
        });
    };

    /**
     * Move directive up in the list
     */
    const handleMoveDirectiveUp = (setName: string, index: number) => {
        if (index === 0) return;
        const newDirectives = [...directiveSets[setName]];
        [newDirectives[index - 1], newDirectives[index]] = [newDirectives[index], newDirectives[index - 1]];
        onDirectiveSetsChange({
            ...directiveSets,
            [setName]: newDirectives
        });
    };

    /**
     * Move directive down in the list
     */
    const handleMoveDirectiveDown = (setName: string, index: number) => {
        const directives = directiveSets[setName];
        if (index === directives.length - 1) return;
        const newDirectives = [...directives];
        [newDirectives[index], newDirectives[index + 1]] = [newDirectives[index + 1], newDirectives[index]];
        onDirectiveSetsChange({
            ...directiveSets,
            [setName]: newDirectives
        });
    };

    /**
     * Start editing a directive
     */
    const handleStartEditDirective = (setName: string, index: number, currentValue: string) => {
        setEditingDirective({ setName, index });
        setEditValue(currentValue);
    };

    /**
     * Save edited directive
     */
    const handleSaveEditDirective = () => {
        if (!editingDirective) return;

        const { setName, index } = editingDirective;
        const trimmedValue = editValue.trim();

        // Check if the new value already exists in the set (excluding the current item being edited)
        const existing = directiveSets[setName] || [];
        const isDuplicate = existing.some((directive, idx) =>
            idx !== index && directive.trim() === trimmedValue
        );

        if (isDuplicate) {
            message.warning('This directive already exists in the set');
            return;
        }

        const newDirectives = [...directiveSets[setName]];
        newDirectives[index] = trimmedValue;

        onDirectiveSetsChange({
            ...directiveSets,
            [setName]: newDirectives
        });

        setEditingDirective(null);
        setEditValue('');

        message.success({
            content: 'Directive updated successfully!',
            icon: <CheckOutlined style={{ color: '#52c41a' }} />
        });
    };

    /**
     * Cancel editing
     */
    const handleCancelEditDirective = () => {
        setEditingDirective(null);
        setEditValue('');
    };

    /**
     * Add CRS rule/file to directive set
     */
    const addCrsItemToSet = (setName: string, includeDirective: string) => {
        const existing = directiveSets[setName] || [];
        if (existing.includes(includeDirective)) {
            message.warning('This rule is already added to the directive set');
            return;
        }

        onDirectiveSetsChange({
            ...directiveSets,
            [setName]: [...existing, includeDirective]
        });

        const isFile = includeDirective.startsWith('Include @owasp_crs/');
        message.success({
            content: isFile ? 'File added successfully!' : 'Rule added successfully!',
            icon: <CheckOutlined style={{ color: '#52c41a' }} />
        });
    };

    /**
     * Confirm formatting preview and add directive (no-op - formatting disabled)
     */
    const handleConfirmFormatting = () => {
        // Formatting is disabled, this should not be called
        setFormattingPreview(null);
    };

    /**
     * Cancel formatting preview (no-op - formatting disabled)
     */
    const handleCancelFormatting = () => {
        setFormattingPreview(null);
    };

    return {
        // State
        newDirective,
        setNewDirective,
        editingDirective,
        editValue,
        setEditValue,
        formattingPreview,

        // Handlers
        handleAddDirective,
        handleQuickAddDirective,
        handleRemoveDirective,
        handleMoveDirectiveUp,
        handleMoveDirectiveDown,
        handleStartEditDirective,
        handleSaveEditDirective,
        handleCancelEditDirective,
        addCrsItemToSet,
        handleConfirmFormatting,
        handleCancelFormatting
    };
};
