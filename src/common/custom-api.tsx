import { useMutation } from "@tanstack/react-query";
import { CustomApiMutationOptions } from './types';
import { api } from "./api";

export const useCustomApiMutation = () => {
    // Mutation function definition
    const mutationFn = async (options: CustomApiMutationOptions) => {
        const { method, path, data } = options;
        const response = await api[method](path, data);
        return response.data;
    };

    // useMutation with single object syntax
    const mutation = useMutation({
        mutationFn, // This is the mutation function defined above
    });

    return mutation;
};