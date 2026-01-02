/**
 * Utility functions for displaying user-friendly values
 */

/**
 * Format default values for display to users with truncation for long values
 */
export const formatDefaultValue = (value: any, maxLength: number = 100): string => {
    if (value === null || value === undefined) {
        return 'empty';
    }

    if (Array.isArray(value)) {
        if (value.length === 0) {
            return 'empty array';
        }
        const joined = value.join(', ');
        return joined.length > maxLength ? `${joined.substring(0, maxLength)}...` : joined;
    }

    if (typeof value === 'object') {
        return 'empty object';
    }

    if (typeof value === 'string' && value === '') {
        return 'empty';
    }

    const stringValue = String(value);
    return stringValue.length > maxLength ? `${stringValue.substring(0, maxLength)}...` : stringValue;
};

/**
 * Get user-friendly placeholder text for fields
 */
export const getFieldPlaceholder = (fieldLabel: string, defaultValue?: any, fieldType?: string): string => {
    // Don't show default values for complex types that users shouldn't manually edit
    const complexTypes = ['object', 'nested_choice', 'conditional'];

    // For arrays, only hide defaults if it's a complex object array (has no simple default)
    if (fieldType === 'array' && (
        !defaultValue ||
        (Array.isArray(defaultValue) && defaultValue.length === 0) ||
        (Array.isArray(defaultValue) && defaultValue.some(item => typeof item === 'object'))
    )) {
        return `Enter ${fieldLabel.toLowerCase()}`;
    }

    if (fieldType && complexTypes.includes(fieldType)) {
        return `Enter ${fieldLabel.toLowerCase()}`;
    }

    if (defaultValue !== null && defaultValue !== undefined && defaultValue !== '') {
        const displayValue = formatDefaultValue(defaultValue);
        return `Default: ${displayValue}`;
    }

    return `Enter ${fieldLabel.toLowerCase()}`;
};
