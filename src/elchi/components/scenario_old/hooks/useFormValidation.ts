import { useEffect } from "react";
import { FormInstance } from "antd";


interface UseFormValidationProps {
    form: FormInstance;
    formKey: string;
    registerForm: any;
    unregisterForm: any;
}

const useFormValidation = ({
    form,
    formKey,
    registerForm,
    unregisterForm,
}: UseFormValidationProps) => {
    useEffect(() => {
        const validate = async () => {
            try {
                await form.validateFields();
                return true;
            } catch {
                return false;
            }
        };

        registerForm(formKey, validate);

        return () => unregisterForm(formKey);
    }, [form, formKey, registerForm, unregisterForm]);
};

export default useFormValidation;