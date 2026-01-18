import React, { useState, useEffect } from "react";
import { Button, Collapse, Empty, Divider, Popconfirm } from 'antd';
import { compareVeri, memorizeComponent } from "@/hooks/useMemoComponent";
import CommonComponentSocketAddress from "@/elchi/components/resources/common/Address/socket_address";
import { handleChangeResources } from "@/redux/dispatcher";
import { ActionType, ResourceType } from "@/redux/reducer-helpers/common";
import { useDispatch } from "react-redux";
import { DeleteOutlined, UnorderedListOutlined } from "@ant-design/icons";
import ECard from "@/elchi/components/common/ECard";
import ElchiIconButton from "@/elchi/components/common/ElchiIconButton";


type GeneralProps = {
    veri: {
        version: string;
        reduxStore: any;
        reduxAction: any;
        keyPrefix: string;
    }
};

const ComponentPreresolveHostnames: React.FC<GeneralProps> = ({ veri }) => {
    const [stateActiveItem, setStateActiveItem] = useState<number>(0);
    const dispatch = useDispatch();

    // Initialize empty array in Redux when component mounts if not exists
    useEffect(() => {
        if (!Array.isArray(veri.reduxStore)) {
            handleChangeResources(
                {
                    version: veri.version,
                    type: ActionType.Update,
                    keys: veri.keyPrefix,
                    val: [],
                    resourceType: ResourceType.Resource
                },
                dispatch,
                veri.reduxAction
            );
        }
    }, []);

    const handleDeleteRedux = (index: number) => {
        handleChangeResources(
            {
                version: veri.version,
                type: ActionType.Delete,
                keys: `${veri.keyPrefix}.${index}`,
                resourceType: ResourceType.Resource
            },
            dispatch,
            veri.reduxAction
        );
    };

    const onChange = (key: string | string[]) => {
        setStateActiveItem(parseInt(key as string))
    };

    const onRemove = (event: React.MouseEvent<HTMLElement>, index: number) => {
        event.stopPropagation();
        handleDeleteRedux(index)
    };

    const addItem = () => {
        handleChangeResources(
            {
                version: veri.version,
                type: ActionType.Append,
                keys: veri.keyPrefix,
                val: {},
                resourceType: ResourceType.Resource
            },
            dispatch,
            veri.reduxAction
        );
    };

    return (
        <ECard title="Preresolve Hostnames">
            <Divider style={{ marginTop: '8px', marginBottom: '8px' }} type="horizontal" />
            <ElchiIconButton style={{ marginBottom: 10 }} onClick={addItem} key={`button_${veri.keyPrefix}`} />

            {!veri.reduxStore || veri.reduxStore.length === 0 ? (
                <div style={{
                    background: 'var(--bg-active)',
                    border: '2px dashed var(--border-default)',
                    borderRadius: 16,
                    padding: '40px 20px',
                    textAlign: 'center',
                    margin: '20px 0',
                    backdropFilter: 'blur(10px)',
                    transition: 'all 0.3s ease',
                }}>
                    <Empty
                        image={<UnorderedListOutlined style={{ fontSize: 48, color: '#94a3b8' }} />}
                        description={
                            <div style={{ marginTop: 16 }}>
                                <h4 style={{
                                    color: 'var(--text-primary)',
                                    marginBottom: 8,
                                    fontSize: 16,
                                    fontWeight: 500
                                }}>
                                    No Preresolve Hostnames
                                </h4>
                                <p style={{
                                    color: 'var(--text-secondary)',
                                    margin: 0,
                                    fontSize: 14,
                                    lineHeight: 1.5
                                }}>
                                    Click the + button above to add hostnames to preresolve
                                </p>
                            </div>
                        }
                    />
                </div>
            ) : (
                <Collapse
                    key={`Collapse_${veri.keyPrefix}`}
                    accordion
                    size='small'
                    defaultActiveKey={[stateActiveItem]}
                    onChange={onChange}
                    bordered={false}
                    style={{
                        background: 'transparent',
                        borderRadius: 12,
                    }}
                    items={
                        veri.reduxStore?.map((data: any, index: number) => (
                            {
                                label: (
                                    <span style={{
                                        fontWeight: 500,
                                        color: 'var(--text-primary)',
                                        fontSize: 14
                                    }}>
                                        {`${index}) ${data?.address || 'Socket Address'}`}
                                    </span>
                                ),
                                extra:
                                    <Popconfirm
                                        title="Delete confirmation"
                                        description="Are you sure you want to delete this item?"
                                        onConfirm={(e) => { onRemove(e as React.MouseEvent<HTMLElement>, index) }}
                                        okText="Yes"
                                        cancelText="No"
                                        placement="left"
                                    >
                                        <Button
                                            key={"btn_ " + index.toString()}
                                            type="text"
                                            danger
                                            icon={<DeleteOutlined style={{ color: 'var(--color-danger)' }} />}
                                            size='small'
                                            className="elchi-delete-button"
                                            onClick={(e) => e.stopPropagation()}
                                            iconPosition={"end"}
                                            style={{
                                                borderRadius: 8,
                                                border: '1px solid var(--color-danger-border)',
                                                background: 'var(--color-danger-light)',
                                            }}
                                        />
                                    </Popconfirm>,
                                style: {
                                    marginBottom: 8,
                                    borderRadius: 12,
                                    border: '1px solid var(--border-default)',
                                    background: 'var(--card-bg)',
                                    backdropFilter: 'blur(10px)',
                                },
                                children:
                                    <CommonComponentSocketAddress veri={{
                                        version: veri.version,
                                        keyPrefix: `${veri.keyPrefix}.${index}`,
                                        reduxStore: data,
                                        unsupportedAddressTag: [],
                                        unsupportedSocketAddressTag: [],
                                    }} />
                            })
                        )}
                />
            )}
        </ECard>
    )
};

export default memorizeComponent(ComponentPreresolveHostnames, compareVeri);
