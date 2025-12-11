import React, { useState, useEffect } from "react";
import { Button, Collapse, Empty, Divider } from 'antd';
import { compareVeri, memorizeComponent } from "@/hooks/useMemoComponent";
import CommonComponentSocketAddress from "@/elchi/components/resources/common/Address/socket_address";
import { handleChangeResources } from "@/redux/dispatcher";
import { ActionType, ResourceType } from "@/redux/reducer-helpers/common";
import { useDispatch } from "react-redux";
import { DeleteTwoTone, UnorderedListOutlined } from "@ant-design/icons";
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
                    background: 'linear-gradient(135deg, rgba(248, 250, 252, 0.8) 0%, rgba(241, 245, 249, 0.9) 100%)',
                    border: '2px dashed rgba(148, 163, 184, 0.3)',
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
                                    color: '#475569',
                                    marginBottom: 8,
                                    fontSize: 16,
                                    fontWeight: 500
                                }}>
                                    No Preresolve Hostnames
                                </h4>
                                <p style={{
                                    color: '#64748b',
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
                                        color: '#1e293b',
                                        fontSize: 14
                                    }}>
                                        {`${index}) ${data?.address || 'Socket Address'}`}
                                    </span>
                                ),
                                extra:
                                    <Button
                                        key={"btn_ " + index.toString()}
                                        icon={<DeleteTwoTone twoToneColor="#ef4444" />}
                                        size='small'
                                        onClick={(e) => { onRemove(e, index) }}
                                        iconPosition={"end"}
                                        style={{
                                            borderRadius: 8,
                                            border: '1px solid rgba(239, 68, 68, 0.2)',
                                            background: 'rgba(254, 242, 242, 0.5)',
                                        }}
                                    />,
                                style: {
                                    marginBottom: 8,
                                    borderRadius: 12,
                                    border: '1px solid rgba(226, 232, 240, 0.5)',
                                    background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.9) 0%, rgba(248, 250, 252, 0.8) 100%)',
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
