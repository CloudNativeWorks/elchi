import { useState, useCallback } from 'react';
import { api } from '@/common/api';
import { showErrorNotification, showSuccessNotification } from '@/common/notificationHandler';
import { useProjectVariable } from '@/hooks/useProjectVariable';
import type {
  BackgroundJob,
  JobListRequest,
  JobListResponse,
  RetryJobRequest,
  RetryJobResponse,
  StuckJobsResponse,
  JobStatsResponse
} from '@/types/jobs';

export const useJobOperations = () => {
  const [loading, setLoading] = useState(false);
  const { project } = useProjectVariable();

  // Get single job by ID
  const getJob = useCallback(async (jobId: string): Promise<BackgroundJob | null> => {
    setLoading(true);
    try {
      const response = await api.get(`/api/v3/jobs/${jobId}?project=${project}`);
      const job = response.data.data || response.data;
      return {
        ...job,
        _id: job.id || job._id, // Backend'de 'id' frontend'de '_id'
        status: job.status || 'PENDING'
      };
    } catch (error: any) {
      showErrorNotification(error, 'Failed to fetch job');
      return null;
    } finally {
      setLoading(false);
    }
  }, [project]);

  // List jobs with filtering and pagination
  const listJobs = useCallback(async (params?: JobListRequest): Promise<JobListResponse | null> => {
    setLoading(true);
    try {
      const queryParams = new URLSearchParams();

      if (params?.page && params?.limit) {
        const offset = (params.page - 1) * params.limit;
        queryParams.append('offset', offset.toString());
      }
      if (params?.limit) queryParams.append('limit', params.limit.toString());
      if (params?.status) queryParams.append('status', params.status);
      if (params?.project) queryParams.append('project', params.project);
      if (params?.created_by) queryParams.append('created_by', params.created_by);
      if (params?.sort_by) queryParams.append('sort_by', params.sort_by);
      if (params?.sort_order) queryParams.append('sort_order', params.sort_order);
      if (params?.resource_name) queryParams.append('resource_name', params.resource_name);
      if (params?.affected_listener) queryParams.append('affected_listener', params.affected_listener);
      if (params?.username) queryParams.append('username', params.username);
      if (params?.start_date) queryParams.append('start_date', params.start_date);
      if (params?.end_date) queryParams.append('end_date', params.end_date);

      queryParams.append('project', project);

      const response = await api.get(`/api/v3/jobs?${queryParams.toString()}`);
      const data = response.data.data || response.data;
      const jobs = data.jobs || [];

      return {
        jobs: jobs.map((job: any) => ({
          ...job,
          _id: job.id,
          status: job.status || 'PENDING'
        })),
        total: data.total_count || 0,
        page: data.current_page || 1,
        limit: data.limit || 20,
        total_pages: data.total_pages || 1
      };
    } catch (error: any) {
      console.error('Jobs fetch error:', error);
      showErrorNotification(error, 'Failed to fetch jobs');
      return {
        jobs: [],
        total: 0,
        page: 1,
        limit: 20,
        total_pages: 0
      };
    } finally {
      setLoading(false);
    }
  }, [project]);

  const cancelJob = async (jobId: string): Promise<boolean> => {
    setLoading(true);
    try {
      await api.delete(`/api/v3/jobs/${jobId}?project=${project}`);
      showSuccessNotification('Job cancelled successfully');
      return true;
    } catch (error: any) {
      showErrorNotification(error, 'Failed to cancel job');
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Retry entire job
  const retryJob = async (jobId: string, reason?: string): Promise<RetryJobResponse | null> => {
    setLoading(true);
    try {
      const payload: RetryJobRequest = {
        retry_type: 'full'
      };
      if (reason) payload.reason = reason;

      const response = await api.post(`/api/v3/jobs/${jobId}/retry?project=${project}`, payload);
      const newJobId = response.data.data.new_job.job_id;
      showSuccessNotification(`New job created: ${newJobId}`);
      return {
        message: response.data.message,
        job_id: newJobId,
        retry_count: response.data.data.retry_count || 0
      };
    } catch (error: any) {
      showErrorNotification(error, 'Failed to retry job');
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Retry only failed snapshots
  const retryFailedSnapshots = async (jobId: string): Promise<RetryJobResponse | null> => {
    setLoading(true);
    try {
      const payload: RetryJobRequest = {
        retry_type: 'failed_only',
        reason: 'Manual retry for failed snapshots'
      };

      const response = await api.post(`/api/v3/jobs/${jobId}/retry?project=${project}`, payload);
      const newJobId = response.data.data.new_job.job_id;
      showSuccessNotification(`Retry job created: ${newJobId}`);
      return {
        message: response.data.message,
        job_id: newJobId,
        retry_count: response.data.data.retry_count || 0
      };
    } catch (error: any) {
      showErrorNotification(error, 'Failed to retry failed snapshots');
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Force restart entire job (same as retry but with different reason)
  const forceRestartJob = async (jobId: string): Promise<RetryJobResponse | null> => {
    setLoading(true);
    try {
      const payload: RetryJobRequest = {
        retry_type: 'full',
        reason: 'Force restart - complete job reset'
      };

      const response = await api.post(`/api/v3/jobs/${jobId}/retry?project=${project}`, payload);
      const newJobId = response.data.data.new_job.job_id;
      showSuccessNotification(`Force restart initiated: ${newJobId}`);
      return {
        message: response.data.message,
        job_id: newJobId,
        retry_count: response.data.data.retry_count || 0
      };
    } catch (error: any) {
      showErrorNotification(error, 'Failed to force restart job');
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Get stuck/abandoned jobs
  const getStuckJobs = useCallback(async (): Promise<StuckJobsResponse | null> => {
    setLoading(true);
    try {
      const response = await api.get(`/api/v3/jobs/stuck?project=${project}`);
      return {
        stuck_jobs: response.data.data.stuck_jobs || [],
        count: response.data.data.count || 0
      };
    } catch (error: any) {
      console.error('Stuck jobs fetch error:', error);
      showErrorNotification(error, 'Failed to fetch stuck jobs');
      return {
        stuck_jobs: [],
        count: 0
      };
    } finally {
      setLoading(false);
    }
  }, [project]);

  // Clean up stuck jobs
  const cleanupStuckJobs = async (): Promise<boolean> => {
    setLoading(true);
    try {
      const response = await api.post('/api/v3/jobs/cleanup');
      showSuccessNotification(`Cleaned up ${response.data.cleaned_count} stuck jobs`);
      return true;
    } catch (error: any) {
      showErrorNotification(error, 'Failed to cleanup stuck jobs');
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Get job statistics
  const getJobStats = useCallback(async (filters?: JobListRequest): Promise<JobStatsResponse | null> => {
    setLoading(true);
    try {
      const queryParams = new URLSearchParams();
      queryParams.append('project', project);

      if (filters?.status) queryParams.append('status', filters.status);
      if (filters?.created_by) queryParams.append('created_by', filters.created_by);
      if (filters?.resource_name) queryParams.append('resource_name', filters.resource_name);
      if (filters?.affected_listener) queryParams.append('affected_listener', filters.affected_listener);
      if (filters?.username) queryParams.append('username', filters.username);
      if (filters?.start_date) queryParams.append('start_date', filters.start_date);
      if (filters?.end_date) queryParams.append('end_date', filters.end_date);

      const response = await api.get(`/api/v3/jobs/stats?${queryParams.toString()}`);

      // Return the full response structure as expected by the new JobStatsResponse type
      return response.data;
    } catch (error: any) {
      console.error('Stats fetch error:', error);
      showErrorNotification(error, 'Failed to fetch job statistics');
      return {
        data: {
          total_jobs: 0,
          jobs_by_status: {},
          jobs_by_resource: {},
          jobs_by_user: {},
          recent_jobs: null,
          queue_size: 0,
          active_workers: 0,
          processing_jobs: 0,
          last_updated: new Date().toISOString()
        },
        filters: {
          end_date: filters?.end_date || new Date().toISOString().split('T')[0],
          project: project,
          start_date: filters?.start_date || new Date().toISOString().split('T')[0]
        },
        message: "Error"
      };
    } finally {
      setLoading(false);
    }
  }, [project]);

  return {
    loading,
    getJob,
    listJobs,
    cancelJob,
    retryJob,
    retryFailedSnapshots,
    forceRestartJob,
    getStuckJobs,
    cleanupStuckJobs,
    getJobStats,
  };
};
