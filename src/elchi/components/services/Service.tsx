import React from 'react';
import { DeployLineIcon } from "@/assets/svg/icons";
import { OperationsSubType } from "@/common/types";
import { InfoCircleOutlined, PlayCircleOutlined, RedoOutlined, ReloadOutlined, StopOutlined } from "@ant-design/icons";
import { Button, Descriptions, Tag, Tooltip, Typography } from "antd";
import { ServiceStatus } from "./ServiceStatus";

const { Text } = Typography;

interface ServiceDetailsProps {
    service: any;
    statusData: any[] | null;
    statusLoading: boolean;
    statusError: any;
    onServiceAction: (type: string) => void;//eslint-disable-line
    onRefreshStatus: () => void;
    onDeployClick: () => void;
    actionLoading: boolean;
    serviceActionsDisabled: boolean;
}

export const ServiceDetails: React.FC<ServiceDetailsProps> = ({
    service,
    statusData,
    statusLoading,
    statusError,
    onServiceAction,
    onRefreshStatus,
    onDeployClick,
    actionLoading,
    serviceActionsDisabled
}) => (
    <>
        <ServiceActions
            onDeployClick={onDeployClick}
            onServiceAction={onServiceAction}
            onRefreshStatus={onRefreshStatus}
            actionLoading={actionLoading}
            serviceActionsDisabled={serviceActionsDisabled}
        />
        <Descriptions column={1} bordered size="middle" styles={{ label: { width: 180, minWidth: 180, maxWidth: 180 } }}>
            <Descriptions.Item label="Service ID">
                <Text copyable>{service?.id}</Text>
            </Descriptions.Item>
            <Descriptions.Item label="Admin Port">
                <span style={{ fontWeight: 600, fontSize: 12 }}>{service?.admin_port}</span>
            </Descriptions.Item>
            <Descriptions.Item label="Service Address(es)">
                {Array.isArray(service?.clients) && service?.clients.length > 0 ? (
                    <div style={{ display: 'flex', flexDirection: 'row', gap: 6 }}>
                        {service?.clients.map((c: any, idx: number) => (
                            <Tag className='auto-width-tag' key={c.client_id + idx} style={{ fontSize: 12 }}>
                                <span style={{ fontWeight: 600 }}>{c.downstream_address}</span>
                            </Tag>
                        ))}
                    </div>
                ) : (
                    <span style={{ color: '#bfbfbf' }}>Service not deployed</span>
                )}
            </Descriptions.Item>
            <Descriptions.Item label="Service Status">
                <ServiceStatus
                    statusData={statusData}
                    loading={statusLoading}
                    error={statusError}
                />
            </Descriptions.Item>
        </Descriptions>
    </>
);

export const ServiceActions: React.FC<{
    onDeployClick: () => void;
    onServiceAction: (subType: OperationsSubType) => void;//eslint-disable-line
    onRefreshStatus: () => void;
    actionLoading: boolean;
    serviceActionsDisabled: boolean;
}> = ({
    onDeployClick,
    onServiceAction,
    onRefreshStatus,
    actionLoading,
    serviceActionsDisabled
}) => (
        <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            marginBottom: 16, 
            marginTop: 8,
            gap: 16,
            padding: '12px 16px',
            background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
            borderRadius: 14,
            border: '1px solid rgba(226, 232, 240, 0.6)',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.04), inset 0 1px 0 rgba(255, 255, 255, 0.7)',
            position: 'relative'
        }}>
            <DeploymentButton onClick={onDeployClick} />
            <div style={{ flex: 1 }} />
            <ServiceActionButtons
                onAction={onServiceAction}
                onRefreshStatus={onRefreshStatus}
                loading={actionLoading}
                disabled={serviceActionsDisabled}
            />
        </div>
    );

