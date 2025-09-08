import { useCustomGetQuery } from '@/common/api';
import Cookies from 'js-cookie';


interface UseErrorSummaryProps {
    project: string;
    enabled?: boolean;
}

export const useErrorSummary = ({ project, enabled = true }: UseErrorSummaryProps) => {
    const hasToken = !!Cookies.get('bb_token');
    
    return useCustomGetQuery({
        queryKey: `error_summary_${project}`,
        enabled: enabled && !!project && hasToken,
        path: `api/v3/custom/error_summary?project=${project}`,
        directApi: true
    });
};