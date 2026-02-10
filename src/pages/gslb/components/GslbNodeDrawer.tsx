/**
 * GSLB Node Operations Drawer
 * Health check, DNS records query, and notify operations for a single node
 */

import React, { useState, useCallback } from 'react';
import {
  Drawer,
  Tabs,
  Descriptions,
  Badge,
  Alert,
  Table,
  Tag,
  Input,
  Select,
  Button,
  Space,
  Spin,
  Typography,
  Result,
  Divider,
  message,
} from 'antd';
import {
  HeartOutlined,
  DatabaseOutlined,
  SendOutlined,
  ReloadOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  GlobalOutlined,
} from '@ant-design/icons';
import { useQuery, useMutation } from '@tanstack/react-query';
import { useProjectVariable } from '@/hooks/useProjectVariable';
import { gslbApi } from '../gslbApi';
import type { NodeRecord, NotifyAllResponse } from '../types';

const { Text } = Typography;
const { TextArea } = Input;

interface GslbNodeDrawerProps {
  open: boolean;
  onClose: () => void;
  nodeId: string;
  nodeIp: string;
}

// ── Health Tab ──

const HealthTab: React.FC<{ nodeId: string }> = ({ nodeId }) => {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['gslb-node-health', nodeId],
    queryFn: () => gslbApi.getNodeHealth(nodeId),
    enabled: !!nodeId,
    retry: false,
  });

  if (isLoading) {
    return <div style={{ textAlign: 'center', padding: 40 }}><Spin /></div>;
  }

  if (error) {
    const errMsg = (error as Error).message ||
      ((error as { response?: { data?: { error?: string } } }).response?.data?.error) ||
      'Failed to reach node';
    return (
      <div>
        <Alert
          type="error"
          showIcon
          message="Node Unreachable"
          description={errMsg}
          style={{ marginBottom: 16 }}
        />
        <Button icon={<ReloadOutlined />} onClick={() => refetch()}>Retry</Button>
      </div>
    );
  }

  if (!data) return null;

  const statusColor = data.status === 'healthy' ? 'green' : 'red';
  const syncStatusColor = data.last_sync_status === 'success' ? 'green' : 'red';

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 12 }}>
        <Button size="small" icon={<ReloadOutlined />} onClick={() => refetch()}>
          Refresh
        </Button>
      </div>
      <Descriptions bordered size="small" column={1}>
        <Descriptions.Item label="Status">
          <Badge color={statusColor} text={data.status} />
        </Descriptions.Item>
        <Descriptions.Item label="Zone">{data.zone}</Descriptions.Item>
        <Descriptions.Item label="Records Count">{data.records_count}</Descriptions.Item>
        <Descriptions.Item label="Version Hash">
          <Text code>{data.version_hash}</Text>
        </Descriptions.Item>
        <Descriptions.Item label="Last Sync">
          {data.last_sync ? new Date(data.last_sync).toLocaleString() : '-'}
        </Descriptions.Item>
        <Descriptions.Item label="Sync Status">
          <Badge color={syncStatusColor} text={data.last_sync_status} />
        </Descriptions.Item>
      </Descriptions>
    </div>
  );
};

// ── Records Tab ──

