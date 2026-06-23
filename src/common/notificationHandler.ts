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

// Insert spaces into a PascalCase proto field name for readability:
// "NumTimeoutsToTriggerPortMigration" -> "Num Timeouts To Trigger Port Migration"
const prettifyProtoField = (name: string): string =>
  name.replace(/([a-z0-9])([A-Z])/g, '$1 $2');

/**
 * Reformat a protoc-gen-validate (PGV) chained validation error into a compact,
 * field-focused message.
 *
 * Backend shape (pkg/resources/base.go -> gRPC ValidateResource):
 *   "Validation error: : invalid HttpConnectionManager.Http3ProtocolOptions:
 *    embedded message failed validation | caused by: invalid
 *    Http3ProtocolOptions.QuicProtocolOptions: embedded message failed
 *    validation | caused by: invalid
 *    QuicProtocolOptions.NumTimeoutsToTriggerPortMigration: value must be
 *    inside range [0, 5]"
 *
 * Multiple top-level violations are joined with "; ". For each violation we
 * walk the "caused by" chain, collect the field path and keep the final
 * (innermost) reason — the only part that carries the actual constraint.
 *
 * Returns null when the text isn't a PGV validation error (caller keeps the
 * original message).
 */
const formatProtoValidationError = (raw: string): string | null => {
  if (typeof raw !== 'string') return null;

  // Only touch genuine PGV validation errors, never other server messages:
  // either the backend's "Validation error:" wrapper (pkg/resources/base.go)
  // or an explicit PGV "... | caused by: ..." chain. Anything else (e.g. a
  // message that merely contains "invalid x.y:") is left untouched.
  const isPgvValidation =
    /^\s*validation error\s*:/i.test(raw) ||
    (/invalid\s+[\w.]+\.\w+:/.test(raw) && /\|\s*caused by:/i.test(raw));
  if (!isPgvValidation) return null;

  // Drop a leading "Validation error:" prefix and any stray leading colon.
  const body = raw
    .replace(/^\s*validation error\s*:?\s*/i, '')
    .replace(/^:\s*/, '')
    .trim();

  // Each independent violation begins with "invalid ...".
  const violations = body
    .split(/;\s+(?=invalid\s)/)
    .map(v => v.trim())
    .filter(Boolean);

  const parsed: { path: string; reason: string }[] = [];
  for (const violation of violations) {
    const segments = violation.split(/\s*\|\s*caused by:\s*/i);
    const fields: string[] = [];
    let reason = '';
    for (const seg of segments) {
      const m = seg.match(/^invalid\s+[\w.]+\.(\w+):\s*(.+)$/s);
      if (m) {
        fields.push(m[1]);
        reason = m[2].trim();
      } else if (seg.trim()) {
        reason = seg.trim();
      }
    }
    if (reason) {
      parsed.push({ path: fields.map(prettifyProtoField).join(' → '), reason });
    }
  }

  if (parsed.length === 0) return null;

  if (parsed.length === 1) {
    const { path, reason } = parsed[0];
    return path ? `${path}\n${reason}` : reason;
  }

  return parsed
    .map(({ path, reason }) => (path ? `• ${path}\n  ${reason}` : `• ${reason}`))
    .join('\n\n');
};

