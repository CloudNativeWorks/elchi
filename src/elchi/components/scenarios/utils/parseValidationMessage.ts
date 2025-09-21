import type { ValidateScenarioResponse } from '../hooks/useScenarioAPI';

/**
 * Parses a formatted validation error message from the backend into structured format
 * Example input: "Validation failed with 3 errors:\n  1. Component Cluster Configuration_1: Static endpoints..."
 */
export const parseFormattedValidationMessage = (message: string): ValidateScenarioResponse | null => {
    if (!message || !message.includes('Validation failed with')) {
        return null;
    }

    // Extract error count from the header
    const errorCountMatch = message.match(/Validation failed with (\d+) errors?:/);
    const errorCount = errorCountMatch ? parseInt(errorCountMatch[1]) : 0;

    // Split by lines and filter out the header line
    const lines = message.split('\n');
    const errorLines = lines.slice(1).filter(line => line.trim().match(/^\d+\./));

    const errors: string[] = [];
    const groupedErrors: Record<string, string[]> = {};

    errorLines.forEach(line => {
        // Remove the number prefix (e.g., "  1. " -> "")
        const cleanLine = line.replace(/^\s*\d+\.\s*/, '');
        errors.push(cleanLine);

        // Try to extract component name
        const componentMatch = cleanLine.match(/^Component ([^:]+):\s*(.+)$/);
        if (componentMatch) {
            const componentName = componentMatch[1].trim();
            const errorMessage = componentMatch[2].trim();
            
            if (!groupedErrors[componentName]) {
                groupedErrors[componentName] = [];
            }
            groupedErrors[componentName].push(errorMessage);
        } else {
            // General error (no component specified)
            if (!groupedErrors['General']) {
                groupedErrors['General'] = [];
            }
            groupedErrors['General'].push(cleanLine);
        }
    });

    return {
        valid: false,
        errors,
        error_count: errorCount,
        grouped_errors: Object.keys(groupedErrors).length > 0 ? groupedErrors : undefined
    };
};

/**
 * Checks if a message appears to be a formatted validation error
 */
export const isFormattedValidationMessage = (message: string): boolean => {
    return message && message.includes('Validation failed with') && message.includes('errors:');
};