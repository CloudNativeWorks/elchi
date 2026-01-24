/**
 * GSLB Detail Page
 * Create and edit GSLB records
 */

import React, { useState, useEffect } from 'react';
import { Form, Spin, App } from 'antd';
import { useParams, useNavigate } from 'react-router-dom';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import { useProjectVariable } from '@/hooks/useProjectVariable';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { gslbApi } from './gslbApi';
import { GSLBIPAddress, GSLBProbe, CreateGSLBRequest, UpdateGSLBRequest } from './types';
import { DEFAULT_VERSION } from './constants';
import GslbHeader from './components/GslbHeader';
import BasicInfoForm from './components/BasicInfoForm';
import IPAddressList from './components/IPAddressList';
import ProbeConfig from './components/ProbeConfig';

const GslbDetail: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { project } = useProjectVariable();
    const queryClient = useQueryClient();
    const [form] = Form.useForm();
    const { modal, message } = App.useApp();

    const [ips, setIps] = useState<GSLBIPAddress[]>([]);

    const isCreateMode = !id;
    const isEditMode = !!id;

    // Fetch failover zones
    const { data: failoverZonesData } = useQuery({
        queryKey: ['gslb-failover-zones', project],
        queryFn: () => gslbApi.getFailoverZones(project),
        enabled: !!project,
        refetchOnWindowFocus: false,
    });

    // Fetch existing record (edit mode)
    const { data: record, isLoading: isLoadingRecord, refetch: refetchRecord, isFetching } = useQuery({
        queryKey: ['gslb-record', id, project],
        queryFn: () => gslbApi.getGslbRecord(id!, project),
        enabled: isEditMode && !!id && !!project,
        refetchOnWindowFocus: false,
        refetchOnMount: false,
        refetchOnReconnect: false,
    });

    // Fetch IPs separately (edit mode)
    const { data: recordIps, isLoading: isLoadingIps, refetch: refetchIps, isFetching: isFetchingIps } = useQuery({
        queryKey: ['gslb-record-ips', id],
        queryFn: () => gslbApi.getRecordIps(id!),
        enabled: isEditMode && !!id,
        refetchOnWindowFocus: false,
        refetchOnMount: false,
        refetchOnReconnect: false,
    });

    // Get zone from record and failover zones
    const zone = record?.zone;
    const failoverZones = failoverZonesData?.failover_zones || [];

    // Track if form is mounted
    const [isFormMounted, setIsFormMounted] = useState(false);

    // Set form mounted state after initial render (when not loading)
    useEffect(() => {
        if (!isLoadingRecord && !isLoadingIps) {
            // Use requestAnimationFrame to ensure Form is rendered
            const rafId = requestAnimationFrame(() => {
                setIsFormMounted(true);
            });
            return () => cancelAnimationFrame(rafId);
        }
    }, [isLoadingRecord, isLoadingIps]);

    // Populate form in edit mode
    useEffect(() => {
        if (record && isEditMode && isFormMounted) {
            form.setFieldsValue({
                fqdn: record.fqdn,
                ttl: record.ttl,
                enabled: record.enabled,
                failover_zone: record.failover_zone,
                probe_type: record.probe?.type,
                probe_port: record.probe?.port,
                probe_path: record.probe?.path,
                probe_host_header: record.probe?.host_header,
                probe_interval: record.probe?.interval,
                probe_timeout: record.probe?.timeout,
                probe_enabled: record.probe?.enabled !== undefined ? record.probe.enabled : true,
                probe_warning_threshold: record.probe?.warning_threshold,
                probe_critical_threshold: record.probe?.critical_threshold,
                probe_passing_threshold: record.probe?.passing_threshold,
                probe_expected_status_codes: record.probe?.expected_status_codes,
                probe_follow_redirects: record.probe?.follow_redirects,
                probe_skip_ssl_verify: record.probe?.skip_ssl_verify,
            });
        }
    }, [record, isEditMode, isFormMounted, form]);

    // Set defaults for create mode
    useEffect(() => {
        if (isCreateMode && isFormMounted) {
            form.setFieldsValue({
                enabled: true,
                ttl: 60,
                // Set first failover zone as default in create mode
                failover_zone: failoverZones.length > 0 ? failoverZones[0] : undefined,
            });
        }
    }, [isCreateMode, failoverZones, isFormMounted, form]);

    // Update IPs from separate query
    useEffect(() => {
        if (recordIps && isEditMode) {
            setIps(recordIps);
        }
    }, [recordIps, isEditMode]);

    // Create mutation
    const createMutation = useMutation({
        mutationFn: async (data: CreateGSLBRequest) => {
            return await gslbApi.createGslbRecord(data);
        },
        onSuccess: (response) => {
            queryClient.invalidateQueries({ queryKey: ['gslb-records'] });
            // Navigate to the created record if available
            if (response.id) {
                navigate(`/gslb/${response.id}`);
            } else {
                navigate('/gslb');
            }
        },
        onError: (error: any) => {
            console.error('Create failed:', error);
        }
    });

    // Update mutation
    const updateMutation = useMutation({
        mutationFn: async (data: UpdateGSLBRequest) => {
            return await gslbApi.updateGslbRecord(id!, data);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['gslb-records'] });
            queryClient.invalidateQueries({ queryKey: ['gslb-record', id] });
        },
        onError: (error: any) => {
            console.error('Update failed:', error);
        }
    });

    // Delete mutation
    const deleteMutation = useMutation({
        mutationFn: async () => {
            return await gslbApi.deleteGslbRecord(id!, project);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['gslb-records'] });
            navigate('/gslb');
        },
        onError: (error: any) => {
            console.error('Delete failed:', error);
        }
    });

    const handleSave = async () => {
        try {
            // Validate form
            await form.validateFields();

            // Validate IPs
            if (ips.length === 0) {
                message.error('At least one IP address is required');
                return;
            }

            const values = form.getFieldsValue();

            // Build probe object if enabled
            let probe: GSLBProbe | null = null;
            if (values.probe_type) {
                probe = {
                    type: values.probe_type,
                    port: values.probe_port,
                    path: values.probe_path,
                    host_header: values.probe_host_header,
                    interval: values.probe_interval,
                    timeout: values.probe_timeout,
                    enabled: values.probe_enabled !== undefined ? values.probe_enabled : true,
                    warning_threshold: values.probe_warning_threshold,
                    critical_threshold: values.probe_critical_threshold,
                    passing_threshold: values.probe_passing_threshold,
                    expected_status_codes: values.probe_expected_status_codes,
                    follow_redirects: values.probe_follow_redirects,
                    skip_ssl_verify: values.probe_skip_ssl_verify,
                };
            }

            if (isCreateMode) {
                const createData: CreateGSLBRequest = {
                    fqdn: values.fqdn,
                    project,
                    version: DEFAULT_VERSION,
                    enabled: values.enabled,
                    ttl: values.ttl,
                    failover_zone: values.failover_zone,
                    probe,
                };

                // Create record first, then add IPs sequentially
                const response = await createMutation.mutateAsync(createData);

                // Backend returns the record directly (not wrapped in records array)
                const recordId = response.id;

                // Add IPs one by one after record creation
                if (recordId && ips.length > 0) {
                    for (const ip of ips) {
                        try {
                            await gslbApi.addIpToRecord(recordId, {
                                ip: ip.ip,
                            });
                        } catch (error) {
                            console.error(`Failed to add IP ${ip.ip}:`, error);
                            // Continue adding other IPs even if one fails
                        }
                    }
                }
            } else {
                const updateData: UpdateGSLBRequest = {
                    enabled: values.enabled,
                    ttl: values.ttl,
                    failover_zone: values.failover_zone,
                    probe,
                };
                // Note: ips not included - managed via separate endpoints
                // POST /api/v3/gslb/:id/ips and DELETE /api/v3/gslb/:id/ips/:ip

                await updateMutation.mutateAsync(updateData);
            }
        } catch (error) {
            console.error('Validation failed:', error);
        }
    };

    const handleDelete = () => {
        modal.confirm({
            title: 'Delete GSLB Record',
            icon: <ExclamationCircleOutlined />,
            content: `Are you sure you want to delete "${record?.fqdn}"? This action cannot be undone.`,
            okText: 'Delete',
            okType: 'danger',
            cancelText: 'Cancel',
            onOk() {
                deleteMutation.mutate();
            },
        });
    };

    const isAutoCreated = record?.service_id && record.service_id !== '';
    const isSaving = createMutation.isPending || updateMutation.isPending;

    const handleRefresh = () => {
        refetchRecord();
        refetchIps();
    };

    if (isLoadingRecord || isLoadingIps) {
        return (
            <div style={{ textAlign: 'center', padding: 100 }}>
                <Spin size="large" />
                <p style={{ marginTop: 16, color: 'var(--text-secondary)' }}>Loading GSLB record...</p>
            </div>
        );
    }

    return (
        <>
            <GslbHeader
                title={isCreateMode ? 'Create New GSLB Record' : record?.fqdn || 'Edit GSLB Record'}
                isCreateMode={isCreateMode}
                isSaving={isSaving}
                isAutoCreated={!!isAutoCreated}
                onSave={handleSave}
                onDelete={isEditMode && !isAutoCreated ? handleDelete : undefined}
                onRefresh={isEditMode ? handleRefresh : undefined}
                isRefreshing={isFetching || isFetchingIps}
            />

            <Form form={form} layout="vertical" size="large">
                <BasicInfoForm
                    isEditMode={isEditMode}
                    zone={zone || undefined}
                    disabled={!!isAutoCreated}
                    failoverZones={failoverZones}
                />

                <IPAddressList
                    ips={ips}
                    onChange={setIps}
                    recordId={id}
                    isEditMode={isEditMode}
                    onRefresh={handleRefresh}
                />

                <ProbeConfig
                    probe={record?.probe}
                />
            </Form>
        </>
    );
};

export default GslbDetail;
