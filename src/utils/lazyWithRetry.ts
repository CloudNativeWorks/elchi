import { lazy, ComponentType } from 'react';

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
 */
export function lazyWithRetry<T extends ComponentType<any>>(
  importFn: () => Promise<{ default: T }>,
  { maxRetries = 2, timeout = 15000 } = {}
): React.LazyExoticComponent<T> {
  return lazy(async () => {
    const storageKey = 'chunk_reload_count';
    const reloadCount = parseInt(sessionStorage.getItem(storageKey) || '0', 10);

    const importWithTimeout = (): Promise<{ default: T }> => {
      return new Promise((resolve, reject) => {
        const timeoutId = setTimeout(() => {
          reject(new Error('Chunk loading timeout'));
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
        sessionStorage.removeItem(storageKey);
        return module;
      } catch (error) {
        lastError = error as Error;
        const isChunkError =
          lastError.message.includes('Loading chunk') ||
          lastError.message.includes('Failed to fetch dynamically imported module') ||
          lastError.message.includes('Chunk loading timeout');

        if (!isChunkError) throw error;

        if (attempt < maxRetries) {
          await new Promise(r => setTimeout(r, 1500));
        }
      }
    }

    // All retries failed - reload page (max 2 times)
    if (reloadCount < 2) {
      sessionStorage.setItem(storageKey, String(reloadCount + 1));
      window.location.reload();
      return new Promise(() => {});
    }

    sessionStorage.removeItem(storageKey);
    throw lastError;
  });
}

export default lazyWithRetry;
