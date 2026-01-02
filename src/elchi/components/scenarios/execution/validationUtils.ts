export const isValidComponentName = (name: string): boolean => {
    // Check if name contains only alphanumeric characters, dashes, and underscores
    return /^[a-zA-Z0-9\-_]+$/.test(name);
};
