import { useCallback } from 'react';
import { showErrorNotification, showWarningNotification, showSuccessNotification, extractErrorMessage, extractSuccessMessage, handleApiResponse } from '@/common/notificationHandler';

export const useErrorHandler = () => {
  const handleError = useCallback((error: any, customMessage?: string, title?: string) => {
    showErrorNotification(error, customMessage, title);
  }, []);

  const handleWarning = useCallback((message: string, title?: string) => {
    showWarningNotification(message, title);
  }, []);

  const handleSuccess = useCallback((message: string, title?: string) => {
    showSuccessNotification(message, title);
  }, []);

  const handleResponse = useCallback((
    data: any, 
    successCallback?: (data: any) => void, 
    customErrorMessage?: string,
    options?: {
      showAutoSuccess?: boolean; // Default: true (gösterilir)
      customSuccessMessage?: string;
      successTitle?: string;
    }
  ) => {
    return handleApiResponse(data, successCallback, customErrorMessage, options);
  }, []);

  const getErrorMessage = useCallback((error: any): string => {
    return extractErrorMessage(error);
  }, []);

  const getSuccessMessage = useCallback((data: any): string => {
    return extractSuccessMessage(data);
  }, []);

  return {
    handleError,
    handleWarning,
    handleSuccess,
    handleResponse,
    getErrorMessage,
    getSuccessMessage,
    showError: showErrorNotification,
    showWarning: showWarningNotification,
    showSuccess: showSuccessNotification
  };
};