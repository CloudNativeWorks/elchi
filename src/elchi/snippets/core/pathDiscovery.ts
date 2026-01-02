/**
 * Path Discovery Logic for Snippets - Dynamic version
 */

import { PathContext, SnippetMetadata } from './types';
import { GTypes, resourceMapping } from '@/common/statics/gtypes';

/**
 * Check if a field path represents an array
 * This is determined dynamically based on the actual Redux data
 */
export function checkIfArray(data: any): boolean {
  return Array.isArray(data);
}

/**
 * Find parent's $type by traversing up the key path
 * @param keyPath - The full key path like "filter_chains.0.filters.0.typed_config.route_config"
 * @returns Parent's $type if found, empty string otherwise
 */
function findParentGType(keyPath: string): string {
  try {
    // Access the global Redux store from window (if available)
    const globalStore = (window as any)?.store?.getState?.();
    if (!globalStore) return "";

    const pathParts = keyPath.split('.');
    let current = globalStore;

    // Traverse up the path to find a parent with $type
    for (let i = pathParts.length - 1; i >= 0; i--) {
      current = globalStore;

      // Navigate to the parent object
      for (const part of pathParts.slice(0, i)) {
        if (current && typeof current === 'object') {
          // Handle array indices
          if (/^\d+$/.test(part)) {
            current = current[parseInt(part)];
          } else {
            current = current[part];
          }
        } else {
          current = null;
          break;
        }
      }

      // Check if this parent has $type
      if (current && current.$type) {
        return current.$type;
      }
    }

    return "";
  } catch (error) {
    console.warn('Error finding parent gtype:', error);
    return "";
  }
}

/**
 * Detect GType from context or URL
 */
export function detectGType(context: PathContext): string {
  // If GType is explicitly provided, use it
  if (context.gtype) {
    return context.gtype;
  }

  // Try to map component type directly using resourceMapping
  if (context.componentType) {
    const gtype = resourceMapping[context.componentType];
    if (gtype) {
      return gtype;
    }
  }

  // Try to get from window location
  const path = window.location.pathname || window.location.hash;

  // Extract resource type from URL patterns like /resources/cluster or #/resources/listener
  const resourceMatch = path.match(/resources\/([^\/]+)/);
  if (resourceMatch) {
    const resource = resourceMatch[1];

    // Use resourceMapping first
    const gtype = resourceMapping[resource];
    if (gtype) {
      return gtype;
    }

    // Fallback to enum key matching
    const gtypeKey = Object.keys(GTypes).find(
      key => key.toLowerCase() === resource.toLowerCase()
    );

    if (gtypeKey) {
      return GTypes[gtypeKey as keyof typeof GTypes];
    }
  }

  // Try to find from current page context
  // Check if we're in a create/edit page
  const createMatch = path.match(/create\/([^\/]+)/);
  const editMatch = path.match(/edit\/([^\/]+)/);
  const match = createMatch || editMatch;

  if (match) {
    const resourceType = match[1];

    // Use resourceMapping first
    const gtype = resourceMapping[resourceType];
    if (gtype) {
      return gtype;
    }

    // Fallback to enum key matching
    const gtypeKey = Object.keys(GTypes).find(
      key => key.toLowerCase() === resourceType.toLowerCase()
    );

    if (gtypeKey) {
      return GTypes[gtypeKey as keyof typeof GTypes];
    }
  }

  // Default fallback - return empty string if no gtype can be determined
  return "";
}

/**
 * Discover path from CCard properties
 * CCard already has all the information we need
 */
export function discoverPath(context: {
  ctype: string;          // Component type from CCard
  keys?: string;          // keyPrefix from CCard
  title?: string;         // Card title
  reduxStore?: any;       // Current redux data
  gtype?: string;         // Explicitly provided GType
}): SnippetMetadata {
  // Use the keys (keyPrefix) if provided - this is the most accurate
  const field_path = context.keys || context.ctype;

  // Check if the actual data is an array
  const is_array = checkIfArray(context.reduxStore);

  // Try to get GType from reduxStore.$type first, then fall back to detection
  let gtype = context.gtype;
  if (!gtype && context.reduxStore?.$type) {
    gtype = context.reduxStore.$type;
  }

  // If still no gtype and we have a key path, try to find parent's $type
  if (!gtype && context.keys && context.keys.includes('.')) {
    gtype = findParentGType(context.keys);
  }

  if (!gtype) {
    gtype = detectGType({
      componentType: context.ctype,
      keyPrefix: context.keys,
      gtype: context.gtype
    });
  }

  return {
    field_path,
    is_array,
    gtype
  };
}

/**
 * Generate a unique hash for snippet data (for duplicate detection)
 */
export function generateDataHash(data: any): string {
  const str = JSON.stringify(data, Object.keys(data || {}).sort());
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  return `hash_${Math.abs(hash).toString(16)}`;
}