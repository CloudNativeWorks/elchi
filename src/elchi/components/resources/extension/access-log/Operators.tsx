import React, { useState } from 'react';
import { Table, Tag, Button, Typography } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { AccessLogOperators, ALO } from '@/common/statics/access-log-operators';
import { CopyOutlined, CheckOutlined, InboxOutlined } from '@ant-design/icons';


const { Text } = Typography;

const AccessLogOperator: React.FC = () => {
	const [copiedOperator, setCopiedOperator] = useState<string | null>(null);

	const copyToClipboard = (text: string) => {
		navigator.clipboard.writeText(text).then(() => {
			setCopiedOperator(text);
			setTimeout(() => {
				setCopiedOperator(null);
			}, 1000);
		}).catch(() => {
			console.error('Failed to copy text!');
		});
	};

	const columns: ColumnsType<ALO> = [
		{
			title: 'Operator',
			dataIndex: 'operator',
			key: 'operator',
			width: '30%',
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
			render: (supported) => (
				<>
					{supported.map((protocol) => (
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
		},
		{
			title: 'Versions',
			dataIndex: 'versions',
			key: 'versions',
			width: '5%',
			render: (versions) => (
				<>
					{versions.map((version) => (
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