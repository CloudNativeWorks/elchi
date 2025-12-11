import React from 'react';
import { Tabs } from 'antd';
import { DeleteOutlined, CloudDownloadOutlined } from '@ant-design/icons';
import Cleanup from './maintenance/Cleanup';
import Backup from './maintenance/Backup';

const Maintenance: React.FC = () => {
    const tabItems = [
        {
            key: 'cleanup',
            label: (
                <span className="tabLabel">
                    <DeleteOutlined style={{ fontSize: 16 }} />
                    Cleanup
                </span>
            ),
            children: <Cleanup />
        },
        {
            key: 'backup',
            label: (
                <span className="tabLabel">
                    <CloudDownloadOutlined style={{ fontSize: 16 }} />
                    Backup & Restore
                </span>
            ),
            children: <Backup />
        }
    ];

    return (
        <div style={{ padding: '12px 0' }}>
            <Tabs
                defaultActiveKey="cleanup"
                items={tabItems}
                size="middle"
                tabPosition="top"
            />
        </div>
    );
};

export default Maintenance;
