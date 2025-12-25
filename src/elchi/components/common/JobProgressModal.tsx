import React, { useState, useEffect, useCallback } from 'react';
import {
  Modal, Progress, Typography, Alert, Space, Button,
  Timeline, Descriptions, Tag, Spin, Result
} from 'antd';
import {
  CheckCircleOutlined, CloseCircleOutlined, ClockCircleOutlined,
  PlayCircleOutlined, InfoCircleOutlined, ReloadOutlined
} from '@ant-design/icons';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import duration from 'dayjs/plugin/duration';

import { useJobOperations } from '@/hooks/useJobOperations';
import type { BackgroundJob, JobStatus } from '@/types/jobs';

dayjs.extend(relativeTime);
dayjs.extend(duration);

const { Title, Text } = Typography;

interface JobProgressModalProps {
  visible: boolean;
  onClose: () => void;
  jobId?: string;
  title?: string;
  description?: string;
}

const JobProgressModal: React.FC<JobProgressModalProps> = ({
  visible,
  onClose,
  jobId,
  title = 'Job Progress',
  description = 'Monitoring background job execution...'
}) => {
  const { loading, getJob } = useJobOperations();
  const [job, setJob] = useState<BackgroundJob | null>(null);
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [refreshInterval, setRefreshInterval] = useState<NodeJS.Timeout | null>(null);

  const loadJob = useCallback(async () => {
    if (!jobId) return;
    const jobData = await getJob(jobId);
    if (jobData) {
      setJob(jobData);

      // Stop auto-refresh if job is completed
      if (['COMPLETED', 'FAILED', 'NO_WORK_NEEDED'].includes(jobData.status)) {
        setAutoRefresh(false);
      }
    }
  }, [jobId, getJob]);

  // Initial load
  useEffect(() => {
    if (visible && jobId) {
      loadJob();
    }
  }, [visible, jobId, loadJob]);

  // Auto-refresh logic
  useEffect(() => {
    if (!visible || !autoRefresh || !job) {
      if (refreshInterval) {
        clearInterval(refreshInterval);
        setRefreshInterval(null);
      }
      return;
    }

    const interval = setInterval(loadJob, 2000); // Refresh every 2 seconds
    setRefreshInterval(interval);

    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [visible, autoRefresh, job, loadJob]);

  // Clean up on unmount
  useEffect(() => {
    return () => {
      if (refreshInterval) {
        clearInterval(refreshInterval);
      }
    };
  }, [refreshInterval]);

  const getStatusIcon = (status: JobStatus) => {
    const icons = {
      PENDING: <ClockCircleOutlined style={{ color: '#1677ff' }} />,
      CLAIMED: <PlayCircleOutlined style={{ color: '#faad14' }} />,
      RUNNING: <PlayCircleOutlined style={{ color: '#52c41a' }} />,
      COMPLETED: <CheckCircleOutlined style={{ color: '#52c41a' }} />,
      FAILED: <CloseCircleOutlined style={{ color: '#ff4d4f' }} />,
      NO_WORK_NEEDED: <CheckCircleOutlined style={{ color: '#8c8c8c' }} />
    };
    return icons[status] || icons.PENDING;
  };

  const getStatusColor = (status: JobStatus) => {
    const colors = {
      PENDING: 'processing',
      CLAIMED: 'warning',
      RUNNING: 'processing',
      COMPLETED: 'success',
      FAILED: 'error',
      NO_WORK_NEEDED: 'default'
    };
    return colors[status] || 'processing';
  };

  const formatDuration = (startTime?: string, endTime?: string) => {
    if (!startTime) return '-';

    const start = dayjs(startTime);
    const end = endTime ? dayjs(endTime) : dayjs();
    const diff = end.diff(start);

    if (diff < 1000) return '< 1s';
    return dayjs.duration(diff).humanize();
  };

  const isJobActive = job && ['PENDING', 'CLAIMED', 'RUNNING'].includes(job.status);
  const isJobCompleted = job && ['COMPLETED', 'FAILED', 'NO_WORK_NEEDED'].includes(job.status);

  const renderJobContent = () => {
    if (!job) {
      return (
        <div style={{ textAlign: 'center', padding: '40px 0' }}>
          <Spin size="large" />
          <div style={{ marginTop: 16 }}>
            <Text>Loading job information...</Text>
          </div>
        </div>
      );
    }

    if (job.status === 'NO_WORK_NEEDED') {
      return (
        <Result
          icon={<CheckCircleOutlined style={{ color: '#52c41a' }} />}
          title="No Work Needed"
          subTitle="The resource configuration hasn't changed, so no updates are required."
        />
      );
    }

    return (
      <Space direction="vertical" style={{ width: '100%' }} size="large">
        {/* Job Status */}
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>
            {getStatusIcon(job.status)}
          </div>
          <Title level={4} style={{ margin: 0 }}>
            <Tag color={getStatusColor(job.status)} style={{ fontSize: 14 }}>
              {job.status.replace('_', ' ')}
            </Tag>
          </Title>
          <Text type="secondary">Job {job.job_id}</Text>
        </div>

        {/* Progress */}
        <div>
          <Progress
            percent={job.progress.percentage}
            status={job.status === 'FAILED' ? 'exception' : isJobActive ? 'active' : 'success'}
            strokeWidth={12}
            showInfo={true}
          />
          <div style={{ marginTop: 8, textAlign: 'center' }}>
            <Text>
              {job.progress.completed} of {job.progress.total} completed
              {job.progress.failed > 0 && `, ${job.progress.failed} failed`}
            </Text>
          </div>
        </div>

        {/* Job Details */}
        <Descriptions size="small" column={1}>
          <Descriptions.Item label="Resource">
            <div>
              <Text strong>{job.metadata.source_resource.name}</Text>
              <br />
              <Text type="secondary">
                {job.metadata.source_resource.collection} • {job.metadata.source_resource.action}
              </Text>
            </div>
          </Descriptions.Item>
          <Descriptions.Item label="Affected Listeners">
            <Text>{job.metadata.total_affected} listeners</Text>
          </Descriptions.Item>
          <Descriptions.Item label="Duration">
            <Text>{formatDuration(job.started_at, job.completed_at)}</Text>
          </Descriptions.Item>
          {job.metadata.analysis_duration_ms && (
            <Descriptions.Item label="Analysis Time">
              <Text>{job.metadata.analysis_duration_ms}ms</Text>
            </Descriptions.Item>
          )}
        </Descriptions>

        {/* Timeline */}
        <Timeline>
          <Timeline.Item
            dot={<InfoCircleOutlined />}
            color="blue"
          >
            <Text strong>Job Created</Text>
            <br />
            <Text type="secondary">{dayjs(job.created_at).format('HH:mm:ss')} ({dayjs(job.created_at).fromNow()})</Text>
          </Timeline.Item>

          {job.started_at && (
            <Timeline.Item
              dot={<PlayCircleOutlined />}
              color="green"
            >
              <Text strong>Job Started</Text>
              <br />
              <Text type="secondary">{dayjs(job.started_at).format('HH:mm:ss')} ({dayjs(job.started_at).fromNow()})</Text>
            </Timeline.Item>
          )}

          {job.completed_at && (
            <Timeline.Item
              dot={job.status === 'COMPLETED' ? <CheckCircleOutlined /> : <CloseCircleOutlined />}
              color={job.status === 'COMPLETED' ? 'green' : 'red'}
            >
              <Text strong>Job {job.status === 'COMPLETED' ? 'Completed' : 'Failed'}</Text>
              <br />
              <Text type="secondary">{dayjs(job.completed_at).format('HH:mm:ss')} ({dayjs(job.completed_at).fromNow()})</Text>
            </Timeline.Item>
          )}
        </Timeline>

        {/* Error Alert */}
        {job.error && (
          <Alert
            message="Job Error"
            description={job.error}
            type="error"
            showIcon
          />
        )}
      </Space>
    );
  };

  return (
    <Modal
      title={
        <Space>
          {job && getStatusIcon(job.status)}
          <span>{title}</span>
          {isJobActive && <Spin size="small" />}
        </Space>
      }
      open={visible}
      onCancel={onClose}
      footer={
        <Space>
          <Button
            icon={<ReloadOutlined />}
            onClick={loadJob}
            loading={loading}
            disabled={!job}
          >
            Refresh
          </Button>
          {isJobActive && (
            <Button
              type={autoRefresh ? 'primary' : 'default'}
              onClick={() => setAutoRefresh(!autoRefresh)}
            >
              {autoRefresh ? 'Stop Auto-Refresh' : 'Start Auto-Refresh'}
            </Button>
          )}
          <Button type={isJobCompleted ? 'primary' : 'default'} onClick={onClose}>
            {isJobCompleted ? 'Close' : 'Close & Continue in Background'}
          </Button>
        </Space>
      }
      width={600}
      centered
      maskClosable={false}
      destroyOnClose={true}
    >
      <div style={{ marginBottom: 16 }}>
        <Text type="secondary">{description}</Text>
      </div>
      {renderJobContent()}
    </Modal>
  );
};

export default JobProgressModal;