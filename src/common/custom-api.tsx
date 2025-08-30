import { useMutation } from "@tanstack/react-query";
import { CustomApiMutationOptions } from './types';
import { api } from "./api";
import { handleApiResponse } from './notificationHandler';

export const useCustomApiMutation = () => {
    // Mutation function definition
    const mutationFn = async (options: CustomApiMutationOptions) => {
        const { method, path, data, showAutoSuccess, customSuccessMessage, successTitle } = options;
        const response = await api[method](path, data);
        
        // Handle success notification
        handleApiResponse(response.data, undefined, undefined, {
            showAutoSuccess,
            customSuccessMessage,
            successTitle
        });
        
        return response.data;
    };

    // useMutation with single object syntax
    const mutation = useMutation({
        mutationFn, // This is the mutation function defined above
    });

    return mutation;
};