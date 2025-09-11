import { AvailableField } from '../hooks/useScenarioAPI';

/**
 * Determines if an array field should be rendered as a tags input
 * vs a complex array component or JSON textarea
 */
export const isSimpleStringArray = (field: AvailableField | any): boolean => {
    // Must be array type
    if (field.type !== 'array') return false;
    
    // If connected field, it's handled separately
    if (field.connected) return false;
    
    // If has complex properties, it's a complex array
    if (field.array_schema?.properties) return false;
    
    // Check various indicators for simple string array:
    
    // 1. Explicitly defined as string item type
    if (field.array_schema?.item_type === 'string') return true;
    
    // 2. Has string array default value (like domains with ["*"])
    if (Array.isArray(field.default_value)) {
        return field.default_value.every((item: any) => typeof item === 'string');
    }
    
    // 3. No array schema defined - assume simple string array
    if (!field.array_schema) return true;
    
    // 4. Array schema exists but no properties and no item_type - assume string
    if (field.array_schema && !field.array_schema.properties && !field.array_schema.item_type) {
        return true;
    }
    
    return false;
};

/**
 * Gets the appropriate placeholder for an array field
 */
export const getArrayPlaceholder = (field: AvailableField | any): string => {
    if (isSimpleStringArray(field)) {
        // Suggest based on field name or use generic
        const fieldName = field.name?.toLowerCase() || '';
        
        if (fieldName.includes('domain')) {
            return 'Enter domains (e.g., example.com, *.example.com)';
        } else if (fieldName.includes('header')) {
            return 'Enter header names';
        } else if (fieldName.includes('host')) {
            return 'Enter hostnames';
        } else if (fieldName.includes('port')) {
            return 'Enter port numbers';
        } else {
            return `Enter ${field.label?.toLowerCase() || 'values'}`;
        }
    }
    
    return `${field.label || field.name} as JSON array`;
};

/**
 * Gets the default value for an array field
 */
export const getArrayDefaultValue = (field: AvailableField | any): any[] => {
    if (Array.isArray(field.default_value)) {
        return field.default_value;
    }
    
    return [];
};