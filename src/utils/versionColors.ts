/**
 * Global version color system - generates consistent colors for version strings across the entire application
 * Used in resources table, settings, and any other place where versions are displayed with colors
 */

// Predefined blue tone palette for version consistency
const COLOR_PALETTE = [
    '#1890ff', // Primary Blue
    '#0958d9', // Dark Blue
    '#40a9ff', // Light Blue
    '#1677ff', // Bright Blue
    '#096dd9', // Medium Blue
    '#69c0ff', // Sky Blue
    '#0050b3', // Deep Blue
    '#85a5ff', // Soft Blue
    '#13c2c2', // Cyan Blue
    '#36cfc9', // Light Cyan
    '#52c41a', // Blue Green
    '#1668dc', // Navy Blue
    '#2f54eb', // Electric Blue
    '#597ef7', // Periwinkle Blue
    '#adc6ff', // Pale Blue
    '#0c7e83', // Teal Blue
    '#40e0d0', // Turquoise
    '#4096ff', // Azure Blue
];

/**
 * Simple hash function to convert string to number
 * Same algorithm used across frontend and backend for consistency
 */
function simpleHash(str: string): number {
    let hash = 0;
    if (str.length === 0) return hash;
    
    for (let i = 0; i < str.length; i++) {
        const char = str.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash; // Convert to 32-bit integer
    }
    
    return Math.abs(hash);
}

/**
 * Get consistent color for a version string
 * @param version - Version string (e.g., "1.33.5", "1.34.2")
 * @returns Hex color string
 */
export function getVersionColor(version: string): string {
    if (!version || typeof version !== 'string') {
        return COLOR_PALETTE[0]; // Default to first color
    }
    
    const hash = simpleHash(version.trim());
    const colorIndex = hash % COLOR_PALETTE.length;
    return COLOR_PALETTE[colorIndex];
}

/**
 * Get version color with opacity for backgrounds
 * @param version - Version string
 * @param opacity - Opacity value (0-1)
 * @returns CSS color string with opacity
 */
export function getVersionColorWithOpacity(version: string, opacity: number = 0.1): string {
    const color = getVersionColor(version);
    
    // Convert hex to RGB and add opacity
    const r = parseInt(color.slice(1, 3), 16);
    const g = parseInt(color.slice(3, 5), 16);
    const b = parseInt(color.slice(5, 7), 16);
    
    return `rgba(${r}, ${g}, ${b}, ${opacity})`;
}

/**
 * Get all version colors for legend or documentation
 * @param versions - Array of version strings
 * @returns Map of version to color
 */
export function getVersionColorMap(versions: string[]): Map<string, string> {
    const colorMap = new Map<string, string>();
    
    versions.forEach(version => {
        colorMap.set(version, getVersionColor(version));
    });
    
    return colorMap;
}

/**
 * Predefined Ant Design compatible color object for version
 * @param version - Version string
 * @returns Ant Design color configuration
 */
export function getVersionAntdColor(version: string): string {
    const color = getVersionColor(version);
    
    // Map our blue-tone colors to Ant Design predefined colors when possible
    const antdColorMap: Record<string, string> = {
        '#1890ff': 'blue',
        '#0958d9': 'blue',
        '#40a9ff': 'blue',
        '#1677ff': 'blue',
        '#096dd9': 'blue', 
        '#69c0ff': 'blue',
        '#0050b3': 'blue',
        '#85a5ff': 'blue',
        '#13c2c2': 'cyan',
        '#36cfc9': 'cyan',
        '#52c41a': 'green', // Keep one green for variety
        '#1668dc': 'blue',
        '#2f54eb': 'blue',
        '#597ef7': 'blue',
        '#adc6ff': 'blue',
        '#0c7e83': 'cyan',
        '#40e0d0': 'cyan',
        '#4096ff': 'blue',
    };
    
    return antdColorMap[color] || 'blue'; // Default to blue if not found
}

export default {
    getVersionColor,
    getVersionColorWithOpacity,
    getVersionColorMap,
    getVersionAntdColor,
};