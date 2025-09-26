import { isFormattedValidationMessage } from '../utils/parseValidationMessage';
import { showErrorNotification } from '@/common/notificationHandler';

/**
 * Enhanced error handling hook for scenario operations
 * Determines the best way to display different types of errors
 */
export const useEnhancedErrorHandling = () => {
    
    /**
     * Handles errors from scenario API calls with enhanced validation support
     * @param error The error from the API call
     * @param defaultMessage Default error message to show for generic errors
     * @returns An object indicating how the error should be handled
     */
    const handleScenarioError = (error: any, defaultMessage: string) => {
        const responseData = error.response?.data;
        
        // Check for enhanced validation error structure
        if (responseData?.data && 
            responseData.data.hasOwnProperty('valid') && 
            responseData.data.hasOwnProperty('errors')) {
            return {
                type: 'validation_structured' as const,
                validationResult: responseData.data,
                shouldShowInComponent: true
            };
        }
        
        // Check for formatted validation message
        if (responseData?.message && isFormattedValidationMessage(responseData.message)) {
            return {
                type: 'validation_formatted' as const,
                errorMessage: responseData.message,
                shouldShowInComponent: true
            };
        }
        
        // Generic error - just show as message
        showErrorNotification(error, defaultMessage);
        return {
            type: 'generic' as const,
            shouldShowInComponent: false
        };
    };

    /**
     * Simplified error handler that just shows appropriate message/UI
     * @param error The error from the API call
     * @param defaultMessage Default error message to show for generic errors
     */
    const showScenarioError = (error: any, defaultMessage: string) => {
        const responseData = error.response?.data;
        
        if (responseData?.message && isFormattedValidationMessage(responseData.message)) {
            // For formatted validation messages, show the formatted message
            showErrorNotification(responseData.message);
        } else {
            // Generic error handling
            showErrorNotification(error, defaultMessage);
        }
    };

    return {
        handleScenarioError,
        showScenarioError
    };
};