import React from 'react';
import { Layout } from 'antd';

const { Sider, Content } = Layout;

interface WafShellProps {
    header: React.ReactNode;
    sidebar: React.ReactNode;
    main: React.ReactNode;
}

/**
 * Two-pane shell for the WAF detail page.
 *
 * Header sits on top. Below it: a left sidebar (navigator) + main content
 * (active tab). The shell takes the full available height of its parent.
 */
const WafShell: React.FC<WafShellProps> = ({ header, sidebar, main }) => {
    return (
        <div
            style={{
                display: 'flex',
                flexDirection: 'column',
                gap: 12,
                height: '100%',
                minHeight: 0,
            }}
        >
            {header}
            <Layout
                style={{
                    flex: 1,
                    minHeight: 0,
                    background: 'transparent',
                    borderRadius: 12,
                    overflow: 'hidden',
                }}
            >
                <Sider
                    width={260}
                    style={{
                        background: 'var(--card-bg)',
                        borderRadius: 12,
                        marginRight: 12,
                        boxShadow: 'var(--shadow-sm)',
                        overflow: 'auto',
                    }}
                >
                    {sidebar}
                </Sider>
                <Content
                    style={{
                        background: 'var(--card-bg)',
                        borderRadius: 12,
                        boxShadow: 'var(--shadow-sm)',
                        display: 'flex',
                        flexDirection: 'column',
                        minHeight: 0,
                        overflow: 'hidden',
                    }}
                >
                    {main}
                </Content>
            </Layout>
        </div>
    );
};

export default WafShell;
