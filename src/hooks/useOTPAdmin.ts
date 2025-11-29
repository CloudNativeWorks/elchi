import { useCustomApiMutation } from '@/common/custom-api';
import { useCustomGetQuery } from '@/common/api';

export interface OTPConfig {
    project: string;
    otp_enforced: boolean;
}

export const useOTPConfig = (project: string, enabled: boolean = true) => {
    const { data, isLoading, error, refetch } = useCustomGetQuery({
        queryKey: `otp-config-${project}`,
        enabled: enabled && !!project,
        path: `api/v3/setting/otp-config?project=${project}`,
        directApi: true
    });

    return {
        config: data as OTPConfig,
        isLoading,
        error,
        refetch
    };
};

export const useOTPAdmin = (project: string) => {
    const mutate = useCustomApiMutation();

    const updateOTPConfig = async (otp_enforced: boolean): Promise<void> => {
        await mutate.mutateAsync({
            method: 'put',
            path: `api/v3/setting/otp-config?project=${project}`,
            data: { otp_enforced },
            directApi: true
        });
    };

    const resetUserOTP = async (user_id: string): Promise<void> => {
        await mutate.mutateAsync({
            method: 'post',
            path: `api/v3/setting/otp/reset-user/${user_id}`,
            data: {},
            directApi: true
        });
    };

    return {
        updateOTPConfig,
        resetUserOTP,
        isLoading: mutate.isPending
    };
};
