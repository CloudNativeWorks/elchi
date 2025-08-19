import React, { useState } from 'react';
import { ThemeColors } from './themes';
import { 
    GlobalOutlined,
    ClusterOutlined,
    FilterOutlined,
    ShareAltOutlined,
    AimOutlined,
    SafetyOutlined,
    CodeOutlined,
    KeyOutlined,
    AppstoreOutlined,
    CloudOutlined
} from '@ant-design/icons';

const NodeIcons: React.FC = () => {
    const [collapsed, setCollapsed] = useState(false);
    return (
        <div style={{
            position: 'absolute',
            top: '10px',
            right: '10px',
            backgroundColor: ThemeColors.glass.background,
            backdropFilter: ThemeColors.glass.backdrop,
            border: `1px solid ${ThemeColors.glass.border}`,
            padding: '12px',
            borderRadius: '12px',
            boxShadow: ThemeColors.glass.shadow,
            zIndex: 1000,
            maxWidth: '400px',
            maxHeight: '80vh',
            overflowY: 'auto'
        }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px', height: '20px' }}>
                <span style={{ fontSize: '13px', fontWeight: 'bold', borderBottom: '1px solid rgba(255, 255, 255, 0.3)', paddingBottom: '8px', flex: 1, height: '20px', lineHeight: '20px', display: 'flex', alignItems: 'center', color: '#333' }}>
                    Resource Types
                </span>
                <button
                    style={{
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer',
                        marginLeft: '8px',
                        padding: 0,
                        display: 'flex',
                        alignItems: 'center',
                        height: '20px',
                        width: '20px',
                        justifyContent: 'center',
                    }}
                    aria-label={collapsed ? 'Open' : 'Close'}
                    onClick={() => setCollapsed(c => !c)}
                >
                    <svg width="18" height="18" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ transform: collapsed ? 'rotate(0deg)' : 'rotate(180deg)', transition: 'transform 0.2s', alignSelf: 'center', display: 'block' }}>
                        <path d="M5 8L10 13L15 8" stroke="#333" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                </button>
            </div>
            {!collapsed && (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', gap: '12px', alignItems: 'center' }}>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px' }}>
                        <div style={{
                            width: '24px',
                            height: '24px',
                            backgroundColor: ThemeColors.node.listener.bg,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            border: `1px solid ${ThemeColors.node.listener.border}`,
                            borderRadius: '6px',
                            flexShrink: 0
                        }}>
                            <GlobalOutlined style={{ color: 'white', fontSize: '14px' }} />
                        </div>
                        <span style={{ color: '#333', fontWeight: '500' }}>Listener</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px' }}>
                        <div style={{
                            width: '24px',
                            height: '24px',
                            backgroundColor: ThemeColors.node.route.bg,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            border: `1px solid ${ThemeColors.node.route.border}`,
                            borderRadius: '6px',
                            flexShrink: 0
                        }}>
                            <ShareAltOutlined style={{ color: 'white', fontSize: '14px' }} />
                        </div>
                        <span style={{ color: '#333', fontWeight: '500' }}>Route</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px' }}>
                        <div style={{
                            width: '24px',
                            height: '24px',
                            backgroundColor: ThemeColors.node.virtual_host.bg,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            border: `1px solid ${ThemeColors.node.virtual_host.border}`,
                            borderRadius: '6px',
                            flexShrink: 0
                        }}>
                            <CloudOutlined style={{ color: 'white', fontSize: '14px' }} />
                        </div>
                        <span style={{ color: '#333', fontWeight: '500' }}>Virtual Host</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px' }}>
                        <div style={{
                            width: '24px',
                            height: '24px',
                            backgroundColor: ThemeColors.node.cluster.bg,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            border: `1px solid ${ThemeColors.node.cluster.border}`,
                            borderRadius: '6px',
                            flexShrink: 0
                        }}>
                            <ClusterOutlined style={{ color: 'white', fontSize: '14px' }} />
                        </div>
                        <span style={{ color: '#333', fontWeight: '500' }}>Cluster</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px' }}>
                        <div style={{
                            width: '24px',
                            height: '24px',
                            backgroundColor: ThemeColors.node.endpoint.bg,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            border: `1px solid ${ThemeColors.node.endpoint.border}`,
                            borderRadius: '6px',
                            flexShrink: 0
                        }}>
                            <AimOutlined style={{ color: 'white', fontSize: '14px' }} />
                        </div>
                        <span style={{ color: '#333', fontWeight: '500' }}>Endpoint</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px' }}>
                        <div style={{
                            width: '24px',
                            height: '24px',
                            backgroundColor: ThemeColors.node.tls.bg,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            border: `1px solid ${ThemeColors.node.tls.border}`,
                            borderRadius: '6px',
                            flexShrink: 0
                        }}>
                            <SafetyOutlined style={{ color: 'white', fontSize: '14px' }} />
                        </div>
                        <span style={{ color: '#333', fontWeight: '500' }}>TLS</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px' }}>
                        <div style={{
                            width: '24px',
                            height: '24px',
                            backgroundColor: ThemeColors.node.secret.bg,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            border: `1px solid ${ThemeColors.node.secret.border}`,
                            borderRadius: '6px',
                            flexShrink: 0
                        }}>
                            <KeyOutlined style={{ color: 'white', fontSize: '14px' }} />
                        </div>
                        <span style={{ color: '#333', fontWeight: '500' }}>Secret</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px' }}>
                        <div style={{
                            width: '24px',
                            height: '24px',
                            backgroundColor: ThemeColors.node.filter.bg,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            border: `1px solid ${ThemeColors.node.filter.border}`,
                            borderRadius: '6px',
                            flexShrink: 0
                        }}>
                            <FilterOutlined style={{ color: 'white', fontSize: '14px' }} />
                        </div>
                        <span style={{ color: '#333', fontWeight: '500' }}>Filter</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px' }}>
                        <div style={{
                            width: '24px',
                            height: '24px',
                            backgroundColor: ThemeColors.node.extension.bg,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            border: `1px solid ${ThemeColors.node.extension.border}`,
                            borderRadius: '6px',
                            flexShrink: 0
                        }}>
                            <AppstoreOutlined style={{ color: 'white', fontSize: '14px' }} />
                        </div>
                        <span style={{ color: '#333', fontWeight: '500' }}>Extension</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px' }}>
                        <div style={{
                            width: '24px',
                            height: '24px',
                            backgroundColor: ThemeColors.node.bootstrap.bg,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            border: `1px solid ${ThemeColors.node.bootstrap.border}`,
                            borderRadius: '6px',
                            flexShrink: 0
                        }}>
                            <CodeOutlined style={{ color: 'white', fontSize: '14px' }} />
                        </div>
                        <span style={{ color: '#333', fontWeight: '500' }}>Bootstrap</span>
                    </div>
                </div>
            )}
        </div>
    );
};

export default NodeIcons; 