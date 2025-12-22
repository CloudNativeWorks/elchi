import { message, Divider, Col, Dropdown, Button, Space, Modal, Select, Spin, App as AntdApp } from 'antd';
import { useCustomMutation, useDeleteMutation, api } from "@/common/api";
import { CustomMutationOptions, ConfigDiscovery, OperationsType } from "@/common/types";
import { useOperationsApiMutation } from "@/common/operations-api";
import { Method } from "axios"
import { useNavigate } from "react-router-dom";
import { SaveOutlined, ArrowLeftOutlined, DownOutlined, RocketOutlined, DeleteOutlined, CloudDownloadOutlined, DeploymentUnitOutlined, SendOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import type { MenuProps } from 'antd';
import { compareReduxStoreAndNameAndConfigDiscovery, memorizeComponent } from "@/hooks/useMemoComponent";
import { useState } from 'react';
import { useSelector } from 'react-redux';
import { GetYaml } from '@/utils/get-yaml';
import { useProjectVariable } from '@/hooks/useProjectVariable';
import useDeleteResource from './DeleteResource';
import { GTypeFieldsBase } from '@/common/statics/gtypes';
// Dependency graph is now a separate page, not a modal
import { useServiceData } from '@/hooks/useServiceData';


interface RenderFormItemProps {
    location_path: string;
    offset: number;
    name: string;
    reduxStore: any;
    queryResource: any;
    envoyVersion: string;
    gtype: string;
    configDiscovery?: ConfigDiscovery[];
    voidToJSON?: any;
    managed?: boolean;
    service?: string;
    callBack?: any;
    GType: GTypeFieldsBase;
    rawQuery?: any;
    validate?: boolean;
    waf?: string; // WAF config name for Wasm filter
}

export const MemorizedRenderCreateUpdate = (options: RenderFormItemProps) => {
    const mutate = useCustomMutation();
    const deleteMutate = useDeleteMutation();
    const operationsMutate = useOperationsApiMutation();
    const navigate = useNavigate();
    const { modal } = AntdApp.useApp();
    const [messageApi, contextHolder] = message.useMessage();
    const [loading, setLoading] = useState(false);
    const { project } = useProjectVariable();

    // Redux'dan elchi_discovery'yi al
    const elchiDiscovery = useSelector((state: any) =>
        state.VersionedResources[options.envoyVersion]?.ElchiDiscovery || []
    );

    // Removed dependency modal state - now uses navigation
    const deleteResource = useDeleteResource(deleteMutate);

    // Downstream IP selection modal state
    const [isIPModalVisible, setIsIPModalVisible] = useState(false);
    const [selectedDownstreamIP, setSelectedDownstreamIP] = useState<string | undefined>(undefined);
    const [hasIPsFetched, setHasIPsFetched] = useState(false);

    // Fetch service data to get downstream IPs (only for bootstrap and when modal is open)
    const { clientIPs, isLoading: isLoadingIPs } = useServiceData({
        project,
        version: options.envoyVersion,
        serviceName: options.name,
        enabled: options.GType.type === "bootstrap" && isIPModalVisible && !hasIPsFetched && !!options.name
    });

    const goBack = () => {
        navigate(-1);
    };

    const items: MenuProps = {
        items: [
            {
                key: '1',
                label: options.GType.type === "bootstrap" ? "Save & Download" : 'Save & Publish',
                icon: options.GType.type === "bootstrap" ? <CloudDownloadOutlined /> : <RocketOutlined />,
            },
            {
                key: '2',
                label: 'Save',
                icon: <SaveOutlined />,
            },
            ...(options.GType.type === "bootstrap" ? [{
                key: '5',
                label: 'Save & Send',
                icon: <SendOutlined />,
            }] : []),
            {
                key: '4',
                label: 'Show Dependencies',
                icon: <DeploymentUnitOutlined />,
            },
            {
                type: 'divider',
            },
            {
                key: '3',
                label: 'Delete',
                danger: true,
                icon: <DeleteOutlined />,
            },
        ],
    };


    const handleResource = async (method: Method, saveORpublish: string, downstreamIP?: string) => {
        if (options.callBack) { options.callBack(); }

        let path: string;
        if (method === "post") {
            path = `${options.GType.backendPath}?project=${project}&version=${options.envoyVersion}`
        } else {
            path = `${options.GType.backendPath}/${options.name}?save_or_publish=${saveORpublish}&project=${project}&resource_id=${options.queryResource?.id}&version=${options.envoyVersion}`
            // Add downstream_ip query param if provided
            if (downstreamIP) {
                path += `&downstream_ip=${downstreamIP}`;
            }
        }

        const defaultMO: CustomMutationOptions = {
            path: path,
            name: options.name,
            envoyVersion: options.envoyVersion,
            type: options.GType.type,
            gtype: options.gtype,
            category: options.GType.category,
            canonical_name: options.GType.canonicalName,
            method: method,
            metadata: options.GType.metadata,
            collection: options.GType.collection,
            resource: Array.isArray(options.reduxStore) ?
                options.reduxStore.map((item: any) => options.voidToJSON(item))
                :
                options.voidToJSON(options.reduxStore),
            config_discovery: options.configDiscovery,
            version: options.queryResource?.resource?.version ? options.queryResource?.resource?.version : "1",
            permissions: {
                users: [],
                groups: []
            },
            managed: options?.managed,
            elchi_discovery: elchiDiscovery,
            waf: options?.waf,
            validate: options?.validate,
            customSuccessMessage: method === 'post' ?
                `${options.GType.type} "${options.name}" created successfully!` :
                `${options.GType.type} "${options.name}" updated successfully!`
        }

        try {
            await mutate.mutateAsync(defaultMO, {
                onSuccess: (data: any) => {
                    if (saveORpublish === "download") {
                        GetYaml(data.data?.data);
                    }

                    if (method === 'post') {
                        navigate(`${options.GType.listPage}/${options.name}?resource_id=${data?.data?.data?.resource_id}&version=${options.envoyVersion}`);
                    }

                    if (options.queryResource?.resource?.version) {
                        options.queryResource.resource.version = (parseInt(options.queryResource.resource.version) + 1).toString();
                    }
                },
                onSettled: () => {
                    setLoading(false);
                },
            });
        } catch (error) {
            console.log(error)
            setLoading(false);
        }
    }

    const handleDelete = () => {
        if (options.GType.prettyName !== "Bootstrap") {
            deleteResource({
                version: options.queryResource?.general?.version,
                path: options.GType.backendPath,
                name: options.name,
                resource_id: options.queryResource?.id,
                project: project,
                gtype: options.gtype,
                redirectUri: options.GType.listPage,
                updateData: 0,
                setUpdateData: () => { },
            });
        } else {
            messageApi.error("Bootstrap resources cannot be deleted!");
        }
        setLoading(false);
    };

    const handleDependencies = () => {
        navigate(`/dependency/${encodeURIComponent(options.name)}?collection=${options.GType.collection}&gtype=${options.gtype}&version=${options.envoyVersion}`);
        setLoading(false);
    };

    const handleSaveAndSend = async () => {
        try {
            // First save the bootstrap
            await handleResource("put", "save");
            
            // Then send UPDATE_BOOTSTRAP command
            await operationsMutate.mutateAsync({
                data: {
                    type: OperationsType.UPDATE_BOOTSTRAP,
                    command: {
                        name: options.name,
                        project: project
                    },
                    clients: [] // Empty array - backend will auto-discover
                },
                project,
                version: options.envoyVersion
            });
            
            // Don't show extra success message - global notification will handle it
        } catch (error) {
            console.error('Save & Send failed:', error);
            // Don't show extra error message - global notification will handle it
        } finally {
            setLoading(false);
        }
    };

    const showSaveAndSendConfirm = () => {
        modal.confirm({
            title: 'Save & Send Bootstrap',
            icon: <ExclamationCircleOutlined />,
            content: 'This will save the bootstrap configuration and send an update command to all clients. The service will be reloaded. Do you want to continue?',
            okText: 'Yes, Continue',
            cancelText: 'Cancel',
            onOk: handleSaveAndSend,
            onCancel: () => {
                setLoading(false);
            },
        });
    };

    const handleIPModalOk = async () => {
        if (!selectedDownstreamIP) {
            messageApi.warning('Please select a downstream IP address');
            return;
        }

        setIsIPModalVisible(false);
        setLoading(true);
        setHasIPsFetched(true); // Mark as fetched to prevent refetching

        try {
            await handleResource("put", "download", selectedDownstreamIP);
        } finally {
            setLoading(false);
            setSelectedDownstreamIP(undefined);
        }
    };

    const handleIPModalCancel = () => {
        setIsIPModalVisible(false);
        setSelectedDownstreamIP(undefined);
        setHasIPsFetched(true); // Mark as fetched to prevent refetching on next open
    };

    const handleBootstrapDownload = async () => {
        setLoading(true);
        try {
            // Check if service has downstream IPs
            const response = await api.get(`/api/op/services?project=${project}&page=1&limit=50&name=${options.name}`);
            const service = response.data?.data?.data?.[0];
            const downstreamIPs = service?.clients?.map((client: any) => client.downstream_address) || [];

            if (downstreamIPs.length === 0) {
                // No IPs found, download without query param
                await handleResource("put", "download");
            } else {
                // IPs found, open modal for selection
                setIsIPModalVisible(true);
                setLoading(false);
            }
        } catch (error) {
            // Service not found or error, download without query param
            await handleResource("put", "download");
        }
    };

    const handleMenuClick: MenuProps['onClick'] = (e) => {
        setLoading(true);

        if (e.key === '1') {
            if (options.GType.type === "bootstrap") {
                handleBootstrapDownload();
            } else {
                handleResource("put", "publish");
            }
        } else if (e.key === '2') {
            handleResource("put", "save");
        } else if (e.key === '3') {
            handleDelete();
        } else if (e.key === '4') {
            handleDependencies();
        } else if (e.key === '5') {
            showSaveAndSendConfirm();
        }

        if (options.GType.type === "bootstrap" && e.key !== '1') {
            setLoading(false);
        }
    };

    const menuStyle = {
        height: "auto",
        background: "white",
        ShadowRoot: "1px 1px 1px 1px #1990FF",
        border: "0.5px solid #1990FF",
    };

    return (
        <>
            {contextHolder}
            <Col md={24} style={{ textAlign: 'right' }}>
                <div className="right-buttons">
                    {options.location_path !== options.GType.createPath ?
                        <Dropdown menu={{
                            items: items.items,
                            onClick: handleMenuClick,
                            style: menuStyle,
                        }}>
                            <Button
                                className='modern-add-btn'
                                size='large'
                                loading={loading}
                                style={{
                                    background: 'linear-gradient(90deg, #056ccd 0%, #00c6fb 100%)',
                                    border: 'none',
                                    color: '#fff',
                                    fontWeight: 600,
                                    fontSize: 15,
                                    borderRadius: 10,
                                    padding: '0 24px',
                                    height: 40,
                                    boxShadow: '0 4px 16px 0 rgba(5,117,230,0.10)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 10,
                                    transition: 'all 0.18s',
                                }}
                            >
                                <Space>
                                    Actions
                                    <DownOutlined />
                                </Space>
                            </Button>
                        </Dropdown>
                        :
                        <Button
                            className='modern-add-btn'
                            size='large'
                            icon={<SaveOutlined />}
                            onClick={() => handleResource("post", "create")}
                            style={{
                                background: 'linear-gradient(90deg, #056ccd 0%, #00c6fb 100%)',
                                border: 'none',
                                color: '#fff',
                                fontWeight: 600,
                                fontSize: 15,
                                borderRadius: 10,
                                padding: '0 24px',
                                height: 40,
                                boxShadow: '0 4px 16px 0 rgba(5,117,230,0.10)',
                                display: 'flex',
                                alignItems: 'center',
                                gap: 10,
                                transition: 'all 0.18s',
                            }}
                        >
                            Create
                        </Button>
                    }
                    <Divider style={{ height: "auto", color: "#1990FF" }} type="vertical" />

                    <Button
                        className='modern-add-btn'
                        size='large'
                        onClick={goBack}
                        style={{
                            background: 'linear-gradient(90deg, #056ccd 0%, #00c6fb 100%)',
                            border: 'none',
                            color: '#fff',
                            fontWeight: 600,
                            fontSize: 15,
                            borderRadius: 10,
                            padding: '0 24px',
                            height: 40,
                            boxShadow: '0 4px 16px 0 rgba(5,117,230,0.10)',
                            display: 'flex',
                            alignItems: 'center',
                            gap: 10,
                            transition: 'all 0.18s',
                        }}
                    >
                        <Space>
                            <ArrowLeftOutlined />
                            Back
                        </Space>
                    </Button>
                </div>
            </Col>

            {/* DependenciesModal removed - now uses separate page via navigation */}

            {/* Downstream IP Selection Modal for Bootstrap */}
            <Modal
                title="Select Downstream IP Address"
                open={isIPModalVisible}
                onOk={handleIPModalOk}
                onCancel={handleIPModalCancel}
                okText="Download"
                cancelText="Cancel"
                okButtonProps={{ disabled: !selectedDownstreamIP }}
            >
                <div style={{ marginBottom: 16 }}>
                    <p>Please select a downstream IP address for the bootstrap configuration:</p>
                </div>
                <Spin spinning={isLoadingIPs}>
                    <Select
                        style={{ width: '100%' }}
                        placeholder="Select downstream IP"
                        value={selectedDownstreamIP}
                        onChange={(value) => setSelectedDownstreamIP(value)}
                        options={clientIPs.map((ip: string) => ({
                            label: ip,
                            value: ip,
                        }))}
                        showSearch
                        filterOption={(input, option) =>
                            (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                        }
                    />
                </Spin>
                {!isLoadingIPs && clientIPs.length === 0 && (
                    <div style={{ marginTop: 16, color: '#ff4d4f' }}>
                        No downstream IP addresses found for this service.
                    </div>
                )}
            </Modal>
        </>
    )
};

export const RenderCreateUpdate = memorizeComponent(MemorizedRenderCreateUpdate, compareReduxStoreAndNameAndConfigDiscovery);
