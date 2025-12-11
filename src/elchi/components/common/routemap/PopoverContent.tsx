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
    ReloadOutlined,
    ThunderboltOutlined,
    ThunderboltFilled,
    InfoCircleOutlined,
    TagOutlined,
    SafetyCertificateOutlined,
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
    originalCategory,
    gtype,
    link,
    id,
    version,
    type,
    source,
    resource_id,
    properties,
}) => {
    const handleClick = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        const params = new URLSearchParams();
        params.set('resource_id', resource_id || id);
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
        ReloadOutlined: <ReloadOutlined />,
        ThunderboltOutlined: <ThunderboltOutlined />,
        ThunderboltFilled: <ThunderboltFilled />,
        SafetyCertificateOutlined: <SafetyCertificateOutlined />,
    };

    const IconComponent = iconMap[iconName] || iconMap['QuestionCircleOutlined'];

    // Check if we should show the "Go to Resource" button
    // Only show for nodes that have a valid resource (source and resource_id)
    const showResourceButton = link && source && resource_id;

    // Helper to render property values
    const renderPropertyValue = (value: any): string => {
        if (value === null || value === undefined) return 'N/A';
        if (typeof value === 'object') {
            if (Array.isArray(value)) {
                return value.length > 0 ? value.join(', ') : 'Empty';
            }
            return JSON.stringify(value, null, 2);
        }
        return String(value);
    };

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
                maxWidth: '420px',
                minWidth: '320px',
                maxHeight: '80vh',
                overflowY: 'auto',
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
                            wordBreak: 'break-word',
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
                        {type || category}
                    </div>
                </div>
            </div>

            {/* Details Section */}
            <div style={{ marginBottom: '16px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {/* Category */}
                {originalCategory && (
                    <div
                        style={{
                            padding: '10px 12px',
                            background: 'rgba(241, 245, 249, 0.6)',
                            borderRadius: '8px',
                        }}
                    >
                        <div
                            style={{
                                fontSize: '10px',
                                fontWeight: 600,
                                color: '#94a3b8',
                                textTransform: 'uppercase',
                                letterSpacing: '0.5px',
                                marginBottom: '4px',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '4px',
                            }}
                        >
                            <TagOutlined style={{ fontSize: '10px' }} />
                            Category
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
                        >
                            {originalCategory}
                        </div>
                    </div>
                )}

                {/* Description from properties */}
                {properties?.description && (
                    <div
                        style={{
                            padding: '10px 12px',
                            background: 'rgba(241, 245, 249, 0.6)',
                            borderRadius: '8px',
                        }}
                    >
                        <div
                            style={{
                                fontSize: '10px',
                                fontWeight: 600,
                                color: '#94a3b8',
                                textTransform: 'uppercase',
                                letterSpacing: '0.5px',
                                marginBottom: '4px',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '4px',
                            }}
                        >
                            <InfoCircleOutlined style={{ fontSize: '10px' }} />
                            Description
                        </div>
                        <div
                            style={{
                                fontSize: '11px',
                                fontWeight: 500,
                                color: '#475569',
                                lineHeight: '1.5',
                            }}
                        >
                            {properties.description}
                        </div>
                    </div>
                )}

                {/* Source */}
                {source && (
                    <div
                        style={{
                            padding: '10px 12px',
                            background: 'rgba(241, 245, 249, 0.6)',
                            borderRadius: '8px',
                        }}
                    >
                        <div
                            style={{
                                fontSize: '10px',
                                fontWeight: 600,
                                color: '#94a3b8',
                                textTransform: 'uppercase',
                                letterSpacing: '0.5px',
                                marginBottom: '4px',
                            }}
                        >
                            Source
                        </div>
                        <div
                            style={{
                                fontSize: '11px',
                                fontWeight: 600,
                                color: nodeStyle.border,
                                fontFamily: 'monospace',
                            }}
                        >
                            {source}
                        </div>
                    </div>
                )}

                {/* Additional Properties */}
                {(() => {
                    // Filter out description (already shown above) and check if there are other properties
                    const otherProperties = properties
                        ? Object.entries(properties).filter(([key]) => key !== 'description')
                        : [];

                    // Only show properties section if there are properties other than description
                    if (otherProperties.length === 0) return null;

                    return (
                        <div
                            style={{
                                padding: '10px 12px',
                                background: 'rgba(241, 245, 249, 0.6)',
                                borderRadius: '8px',
                            }}
                        >
                            <div
                                style={{
                                    fontSize: '10px',
                                    fontWeight: 600,
                                    color: '#94a3b8',
                                    textTransform: 'uppercase',
                                    letterSpacing: '0.5px',
                                    marginBottom: '8px',
                                }}
                            >
                                Properties
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                                {otherProperties
                                    .slice(0, 5) // Limit to 5 properties
                                    .map(([key, value]) => (
                                        <div
                                            key={key}
                                            style={{
                                                display: 'flex',
                                                flexDirection: 'column',
                                                gap: '2px',
                                            }}
                                        >
                                            <div
                                                style={{
                                                    fontSize: '9px',
                                                    fontWeight: 600,
                                                    color: '#64748b',
                                                    textTransform: 'capitalize',
                                                }}
                                            >
                                                {key.replace(/_/g, ' ')}
                                            </div>
                                            <div
                                                style={{
                                                    fontSize: '10px',
                                                    fontWeight: 500,
                                                    color: '#475569',
                                                    fontFamily: 'monospace',
                                                    wordBreak: 'break-all',
                                                    lineHeight: '1.3',
                                                    maxHeight: '60px',
                                                    overflow: 'auto',
                                                }}
                                            >
                                                {renderPropertyValue(value)}
                                            </div>
                                        </div>
                                    ))}
                            </div>
                        </div>
                    );
                })()}

                {/* Version (if available) */}
                {version && (
                    <div
                        style={{
                            padding: '10px 12px',
                            background: 'rgba(241, 245, 249, 0.6)',
                            borderRadius: '8px',
                        }}
                    >
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
                                fontSize: '11px',
                                fontWeight: 500,
                                color: '#475569',
                                fontFamily: 'monospace',
                            }}
                        >
                            {version}
                        </div>
                    </div>
                )}
            </div>

            {/* Action Button - Only show for valid resources with source */}
            {showResourceButton && (
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
            )}
        </div>
    );
};

export default PopoverContent;
