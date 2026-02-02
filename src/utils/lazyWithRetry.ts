import { lazy, ComponentType } from 'react';

interface LazyOptions {
  maxRetries?: number;
  retryDelay?: number;
  timeout?: number;
}

/**
 * Wrapper for React.lazy that adds retry logic and timeout for chunk loading.
 *
 * Solves the "stale chunk" problem after deployments:
 * - User has page open, new deploy happens
 * - Old JS tries to load old chunk that no longer exists
 * - Request hangs forever (pending) or returns 404
 *
 * This wrapper:
 * 1. Adds timeout to prevent infinite pending
 * 2. Retries loading the chunk
 * 3. If all retries fail, reloads page to get fresh chunks
 * 4. Prevents infinite reload loops with sessionStorage flag
 */
export function lazyWithRetry<T extends ComponentType<any>>(
  importFn: () => Promise<{ default: T }>,
  options: LazyOptions = {}
): React.LazyExoticComponent<T> {
  const {
    maxRetries = 2,
    retryDelay = 1500,
    timeout = 15000  // 15 second timeout for chunk loading
  } = options;

  return lazy(async () => {
    const storageKey = 'chunk_reload_count';
    const reloadCount = parseInt(sessionStorage.getItem(storageKey) || '0', 10);

    // Helper to add timeout to import
    const importWithTimeout = (): Promise<{ default: T }> => {
      return new Promise((resolve, reject) => {
        const timeoutId = setTimeout(() => {
          reject(new Error(`Chunk loading timeout after ${timeout}ms`));
        }, timeout);

        importFn()
          .then((module) => {
            clearTimeout(timeoutId);
            resolve(module);
          })
          .catch((error) => {
            clearTimeout(timeoutId);
            reject(error);
          });
      });
    };

    let lastError: Error | null = null;

    for (let attempt = 0; attempt <= maxRetries; attempt++) {
      try {
        const module = await importWithTimeout();
        // Success - clear the reload counter
        sessionStorage.removeItem(storageKey);
        return module;
      } catch (error) {
        lastError = error as Error;

        const isChunkError =
          lastError.message.includes('Loading chunk') ||
          lastError.message.includes('Failed to fetch dynamically imported module') ||
          lastError.message.includes('Unable to preload CSS') ||
          lastError.message.includes('error loading dynamically imported module') ||
          lastError.message.includes('Chunk loading timeout');

        if (!isChunkError) {
          throw error;
        }

        console.warn(`[LazyRetry] Attempt ${attempt + 1}/${maxRetries + 1} failed:`, lastError.message);

        if (attempt < maxRetries) {
          await new Promise(resolve => setTimeout(resolve, retryDelay));
        }
      }
    }

    // All retries failed - try reload (max 2 reloads to prevent loop)
    if (reloadCount < 2) {
      console.warn('[LazyRetry] All attempts failed. Reloading page to get fresh chunks...');
      sessionStorage.setItem(storageKey, String(reloadCount + 1));
      window.location.reload();
      // Return never-resolving promise while reloading
      return new Promise(() => {});
    }

    // Already reloaded twice, show error
    sessionStorage.removeItem(storageKey);
    console.error('[LazyRetry] Chunk loading failed after retries and reloads. Please clear browser cache.');
    throw lastError;
  });
}

export default lazyWithRetry;
