import React, { useEffect, useRef, useState } from 'react';
import { Button, Card, Dropdown, Tabs, Typography, Space } from 'antd';
import { AuditOutlined, CheckOutlined, MoreOutlined, UserOutlined, TeamOutlined, ProjectOutlined, SettingOutlined, AppstoreOutlined, KeyOutlined, RobotOutlined, CloudOutlined, SafetyOutlined, SafetyCertificateOutlined, ToolOutlined, GlobalOutlined } from '@ant-design/icons';
import { useSearchParams } from 'react-router-dom';
import General from './General';
import Users from './users';
import Groups from './Groups';
import Projects from './Projects';
import AI from './AI';
import Tokens from './Tokens';
import CloudsConfig from './CloudsConfig';
import LdapConfig from './LdapConfig';
import GSLBConfig from './GSLBConfig';
import Licensing from './Licensing';
import Maintenance from './Maintenance';
import SyslogConfig from './SyslogConfig';

const { Title, Text } = Typography;

const SETTINGS_TABS_CLASS = 'settings-tabs-overflow';

const Settings: React.FC = () => {
    const [searchParams, setSearchParams] = useSearchParams();

    // Direct computation without state to prevent flicker
    const activeTab = searchParams.get('tab') || 'general';

    const handleTabChange = (key: string) => {
        // Update URL parameter without extra state
        const newParams = new URLSearchParams(searchParams);
        if (key === 'general') {
            newParams.delete('tab'); // Remove tab param for default
        } else {
            newParams.set('tab', key);
        }
        setSearchParams(newParams, { replace: true }); // Use replace to avoid history pollution
    };

    // Detect when the tab strip overflows the visible area. When it does,
    // we surface a "…" dropdown on the right that lets the user pick any
    // tab without horizontal scrolling. ResizeObserver keeps it accurate
    // when the viewport changes.
    const tabsWrapperRef = useRef<HTMLDivElement>(null);
    const [isOverflowing, setIsOverflowing] = useState(false);

    useEffect(() => {
        const root = tabsWrapperRef.current;
        if (!root) return;

        let cleanupObservers: (() => void) | null = null;

        const measure = (navWrap: HTMLElement, navList: HTMLElement) => {
            // The list overflows when its content is wider than the wrap.
            setIsOverflowing(navList.scrollWidth > navWrap.clientWidth + 1);
        };

        const attach = () => {
            const navWrap = root.querySelector('.ant-tabs-nav-wrap') as HTMLElement | null;
            const navList = root.querySelector('.ant-tabs-nav-list') as HTMLElement | null;
            if (!navWrap || !navList) return false;

            const ro = new ResizeObserver(() => measure(navWrap, navList));
            ro.observe(navWrap);
            ro.observe(navList);
            measure(navWrap, navList);

            cleanupObservers = () => ro.disconnect();
            return true;
        };

        // Antd renders the nav lazily; retry once after the first paint if
        // it isn't in the DOM yet.
        if (!attach()) {
            const t = setTimeout(attach, 0);
            return () => {
                clearTimeout(t);
                cleanupObservers?.();
            };
        }
        return () => {
            cleanupObservers?.();
        };
    }, []);

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
        ...(!window.APP_CONFIG?.ENABLE_DEMO ? [{
            key: 'users',
            label: (
                <span className="tabLabel">
                    <UserOutlined style={{ fontSize: 18 }} />
                    Users
                </span>
            ),
            children: <Users />
        }] : []),
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
        },
        {
            key: 'gslb',
            label: (
                <span className="tabLabel">
                    <GlobalOutlined style={{ fontSize: 18 }} />
                    GSLB
                </span>
            ),
            children: <GSLBConfig />
        },
        {
            key: 'audit-forwarding',
            label: (
                <span className="tabLabel">
                    <AuditOutlined style={{ fontSize: 18 }} />
                    Audit Forwarding
                </span>
            ),
            children: <SyslogConfig />
        },
        {
            key: 'license',
            label: (
                <span className="tabLabel">
                    <SafetyCertificateOutlined style={{ fontSize: 18 }} />
                    License
                </span>
            ),
            children: <Licensing />
        },
        {
            key: 'maintenance',
            label: (
                <span className="tabLabel">
                    <ToolOutlined style={{ fontSize: 18 }} />
                    Maintenance
                </span>
            ),
            children: <Maintenance />
        }
    ];

    return (
        <>
            {/* Header Section - Outside Card */}
            <div style={{ marginBottom: 16 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                    <Space>
                        <SettingOutlined style={{ color: 'var(--color-primary)', fontSize: 24 }} />
                        <Title level={4} style={{ margin: 0 }}>Settings</Title>
                    </Space>
                </div>
                
                <Text type="secondary">
                    Manage your application settings, users, groups, projects, AI configuration, API tokens, cloud providers, LDAP authentication, license, and system maintenance.
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
                {/* Hide antd's built-in `…` overflow popover (click-only,
                    looks subtle) so we can surface our own hover-triggered
                    Dropdown on the right when the tab strip overflows.
                    Scoped to this Tabs instance via the className so other
                    Tabs in the app keep antd defaults. */}
                <style>{`
                    .${SETTINGS_TABS_CLASS} .ant-tabs-nav-operations { display: none !important; }
                `}</style>
                <div ref={tabsWrapperRef}>
                    <Tabs
                        className={SETTINGS_TABS_CLASS}
                        activeKey={activeTab}
                        onChange={handleTabChange}
                        items={tabItems}
                        size="large"
                        tabPosition="top"
                        style={{ minHeight: '400px' }}
                        destroyOnHidden
                        tabBarExtraContent={{
                            right: isOverflowing ? (
                                <Dropdown
                                    trigger={['hover']}
                                    placement="bottomRight"
                                    menu={{
                                        items: tabItems.map((t) => ({
                                            key: t.key,
                                            label: t.label,
                                            icon: t.key === activeTab ? (
                                                <CheckOutlined
                                                    style={{ color: 'var(--color-primary)' }}
                                                />
                                            ) : undefined,
                                        })),
                                        onClick: ({ key }) => handleTabChange(key),
                                        selectedKeys: [activeTab],
                                        style: { maxHeight: '60vh', overflow: 'auto' },
                                    }}
                                >
                                    <Button
                                        type="text"
                                        size="small"
                                        icon={<MoreOutlined />}
                                        style={{
                                            marginLeft: 4,
                                            color: 'var(--text-secondary)',
                                        }}
                                        aria-label="All tabs"
                                    />
                                </Dropdown>
                            ) : null,
                        }}
                    />
                </div>
            </Card>
        </>
    );
};

export default Settings;