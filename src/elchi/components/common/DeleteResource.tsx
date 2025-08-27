import { AxiosError } from 'axios';
import { useNavigate } from 'react-router-dom';
import { successMessage, errorMessage } from '../../../common/message'


interface DeleteMutationOptions {
    path: string;
}

interface DeleteResourceOptions {
    version: string;
    path: string;
    name: string;
    project: string;
    resource_id: string;
    gtype: string;
    redirectUri: string;
    updateData: number;
    setUpdateData: any;
}

const useDeleteResource = (messageApi: any, deleteMutate: any) => {
    const navigate = useNavigate();

    const deleteResource = async (options: DeleteResourceOptions) => {
        const defaultMO: DeleteMutationOptions = {
            path: `${options.path}/${options.name}?project=${options.project}&gtype=${options.gtype}&resource_id=${options.resource_id}&version=${options.version}`,
        };

        try {
            await deleteMutate.mutateAsync(defaultMO, {
                onSuccess: (data: any) => {
                    successMessage(messageApi, data.data.message);
                    options.setUpdateData(options.updateData + 1)
                    navigate(options.redirectUri);
                },
                onError: (error: any) => {
                    const errorMsg = error?.response?.data?.message || 'An error occurred while deleting resource';
                    errorMessage(messageApi, errorMsg);
                },
            });
        } catch (error) {
            if (error instanceof AxiosError) {
                errorMessage(messageApi, error?.response?.data?.message);
            }
        }
    };

    return deleteResource;
};

export default useDeleteResource;