import React, { useEffect, useState } from 'react';
import { Collapse, Divider, Empty } from 'antd';
import { memorizeComponent, compareVeri } from "@/hooks/useMemoComponent";
import ElchiIconButton from "@/elchi/components/common/ElchiIconButton";
import { UnorderedListOutlined } from '@ant-design/icons';
import ECard from '@/elchi/components/common/ECard';
import CommonComponentSocketAddress from '@/elchi/components/resources/common/Address/socket_address';
import { handleChangeResources } from "@/redux/dispatcher";
import { ActionType, ResourceType } from "@/redux/reducer-helpers/common";
import { useDispatch } from "react-redux";

type GeneralProps = {
    veri: {
        version: string;
        reduxStore: any;
        keyPrefix: string;
        reduxAction: any;
        title?: string;
    }
};

const ComponentPreresolveClusters: React.FC<GeneralProps> = ({ veri }) => {
    const [activeKey, setActiveKey] = useState<number>(0);
    const dispatch = useDispatch();

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

    const onChange = (key: string | string[]) => {
        setActiveKey(parseInt(key as string));
    };

    return (
        <ECard title={veri.title || "Preresolve Clusters"}>
            <Divider style={{ marginTop: '8px', marginBottom: '8px' }} type="horizontal" />
            <ElchiIconButton
                style={{ marginBottom: 10 }}
                onClick={addItem}
                key={`button_${veri.keyPrefix}`}
            />

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
                        image={<UnorderedListOutlined style={{ fontSize: 48, color: 'var(--text-secondary)' }} />}
                        description={
                            <div style={{ marginTop: 16 }}>
                                <h4 style={{
                                    color: 'var(--text-primary)',
                                    marginBottom: 8,
                                    fontSize: 16,
                                    fontWeight: 500
                                }}>
                                    No Preresolve Clusters
                                </h4>
                                <p style={{
                                    color: 'var(--text-secondary)',
                                    margin: 0,
                                    fontSize: 14,
                                    lineHeight: 1.5
                                }}>
                                    Click the + button above to add clusters to preresolve
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
                    defaultActiveKey={[activeKey.toString()]}
                    onChange={onChange}
                    bordered={false}
                    style={{
                        background: 'transparent',
                        borderRadius: 12,
                    }}
                    items={veri.reduxStore?.map((data: any, index: number) => ({
                        key: index.toString(),
                        label: (
                            <span style={{
                                fontWeight: 500,
                                color: '#1e293b',
                                fontSize: 14
                            }}>
                                {`${index}) ${data?.address || 'Socket Address'}`}
                            </span>
                        ),
                        style: {
                            marginBottom: 8,
                            borderRadius: 12,
                            border: '1px solid rgba(226, 232, 240, 0.5)',
                            background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.9) 0%, rgba(248, 250, 252, 0.8) 100%)',
                            backdropFilter: 'blur(10px)',
                        },
                        children: (
                            <CommonComponentSocketAddress
                                veri={{
                                    version: veri.version,
                                    reduxStore: data,
                                    keyPrefix: `${veri.keyPrefix}.${index}`,
                                    unsupportedAddressTag: [],
                                    unsupportedSocketAddressTag: [],
                                }}
                            />
                        )
                    }))}
                />
            )}
        </ECard>
    );
};

export default memorizeComponent(ComponentPreresolveClusters, compareVeri);
