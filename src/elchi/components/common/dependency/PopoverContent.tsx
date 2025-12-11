import React from 'react';
import {
    LinkOutlined,
    GlobalOutlined,
    ClusterOutlined,
    FilterOutlined,
    ShareAltOutlined,
    AimOutlined,
    SafetyOutlined,
    CodeOutlined,
    KeyOutlined,
    AppstoreOutlined,
    CloudOutlined,
    QuestionCircleOutlined,
} from '@ant-design/icons';
import { PopoverContentProps } from './types';
import { getIconForCategory, getNodeStyleByCategory } from './themes';
import { ThemeColors } from './themes';

/**
 * Popover Content Component
 * Single responsibility: Display node details in a modern card
 */
const PopoverContent: React.FC<PopoverContentProps> = ({
    nodeLabel,
    category,
    gtype,
    link,
    id,
    version,
}) => {
    const handleClick = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        const params = new URLSearchParams();
        params.set('resource_id', id);
        if (version) {
            params.set('version', version);
        }
        const url = `#${link}${nodeLabel}?${params.toString()}`;
        window.location.href = url;
    };

    const iconName = getIconForCategory(category);
    const nodeStyle = getNodeStyleByCategory(category);

    // Icon mapping
    const iconMap: Record<string, React.ReactNode> = {
        GlobalOutlined: <GlobalOutlined />,
        ClusterOutlined: <ClusterOutlined />,
        FilterOutlined: <FilterOutlined />,
        ShareAltOutlined: <ShareAltOutlined />,
        AimOutlined: <AimOutlined />,
        SafetyOutlined: <SafetyOutlined />,
        CodeOutlined: <CodeOutlined />,
        KeyOutlined: <KeyOutlined />,
        AppstoreOutlined: <AppstoreOutlined />,
        CloudOutlined: <CloudOutlined />,
        QuestionCircleOutlined: <QuestionCircleOutlined />,
    };

    const IconComponent = iconMap[iconName] || iconMap['QuestionCircleOutlined'];

    return (
        <div
            onClick={(e) => e.stopPropagation()}
            style={{
                background: ThemeColors.glass.background,
                backdropFilter: ThemeColors.glass.backdrop,
                border: `1px solid ${ThemeColors.glass.border}`,
                borderRadius: '12px',
                padding: '20px',
                boxShadow: ThemeColors.glass.shadow,
                width: '320px',
            }}
        >
            {/* Header Section */}
            <div
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    marginBottom: '20px',
                    paddingBottom: '16px',
                    borderBottom: `1px solid ${ThemeColors.glass.border}`,
                }}
            >
                {/* Icon */}
                <div
                    style={{
                        width: 48,
                        height: 48,
                        background: nodeStyle.gradient,
                        border: `2px solid ${nodeStyle.border}`,
                        borderRadius: '12px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '20px',
                        color: '#fff',
                        flexShrink: 0,
                        boxShadow: nodeStyle.shadow,
                    }}
                >
                    {IconComponent}
                </div>

                {/* Title */}
                <div style={{ flex: 1, minWidth: 0 }}>
                    <div
                        style={{
                            fontSize: '14px',
                            fontWeight: 700,
                            color: '#1e293b',
                            marginBottom: '4px',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap',
                        }}
                        title={nodeLabel}
                    >
                        {nodeLabel}
                    </div>
                    <div
                        style={{
                            fontSize: '11px',
                            fontWeight: 600,
                            color: nodeStyle.border,
                            textTransform: 'uppercase',
                            letterSpacing: '0.5px',
                        }}
                    >
                        {category}
                    </div>
                </div>
            </div>

            {/* Details Section */}
            <div style={{ marginBottom: '16px' }}>
                {/* Type */}
                <div
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        padding: '10px 12px',
                        background: 'rgba(241, 245, 249, 0.6)',
                        borderRadius: '8px',
                        marginBottom: '8px',
                    }}
                >
                    <div style={{ flex: 1 }}>
                        <div
                            style={{
                                fontSize: '10px',
                                fontWeight: 600,
                                color: '#94a3b8',
                                textTransform: 'uppercase',
                                letterSpacing: '0.5px',
                                marginBottom: '2px',
                            }}
                        >
                            Type
                        </div>
                        <div
                            style={{
                                fontSize: '11px',
                                fontWeight: 500,
                                color: '#475569',
                                fontFamily: 'monospace',
                                wordBreak: 'break-all',
                                lineHeight: '1.4',
                            }}
                            title={gtype}
                        >
                            {gtype}
                        </div>
                    </div>
                </div>

                {/* Version (if available) */}
                {version && (
                    <div
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            padding: '10px 12px',
                            background: 'rgba(241, 245, 249, 0.6)',
                            borderRadius: '8px',
                        }}
                    >
                        <div style={{ flex: 1 }}>
                            <div
                                style={{
                                    fontSize: '10px',
                                    fontWeight: 600,
                                    color: '#94a3b8',
                                    textTransform: 'uppercase',
                                    letterSpacing: '0.5px',
                                    marginBottom: '2px',
                                }}
                            >
                                Version
                            </div>
                            <div
                                style={{
                                    fontSize: '12px',
                                    fontWeight: 500,
                                    color: '#475569',
                                    fontFamily: 'monospace',
                                }}
                            >
                                {version}
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Action Button */}
            <button
                onClick={handleClick}
                style={{
                    width: '100%',
                    padding: '12px 16px',
                    background: nodeStyle.gradient,
                    border: `2px solid ${nodeStyle.border}`,
                    borderRadius: '10px',
                    color: '#fff',
                    fontSize: '13px',
                    fontWeight: 700,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    transition: 'all 0.2s ease',
                    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
                }}
                onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-2px)';
                    e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.15)';
                }}
                onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.1)';
                }}
            >
                <LinkOutlined style={{ fontSize: '14px' }} />
                <span>Go to Resource</span>
            </button>
        </div>
    );
};

export default PopoverContent;
