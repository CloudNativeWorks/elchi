import { useNavigate } from 'react-router-dom';
import { DeleteMutationOptions } from '../../../common/types';

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
    showAutoSuccess?: boolean; // Otomatik success notification gösterilsin mi
    customSuccessMessage?: string; // Özel success mesajı
}

const useDeleteResource = (deleteMutate: any) => {
    const navigate = useNavigate();

    const deleteResource = async (options: DeleteResourceOptions) => {
        const defaultMO: DeleteMutationOptions = {
            path: `${options.path}/${options.name}?project=${options.project}&gtype=${options.gtype}&resource_id=${options.resource_id}&version=${options.version}`,
            showAutoSuccess: options.showAutoSuccess, // Pass through success notification options
            customSuccessMessage: options.customSuccessMessage || `Resource "${options.name}" deleted successfully!`
        };


        await deleteMutate.mutateAsync(defaultMO, {
            onSuccess: () => {
                options.setUpdateData(options.updateData + 1)
                navigate(options.redirectUri);
            }
        });

    };

    return deleteResource;
};

export default useDeleteResource;