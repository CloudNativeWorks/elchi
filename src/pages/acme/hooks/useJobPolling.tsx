import { useEffect, useRef, useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { letsencryptApi } from '../letsencryptApi';
import type { JobStatus } from '../types';

interface UseJobPollingOptions {
  jobId: string | null;
  enabled?: boolean;
  onComplete?: (job: JobStatus) => void;
  onFailed?: (job: JobStatus) => void;
  pollingInterval?: number; // milliseconds
}

/**
 * Hook for polling job status until completion or failure
 * Automatically stops polling when job reaches terminal state (COMPLETED/FAILED)
 */
export const useJobPolling = ({
  jobId,
  enabled = true,
  onComplete,
  onFailed,
  pollingInterval = 3000, // 3 seconds default
}: UseJobPollingOptions) => {
  const queryClient = useQueryClient();
  const [isPolling, setIsPolling] = useState(!!jobId && enabled);
  const completedRef = useRef(false);
  const onCompleteRef = useRef(onComplete);
  const onFailedRef = useRef(onFailed);

  // Update callback refs when callbacks change
  useEffect(() => {
    onCompleteRef.current = onComplete;
    onFailedRef.current = onFailed;
  }, [onComplete, onFailed]);

  const {
    data: jobStatus,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['job-status', jobId],
    queryFn: () => letsencryptApi.getJobStatus(jobId!),
    enabled: !!jobId && enabled && isPolling,
    refetchInterval: (query) => {
      const data = query.state.data;
      if (!data) return pollingInterval;

      // Stop polling if job reached terminal state
      if (data.status === 'COMPLETED' || data.status === 'FAILED') {
        return false;
      }

      return pollingInterval;
    },
    refetchOnWindowFocus: false,
  });

  // Handle job completion/failure
  useEffect(() => {
    if (!jobStatus || completedRef.current) return;

    if (jobStatus.status === 'COMPLETED') {
      completedRef.current = true;
      setIsPolling(false);

      // Don't invalidate queries here - causes infinite refetch loop
      // Parent component can manually refetch if needed

      // Call callback after state updates
      onCompleteRef.current?.(jobStatus);
    } else if (jobStatus.status === 'FAILED') {
      completedRef.current = true;
      setIsPolling(false);

      // Don't invalidate queries here - causes infinite refetch loop
      // Parent component can manually refetch if needed

      // Call callback after state updates
      onFailedRef.current?.(jobStatus);
    } else if (jobStatus.status === 'RUNNING') {
      setIsPolling(true);
    }
  }, [jobStatus?.status, jobStatus?.job_id, queryClient]);

  // Reset completed flag when jobId changes
  useEffect(() => {
    completedRef.current = false;
    setIsPolling(!!jobId && enabled);
  }, [jobId, enabled]);

  return {
    jobStatus,
    isPolling,
    isLoading,
    error,
    progress: jobStatus?.progress?.percentage || 0,
    isCompleted: jobStatus?.status === 'COMPLETED',
    isFailed: jobStatus?.status === 'FAILED',
  };
};