const DeploymentButton: React.FC<{ onClick: () => void }> = ({ onClick }) => (
    <Tooltip title="Service Yönetimi" placement="bottom">
        <button
            onClick={onClick}
            style={{
                position: 'relative',
                width: 150,
                height: 42,
                background: 'linear-gradient(135deg, #1e40af 0%, #3b82f6 50%, #06b6d4 100%)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                borderRadius: 12,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                boxShadow: '0 8px 20px rgba(59, 130, 246, 0.3), 0 3px 10px rgba(0,0,0,0.1), inset 0 1px 0 rgba(255,255,255,0.15)',
                overflow: 'hidden',
                color: '#ffffff',
                padding: '0 16px',
                outline: 'none',
                gap: 8
            }}
            onMouseEnter={e => {
                e.currentTarget.style.transform = 'translateY(-2px) scale(1.03)';
                e.currentTarget.style.boxShadow = '0 12px 30px rgba(59, 130, 246, 0.4), 0 6px 20px rgba(0,0,0,0.15), inset 0 1px 0 rgba(255,255,255,0.2)';
                e.currentTarget.style.background = 'linear-gradient(135deg, #1e3a8a 0%, #2563eb 50%, #0891b2 100%)';
                
                const shimmer = e.currentTarget.querySelector('.shimmer') as HTMLElement;
                if (shimmer) {
                    shimmer.style.left = '100%';
                }
            }}
            onMouseLeave={e => {
                e.currentTarget.style.transform = 'translateY(0) scale(1)';
                e.currentTarget.style.boxShadow = '0 8px 20px rgba(59, 130, 246, 0.3), 0 3px 10px rgba(0,0,0,0.1), inset 0 1px 0 rgba(255,255,255,0.15)';
                e.currentTarget.style.background = 'linear-gradient(135deg, #1e40af 0%, #3b82f6 50%, #06b6d4 100%)';
                
                const shimmer = e.currentTarget.querySelector('.shimmer') as HTMLElement;
                if (shimmer) {
                    shimmer.style.left = '-100%';
                }
            }}
            onMouseDown={e => {
                e.currentTarget.style.transform = 'translateY(0) scale(0.98)';
            }}
            onMouseUp={e => {
                e.currentTarget.style.transform = 'translateY(-2px) scale(1.03)';
            }}
        >
            <div 
                className="shimmer"
                style={{
                    position: 'absolute',
                    top: 0,
                    left: '-100%',
                    width: '100%',
                    height: '100%',
                    background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)',
                    transition: 'left 0.6s ease-out',
                    borderRadius: 12
                }} 
            />
            <div style={{
                position: 'absolute',
                top: '1px',
                left: '1px',
                right: '1px',
                height: '40%',
                background: 'linear-gradient(180deg, rgba(255,255,255,0.1), transparent)',
                borderRadius: '11px 11px 0 0',
                pointerEvents: 'none'
            }} />
            <DeployLineIcon style={{ 
                fontSize: 20,
                width: 20,
                height: 20,
                color: '#ffffff',
                fill: '#ffffff',
                transform: 'scale(1.6)',
                filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.3)) brightness(1.1)',
                zIndex: 1
            }} />
            <span style={{ 
                fontSize: 12, 
                fontWeight: 600, 
                letterSpacing: '0.2px',
                textShadow: '0 1px 2px rgba(0,0,0,0.3)',
                zIndex: 1,
                whiteSpace: 'nowrap'
            }}>
                Manage Service
            </span>
        </button>
    </Tooltip>
);

