import { showSuccessNotification, showErrorNotification } from '@/common/notificationHandler';

/**
 * Robust clipboard copy function with fallback support
 * Works in both dev (localhost/HTTPS) and prod environments
 */
export const copyToClipboard = async (
    text: string, 
    successMessage?: string, 
    errorMessage?: string
): Promise<boolean> => {
    try {
        // Try modern clipboard API first
        if (navigator.clipboard && navigator.clipboard.writeText) {
            // Check permission if available
            try {
                const permission = await navigator.permissions.query({ name: 'clipboard-write' as PermissionName });
                if (permission.state === 'denied') {
                    throw new Error('Clipboard write access denied');
                }
            } catch (permErr) {
                // Permission API might not be available, continue anyway
                console.warn('Permission API not available:', permErr);
            }
            
            await navigator.clipboard.writeText(text);
            if (successMessage) {
                showSuccessNotification(successMessage);
            }
            return true;
        }
        
        // Fallback for older browsers or non-HTTPS environments
        const textArea = document.createElement('textarea');
        textArea.value = text;
        textArea.style.position = 'fixed';
        textArea.style.left = '-999999px';
        textArea.style.top = '-999999px';
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        
        const successful = document.execCommand('copy');
        document.body.removeChild(textArea);
        
        if (successful) {
            if (successMessage) {
                showSuccessNotification(successMessage);
            }
            return true;
        } else {
            throw new Error('execCommand copy failed');
        }
    } catch (err) {
        console.error('Copy failed:', err);
        const finalErrorMessage = errorMessage || 'Failed to copy to clipboard. Please copy manually.';
        showErrorNotification(finalErrorMessage);
        return false;
    }
};

/**
 * Robust clipboard read function with permission check
 */
export const readFromClipboard = async (
    errorMessage?: string
): Promise<string | null> => {
    try {
        // Try modern clipboard API first
        if (navigator.clipboard && navigator.clipboard.readText) {
            // Check permission if available
            try {
                const permission = await navigator.permissions.query({ name: 'clipboard-read' as PermissionName });
                if (permission.state === 'denied') {
                    throw new Error('Clipboard read access denied');
                }
            } catch (permErr) {
                // Permission API might not be available, continue anyway
                console.warn('Permission API not available:', permErr);
            }
            
            return await navigator.clipboard.readText();
        } else {
            // No fallback for reading - modern browsers required
            throw new Error('Clipboard read not supported in this environment');
        }
    } catch (err) {
        console.error('Read from clipboard failed:', err);
        const finalErrorMessage = errorMessage || 'Failed to read from clipboard. Please paste manually.';
        showErrorNotification(finalErrorMessage);
        return null;
    }
};