/**
 * Utility functions for displaying user-friendly values
 */

/**
 * Format default values for display to users
 */
export const formatDefaultValue = (value: any): string => {
    if (value === null || value === undefined) {
        return 'empty';
    }
    
    if (Array.isArray(value)) {
        if (value.length === 0) {
            return 'empty array';
        }
        return value.join(', ');
    }
    
    if (typeof value === 'object') {
        return 'empty object';
    }
    
    if (typeof value === 'string' && value === '') {
        return 'empty';
    }
    
    return String(value);
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

/**
 * Check if a value is considered empty
 */
export const isEmpty = (value: any): boolean => {
    if (value === null || value === undefined) {
        return true;
    }
    
    if (typeof value === 'string' && value.trim() === '') {
        return true;
    }
    
    if (Array.isArray(value) && value.length === 0) {
        return true;
    }
    
    if (typeof value === 'object' && Object.keys(value).length === 0) {
        return true;
    }
    
    return false;
};