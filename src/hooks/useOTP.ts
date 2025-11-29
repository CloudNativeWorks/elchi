import { useCustomApiMutation } from '@/common/custom-api';

export interface OTPEnableResponse {
    qr_code: string;
    secret: string;
    backup_codes: string[];
    message: string;
}

export interface OTPRegenerateResponse {
    backup_codes: string[];
    message: string;
}

export const useOTP = () => {
    const mutate = useCustomApiMutation();

    const enableOTP = async (password: string): Promise<OTPEnableResponse> => {
        const response = await mutate.mutateAsync({
            method: 'post',
            path: 'api/v3/profile/otp/enable',
            data: { password },
            directApi: true
        });
        return response as OTPEnableResponse;
    };

    const verifyOTP = async (otp_code: string): Promise<void> => {
        await mutate.mutateAsync({
            method: 'post',
            path: 'api/v3/profile/otp/verify',
            data: { code: otp_code },
            directApi: true
        });
    };

    const disableOTP = async (
        password: string,
        otp_code?: string,
        backup_code?: string
    ): Promise<void> => {
        await mutate.mutateAsync({
            method: 'post',
            path: 'api/v3/profile/otp/disable',
            data: {
                password,
                otp_code,
                backup_code
            },
            directApi: true
        });
    };

    const regenerateBackupCodes = async (otp_code: string): Promise<OTPRegenerateResponse> => {
        const response = await mutate.mutateAsync({
            method: 'post',
            path: 'api/v3/profile/otp/regenerate-backup-codes',
            data: { otp_code },
            directApi: true
        });
        return response as OTPRegenerateResponse;
    };

    return {
        enableOTP,
        verifyOTP,
        disableOTP,
        regenerateBackupCodes,
        isLoading: mutate.isPending
    };
};
