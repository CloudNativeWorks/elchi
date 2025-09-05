import { useRef } from "react";


const useFormRegistry = () => {
    const forms = useRef<Map<string, () => Promise<boolean>>>(new Map());

    const registerForm = (key: string, validate: () => Promise<boolean>) => {
        forms.current.set(key, validate);
    };

    const unregisterForm = (key: string) => {
        forms.current.delete(key);
    };

    const validateAllForms = async (): Promise<boolean> => {
        const validations = Array.from(forms.current.values()).map((validate) => validate());
        const results = await Promise.all(validations);
        return results.every((result) => result);
    };

    return { registerForm, unregisterForm, validateAllForms };
};

export default useFormRegistry;