export const extractErrorMessage = (error: any): string => {
  if (!error) return 'An unknown error occurred';

  // String error
  if (typeof error === 'string') return error;

  // Check for Let's Encrypt rate limit errors with details and hint
  const responseData = error?.response?.data || error?.data;
  if (responseData?.details || responseData?.hint) {
    const mainError = responseData?.error || responseData?.message || 'An error occurred';
    const details = responseData?.details;
    const hint = responseData?.hint;

    // Build comprehensive error message
    let message = mainError;

    if (details) {
      // Extract key information from details
      const detailsStr = typeof details === 'string' ? details : JSON.stringify(details);

      // Check if it's a Let's Encrypt rate limit error
      if (detailsStr.includes('rate limit') || detailsStr.includes('rateLimited')) {
        message = '🚫 Let\'s Encrypt Rate Limit Exceeded\n\n';

        // Extract retry time if available (full UTC timestamp)
        const retryMatch = detailsStr.match(/retry after (\d{4}-\d{2}-\d{2}\s+\d{2}:\d{2}:\d{2}\s+UTC)/i) ||
          detailsStr.match(/wait until (\d{4}-\d{2}-\d{2}\s+\d{2}:\d{2}:\d{2}\s+UTC)/i) ||
          detailsStr.match(/retry after (\d{4}-\d{2}-\d{2}\s+\d{2}\s+UTC)/i) ||
          detailsStr.match(/wait until (\d{4}-\d{2}-\d{2}\s+\d{2}\s+UTC)/i);
        if (retryMatch) {
          message += `⏰ Please wait until: ${retryMatch[1].trim()}\n\n`;
        }

        // Extract domain if available
        const domainMatch = detailsStr.match(/for ["']([^"']+)["']/);
        if (domainMatch) {
          message += `🌐 Domain: ${domainMatch[1]}\n\n`;
        }

        // Add the error type
        if (detailsStr.includes('failed authorization')) {
          message += '❌ Too many failed verification attempts\n';
        } else if (detailsStr.includes('too many certificates')) {
          message += '❌ Too many certificates issued\n';
        }

        message += '\n💡 Suggestions:\n';
        message += '  • Use staging environment for testing\n';
        message += '  • Try a different subdomain\n';
        message += '  • Wait for the rate limit window to reset\n';

        if (hint) {
          message += `\n${hint}`;
        }
      } else {
        // Non-rate-limit error with details
        message += `\n\n📋 Details:\n${details}`;
        if (hint) {
          message += `\n\n💡 Hint: ${hint}`;
        }
      }
    } else if (hint) {
      message += `\n\n💡 Hint: ${hint}`;
    }

    return message;
  }

  // Check for validation errors with structured error list
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

  // Server-provided messages are the real error and must be trusted verbatim.
  // (They must NOT pass through the generic-noise filter below: a valid
  // message can legitimately contain a substring like "timeout" — e.g. the
  // field name `NumTimeoutsToTriggerPortMigration` — which would otherwise be
  // mistaken for the generic "timeout" noise and discarded.)
  const serverMessages = [
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
    error?.envoy_version?.error_message
  ];

  const validServerMessages: string[] = [];
  for (const msg of serverMessages) {
    if (msg && typeof msg === 'string' && msg.trim() && !validServerMessages.includes(msg)) {
      validServerMessages.push(msg);
    }
  }

  if (validServerMessages.length > 0) {
    return validServerMessages
      .map(msg => formatProtoValidationError(msg) ?? msg)
      .join('\n ');
  }

  // Client/transport-level fields (axios-generated). These DO get the generic
  // filter so we don't surface noise like "Request failed with status code 400".
  const fallbackMessages = [
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

  // Collect valid fallback messages, filtering out generic HTTP errors
  const validMessages: string[] = [];
  for (const msg of fallbackMessages) {
    if (msg && typeof msg === 'string' && !validMessages.includes(msg)) {
      // Check if this is a generic HTTP error message
      const isGeneric = genericMessages.some(generic =>
        msg.toLowerCase().includes(generic.toLowerCase())
      );

      // Only add if it's not a generic message
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
    // Use longer duration for rate limit errors (10 seconds)
    const isRateLimitError = errorMessage.includes('Rate Limit') || errorMessage.includes('rate limit');
    const duration = isRateLimitError ? 10 : 6;

    notificationApi.error({
      message: title || 'Error',
      description: formatMessageWithLineBreaks(errorMessage),
      duration,
      placement: 'bottomRight',
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
      placement: 'bottomRight',
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
      placement: 'bottomRight',
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