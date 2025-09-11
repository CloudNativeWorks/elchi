export const isValidComponentName = (name: string): boolean => {
    // Check if name contains only alphanumeric characters, dashes, and underscores
    return /^[a-zA-Z0-9\-_]+$/.test(name);
};

export const validateAllComponentNames = (
    components: any[], 
    componentNames: Record<string, string>
): { isValid: boolean; invalidNames: string[] } => {
    const invalidNames: string[] = [];
    
    for (const component of components) {
        const componentName = componentNames[component.name] || component.name;
        if (!isValidComponentName(componentName) || componentName.trim() === '') {
            invalidNames.push(componentName);
        }
    }
    
    return {
        isValid: invalidNames.length === 0,
        invalidNames
    };
};