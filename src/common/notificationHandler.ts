// Context-aware notification API
import React from 'react';

// Error notification cache to prevent duplicate notifications
const errorCache = new Set<string>();
const CACHE_DURATION = 5000; // 5 seconds

// Helper function to convert \n to JSX line breaks
const formatMessageWithLineBreaks = (message: string) => {
  const lines = message.split('\n');
  return lines.map((line, index) => 
    React.createElement(React.Fragment, { key: index }, [
      line,
      index < lines.length - 1 ? React.createElement('br', { key: `br-${index}` }) : null
    ])
  );
};

export interface ErrorResponse {
  message?: string;
  error?: string;
  data?: {
    message?: string;
    error?: string;
  };
  response?: {
    data?: {
      message?: string;
      error?: string;
    };
    status?: number;
  };
}

export const extractErrorMessage = (error: any): string => {
  if (!error) return 'An unknown error occurred';
  
  // String error
  if (typeof error === 'string') return error;
  
  // Check for validation errors with structured error list
  const responseData = error?.response?.data || error?.data;
  if (responseData?.data?.valid === false && responseData?.data?.errors) {
    const errors = responseData.data.errors;
    const mainMessage = responseData.message || 'Validation failed';
    
    if (errors.length > 0) {
      const errorList = errors.map((err: any, index: number) => 
        `${index + 1}. ${err.field || 'Unknown field'}: ${err.message || 'Unknown error'}`
      ).join('\n');
      
      return `${mainMessage}\n\nError Details:\n${errorList}`;
    }
  }
  
  // Check different possible error message locations
  const possibleMessages = [
    error?.response?.data?.message,
    error?.response?.data?.error,
    error?.response?.data?.detail,
    error?.response?.data?.error_description,
    error?.response?.data?.error_message,
    error?.response?.data?.envoy_version?.error_message,
    error?.response?.data?.errors?.[0]?.message,
    error?.response?.data?.errors?.[0]?.detail,
    error?.data?.message,
    error?.data?.error,
    error?.data?.detail,
    error?.data?.error_message,
    error?.data?.envoy_version?.error_message,
    error?.envoy_version?.error_message,
    error?.message,
    error?.error,
    error?.error_message,
    error?.statusText,
    error?.detail
  ];
  
  // Generic HTTP error messages to filter out
  const genericMessages = [
    'Request failed with status code',
    'Network Error',
    'timeout',
    'ECONNABORTED',
    'ENOTFOUND',
    'ECONNREFUSED',
    'Bad Request',
    'Internal Server Error',
    'Service Unavailable',
    'Gateway Timeout'
  ];
  
  // Collect all valid messages, filtering out generic HTTP errors
  const validMessages: string[] = [];
  for (const msg of possibleMessages) {
    if (msg && typeof msg === 'string' && !validMessages.includes(msg)) {
      // Check if this is a generic HTTP error message
      const isGeneric = genericMessages.some(generic => 
        msg.toLowerCase().includes(generic.toLowerCase())
      );
      
      // Only add if it's not a generic message, or if no specific messages exist yet
      if (!isGeneric) {
        validMessages.push(msg);
      }
    }
  }
  
  // Return combined messages if specific messages found
  if (validMessages.length > 0) {
    return validMessages.join('\n ');
  }
  
  // Check for network/connection errors first
  if (error?.code === 'ERR_NETWORK' || error?.message?.includes('Network Error')) {
    return 'Unable to connect to Elchi Controller. Please check your connection.';
  }
  
  if (error?.code === 'ECONNREFUSED' || error?.message?.includes('ECONNREFUSED')) {
    return 'Server is not responding. The service may be temporarily unavailable.';
  }
  
  if (error?.code === 'ENOTFOUND' || error?.message?.includes('ENOTFOUND')) {
    return 'Server not found. Please check the server address.';
  }
  
  if (error?.code === 'ERR_CONNECTION_TIMED_OUT' || error?.message?.includes('timeout')) {
    return 'Connection timed out. Please try again.';
  }

  // Fallback for status codes
  if (error?.response?.status) {
    switch (error.response.status) {
      case 400:
        return 'Bad request - please check your input';
      case 401:
        return 'Authentication required';
      case 403:
        return 'Access denied';
      case 404:
        return 'Resource not found';
      case 500:
        return 'Internal server error';
      case 502:
        return 'Bad gateway - server is temporarily unavailable';
      case 503:
        return 'Service unavailable - server is temporarily down';
      case 504:
        return 'Gateway timeout - server took too long to respond';
      default:
        return `Server error (${error.response.status})`;
    }
  }
  
  // Check if there's no response at all (server completely down)
  if (error?.request && !error?.response) {
    return 'Server is not responding. Please check if the service is running.';
  }
  
  return 'An unexpected error occurred';
};

let notificationApi: any = null;

export const setNotificationApi = (api: any) => {
  notificationApi = api;
};

export const showErrorNotification = (error: any, customMessage?: string, title?: string): void => {
  const errorMessage = customMessage || extractErrorMessage(error);
  const cacheKey = `${title || 'Error'}:${errorMessage}`;
  
  // Check if this exact error was already shown recently
  if (errorCache.has(cacheKey)) {
    return;
  }
  
  // Add to cache and set timer to remove it
  errorCache.add(cacheKey);
  setTimeout(() => {
    errorCache.delete(cacheKey);
  }, CACHE_DURATION);
  
  if (notificationApi) {
    notificationApi.error({
      message: title || 'Error',
      description: formatMessageWithLineBreaks(errorMessage),
      duration: 6,
      placement: 'topRight',
      showProgress: true,
      className: 'modern-error-notification'
    });
  }
};

