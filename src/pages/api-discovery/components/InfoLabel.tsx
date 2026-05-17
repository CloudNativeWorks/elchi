import React from 'react';
import { Tooltip, Space } from 'antd';
import { InfoCircleOutlined } from '@ant-design/icons';

interface Props {
    children: React.ReactNode;
    /** Tooltip body. Plain text or a node with formatting. */
    info: React.ReactNode;
    /** Extra info-icon styling. */
    iconStyle?: React.CSSProperties;
}

// Inline label + ⓘ icon. Used on column headers, KPI tile titles, and any
// field-level callout where we want the meaning available on hover without
// stealing layout space.
const InfoLabel: React.FC<Props> = ({ children, info, iconStyle }) => (
    <Space size={4}>
        {children}
        <Tooltip
            title={info}
            styles={{ body: { maxWidth: 320, fontSize: 11, lineHeight: 1.5 } }}
        >
            <InfoCircleOutlined
                style={{
                    color: 'var(--text-tertiary)',
                    fontSize: 11,
                    cursor: 'help',
                    ...iconStyle,
                }}
            />
        </Tooltip>
    </Space>
);

export default InfoLabel;