const RecordsTab: React.FC<{ nodeId: string }> = ({ nodeId }) => {
  const { project } = useProjectVariable();
  const [nameFilter, setNameFilter] = useState('');
  const [typeFilter, setTypeFilter] = useState<string | undefined>(undefined);

  const { data, isLoading, refetch } = useQuery({
    queryKey: ['gslb-node-records', nodeId, project, nameFilter, typeFilter],
    queryFn: () => gslbApi.getNodeRecords(nodeId, {
      project: project || undefined,
      name: nameFilter || undefined,
      type: typeFilter || undefined,
    }),
    enabled: !!nodeId,
    retry: false,
  });

  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      ellipsis: true,
      sorter: (a: NodeRecord, b: NodeRecord) => a.name.localeCompare(b.name),
      defaultSortOrder: 'ascend' as const,
    },
    {
      title: 'Type',
      dataIndex: 'type',
      key: 'type',
      width: 80,
      render: (type: string) => <Tag>{type}</Tag>,
    },
    {
      title: 'TTL',
      dataIndex: 'ttl',
      key: 'ttl',
      width: 80,
      sorter: (a: NodeRecord, b: NodeRecord) => a.ttl - b.ttl,
      render: (ttl: number) => `${ttl}s`,
    },
    {
      title: 'IPs',
      dataIndex: 'ips',
      key: 'ips',
      sorter: (a: NodeRecord, b: NodeRecord) => (a.ips || []).length - (b.ips || []).length,
      render: (ips: string[] | null) => (
        <Space size={[4, 4]} wrap>
          {(ips || []).map((ip) => (
            <Tag key={ip} color="blue">{ip}</Tag>
          ))}
        </Space>
      ),
    },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: 'calc(100vh - 170px)' }}>
      <Space style={{ marginBottom: 12, width: '100%', flexShrink: 0 }} wrap>
        <Input
          placeholder="Filter by name"
          size="small"
          value={nameFilter}
          onChange={(e) => setNameFilter(e.target.value)}
          allowClear
          style={{ width: 200 }}
          onPressEnter={() => refetch()}
        />
        <Select
          placeholder="Type"
          size="small"
          value={typeFilter}
          onChange={setTypeFilter}
          allowClear
          style={{ width: 100 }}
          options={[
            { value: 'A', label: 'A' },
            { value: 'AAAA', label: 'AAAA' },
            { value: 'CNAME', label: 'CNAME' },
            { value: 'SRV', label: 'SRV' },
            { value: 'MX', label: 'MX' },
            { value: 'TXT', label: 'TXT' },
          ]}
        />
        <Button size="small" icon={<ReloadOutlined />} onClick={() => refetch()}>
          Refresh
        </Button>
      </Space>

      {data && (
        <div style={{
          display: 'flex',
          gap: 16,
          marginBottom: 12,
          padding: '8px 12px',
          background: 'var(--bg-surface)',
          borderRadius: 6,
          border: '1px solid var(--border-default)',
          fontSize: 12,
          alignItems: 'center',
          flexWrap: 'wrap',
          flexShrink: 0,
        }}>
          <span><Text type="secondary">Zone:</Text> <Text strong>{data.zone}</Text></span>
          <span><Text type="secondary">Version:</Text> <Text code style={{ fontSize: 11 }}>{data.version_hash.slice(0, 12)}...</Text></span>
          <span><Text type="secondary">Count:</Text> <Text strong>{data.count}</Text></span>
        </div>
      )}

      <div style={{ flex: 1, overflow: 'hidden' }}>
        <Table<NodeRecord>
          dataSource={data?.records || []}
          columns={columns}
          rowKey="name"
          size="small"
          loading={isLoading}
          pagination={{ defaultPageSize: 20, size: 'small', showSizeChanger: true, pageSizeOptions: ['20', '50', '100', '200', '500', '1000'] }}
          scroll={{ x: 500, y: 'calc(100vh - 340px)' }}
        />
      </div>
    </div>
  );
};

// ── Notify Tab ──

