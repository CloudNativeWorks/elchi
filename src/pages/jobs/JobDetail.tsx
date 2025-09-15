import React, { useState, useEffect, useCallback } from 'react';
import {
  Card, Typography, Row, Col, Tag, Progress, Table, Button,
  Space, Timeline, Alert, Tooltip, Modal
} from 'antd';
import {
  ArrowLeftOutlined, ReloadOutlined, RedoOutlined, DeleteOutlined,
  CheckCircleOutlined, CloseCircleOutlined, ClockCircleOutlined,
  PlayCircleOutlined, ExclamationCircleOutlined, InfoCircleOutlined,
  UserOutlined, FileTextOutlined
} from '@ant-design/icons';
import { useParams, useNavigate } from 'react-router-dom';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import duration from 'dayjs/plugin/duration';

import { useJobOperations } from '@/hooks/useJobOperations';
import type { BackgroundJob, JobStatus, PokeStatus } from '@/types/jobs';

dayjs.extend(relativeTime);
dayjs.extend(duration);

const { Text } = Typography;

const JobDetail: React.FC = () => {
  const { jobId } = useParams<{ jobId: string }>();
  const navigate = useNavigate();
  const {
    loading,
    getJob,
    cancelJob,
    retryJob,
    retryFailedSnapshots,
    forceRestartJob
  } = useJobOperations();

  const [job, setJob] = useState<BackgroundJob | null>(null);
  const [autoRefresh, setAutoRefresh] = useState(false);

  const loadJob = useCallback(async () => {
    if (!jobId) return;
    const jobData = await getJob(jobId);
    if (jobData) {
      setJob(jobData);
    }
  }, [jobId]);

  useEffect(() => {
    loadJob();
  }, [loadJob]);

  // Auto refresh for active jobs
  useEffect(() => {
    if (!job || !autoRefresh) return;

    const shouldAutoRefresh = ['PENDING', 'CLAIMED', 'RUNNING'].includes(job.status);
    if (!shouldAutoRefresh) {
      setAutoRefresh(false);
      return;
    }

    const interval = setInterval(loadJob, 3000); // Refresh every 3 seconds
    return () => clearInterval(interval);
  }, [job, autoRefresh, loadJob]);

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

  const getPokeStatusTag = (status: PokeStatus) => {
    const config = {
      PENDING: { color: 'processing', text: 'Pending' },
      SUCCESS: { color: 'success', text: 'Success' },
      FAILED: { color: 'error', text: 'Failed' }
    };

    const { color, text } = config[status] || config.PENDING;
    return <Tag className='auto-width-tag' color={color}>{text}</Tag>;
  };

  const formatDuration = (startTime?: string, endTime?: string) => {
    if (!startTime) return '-';

    const start = dayjs(startTime);
    const end = endTime ? dayjs(endTime) : dayjs();
    const diff = end.diff(start);

    if (diff < 1000) return '< 1s';
    return dayjs.duration(diff).humanize();
  };

  const handleAction = async (action: string) => {
    if (!job) return;

    switch (action) {
      case 'cancel':
        const cancelSuccess = await cancelJob(job._id);
        if (cancelSuccess) loadJob();
        break;
      case 'retry':
        await retryJob(job._id);
        navigate('/jobs');
        break;
      case 'retry-failed':
        await retryFailedSnapshots(job._id);
        navigate('/jobs');
        break;
      case 'force-restart':
        Modal.confirm({
          title: 'Force Restart Job',
          icon: <ExclamationCircleOutlined />,
          content: 'This will completely restart the job from the beginning. Continue?',
          onOk: async () => {
            await forceRestartJob(job._id);
            navigate('/jobs');
          },
        });
        break;
    }
  };

  const snapshotColumns = [
    {
      title: 'Listener Name',
      dataIndex: 'listener_name',
      key: 'listener_name',
      sorter: (a: any, b: any) => a.listener_name.localeCompare(b.listener_name),
      render: (name: string) => (
        <Text code style={{ fontSize: 12 }}>{name}</Text>
      ),
    },
    {
      title: 'Node ID',
      dataIndex: 'node_id',
      key: 'node_id',
      render: (nodeId: string) => (
        <Text style={{ fontSize: 11, color: '#666' }}>{nodeId}</Text>
      ),
    },
    {
      title: 'Status',
      dataIndex: 'poke_status',
      key: 'poke_status',
      filters: [
        { text: 'Success', value: 'SUCCESS' },
        { text: 'Failed', value: 'FAILED' },
        { text: 'Pending', value: 'PENDING' },
      ],
      onFilter: (value: any, record: any) => record.poke_status === value,
      render: (status: PokeStatus) => getPokeStatusTag(status),
    },
    {
      title: 'Sent At',
      dataIndex: 'poke_sent_at',
      key: 'poke_sent_at',
      sorter: (a: any, b: any) => dayjs(a.poke_sent_at).unix() - dayjs(b.poke_sent_at).unix(),
      render: (sentAt: string) => (
        <Tooltip title={dayjs(sentAt).format('YYYY-MM-DD HH:mm:ss')}>
          <Text style={{ fontSize: 12 }}>
            {dayjs(sentAt).format('HH:mm:ss')}
          </Text>
        </Tooltip>
      ),
    },
    {
      title: 'Error',
      dataIndex: 'error',
      key: 'error',
      render: (error?: string) => (
        error ? (
          <Tooltip title={error}>
            <Text type="danger" style={{ fontSize: 11 }}>
              {error.length > 30 ? `${error.substring(0, 30)}...` : error}
            </Text>
          </Tooltip>
        ) : '-'
      ),
    },
  ];

  if (!job) {
    return (
      <div style={{ padding: '24px', textAlign: 'center' }}>
        <Text>Job not found</Text>
      </div>
    );
  }

  const isActive = ['PENDING', 'CLAIMED', 'RUNNING'].includes(job.status);
  const canRetry = ['FAILED', 'COMPLETED'].includes(job.status);
  const canCancel = ['PENDING', 'CLAIMED'].includes(job.status);
  const hasFailedSnapshots = job.execution_details?.processed_snapshots?.some(s => s.poke_status === 'FAILED');

  return (
    <div style={{ padding: '0px', background: '#f5f7fa', minHeight: '100vh' }}>
      {/* Modern Header */}
      <div style={{ 
        background: 'white', 
        borderRadius: 16, 
        padding: '20px 24px', 
        marginBottom: 24,
        boxShadow: '0 2px 8px rgba(0,0,0,0.06)'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <Button 
              icon={<ArrowLeftOutlined />} 
              onClick={() => navigate('/jobs')}
              style={{ borderRadius: 8 }}
            >
              Back
            </Button>
            <div style={{ 
              width: 1, 
              height: 24, 
              background: '#e8e8e8' 
            }} />
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              {getStatusIcon(job.status)}
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <Text strong style={{ fontSize: 18 }}>Job {job.job_id}</Text>
                  <Tag className='auto-width-tag' color="blue" style={{ borderRadius: 6 }}>{job.type.replace(/_/g, ' ')}</Tag>
                </div>
                <Text type="secondary" style={{ fontSize: 12 }}>
                  Created {dayjs(job.created_at).fromNow()}
                </Text>
              </div>
            </div>
          </div>
          <Space>
            <Button
              icon={<ReloadOutlined />}
              onClick={loadJob}
              loading={loading}
              style={{ borderRadius: 8 }}
            >
              Refresh
            </Button>
            <Button
              type={autoRefresh ? 'primary' : 'default'}
              onClick={() => setAutoRefresh(!autoRefresh)}
              disabled={!isActive}
              style={{ borderRadius: 8 }}
            >
              Auto Refresh {autoRefresh && '•'}
            </Button>
            {canCancel && (
              <Button 
                danger 
                icon={<DeleteOutlined />}
                onClick={() => handleAction('cancel')}
                style={{ borderRadius: 8 }}
              >
                Cancel Job
              </Button>
            )}
          </Space>
        </div>
      </div>

      <Row gutter={24}>
        <Col span={16}>
          {/* Job Status Overview Card */}
          <Card
            style={{ 
              borderRadius: 16, 
              marginBottom: 24,
              border: 'none',
              boxShadow: '0 2px 8px rgba(0,0,0,0.06)'
            }}
          >
            <div style={{ marginBottom: 20 }}>
              <Text type="secondary" style={{ fontSize: 12, textTransform: 'uppercase', letterSpacing: 1 }}>
                JOB STATUS
              </Text>
            </div>
            {job.status === 'NO_WORK_NEEDED' ? (
              <div style={{ 
                textAlign: 'center', 
                padding: '40px 0',
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                borderRadius: 12,
                color: 'white'
              }}>
                <CheckCircleOutlined style={{ fontSize: 48, marginBottom: 16 }} />
                <div style={{ fontSize: 18, fontWeight: 600 }}>No Work Needed</div>
                <div style={{ fontSize: 14, opacity: 0.9, marginTop: 8 }}>
                  This job completed without requiring any updates
                </div>
              </div>
            ) : (
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
                  <div>
                    <Text type="secondary" style={{ fontSize: 12, marginBottom: 4 }}>Current Status</Text>
                    <Tag 
                      color={job.status === 'COMPLETED' ? 'success' : job.status === 'FAILED' ? 'error' : 'processing'}
                      style={{ borderRadius: 6, padding: '6px 16px', fontSize: 14 }}
                    >
                      {getStatusIcon(job.status)} {job.status.replace(/_/g, ' ')}
                    </Tag>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <Text type="secondary" style={{ fontSize: 12 }}>Completion</Text>
                    <div style={{ fontSize: 32, fontWeight: 600, color: job.progress.percentage === 100 ? '#52c41a' : '#1890ff' }}>
                      {job.progress.percentage}%
                    </div>
                  </div>
                </div>
                <Progress
                  percent={job.progress.percentage}
                  strokeColor={{
                    '0%': job.status === 'FAILED' ? '#ff4d4f' : '#108ee9',
                    '100%': job.status === 'FAILED' ? '#ff7875' : '#87d068',
                  }}
                  size="default"
                  status={job.status === 'FAILED' ? 'exception' : isActive ? 'active' : 'success'}
                  showInfo={false}
                  style={{ marginBottom: 24 }}
                />
                {/* Timing Information */}
                <Row gutter={16}>
                  <Col span={8}>
                    <div style={{ 
                      background: 'linear-gradient(135deg, #667eea15 0%, #764ba215 100%)',
                      borderRadius: 12, 
                      padding: 16,
                      textAlign: 'center',
                      border: '1px solid #f0f0f0'
                    }}>
                      <ClockCircleOutlined style={{ fontSize: 20, color: '#722ed1', marginBottom: 8 }} />
                      <div style={{ fontSize: 16, fontWeight: 600, color: '#722ed1' }}>
                        {job.started_at ? dayjs(job.started_at).format('HH:mm:ss') : '-'}
                      </div>
                      <Text type="secondary" style={{ fontSize: 11 }}>Started At</Text>
                    </div>
                  </Col>
                  <Col span={8}>
                    <div style={{ 
                      background: 'linear-gradient(135deg, #108ee915 0%, #87d06815 100%)',
                      borderRadius: 12, 
                      padding: 16,
                      textAlign: 'center',
                      border: '1px solid #f0f0f0'
                    }}>
                      <PlayCircleOutlined style={{ fontSize: 20, color: '#1890ff', marginBottom: 8 }} />
                      <div style={{ fontSize: 16, fontWeight: 600, color: '#1890ff' }}>
                        {formatDuration(job.started_at, job.completed_at)}
                      </div>
                      <Text type="secondary" style={{ fontSize: 11 }}>Duration</Text>
                    </div>
                  </Col>
                  <Col span={8}>
                    <div style={{ 
                      background: job.completed_at ? 
                        'linear-gradient(135deg, #52c41a15 0%, #95de6415 100%)' : 
                        'linear-gradient(135deg, #ffa94015 0%, #ffec3d15 100%)',
                      borderRadius: 12, 
                      padding: 16,
                      textAlign: 'center',
                      border: '1px solid #f0f0f0'
                    }}>
                      {job.completed_at ? (
                        <>
                          <CheckCircleOutlined style={{ fontSize: 20, color: '#52c41a', marginBottom: 8 }} />
                          <div style={{ fontSize: 16, fontWeight: 600, color: '#52c41a' }}>
                            {dayjs(job.completed_at).format('HH:mm:ss')}
                          </div>
                          <Text type="secondary" style={{ fontSize: 11 }}>Completed At</Text>
                        </>
                      ) : (
                        <>
                          <ClockCircleOutlined style={{ fontSize: 20, color: '#ffa940', marginBottom: 8 }} />
                          <div style={{ fontSize: 16, fontWeight: 600, color: '#ffa940' }}>
                            Running
                          </div>
                          <Text type="secondary" style={{ fontSize: 11 }}>In Progress</Text>
                        </>
                      )}
                    </div>
                  </Col>
                </Row>
              </div>
            )}
            {job.error && (
              <Alert
                message="Error Details"
                description={job.error}
                type="error"
                showIcon
                style={{ marginTop: 20, borderRadius: 8 }}
              />
            )}
          </Card>

          {/* Job Details Card */}
          <Card
            style={{ 
              borderRadius: 16, 
              marginBottom: 24,
              border: 'none',
              boxShadow: '0 2px 8px rgba(0,0,0,0.06)'
            }}
          >
            <div style={{ marginBottom: 20 }}>
              <Text type="secondary" style={{ fontSize: 12, textTransform: 'uppercase', letterSpacing: 1 }}>
                JOB DETAILS
              </Text>
            </div>
            <Row gutter={[24, 24]}>
              <Col span={12}>
                <div style={{ marginBottom: 16 }}>
                  <Text type="secondary" style={{ fontSize: 12 }}>Resource</Text>
                  <div style={{ marginTop: 4 }}>
                    <Text strong style={{ fontSize: 14 }}>{job.metadata.source_resource.name}</Text>
                    <div>
                      <Text style={{ fontSize: 12, color: '#8c8c8c' }}>
                        {job.metadata.source_resource.collection} • {job.metadata.source_resource.action}
                      </Text>
                    </div>
                  </div>
                </div>
              </Col>
              <Col span={12}>
                <div style={{ marginBottom: 16 }}>
                  <Text type="secondary" style={{ fontSize: 12 }}>Triggered By</Text>
                  <div style={{ marginTop: 4, display: 'flex', alignItems: 'center', gap: 8 }}>
                    <UserOutlined style={{ color: '#8c8c8c' }} />
                    <div>
                      <Text strong style={{ fontSize: 14 }}>
                        {job.metadata.trigger_user.display_name || job.metadata.trigger_user.username}
                      </Text>
                      <div>
                        <Text style={{ fontSize: 12, color: '#8c8c8c' }}>
                          {job.metadata.trigger_user.role}
                        </Text>
                      </div>
                    </div>
                  </div>
                </div>
              </Col>
              <Col span={12}>
                <div style={{ marginBottom: 16 }}>
                  <Text type="secondary" style={{ fontSize: 12 }}>Project</Text>
                  <div style={{ marginTop: 4 }}>
                    <Tag className='auto-width-tag' style={{ borderRadius: 6 }}>{job.project}</Tag>
                  </div>
                </div>
              </Col>
              <Col span={12}>
                <div style={{ marginBottom: 16 }}>
                  <Text type="secondary" style={{ fontSize: 12 }}>Duration</Text>
                  <div style={{ marginTop: 4 }}>
                    <Text strong style={{ fontSize: 14 }}>
                      {formatDuration(job.started_at, job.completed_at)}
                    </Text>
                  </div>
                </div>
              </Col>
            </Row>
          </Card>

          {/* Timeline */}
          <Card 
            style={{ 
              borderRadius: 16,
              border: 'none',
              boxShadow: '0 2px 8px rgba(0,0,0,0.06)'
            }}
          >
            <div style={{ marginBottom: 20 }}>
              <Text type="secondary" style={{ fontSize: 12, textTransform: 'uppercase', letterSpacing: 1 }}>
                TIMELINE
              </Text>
            </div>
            <Timeline
              items={[
                {
                  dot: <InfoCircleOutlined />,
                  color: 'blue',
                  children: (
                    <div>
                      <Text strong>Job Created</Text>
                      <br />
                      <Text type="secondary">{dayjs(job.created_at).format('YYYY-MM-DD HH:mm:ss')}</Text>
                      <Text type="secondary"> ({dayjs(job.created_at).fromNow()})</Text>
                    </div>
                  )
                },
                ...(job.started_at ? [{
                  dot: <PlayCircleOutlined />,
                  color: 'green',
                  children: (
                    <div>
                      <Text strong>Job Started</Text>
                      <br />
                      <Text type="secondary">{dayjs(job.started_at).format('YYYY-MM-DD HH:mm:ss')}</Text>
                      <Text type="secondary"> ({dayjs(job.started_at).fromNow()})</Text>
                    </div>
                  )
                }] : []),
                ...(job.completed_at ? [{
                  dot: job.status === 'COMPLETED' ? <CheckCircleOutlined /> :
                       job.status === 'NO_WORK_NEEDED' ? <CheckCircleOutlined /> :
                       <CloseCircleOutlined />,
                  color: job.status === 'COMPLETED' ? 'green' :
                         job.status === 'NO_WORK_NEEDED' ? 'gray' :
                         'red',
                  children: (
                    <div>
                      <Text strong>
                        {job.status === 'COMPLETED' ? 'Job Completed' :
                         job.status === 'NO_WORK_NEEDED' ? 'Job Completed - No Work Needed' :
                         'Job Failed'}
                      </Text>
                      <br />
                      <Text type="secondary">{dayjs(job.completed_at).format('YYYY-MM-DD HH:mm:ss')}</Text>
                      <Text type="secondary"> ({dayjs(job.completed_at).fromNow()})</Text>
                    </div>
                  )
                }] : [])
              ]}
            />
          </Card>
        </Col>

        <Col span={8}>
          {/* Quick Stats */}
          <Card 
            style={{ 
              borderRadius: 16,
              marginBottom: 24,
              border: 'none',
              boxShadow: '0 2px 8px rgba(0,0,0,0.06)'
            }}
          >
            <div style={{ marginBottom: 20 }}>
              <Text type="secondary" style={{ fontSize: 12, textTransform: 'uppercase', letterSpacing: 1 }}>
                QUICK STATS
              </Text>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center',
                padding: '12px 16px',
                background: '#fafafa',
                borderRadius: 12
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <FileTextOutlined style={{ color: '#1890ff' }} />
                  <Text style={{ fontSize: 13 }}>Total Listeners</Text>
                </div>
                <Text strong style={{ fontSize: 16 }}>{job.progress.total}</Text>
              </div>
              <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center',
                padding: '12px 16px',
                background: '#f6ffed',
                borderRadius: 12
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <CheckCircleOutlined style={{ color: '#52c41a' }} />
                  <Text style={{ fontSize: 13 }}>Completed</Text>
                </div>
                <Text strong style={{ fontSize: 16, color: '#52c41a' }}>{job.progress.completed}</Text>
              </div>
              <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center',
                padding: '12px 16px',
                background: '#fff2e8',
                borderRadius: 12
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <CloseCircleOutlined style={{ color: '#ff4d4f' }} />
                  <Text style={{ fontSize: 13 }}>Failed</Text>
                </div>
                <Text strong style={{ fontSize: 16, color: '#ff4d4f' }}>{job.progress.failed}</Text>
              </div>
              <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center',
                padding: '12px 16px',
                background: '#e6f7ff',
                borderRadius: 12
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <ClockCircleOutlined style={{ color: '#1890ff' }} />
                  <Text style={{ fontSize: 13 }}>Analysis Time</Text>
                </div>
                <Text strong style={{ fontSize: 16 }}>{job.metadata.analysis_duration_ms} ms</Text>
              </div>
            </div>
          </Card>

          {/* Actions */}
          {(canRetry || hasFailedSnapshots) && (
            <Card 
              style={{ 
                borderRadius: 16,
                marginBottom: 24,
                border: 'none',
                boxShadow: '0 2px 8px rgba(0,0,0,0.06)'
              }}
            >
              <div style={{ marginBottom: 20 }}>
                <Text type="secondary" style={{ fontSize: 12, textTransform: 'uppercase', letterSpacing: 1 }}>
                  ACTIONS
                </Text>
              </div>
              <Space direction="vertical" style={{ width: '100%' }}>
                {canRetry && (
                  <Button
                    block
                    size="large"
                    icon={<RedoOutlined />}
                    onClick={() => handleAction('retry')}
                    style={{ 
                      borderRadius: 8,
                      height: 44,
                      fontWeight: 500
                    }}
                  >
                    Retry All
                  </Button>
                )}
                {hasFailedSnapshots && (
                  <Button
                    block
                    size="large"
                    type="primary"
                    ghost
                    icon={<RedoOutlined />}
                    onClick={() => handleAction('retry-failed')}
                    style={{ 
                      borderRadius: 8,
                      height: 44,
                      fontWeight: 500
                    }}
                  >
                    Retry Failed Only
                  </Button>
                )}
                <Button
                  block
                  size="large"
                  danger
                  icon={<ExclamationCircleOutlined />}
                  onClick={() => handleAction('force-restart')}
                  style={{ 
                    borderRadius: 8,
                    height: 44,
                    fontWeight: 500
                  }}
                >
                  Force Restart
                </Button>
              </Space>
            </Card>
          )}

          {/* Worker Info */}
          {job.worker_info && (
            <Card 
              style={{ 
                borderRadius: 16,
                border: 'none',
                boxShadow: '0 2px 8px rgba(0,0,0,0.06)'
              }}
            >
              <div style={{ marginBottom: 20 }}>
                <Text type="secondary" style={{ fontSize: 12, textTransform: 'uppercase', letterSpacing: 1 }}>
                  WORKER INFO
                </Text>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                <div>
                  <Text type="secondary" style={{ fontSize: 12 }}>Worker ID</Text>
                  <div style={{ marginTop: 4 }}>
                    <Tag className='auto-width-tag' style={{ borderRadius: 6 }}>{job.worker_info.worker_id}</Tag>
                  </div>
                </div>
                <div>
                  <Text type="secondary" style={{ fontSize: 12 }}>Claimed At</Text>
                  <div style={{ marginTop: 4 }}>
                    <Text strong>{dayjs(job.worker_info.claimed_at).format('HH:mm:ss')}</Text>
                  </div>
                </div>
                <div>
                  <Text type="secondary" style={{ fontSize: 12 }}>Last Heartbeat</Text>
                  <div style={{ marginTop: 4 }}>
                    <Text strong>{dayjs(job.worker_info.heartbeat).fromNow()}</Text>
                  </div>
                </div>
              </div>
            </Card>
          )}
        </Col>
      </Row>

      {/* Snapshot Details */}
      {job.execution_details?.processed_snapshots?.length > 0 && (
        <Card
          style={{ 
            marginTop: 24,
            borderRadius: 16,
            border: 'none',
            boxShadow: '0 2px 8px rgba(0,0,0,0.06)'
          }}
        >
          <div style={{ marginBottom: 20, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Text type="secondary" style={{ fontSize: 12, textTransform: 'uppercase', letterSpacing: 1 }}>
              SNAPSHOT EXECUTIONS
            </Text>
            <Space>
              <Tag className='auto-width-tag' color="blue" style={{ borderRadius: 12 }}>{job.execution_details.processed_snapshots.length} listeners</Tag>
              {job.progress.failed > 0 && (
                <Tag className='auto-width-tag' color="red" style={{ borderRadius: 12 }}>{job.progress.failed} failed</Tag>
              )}
              {job.progress.completed > 0 && (
                <Tag className='auto-width-tag' color="green" style={{ borderRadius: 12 }}>{job.progress.completed} completed</Tag>
              )}
            </Space>
          </div>
          <Table
            columns={snapshotColumns}
            dataSource={job.execution_details.processed_snapshots}
            rowKey="node_id"
            size="small"
            pagination={{
              defaultPageSize: 50,
              pageSizeOptions: ['20', '50', '100', '200'],
              showSizeChanger: true,
              showQuickJumper: true,
              showTotal: (total, range) =>
                `${range[0]}-${range[1]} of ${total} snapshots`,
            }}
            scroll={{ y: 400 }}
            sticky={true}
          />
        </Card>
      )}
    </div>
  );
};

export default JobDetail;