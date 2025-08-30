import React, { useState, useCallback, useEffect } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { Card, Typography, Spin, Alert, Tabs, Drawer, Tag, Space, Button, Tooltip, Collapse } from 'antd';
import { useCustomGetQuery } from '@/common/api';
import { useProjectVariable } from '@/hooks/useProjectVariable';
import { InfoCircleOutlined, FileTextOutlined, ClusterOutlined, CloseOutlined, WarningOutlined } from '@ant-design/icons';
import { useServiceStatus, useServiceAction } from '@/hooks/useServiceActions';
import { OperationsSubType, OperationsType } from '@/common/types';
import EnvoysCard from '@/elchi/components/services/EnvoysCard';
import { DeployServiceDialog } from '@/elchi/components/clients/deploy/DeployServiceDialog';
import { renderStatusBadge } from './helpers';
import { ServiceDetails } from '@/elchi/components/services/Service';
import ClusterDetails from '@/elchi/components/services/ClusterDetails';

const { Title } = Typography;

interface ServiceState {
    isDeployDialogOpen: boolean;
    actionStatusData: any[] | null;
    needsRefresh: boolean;
    isErrorDrawerOpen: boolean;
}

const Service: React.FC = () => {
    const { service_id } = useParams();
    const { project } = useProjectVariable();
    const [searchParams] = useSearchParams();
    const urlVersion = searchParams.get('version');

    const [state, setState] = useState<ServiceState>({
        isDeployDialogOpen: false,
        actionStatusData: null,
        needsRefresh: false,
        isErrorDrawerOpen: false
    });

    const { isLoading, data: serviceData, error: serviceError, refetch: refetchService } = useCustomGetQuery({
        queryKey: `service_detail_${service_id}_${urlVersion || 'default'}`,
        enabled: !!service_id,
        path: `api/op/services/${service_id}?project=${project}${urlVersion ? `&version=${urlVersion}` : ''}`,
        directApi: true
    });

    const { statusData, loading: statusLoading, error: statusError, refresh: refreshStatus } = useServiceStatus({
        name: serviceData?.service?.name,
        project,
        enabled: !!serviceData?.service?.name,
        version: urlVersion || serviceData?.service?.version
    });

    const { callAction, actionLoading } = useServiceAction({
        name: serviceData?.service?.name,
        project,
        version: urlVersion || serviceData?.service?.version
    });

    useEffect(() => {
        if (state.needsRefresh) {
            const handleRefresh = async () => {
                await refreshStatus();
                await refetchService();
                setState(prev => ({ ...prev, needsRefresh: false }));
            };
            handleRefresh();
        }
    }, [state.needsRefresh, refreshStatus, refetchService]);

    const handleServiceAction = useCallback(async (subType: OperationsSubType) => {
        if (actionLoading) return;

        const result = await callAction(subType);
        if (result) {
            setState(prev => ({
                ...prev,
                actionStatusData: result
            }));
            await refreshStatus();
            await refetchService();
        }
    }, [callAction, actionLoading, refreshStatus, refetchService]);

    const handleRefreshStatus = useCallback(async () => {
        if (actionLoading) return;

        // Reset actionStatusData so we can see the new status
        setState(prev => ({
            ...prev,
            actionStatusData: null
        }));

        await refreshStatus();
    }, [refreshStatus, actionLoading]);

    const handleDeploymentClick = useCallback(() => {
        setState(prev => ({ ...prev, isDeployDialogOpen: true }));
    }, []);

    const handleDeploymentClose = useCallback(() => {
        setState(prev => ({ ...prev, isDeployDialogOpen: false }));
    }, []);

    const handleDeploymentSuccess = useCallback(async () => {
        setState(prev => ({
            ...prev,
            isDeployDialogOpen: false
        }));

        await refreshStatus();
        await refetchService();
    }, [refreshStatus, refetchService]);

    const statusToShow = state.actionStatusData || statusData;
    const enhancedErrors = serviceData?.envoys?.enhanced_errors || [];
    
    const handleErrorIconClick = () => {
        setState(prev => ({ ...prev, isErrorDrawerOpen: true }));
    };
    
    const handleErrorDrawerClose = () => {
        setState(prev => ({ ...prev, isErrorDrawerOpen: false }));
    };
    
    const statusBadge = (
        <div 
            style={{ display: 'flex', alignItems: 'center', cursor: enhancedErrors.length > 0 ? 'pointer' : 'default' }}
            onClick={enhancedErrors.length > 0 ? handleErrorIconClick : undefined}
        >
            {renderStatusBadge(serviceData?.service?.clients, statusToShow, enhancedErrors)}
        </div>
    );

    if (isLoading) {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 300 }}>
                <Spin size="large" />
            </div>
        );
    }

    if (serviceError || !serviceData) {
        return (
            <Alert
                type="error"
                message="Service not found or error occurred."
                showIcon
                style={{ margin: 32 }}
            />
        );
    }

    const serviceActionsDisabled = !Array.isArray(serviceData?.service?.clients) ||
        serviceData?.service?.clients.length === 0;

    // Check if service is deployed (has clients)
    const isServiceDeployed = Array.isArray(serviceData?.service?.clients) && 
        serviceData?.service?.clients.length > 0;

    return (
        <div style={{ width: '100%', margin: '3px auto', padding: 0 }}>
            <Card style={{ borderRadius: 14, boxShadow: '0 2px 8px rgba(24,144,255,0.10)' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 0 }}>
                        <span style={{ display: 'flex', alignItems: 'center' }}>
                            <svg fill="#056ccd" viewBox="-3.6 -3.6 31.20 31.20" xmlns="http://www.w3.org/2000/svg" width="32" height="32" style={{ marginRight: 6 }}>
                                <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
                                <g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g>
                                <g id="SVGRepo_iconCarrier">
                                    <g id="service-start">
                                        <g>
                                            <path d="M6,4.5c0.1,0,0,6,0,6l5-3L6,4.5z"></path>
                                        </g>
                                        <g>
                                            <path d="M9.7,23c-3.6,0-6.5-2.9-6.5-6.5c0-1.2,0.3-2.4,1-3.4C2.3,12,1,9.8,1,7.5C1,3.9,3.9,1,7.5,1c2.3,0,4.3,1.2,5.5,3 c1-0.7,2.2-1,3.5-1C20.1,3,23,5.9,23,9.5S20.1,16,16.5,16c-0.1,0-0.2,0-0.3,0c0,0.2,0,0.4,0,0.6C16.2,20.2,13.3,23,9.7,23z M6.1,13.8c-0.6,0.8-0.9,1.7-0.9,2.7c0,2.5,2,4.5,4.5,4.5s4.5-1.9,4.5-4.4c0-0.3,0-0.5,0-0.7L14,15.3c0-0.1,0-0.1-0.1-0.2V15 c-0.4-1.2-1.1-2-2.3-2.5C10.5,13.5,9,14,7.5,14C7,14,6.5,13.9,6.1,13.8z M15.6,13.9c0.3,0.1,0.6,0.1,0.9,0.1C19,14,21,12,21,9.5 S19,5,16.5,5c-1,0-1.9,0.3-2.7,0.9c0.1,0.5,0.2,1,0.2,1.6c0,1.3-0.4,2.5-1,3.5C14.2,11.6,15.1,12.6,15.6,13.9z M7.5,3 C5,3,3,5,3,7.5c0,1.9,1.2,3.6,3,4.3c1.5,0.6,3.4,0.1,4.6-1l0,0c0.8-0.8,1.3-2,1.3-3.2c0-0.6-0.1-1.1-0.3-1.6l0,0 C11.1,4.2,9.4,3,7.5,3z"></path>
                                        </g>
                                    </g>
                                </g>
                            </svg>
                        </span>
                        <Title level={4} style={{ margin: 0 }}>{serviceData?.service?.name}</Title>
                    </div>
                    {statusBadge}
                </div>
                <Tabs
                    defaultActiveKey="service"
                    destroyOnHidden
                    tabBarStyle={{
                        marginBottom: 24
                    }}
                    items={[
                        {
                            key: 'service',
                            label: (
                                <span className="tabLabel">
                                    <InfoCircleOutlined style={{ fontSize: 17 }} />
                                    Overview
                                </span>
                            ),
                            children: (
                                <>
                                    <ServiceDetails
                                        service={serviceData?.service}
                                        statusData={statusToShow}
                                        statusLoading={statusLoading}
                                        statusError={statusError}
                                        onDeployClick={handleDeploymentClick}
                                        onServiceAction={handleServiceAction}
                                        onRefreshStatus={handleRefreshStatus}
                                        actionLoading={actionLoading}
                                        serviceActionsDisabled={serviceActionsDisabled}
                                    />
                                </>
                            )
                        },
                        {
                            key: 'clusters',
                            label: (
                                <span className="tabLabel">
                                    <ClusterOutlined style={{ fontSize: 17 }} />
                                    Clusters
                                </span>
                            ),
                            disabled: !isServiceDeployed,
                            children: (
                                <ClusterDetails
                                    name={serviceData?.service?.name}
                                    project={project}
                                    version={urlVersion || serviceData?.service?.version}
                                />
                            )
                        },
                        {
                            key: 'envoy',
                            label: (
                                <span className="tabLabel">
                                    <FileTextOutlined style={{ fontSize: 17 }} />
                                    Envoy
                                </span>
                            ),
                            disabled: !isServiceDeployed,
                            children: (
                                <EnvoysCard
                                    envoys={serviceData?.envoys}
                                    name={serviceData?.service?.name}
                                    project={project}
                                    version={urlVersion || serviceData?.service?.version}
                                />
                            )
                        }
                    ]} />
            </Card>
            <DeployServiceDialog
                open={state.isDeployDialogOpen}
                onClose={handleDeploymentClose}
                serviceName={serviceData?.service?.name}
                project={project}
                action={OperationsType.DEPLOY}
                existingClients={serviceData?.service?.clients || []}
                onSuccess={handleDeploymentSuccess}
                version={urlVersion || serviceData?.service?.version}
            />
            
            <Drawer
                title={
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <WarningOutlined style={{ color: '#ff4d4f' }} />
                        <span>Configuration Errors</span>
                        <Tag color="error">{enhancedErrors.length}</Tag>
                    </div>
                }
                placement="right"
                width={720}
                onClose={handleErrorDrawerClose}
                open={state.isErrorDrawerOpen}
                extra={
                    <Button
                        type="text"
                        icon={<CloseOutlined />}
                        onClick={handleErrorDrawerClose}
                    />
                }
            >
                <div style={{ padding: '0 4px' }}>
                    {enhancedErrors.length > 0 ? (() => {
                        const activeErrors = enhancedErrors.filter((error: any) => error.status === 'active');
                        const resolvedErrors = enhancedErrors.filter((error: any) => error.status === 'resolved');
                        
                        const renderErrorCard = (error: any, index: number) => {
                            const isResolved = error.status === 'resolved';
                            const borderColor = isResolved ? '#52c41a' : (error.severity === 'critical' ? '#ff4d4f' : '#faad14');
                            const tagColor = isResolved ? 'success' : (error.severity === 'critical' ? 'error' : 'warning');
                            const textColor = isResolved ? '#52c41a' : (error.severity === 'critical' ? '#cf1322' : '#d46b08');
                            const statusTagColor = isResolved ? 'success' : 'processing';
                            
                            return (
                                <div
                                    key={error.id || index}
                                    style={{
                                        background: '#fff',
                                        border: `1px solid ${borderColor}`,
                                        borderRadius: 8,
                                        padding: 16,
                                        boxShadow: '0 2px 8px rgba(0,0,0,0.06)'
                                    }}
                                >
                                    <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 8 }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                            <Tag color={tagColor} style={{ margin: 0 }}>
                                                {error.severity?.toUpperCase()}
                                            </Tag>
                                            <Typography.Text strong style={{ color: textColor, fontSize: 14 }}>
                                                {error.userFriendlyMessage}
                                            </Typography.Text>
                                        </div>
                                        <Tag color={statusTagColor} style={{ margin: 0 }}>{error.status}</Tag>
                                    </div>
                                    
                                    <div style={{ marginBottom: 12, padding: '8px 12px', background: '#fafafa', borderRadius: 6 }}>
                                        <Typography.Text style={{ fontSize: 12, color: '#666', fontFamily: 'monospace' }}>
                                            {error.message}
                                        </Typography.Text>
                                    </div>
                                    
                                    <div style={{
                                        marginBottom: 12,
                                        padding: 12,
                                        background: 'linear-gradient(135deg, #fafafa 0%, #f5f5f5 100%)',
                                        border: '1px solid #e8e8e8',
                                        borderRadius: 8,
                                        fontSize: 12,
                                        boxShadow: '0 2px 4px rgba(0,0,0,0.02)'
                                    }}>
                                        <div style={{ display: 'flex', alignItems: 'center', marginBottom: 8 }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                                <span style={{ color: '#1890ff', fontWeight: 600, fontSize: 13 }}>{error.resourceName}</span>
                                                <div style={{ background: '#ff4d4f', color: 'white', padding: '2px 6px', borderRadius: 10, fontSize: 10, fontWeight: 600 }}>
                                                    {error.occurrenceCount}
                                                </div>
                                            </div>
                                        </div>
                                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, fontSize: 11 }}>
                                            <div>
                                                <div style={{ color: '#999', fontSize: 9, textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 2 }}>Type</div>
                                                <Tooltip title={error.resourceType}>
                                                    <div style={{ color: '#595959', fontWeight: 500, cursor: 'help', fontFamily: 'monospace', lineHeight: 1.3 }}>
                                                        {error.resourceType?.substring(0, 30)}
                                                        {error.resourceType?.length > 30 && '...'}
                                                    </div>
                                                </Tooltip>
                                            </div>
                                            <div>
                                                <div style={{ color: '#999', fontSize: 9, textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 2 }}>First Seen</div>
                                                <div style={{ color: '#52c41a', fontWeight: 600, lineHeight: 1.3 }}>
                                                    {new Date(error.firstOccurred).toLocaleString()}
                                                </div>
                                            </div>
                                            <div>
                                                <div style={{ color: '#999', fontSize: 9, textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 2 }}>Node ID</div>
                                                <Tooltip title={error.nodeId}>
                                                    <div style={{ color: '#595959', fontWeight: 500, cursor: 'help', fontFamily: 'monospace', lineHeight: 1.3 }}>
                                                        {error.nodeId?.substring(0, 30)}
                                                        {error.nodeId?.length > 30 && '...'}
                                                    </div>
                                                </Tooltip>
                                            </div>
                                            <div>
                                                <div style={{ color: '#999', fontSize: 9, textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 2 }}>Last Seen</div>
                                                <div style={{ color: '#722ed1', fontWeight: 600, lineHeight: 1.3 }}>
                                                    {new Date(error.lastOccurred).toLocaleString()}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    
                                    {error.suggestedFix && (
                                        <div style={{
                                            background: '#f6ffed',
                                            border: '1px solid #b7eb8f',
                                            borderRadius: 6,
                                            padding: 8,
                                            marginTop: 8
                                        }}>
                                            <Typography.Text style={{ fontSize: 11, color: '#389e0d' }}>
                                                💡 {error.suggestedFix}
                                            </Typography.Text>
                                        </div>
                                    )}
                                </div>
                            );
                        };

                        return (
                            <>
                                {activeErrors.length > 0 && (
                                    <Collapse 
                                        defaultActiveKey={['active']}
                                        ghost
                                        items={[{
                                            key: 'active',
                                            label: (
                                                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                                    <WarningOutlined style={{ color: '#ff4d4f' }} />
                                                    <span style={{ fontWeight: 600, color: '#ff4d4f' }}>
                                                        Active Errors ({activeErrors.length})
                                                    </span>
                                                </div>
                                            ),
                                            children: (
                                                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                                                    {activeErrors.map(renderErrorCard)}
                                                </div>
                                            )
                                        }]}
                                    />
                                )}
                                
                                {resolvedErrors.length > 0 && (
                                    <Collapse 
                                        ghost
                                        items={[{
                                            key: 'resolved',
                                            label: (
                                                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                                    <InfoCircleOutlined style={{ color: '#52c41a' }} />
                                                    <span style={{ fontWeight: 600, color: '#52c41a' }}>
                                                        Resolved Errors ({resolvedErrors.length})
                                                    </span>
                                                </div>
                                            ),
                                            children: (
                                                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                                                    {resolvedErrors.map(renderErrorCard)}
                                                </div>
                                            )
                                        }]}
                                    />
                                )}
                            </>
                        );
                    })() : (
                        <Alert
                            message="No configuration errors"
                            description="All configurations are valid and no errors detected."
                            type="success"
                            showIcon
                        />
                    )}
                </div>
            </Drawer>
        </div>
    );
};

export default Service;
