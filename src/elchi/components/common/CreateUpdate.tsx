import { message, Divider, Col, Dropdown, Button, Space } from 'antd';
import { useCustomMutation, useDeleteMutation } from "@/common/api";
import { CustomMutationOptions, ConfigDiscovery } from "@/common/types";
import { successMessage, errorMessage } from '@/common/message'
import { AxiosError, Method } from "axios"
import { useNavigate } from "react-router-dom";
import { SaveOutlined, ArrowLeftOutlined, DownOutlined, RocketOutlined, DeleteOutlined, CloudDownloadOutlined, DeploymentUnitOutlined } from '@ant-design/icons';
import type { MenuProps } from 'antd';
import { compareReduxStoreAndNameAndConfigDiscovery, memorizeComponent } from "@/hooks/useMemoComponent";
import { useState } from 'react';
import { GetYaml } from '@/utils/get-yaml';
import ResourceDrawer from './Result';
import { useProjectVariable } from '@/hooks/useProjectVariable';
import useDeleteResource from './DeleteResource';
import { GTypeFieldsBase } from '@/common/statics/gtypes';
import ErrResourceDrawer from './ErrResult';
import DependenciesModal from './dependency';


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
}

interface ResultMessage {
    message: string;
    data: { Listeners: string[], Depends: string[] };
}

export const MemorizedRenderCreateUpdate = (options: RenderFormItemProps) => {
    const mutate = useCustomMutation();
    const deleteMutate = useDeleteMutation()
    const navigate = useNavigate();
    const [messageApi, contextHolder] = message.useMessage();
    const [loading, setLoading] = useState(false);
    const { project } = useProjectVariable();

    const [drawerVisible, setDrawerVisible] = useState(false);
    const [errDrawerVisible, setErrDrawerVisible] = useState(false);
    const [drawerMessage, setDrawerMessage] = useState<ResultMessage>();
    const [errDrawerMessage, setErrDrawerMessage] = useState<string>();
    const [isModalVisible, setIsModalVisible] = useState({
        visible: false,
        name: '',
        collection: '',
        gtype: '',
        version: '',
    });
    const deleteResource = useDeleteResource(messageApi, deleteMutate);

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

    const handleError = (error: unknown) => {
        if (error instanceof AxiosError) {
            const message = error.response?.data || { message: error.message };
            setErrDrawerMessage(message);
            setErrDrawerVisible(true);
            setLoading(false);
        } else {
            errorMessage(messageApi, "An unknown error occurred.");
        }
    };

    const handleResource = async (method: Method, saveORpublish: string) => {
        if (options.callBack) { options.callBack(); }

        let path: string;
        if (method === "post") {
            path = `${options.GType.backendPath}?project=${project}`
        } else {
            path = `${options.GType.backendPath}/${options.name}?save_or_publish=${saveORpublish}&project=${project}&resource_id=${options.queryResource?.id}`
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
            managed: options?.managed
        }

        try {
            await mutate.mutateAsync(defaultMO, {
                onSuccess: (data: any) => {
                    if (saveORpublish === "publish") {
                        setDrawerMessage(data.data);
                        setDrawerVisible(true);
                    } else if (saveORpublish === "download") {
                        GetYaml(data.data?.data);
                    } else {
                        successMessage(messageApi, data?.data?.message);
                    }

                    if (method === 'post') {
                        navigate(`${options.GType.listPage}/${options.name}?resource_id=${data?.data?.data?.resource_id}`);
                    }

                    if (options.queryResource?.resource?.version) {
                        options.queryResource.resource.version = (parseInt(options.queryResource.resource.version) + 1).toString();
                    }
                },
                onError: (error: any) => {
                    handleError(error);
                    return Promise.resolve();
                },
                onSettled: () => {
                    setLoading(false);
                },
            });
        } catch (error) {
            if (saveORpublish === "publish") {
                setErrDrawerMessage(error.response?.data || { message: error.message });
                setErrDrawerVisible(true);
                setLoading(false);
                return;
            }
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
        setIsModalVisible({
            visible: true,
            name: options.name,
            collection: options.GType.collection,
            gtype: options.gtype,
            version: options.envoyVersion,
        });

        setLoading(false);
    };

    const handleMenuClick: MenuProps['onClick'] = (e) => {
        setLoading(true);

        if (e.key === '1') {
            if (options.GType.type === "bootstrap") {
                handleResource("put", "download");
            } else {
                handleResource("put", "publish");
            }
        } else if (e.key === '2') {
            handleResource("put", "save");
        } else if (e.key === '3') {
            handleDelete();
        } else if (e.key === '4') {
            handleDependencies();
        }

        if (options.GType.type === "bootstrap") {
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

            <ResourceDrawer
                visible={drawerVisible}
                onClose={() => setDrawerVisible(false)}
                message={drawerMessage}
            />

            <ErrResourceDrawer
                visible={errDrawerVisible}
                onClose={() => setErrDrawerVisible(false)}
                message={errDrawerMessage}
            />

            <DependenciesModal
                visible={isModalVisible.visible}
                onClose={() => setIsModalVisible({ visible: false, name: '', collection: '', gtype: '', version: '' })}
                name={isModalVisible.name}
                collection={isModalVisible.collection}
                gtype={isModalVisible.gtype}
                version={isModalVisible.version}
            />
        </>
    )
};

export const RenderCreateUpdate = memorizeComponent(MemorizedRenderCreateUpdate, compareReduxStoreAndNameAndConfigDiscovery);
