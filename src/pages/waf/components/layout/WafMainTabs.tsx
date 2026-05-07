import React from 'react';
import { Empty, Tabs } from 'antd';
import {
    CodeOutlined,
    FileTextOutlined,
    HistoryOutlined,
} from '@ant-design/icons';
import { useWafEditor, WafTab } from '../../state/wafEditorStore';

interface WafMainTabsProps {
    editor: React.ReactNode;
    preview: React.ReactNode;
    history?: React.ReactNode;
}

/**
 * Tab strip on the main pane: Editor / Live .conf / History.
 *
 * Test/dry-run tab was removed because the backend cannot run Coraza in-process
 * today (no Go dependency, no embedded .conf bodies — see backend review C1+H3).
 * Re-add only when both blockers clear.
 *
 * History stays as a placeholder; backend versioning is on the BE plan §4.1
 * (recommended sync write, best-effort).
 */
const WafMainTabs: React.FC<WafMainTabsProps> = ({ editor, preview, history }) => {
    const { state, dispatch } = useWafEditor();
    const { activeTab } = state.ui;

    return (
        <Tabs
            activeKey={activeTab}
            onChange={(k) => dispatch({ type: 'SET_ACTIVE_TAB', tab: k as WafTab })}
            destroyOnHidden={false}
            style={{ flex: 1, display: 'flex', flexDirection: 'column', minHeight: 0 }}
            tabBarStyle={{ padding: '0 16px', margin: 0 }}
            items={[
                {
                    key: 'editor',
                    label: (
                        <span>
                            <CodeOutlined /> Editor
                        </span>
                    ),
                    children: <div style={{ flex: 1, minHeight: 0, overflow: 'auto' }}>{editor}</div>,
                },
                {
                    key: 'preview',
                    label: (
                        <span>
                            <FileTextOutlined /> Live .conf
                        </span>
                    ),
                    children: <div style={{ flex: 1, minHeight: 0, overflow: 'auto' }}>{preview}</div>,
                },
                {
                    key: 'history',
                    label: (
                        <span>
                            <HistoryOutlined /> History
                        </span>
                    ),
                    children: history ?? (
                        <Empty
                            description="Version history will surface here once backend versioning ships (sync writer per backend review §S7)."
                            style={{ padding: '64px 0' }}
                        />
                    ),
                },
            ]}
        />
    );
};

export default WafMainTabs;
