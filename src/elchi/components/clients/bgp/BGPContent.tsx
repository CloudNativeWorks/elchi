import React, { useState } from 'react';
import { Tabs } from 'antd';
import {
    SettingOutlined,
    TeamOutlined,
    ShareAltOutlined,
    FileProtectOutlined,
    FileTextOutlined
} from '@ant-design/icons';
import BGPSummaryContent from './BGPSummaryContent';
import BGPConfigurationContent from './BGPConfigurationContent';
import BGPNeighborsContent from './BGPNeighborsContent';
import BGPRoutesContent from './BGPRoutesContent';
import BGPPoliciesContent from './BGPPoliciesContent';
import { BGPProvider } from './context/BGPContext';
import BgpLogs from './BgpLogs';

interface BGPContentProps {
    clientId: string;
    project: string;
}

const BGPContent: React.FC<BGPContentProps> = ({ clientId }) => {
    const [activeTab, setActiveTab] = useState('configuration');

    const tabItems = [
        {
            key: 'configuration',
            label: (
                <span>
                    <SettingOutlined style={{ marginRight: 4 }} />
                    Configuration
                </span>
            ),
            children: (
                <div>
                    <BGPSummaryContent clientId={clientId} />
                    <BGPConfigurationContent clientId={clientId} />
                </div>
            )
        },
        {
            key: 'neighbors',
            label: (
                <span>
                    <TeamOutlined style={{ marginRight: 4 }} />
                    Neighbors
                </span>
            ),
            children: <BGPNeighborsContent clientId={clientId} />
        },
        {
            key: 'policies',
            label: (
                <span>
                    <FileProtectOutlined style={{ marginRight: 4 }} />
                    Policies
                </span>
            ),
            children: <BGPPoliciesContent clientId={clientId} />
        },
        {
            key: 'routes',
            label: (
                <span>
                    <ShareAltOutlined style={{ marginRight: 4 }} />
                    Routes
                </span>
            ),
            children: <BGPRoutesContent clientId={clientId} />
        },
        {
            key: 'logs',
            label: (
                <span>
                    <FileTextOutlined style={{ marginRight: 4 }} />
                    Logs
                </span>
            ),
            children: <BgpLogs clientId={clientId} />
        }
    ];

    return (
        <BGPProvider>
            <div style={{ padding: '0px 0' }}>
                <Tabs
                    activeKey={activeTab}
                    onChange={setActiveTab}
                    items={tabItems}
                    tabBarStyle={{
                        marginBottom: 24,
                        borderBottom: '1px solid #e6f7ff'
                    }}
                    tabBarGutter={24}
                    destroyOnHidden
                />
            </div>
        </BGPProvider>
    );
};

export default BGPContent; 