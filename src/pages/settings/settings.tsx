import React from 'react';
import { Card, Tabs, Typography, Space } from 'antd';
import { UserOutlined, TeamOutlined, ProjectOutlined, SettingOutlined, AppstoreOutlined, KeyOutlined, RobotOutlined, CloudOutlined, SafetyOutlined } from '@ant-design/icons';
import General from './General';
import Users from './users';
import Groups from './Groups';
import Projects from './Projects';
import AI from './AI';
import Tokens from './Tokens';
import CloudsConfig from './CloudsConfig';
import LdapConfig from './LdapConfig';

const { Title, Text } = Typography;

const Settings: React.FC = () => {
    const tabItems = [
        {
            key: 'general',
            label: (
                <span className="tabLabel">
                    <AppstoreOutlined style={{ fontSize: 18 }} />
                    General
                </span>
            ),
            children: <General />
        },
        {
            key: 'users',
            label: (
                <span className="tabLabel">
                    <UserOutlined style={{ fontSize: 18 }} />
                    Users
                </span>
            ),
            children: <Users />
        },
        {
            key: 'groups',
            label: (
                <span className="tabLabel">
                    <TeamOutlined style={{ fontSize: 18 }} />
                    Groups
                </span>
            ),
            children: <Groups />
        },
        {
            key: 'projects',
            label: (
                <span className="tabLabel">
                    <ProjectOutlined style={{ fontSize: 18 }} />
                    Projects
                </span>
            ),
            children: <Projects />
        },
        {
            key: 'ai',
            label: (
                <span className="tabLabel">
                    <RobotOutlined style={{ fontSize: 18 }} />
                    AI
                </span>
            ),
            children: <AI />
        },
        {
            key: 'tokens',
            label: (
                <span className="tabLabel">
                    <KeyOutlined style={{ fontSize: 18 }} />
                    Tokens
                </span>
            ),
            children: <Tokens />
        },
        {
            key: 'clouds',
            label: (
                <span className="tabLabel">
                    <CloudOutlined style={{ fontSize: 18 }} />
                    Clouds
                </span>
            ),
            children: <CloudsConfig />
        },
        {
            key: 'ldap',
            label: (
                <span className="tabLabel">
                    <SafetyOutlined style={{ fontSize: 18 }} />
                    LDAP
                </span>
            ),
            children: <LdapConfig />
        }
    ];

    return (
        <>
            {/* Header Section - Outside Card */}
            <div style={{ marginBottom: 16 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                    <Space>
                        <SettingOutlined style={{ color: '#1890ff', fontSize: 24 }} />
                        <Title level={4} style={{ margin: 0 }}>Settings</Title>
                    </Space>
                </div>
                
                <Text type="secondary">
                    Manage your application settings, users, groups, projects, AI configuration, API tokens, cloud providers, and LDAP authentication.
                </Text>
            </div>

            {/* Settings Card */}
            <Card 
                style={{ 
                    borderRadius: 12, 
                    boxShadow: '0 2px 8px rgba(5,117,230,0.06)'
                }}
                styles={{
                    body: { padding: 12 }
                }}
            >
                <Tabs
                    defaultActiveKey="general"
                    items={tabItems}
                    size="large"
                    tabPosition="top"
                    style={{ minHeight: '400px' }}
                    destroyOnHidden
                />
            </Card>
        </>
    );
};

export default Settings;