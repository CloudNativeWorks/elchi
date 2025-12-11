import React from 'react';
import { Tabs } from 'antd';
import { SettingOutlined, DatabaseOutlined } from '@ant-design/icons';
import FilebeatConfig from './FilebeatConfig';
import RsyslogConfig from './RsyslogConfig';

interface ClientSettingsProps {
    clientId: string;
    downstreamAddress: string;
}

const ClientSettings: React.FC<ClientSettingsProps> = ({ clientId, downstreamAddress }) => {
    return (
        <Tabs
            defaultActiveKey="filebeat"
            items={[
                {
                    key: 'filebeat',
                    label: (
                        <span style={{ fontSize: 12, fontWeight: 500 }}>
                            <SettingOutlined style={{ marginRight: 8 }} />
                            Log Service
                        </span>
                    ),
                    children: (
                        <FilebeatConfig
                            clientId={clientId}
                            downstreamAddress={downstreamAddress}
                        />
                    )
                },
                {
                    key: 'rsyslog',
                    label: (
                        <span style={{ fontSize: 12, fontWeight: 500 }}>
                            <DatabaseOutlined style={{ marginRight: 8 }} />
                            Syslog
                        </span>
                    ),
                    children: (
                        <RsyslogConfig
                            clientId={clientId}
                            downstreamAddress={downstreamAddress}
                        />
                    )
                }
            ]}
        />
    );
};

export default ClientSettings;
