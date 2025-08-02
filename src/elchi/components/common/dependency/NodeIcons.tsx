import React, { useState } from 'react';
import { ThemeColors } from './themes';

interface IconsImport {
    icons: Record<string, string>;
}

const NodeIcons: React.FC<IconsImport> = ({ icons }) => {
    const [collapsed, setCollapsed] = useState(false);
    return (
        <div style={{
            position: 'absolute',
            top: '10px',
            right: '10px',
            backgroundColor: '#ffffff',
            border: '1px solid #ddd',
            padding: '12px',
            borderRadius: '8px',
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)',
            zIndex: 1000,
            //maxWidth: '300px',
            maxHeight: '80vh',
            overflowY: 'auto'
        }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px', height: '20px' }}>
                <span style={{ fontSize: '13px', fontWeight: 'bold', borderBottom: '1px solid #eee', paddingBottom: '8px', flex: 1, height: '20px', lineHeight: '20px', display: 'flex', alignItems: 'center' }}>
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
                <div style={{ display: 'flex', flexDirection: 'row', gap: '18px', flexWrap: 'wrap', alignItems: 'center' }}>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <div style={{
                            width: '32px',
                            height: '32px',
                            backgroundColor: ThemeColors.node.listener.bg,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            border: `2px solid ${ThemeColors.node.listener.border}`,
                            borderRadius: '6px'
                        }}>
                            <img src={icons.listener} alt="Listener" style={{ width: '80%', height: '80%', margin: 'auto', display: 'block' }} />
                        </div>
                        <span>Listener</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <div style={{
                            width: '32px',
                            height: '32px',
                            backgroundColor: ThemeColors.node.route.bg,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            border: `2px solid ${ThemeColors.node.route.border}`,
                            borderRadius: '6px'
                        }}>
                            <img src={icons.route} alt="Route" style={{ width: '80%', height: '80%', margin: 'auto', display: 'block' }} />
                        </div>
                        <span>Route</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <div style={{
                            width: '30px',
                            height: '30px',
                            backgroundColor: '#a0522d',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            border: '2px solid #8b4513',
                            borderRadius: '6px'
                        }}>
                            <img src={icons.virtual_host} alt="Virtual Host" style={{ width: '70%', height: '70%', margin: 'auto', display: 'block' }} />
                        </div>
                        <span>Virtual Host</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <div style={{
                            width: '32px',
                            height: '32px',
                            backgroundColor: ThemeColors.node.cluster.bg,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            border: `2px solid ${ThemeColors.node.cluster.border}`,
                            borderRadius: '6px'
                        }}>
                            <img src={icons.cluster} alt="Cluster" style={{ width: '80%', height: '80%', margin: 'auto', display: 'block' }} />
                        </div>
                        <span>Cluster</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <div style={{
                            width: '32px',
                            height: '32px',
                            backgroundColor: ThemeColors.node.endpoint.bg,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            border: `2px solid ${ThemeColors.node.endpoint.border}`,
                            borderRadius: '6px'
                        }}>
                            <img src={icons.endpoint} alt="Endpoint" style={{ width: '80%', height: '80%', margin: 'auto', display: 'block' }} />
                        </div>
                        <span>Endpoint</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <div style={{
                            width: '32px',
                            height: '32px',
                            backgroundColor: '#28a745',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            border: '2px solid #1e7e34',
                            borderRadius: '6px'
                        }}>
                            <img src={icons.tls} alt="TLS" style={{ width: '80%', height: '80%', margin: 'auto', display: 'block' }} />
                        </div>
                        <span>TLS</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <div style={{
                            width: '32px',
                            height: '32px',
                            backgroundColor: '#6c757d',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            border: '2px solid #545b62',
                            borderRadius: '6px'
                        }}>
                            <img src={icons.secret} alt="Secret" style={{ width: '80%', height: '80%', margin: 'auto', display: 'block' }} />
                        </div>
                        <span>Secret</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <div style={{
                            width: '32px',
                            height: '32px',
                            backgroundColor: ThemeColors.node.filter.bg,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            border: `2px solid ${ThemeColors.node.filter.border}`,
                            borderRadius: '6px'
                        }}>
                            <img src={icons.filter} alt="Filter" style={{ width: '80%', height: '80%', margin: 'auto', display: 'block' }} />
                        </div>
                        <span>Filter</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <div style={{
                            width: '32px',
                            height: '32px',
                            backgroundColor: '#17a2b8',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            border: '2px solid #138496',
                            borderRadius: '6px'
                        }}>
                            <img src={icons.extension} alt="Extension" style={{ width: '80%', height: '80%', margin: 'auto', display: 'block' }} />
                        </div>
                        <span>Extension</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <div style={{
                            width: '32px',
                            height: '32px',
                            backgroundColor: '#007bff',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            border: '2px solid #0056b3',
                            borderRadius: '6px'
                        }}>
                            <img src={icons.bootstrap} alt="Bootstrap" style={{ width: '80%', height: '80%', margin: 'auto', display: 'block' }} />
                        </div>
                        <span>Bootstrap</span>
                    </div>
                </div>
            )}
        </div>
    );
};

export default NodeIcons; 