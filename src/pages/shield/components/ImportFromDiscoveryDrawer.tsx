/**
 * "Import from Discovery" — pick observed endpoints from API Discovery and graft
 * suggested protections (engines) onto the policy you're editing. Lists the
 * project's confirmed inventory, lets you multi-select, then calls the backend
 * suggestion endpoint and merges the result into the current Builder model.
 */

import React, { useState } from 'react';
import { Drawer, Table, Button, Tag, Typography, Space, Input } from 'antd';
import { SafetyCertificateOutlined, SearchOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import { useApiInventory } from '@/hooks/useApiDiscovery';
import type { InventoryDoc } from '@/pages/api-discovery/types';

const { Text } = Typography;

const riskColor = (s: number) => (s >= 40 ? 'error' : s >= 25 ? 'volcano' : s >= 10 ? 'orange' : 'default');

interface ImportFromDiscoveryDrawerProps {
    open: boolean;
    onClose: () => void;
    // eslint-disable-next-line no-unused-vars
    onImport: (endpointIds: string[]) => Promise<void>;
}

const ImportFromDiscoveryDrawer: React.FC<ImportFromDiscoveryDrawerProps> = ({ open, onClose, onImport }) => {
    const [selected, setSelected] = useState<string[]>([]);
    const [host, setHost] = useState('');
    const [importing, setImporting] = useState(false);

    const { data, isLoading } = useApiInventory(
        { host: host || undefined, sort_by: 'max_risk_score', sort_order: 'desc', limit: 200 },
        open,
    );
    const rows = data?.data ?? [];

    const columns: ColumnsType<InventoryDoc> = [
        { title: 'Method', dataIndex: 'method', width: 90, render: (m: string) => <Text code>{m}</Text> },
        { title: 'Endpoint', key: 'ep', render: (_, r) => <Text>{r.host}<Text type="secondary">{r.normalized_path}</Text></Text> },
        {
            title: 'Risk', dataIndex: 'max_risk_score', width: 80, align: 'right',
            render: (s: number) => <Tag className="auto-width-tag" color={riskColor(s ?? 0)}>{s ?? 0}</Tag>,
        },
        {
            title: 'Findings', dataIndex: 'risk_flags', render: (f: string[]) =>
                <Space size={2} wrap>{(f ?? []).slice(0, 3).map(x => <Tag key={x} className="auto-width-tag" style={{ fontSize: 11 }}>{x}</Tag>)}{(f?.length ?? 0) > 3 && <Text type="secondary">+{f.length - 3}</Text>}</Space>,
        },
    ];

    const doImport = async () => {
        if (!selected.length) return;
        setImporting(true);
        try {
            await onImport(selected);
            setSelected([]);
            onClose();
        } catch {
            // onImport surfaces its own error toast; keep the drawer open for a retry.
        } finally {
            setImporting(false);
        }
    };

    return (
        <Drawer
            title={<Space><SafetyCertificateOutlined /> Import from API Discovery</Space>}
            open={open}
            onClose={onClose}
            width={760}
            extra={
                <Button type="primary" icon={<SafetyCertificateOutlined />} loading={importing}
                    disabled={!selected.length} onClick={doImport}>
                    Add protections ({selected.length})
                </Button>
            }
        >
            <Text type="secondary" style={{ display: 'block', marginBottom: 12 }}>
                Select the discovered endpoints to protect. Their findings (missing auth, PII, abuse,
                OWASP exposure…) are mapped to the matching engines and merged as routes into the
                policy you're editing — review and save when done.
            </Text>
            <Input
                allowClear
                prefix={<SearchOutlined />}
                placeholder="Filter by host (e.g. api.example.com)"
                value={host}
                onChange={e => setHost(e.target.value)}
                style={{ marginBottom: 12, maxWidth: 360 }}
            />
            <Table<InventoryDoc>
                size="small"
                rowKey="_id"
                loading={isLoading}
                dataSource={rows}
                columns={columns}
                pagination={{ pageSize: 20, size: 'small' }}
                rowSelection={{
                    selectedRowKeys: selected,
                    onChange: (keys) => setSelected(keys as string[]),
                    preserveSelectedRowKeys: true,
                }}
            />
        </Drawer>
    );
};

export default ImportFromDiscoveryDrawer;
