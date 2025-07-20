import React from 'react';
import { Card, Tabs, Typography } from 'antd';
import { UserOutlined, TeamOutlined, ProjectOutlined, SettingOutlined, AppstoreOutlined } from '@ant-design/icons';
import General from './General';
import Users from './users';
import Groups from './Groups';
import Projects from './Projects';

const { Title } = Typography;

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
        }
    ];

    return (
        <div style={{ width: '100%', marginTop: '3px', padding: 0 }}>
            <Card style={{ borderRadius: 12, boxShadow: '0 2px 8px rgba(5,117,230,0.06)', margin: '0 auto' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <SettingOutlined 
                            style={{ 
                                fontSize: '22px', 
                                color: '#056ccd'
                            }} 
                        />
                        <Title level={4} style={{ margin: 0 }}>Settings</Title>
                    </div>
                </div>
                <Tabs
                    defaultActiveKey="general"
                    items={tabItems}
                    size="large"
                    tabPosition="top"
                    style={{ minHeight: '400px' }}
                    
                />
            </Card>

            <div style={{ height: 32 }} />
        </div>
    );
};

export default Settings;