import React, { useState, useCallback, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Card, Typography, Spin, Alert, Tabs } from 'antd';
import { useCustomGetQuery } from '@/common/api';
import { useProjectVariable } from '@/hooks/useProjectVariable';
import { InfoCircleOutlined, FileTextOutlined, ClusterOutlined } from '@ant-design/icons';
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
}

const Service: React.FC = () => {
    const { service_id } = useParams();
    const { project } = useProjectVariable();

    const [state, setState] = useState<ServiceState>({
        isDeployDialogOpen: false,
        actionStatusData: null,
        needsRefresh: false
    });

    const { isLoading, data: serviceData, error: serviceError, refetch: refetchService } = useCustomGetQuery({
        queryKey: `service_detail_${service_id}`,
        enabled: !!service_id,
        path: `api/op/services/${service_id}?project=${project}`,
        directApi: true
    });

    const { statusData, loading: statusLoading, error: statusError, refresh: refreshStatus } = useServiceStatus({
        name: serviceData?.service?.name,
        project,
        enabled: !!serviceData?.service?.name
    });

    const { callAction, actionLoading } = useServiceAction({
        name: serviceData?.service?.name,
        project
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
        }
    }, [callAction, actionLoading, refreshStatus]);

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
    const statusBadge = renderStatusBadge(serviceData?.service?.clients, statusToShow);

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
                            children: (
                                <ClusterDetails
                                    name={serviceData?.service?.name}
                                    project={project}
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
                            children: (
                                <EnvoysCard
                                    envoys={serviceData?.envoys}
                                    name={serviceData?.service?.name}
                                    project={project}
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
            />
        </div>
    );
};

export default Service;
