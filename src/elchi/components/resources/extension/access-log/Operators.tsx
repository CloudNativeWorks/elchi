import React, { useState } from 'react';
import { Table, Tag, Button, Typography, Input } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { AccessLogOperators, ALO } from '@/common/statics/access-log-operators';
import { CopyOutlined, CheckOutlined, InboxOutlined, SearchOutlined } from '@ant-design/icons';
import { copyToClipboard as copyToClipboardUtil } from '@/utils/clipboard';


const { Text } = Typography;

const AccessLogOperator: React.FC = () => {
	const [copiedOperator, setCopiedOperator] = useState<string | null>(null);

	const copyToClipboard = async (text: string) => {
		const success = await copyToClipboardUtil(text, 'Operator copied to clipboard!');
		if (success) {
			setCopiedOperator(text);
			setTimeout(() => {
				setCopiedOperator(null);
			}, 1000);
		}
	};

	const getColumnSearchProps = (dataIndex: keyof ALO) => ({
		filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }: any) => (
			<div style={{ padding: 8 }}>
				<Input
					placeholder={`Search ${dataIndex}`}
					value={selectedKeys[0]}
					onChange={e => setSelectedKeys(e.target.value ? [e.target.value] : [])}
					onPressEnter={() => confirm()}
					style={{ marginBottom: 8, display: 'block' }}
				/>
				<div style={{ display: 'flex', gap: 8 }}>
					<Button
						type="primary"
						onClick={() => confirm()}
						icon={<SearchOutlined />}
						size="small"
						style={{ width: 90 }}
					>
						Search
					</Button>
					<Button
						onClick={() => {
							clearFilters?.();
							confirm();
						}}
						size="small"
						style={{ width: 90 }}
					>
						Reset
					</Button>
				</div>
			</div>
		),
		filterIcon: (filtered: boolean) => (
			<SearchOutlined style={{ color: filtered ? '#1890ff' : undefined }} />
		),
		onFilter: (value: any, record: ALO) => {
			const fieldValue = record[dataIndex];
			if (Array.isArray(fieldValue)) {
				return fieldValue.some(item => 
					item.toString().toLowerCase().includes(value.toLowerCase())
				);
			}
			return fieldValue?.toString().toLowerCase().includes(value.toLowerCase()) || false;
		},
	});

	const columns: ColumnsType<ALO> = [
		{
			title: 'Operator',
			dataIndex: 'operator',
			key: 'operator',
			width: '30%',
			...getColumnSearchProps('operator'),
			render: (text) => (
				<div style={{ display: 'flex', alignItems: 'center' }}>
					<Text code>{text}</Text>
					<Button
						icon={copiedOperator === text ? <CheckOutlined /> : <CopyOutlined />}
						size="small"
						style={{ marginLeft: 8 }}
						onClick={() => copyToClipboard(text)}
					/>
				</div>
			),
		},
		{
			title: 'Supported Protocols',
			dataIndex: 'supported',
			key: 'supported',
			width: '10%',
			...getColumnSearchProps('supported'),
			render: (supported: string[]) => (
				<>
					{supported.map((protocol: string) => (
						<Tag color="blue" key={protocol}>
							{protocol}
						</Tag>
					))}
				</>
			),
		},
		{
			title: 'Description',
			dataIndex: 'description',
			width: '55%',
			key: 'description',
			...getColumnSearchProps('description'),
		},
		{
			title: 'Versions',
			dataIndex: 'versions',
			key: 'versions',
			width: '5%',
			...getColumnSearchProps('versions'),
			render: (versions: string[]) => (
				<>
					{versions.map((version: string) => (
						<Tag color="green" key={version}>
							{version}
						</Tag>
					))}
				</>
			),
		},
	];

	return (
		<Table
			dataSource={AccessLogOperators}
			columns={columns}
			rowKey="operator"
			pagination={false}
			locale={{
				emptyText: (
					<div>
						<InboxOutlined style={{ fontSize: 48, marginBottom: 8 }} />
						<div>No Operators</div>
					</div>
				)
			}}
		/>
	);
};

export default AccessLogOperator;