const NotifyTab: React.FC<{ nodeId: string; nodeIp: string }> = ({ nodeId, nodeIp }) => {
  const { project } = useProjectVariable();
  const [records, setRecords] = useState('');
  const [deletes, setDeletes] = useState('');
  const [notifyAllResult, setNotifyAllResult] = useState<NotifyAllResponse | null>(null);

  const parseFqdns = (text: string): string[] =>
    text.split(/[\n,\s]+/).map((l) => l.trim()).filter(Boolean);

  const hasInput = parseFqdns(records).length > 0 || parseFqdns(deletes).length > 0;

  const notifyNodeMutation = useMutation({
    mutationFn: () => gslbApi.notifyNode(nodeId, project || '', {
      records: parseFqdns(records).length > 0 ? parseFqdns(records) : undefined,
      deletes: parseFqdns(deletes).length > 0 ? parseFqdns(deletes) : undefined,
    }),
  });

  const notifyAllMutation = useMutation({
    mutationFn: () => gslbApi.notifyAllNodes(project || '', {
      records: parseFqdns(records).length > 0 ? parseFqdns(records) : undefined,
      deletes: parseFqdns(deletes).length > 0 ? parseFqdns(deletes) : undefined,
    }),
    onSuccess: (data) => setNotifyAllResult(data),
  });

  const handleNotifyNode = useCallback(() => {
    if (!hasInput) {
      message.warning('Enter at least one record or delete FQDN');
      return;
    }
    setNotifyAllResult(null);
    notifyNodeMutation.mutate();
  }, [hasInput, notifyNodeMutation]);

  const handleNotifyAll = useCallback(() => {
    if (!hasInput) {
      message.warning('Enter at least one record or delete FQDN');
      return;
    }
    notifyAllMutation.mutate();
  }, [hasInput, notifyAllMutation]);

  return (
    <div>
      <div style={{ marginBottom: 16 }}>
        <Text strong style={{ display: 'block', marginBottom: 4 }}>Records (FQDNs to update)</Text>
        <TextArea
          rows={4}
          placeholder="app.gslb.elchi&#10;api.gslb.elchi"
          value={records}
          onChange={(e) => setRecords(e.target.value)}
        />
      </div>

      <div style={{ marginBottom: 16 }}>
        <Text strong style={{ display: 'block', marginBottom: 4 }}>Deletes (FQDNs to remove)</Text>
        <TextArea
          rows={3}
          placeholder="old.gslb.elchi"
          value={deletes}
          onChange={(e) => setDeletes(e.target.value)}
        />
      </div>

      <Space>
        <Button
          type="primary"
          icon={<SendOutlined />}
          loading={notifyNodeMutation.isPending}
          onClick={handleNotifyNode}
          disabled={!hasInput}
        >
          Notify {nodeIp}
        </Button>
        <Button
          icon={<GlobalOutlined />}
          loading={notifyAllMutation.isPending}
          onClick={handleNotifyAll}
          disabled={!hasInput}
        >
          Notify All Nodes
        </Button>
      </Space>

      {notifyNodeMutation.isSuccess && notifyNodeMutation.data && (
        <Result
          status="success"
          title="Node Notified"
          subTitle={`Updated: ${notifyNodeMutation.data.updated}, Deleted: ${notifyNodeMutation.data.deleted}`}
          style={{ padding: '16px 0' }}
        />
      )}

      {notifyAllResult && (
        <>
          <Divider />
          <Descriptions size="small" bordered column={3} style={{ marginBottom: 12 }}>
            <Descriptions.Item label="Total">{notifyAllResult.total}</Descriptions.Item>
            <Descriptions.Item label="Success">
              <Text type="success">{notifyAllResult.success}</Text>
            </Descriptions.Item>
            <Descriptions.Item label="Failed">
              <Text type="danger">{notifyAllResult.failed}</Text>
            </Descriptions.Item>
          </Descriptions>
          <Table
            dataSource={notifyAllResult.results}
            rowKey="node_ip"
            size="small"
            pagination={false}
            columns={[
              {
                title: 'Node IP',
                dataIndex: 'node_ip',
                key: 'node_ip',
              },
              {
                title: 'Status',
                dataIndex: 'status',
                key: 'status',
                width: 80,
                render: (status: number) =>
                  status === 200 ? (
                    <CheckCircleOutlined style={{ color: 'var(--color-success)' }} />
                  ) : (
                    <CloseCircleOutlined style={{ color: 'var(--color-danger)' }} />
                  ),
              },
              {
                title: 'Error',
                dataIndex: 'error',
                key: 'error',
                render: (err: string) => err ? <Text type="danger">{err}</Text> : '-',
              },
            ]}
          />
        </>
      )}
    </div>
  );
};

// ── Main Drawer ──

const GslbNodeDrawer: React.FC<GslbNodeDrawerProps> = ({
  open,
  onClose,
  nodeId,
  nodeIp,
}) => {
  return (
    <Drawer
      title={
        <Space>
          <GlobalOutlined style={{ fontSize: 18, color: 'var(--color-primary)' }} />
          <div>
            <div style={{ fontWeight: 600 }}>Node Operations</div>
            <div style={{ fontSize: 12, fontWeight: 400, color: 'var(--text-secondary)' }}>
              {nodeIp}
            </div>
          </div>
        </Space>
      }
      placement="right"
      width={700}
      open={open}
      onClose={onClose}
      destroyOnClose
    >
      {nodeId && (
        <Tabs
          defaultActiveKey="health"
          items={[
            {
              key: 'health',
              label: <span><HeartOutlined /> Health</span>,
              children: <HealthTab nodeId={nodeId} />,
            },
            {
              key: 'records',
              label: <span><DatabaseOutlined /> Records</span>,
              children: <RecordsTab nodeId={nodeId} />,
            },
            {
              key: 'notify',
              label: <span><SendOutlined /> Notify</span>,
              children: <NotifyTab nodeId={nodeId} nodeIp={nodeIp} />,
            },
          ]}
        />
      )}
    </Drawer>
  );
};

export default GslbNodeDrawer;
