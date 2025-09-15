/**
 * Snippet System - Barrel Export File
 */

// Types
export * from './core/types';

// API
export * from './api/snippetApi';

// Core utilities
export * from './core/pathDiscovery';

// Hooks
export * from './hooks/useSnippets';
export * from './hooks/useSnippetActions';

// Components
export { SnippetDrawer } from './components/SnippetDrawer';

// Legacy components (deprecated - use SnippetDrawer instead)
export { SnippetMenu } from './components/SnippetMenu';
export { SnippetSaveModal } from './components/SnippetSaveModal';
export { SnippetApplyModal } from './components/SnippetApplyModal';