export const showWarningNotification = (message: string, title?: string): void => {
  const cacheKey = `${title || 'Warning'}:${message}`;
  
  // Check if this exact warning was already shown recently
  if (errorCache.has(cacheKey)) {
    return;
  }
  
  // Add to cache and set timer to remove it
  errorCache.add(cacheKey);
  setTimeout(() => {
    errorCache.delete(cacheKey);
  }, CACHE_DURATION);
  
  if (notificationApi) {
    notificationApi.warning({
      message: title || 'Warning',
      description: formatMessageWithLineBreaks(message),
      duration: 6,
      placement: 'topRight',
      showProgress: true,
      className: 'modern-warning-notification'
    });
  }
};

export const showSuccessNotification = (message: string, title?: string): void => {
  const cacheKey = `${title || 'Success'}:${message}`;
  
  // Check if this exact success was already shown recently
  if (errorCache.has(cacheKey)) {
    return;
  }
  
  // Add to cache and set timer to remove it
  errorCache.add(cacheKey);
  setTimeout(() => {
    errorCache.delete(cacheKey);
  }, CACHE_DURATION);
  
  if (notificationApi) {
    notificationApi.success({
      message: title || 'Success',
      description: formatMessageWithLineBreaks(message),
      duration: 4,
      placement: 'topRight',
      showProgress: true,
      className: 'modern-success-notification'
    });
  }
};

// Extract success message from API response
export const extractSuccessMessage = (data: any): string => {
  if (!data) return 'Operation completed successfully';
  
  const responseData = Array.isArray(data) ? data[0] : data;
  
  // Check different possible success message locations
  const possibleMessages = [
    responseData?.message,
    responseData?.data?.message,
    responseData?.data?.data?.message,
    responseData?.success_message,
    responseData?.result?.message,
    responseData?.response?.message,
    responseData?.info?.message,
    responseData?.status?.message,
    responseData?.notification?.message,
    responseData?.content?.message,
    responseData?.body?.message,
    responseData?.payload?.message,
    responseData?.meta?.message,
    responseData?.details?.message
  ];
  
  for (const msg of possibleMessages) {
    if (msg && typeof msg === 'string') {
      return msg;
    }
  }
  
  return 'Operation completed successfully';
};

// Handle API responses with success: false (business logic errors)
export const handleApiResponse = (
  data: any, 
  successCallback?: (data: any) => void, 
  customErrorMessage?: string,
  options?: {
    showAutoSuccess?: boolean;
    customSuccessMessage?: string;
    successTitle?: string;
  }
): boolean => {
  if (data && typeof data === 'object') {
    // Handle array responses
    const responseData = Array.isArray(data) ? data[0] : data;
    
    if (responseData.success === false) {
      // Business logic error - show warning
      const errorMessage = customErrorMessage || 
        responseData.error || 
        responseData.envoy_version?.error_message || 
        responseData.message || 
        'Operation failed';
      
      showWarningNotification(errorMessage, 'Operation Failed');
      return false;
    }
    
    // Check for error field first (business logic errors)
    if (responseData.error) {
      // Business logic error - show warning
      const errorMessage = customErrorMessage || 
        responseData.error || 
        responseData.envoy_version?.error_message || 
        responseData.message || 
        'Operation failed';
      
      showWarningNotification(errorMessage, 'Operation Failed');
      return false;
    }

    // Check for various success indicators
    const isSuccess = responseData.success === true || 
                     responseData.success === undefined || 
                     responseData.status === 'success' ||
                     responseData.state === 'success' ||
                     responseData.result === 'success' ||
                     responseData.ok === true ||
                     (responseData.code >= 200 && responseData.code < 300) ||
                     (!responseData.success && !responseData.error && !responseData.fail);
    
    if (isSuccess) {
      // Success case - show automatic success notification by default (unless explicitly disabled)
      const shouldShowSuccess = options?.showAutoSuccess !== false; // Default true
      
      if (shouldShowSuccess) {
        const successMessage = options?.customSuccessMessage || extractSuccessMessage(data);
        showSuccessNotification(successMessage, options?.successTitle || 'Success');
      }
      
      // Check for safety mechanism notifications
      if (responseData.safely_applied) {
        showSuccessNotification(
          'Operation was performed with safety mechanisms enabled.', 
          'Operation Completed Safely'
        );
      }
      
      if (successCallback) {
        successCallback(data);
      }
      return true;
    }
  }
  
  // For unknown response formats, show success by default (unless explicitly disabled)
  const shouldShowSuccess = options?.showAutoSuccess !== false; // Default true
  
  if (shouldShowSuccess) {
    const successMessage = options?.customSuccessMessage || 'Operation completed successfully';
    showSuccessNotification(successMessage, options?.successTitle || 'Success');
  }
  
  // If success callback provided, call it for unknown response formats
  if (successCallback) {
    successCallback(data);
  }
  return true;
};

export const isAuthError = (error: any): boolean => {
  return error?.response?.status === 401 || error?.response?.status === 403;
};