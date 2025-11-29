import { useCustomGetQuery } from '@/common/api';

export interface OTPStatus {
    otp_enabled: boolean;
    otp_verified: boolean;
    backup_codes_count: number;
    backup_codes_remain: boolean;
}

export const useOTPStatus = (enabled: boolean = true) => {
    const { data, isLoading, error, refetch } = useCustomGetQuery({
        queryKey: 'otp-status',
        enabled: enabled,
        path: 'api/v3/profile/otp/status',
        directApi: true
    });

    return {
        status: data as OTPStatus,
        isLoading,
        error,
        refetch
    };
};