const ServiceActionButtons: React.FC<{
    onAction: (subType: OperationsSubType) => void;//eslint-disable-line
    onRefreshStatus: () => void;
    loading: boolean;
    disabled: boolean;
}> = ({ onAction, onRefreshStatus, loading, disabled }) => (
    <div style={{
        display: 'flex',
        alignItems: 'center',
        background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
        padding: '8px',
        borderRadius: 20,
        border: '1px solid rgba(226, 232, 240, 0.8)',
        boxShadow: '0 4px 15px rgba(0,0,0,0.08), inset 0 1px 0 rgba(255,255,255,0.9)',
        gap: 6,
        backdropFilter: 'blur(10px)'
    }}>
        <div style={{
            display: 'flex',
            alignItems: 'center',
            padding: '0 16px',
            minWidth: 'fit-content'
        }}>
            <span style={{ 
                fontSize: 13, 
                fontWeight: 600, 
                color: '#4f46e5',
                letterSpacing: '0.5px',
                textShadow: '0 1px 2px rgba(0,0,0,0.1)'
            }}>
                Actions
            </span>
        </div>
        <div style={{
            display: 'flex',
            gap: 6,
            alignItems: 'center'
        }}>
            <Tooltip title="Start" placement="top">
                <button
                    onClick={() => onAction(OperationsSubType.SUB_START)}
                    disabled={disabled || loading}
                    style={{
                        width: 36,
                        height: 36,
                        borderRadius: 12,
                        background: disabled ? '#f1f5f9' : 'linear-gradient(135deg, #10b981, #059669)',
                        border: 'none',
                        color: disabled ? '#94a3b8' : '#ffffff',
                        cursor: disabled ? 'not-allowed' : 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: 16,
                        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                        boxShadow: disabled ? 'none' : '0 4px 12px rgba(16, 185, 129, 0.3)'
                    }}
                    onMouseEnter={e => {
                        if (!disabled && !loading) {
                            e.currentTarget.style.transform = 'translateY(-2px) scale(1.05)';
                            e.currentTarget.style.boxShadow = '0 6px 20px rgba(16, 185, 129, 0.4)';
                        }
                    }}
                    onMouseLeave={e => {
                        if (!disabled) {
                            e.currentTarget.style.transform = 'translateY(0) scale(1)';
                            e.currentTarget.style.boxShadow = '0 4px 12px rgba(16, 185, 129, 0.3)';
                        }
                    }}
                >
                    <PlayCircleOutlined />
                </button>
            </Tooltip>
            <Tooltip title="Stop" placement="top">
                <button
                    onClick={() => onAction(OperationsSubType.SUB_STOP)}
                    disabled={disabled || loading}
                    style={{
                        width: 36,
                        height: 36,
                        borderRadius: 12,
                        background: disabled ? '#f1f5f9' : 'linear-gradient(135deg, #ef4444, #dc2626)',
                        border: 'none',
                        color: disabled ? '#94a3b8' : '#ffffff',
                        cursor: disabled ? 'not-allowed' : 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: 16,
                        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                        boxShadow: disabled ? 'none' : '0 4px 12px rgba(239, 68, 68, 0.3)'
                    }}
                    onMouseEnter={e => {
                        if (!disabled && !loading) {
                            e.currentTarget.style.transform = 'translateY(-2px) scale(1.05)';
                            e.currentTarget.style.boxShadow = '0 6px 20px rgba(239, 68, 68, 0.4)';
                        }
                    }}
                    onMouseLeave={e => {
                        if (!disabled) {
                            e.currentTarget.style.transform = 'translateY(0) scale(1)';
                            e.currentTarget.style.boxShadow = '0 4px 12px rgba(239, 68, 68, 0.3)';
                        }
                    }}
                >
                    <StopOutlined />
                </button>
            </Tooltip>
            <Tooltip title="Restart" placement="top">
                <button
                    onClick={() => onAction(OperationsSubType.SUB_RESTART)}
                    disabled={disabled || loading}
                    style={{
                        width: 36,
                        height: 36,
                        borderRadius: 12,
                        background: disabled ? '#f1f5f9' : 'linear-gradient(135deg, #f59e0b, #d97706)',
                        border: 'none',
                        color: disabled ? '#94a3b8' : '#ffffff',
                        cursor: disabled ? 'not-allowed' : 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: 16,
                        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                        boxShadow: disabled ? 'none' : '0 4px 12px rgba(245, 158, 11, 0.3)'
                    }}
                    onMouseEnter={e => {
                        if (!disabled && !loading) {
                            e.currentTarget.style.transform = 'translateY(-2px) scale(1.05)';
                            e.currentTarget.style.boxShadow = '0 6px 20px rgba(245, 158, 11, 0.4)';
                        }
                    }}
                    onMouseLeave={e => {
                        if (!disabled) {
                            e.currentTarget.style.transform = 'translateY(0) scale(1)';
                            e.currentTarget.style.boxShadow = '0 4px 12px rgba(245, 158, 11, 0.3)';
                        }
                    }}
                >
                    <RedoOutlined />
                </button>
            </Tooltip>
            <Tooltip title="Reload" placement="top">
                <button
                    onClick={() => onAction(OperationsSubType.SUB_RELOAD)}
                    disabled={disabled || loading}
                    style={{
                        width: 36,
                        height: 36,
                        borderRadius: 12,
                        background: disabled ? '#f1f5f9' : 'linear-gradient(135deg, #3b82f6, #2563eb)',
                        border: 'none',
                        color: disabled ? '#94a3b8' : '#ffffff',
                        cursor: disabled ? 'not-allowed' : 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: 16,
                        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                        boxShadow: disabled ? 'none' : '0 4px 12px rgba(59, 130, 246, 0.3)'
                    }}
                    onMouseEnter={e => {
                        if (!disabled && !loading) {
                            e.currentTarget.style.transform = 'translateY(-2px) scale(1.05)';
                            e.currentTarget.style.boxShadow = '0 6px 20px rgba(59, 130, 246, 0.4)';
                        }
                    }}
                    onMouseLeave={e => {
                        if (!disabled) {
                            e.currentTarget.style.transform = 'translateY(0) scale(1)';
                            e.currentTarget.style.boxShadow = '0 4px 12px rgba(59, 130, 246, 0.3)';
                        }
                    }}
                >
                    <ReloadOutlined />
                </button>
            </Tooltip>
            <Tooltip title="Status" placement="top">
                <button
                    onClick={onRefreshStatus}
                    disabled={disabled}
                    style={{
                        width: 36,
                        height: 36,
                        borderRadius: 12,
                        background: disabled ? '#f1f5f9' : 'linear-gradient(135deg, #6366f1, #4f46e5)',
                        border: 'none',
                        color: disabled ? '#94a3b8' : '#ffffff',
                        cursor: disabled ? 'not-allowed' : 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: 16,
                        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                        boxShadow: disabled ? 'none' : '0 4px 12px rgba(99, 102, 241, 0.3)'
                    }}
                    onMouseEnter={e => {
                        if (!disabled) {
                            e.currentTarget.style.transform = 'translateY(-2px) scale(1.05)';
                            e.currentTarget.style.boxShadow = '0 6px 20px rgba(99, 102, 241, 0.4)';
                        }
                    }}
                    onMouseLeave={e => {
                        if (!disabled) {
                            e.currentTarget.style.transform = 'translateY(0) scale(1)';
                            e.currentTarget.style.boxShadow = '0 4px 12px rgba(99, 102, 241, 0.3)';
                        }
                    }}
                >
                    <InfoCircleOutlined />
                </button>
            </Tooltip>
        </div>
    </div>
);

 