import React, { useState } from "react";
import { Col, Collapse, Divider, Row, Button, Drawer, Popconfirm } from 'antd';
import { DeleteOutlined } from "@ant-design/icons";
import { useDispatch } from "react-redux";
import { ActionType, ResourceType } from "@/redux/reducer-helpers/common";
import { handleChangeResources } from '@/redux/dispatcher';
import { HorizonTags } from '@/elchi/components/common/HorizonTags';
import { FieldComponent } from '@/elchi/components/common/FormItems';
import { FieldTypes } from '@/common/statics/general';
import CommonComponentCluster from '../../Cluster/Cluster';
import useResourceFormMultiple from '@/hooks/useResourceFormMultiple';
import { modtag_clusters } from "./_modtag_";
import { useTags } from "@/hooks/useTags";
import { EForm } from "@/elchi/components/common/e-components/EForm";
import ElchiButton from "@/elchi/components/common/ElchiButton";
import ElchiIconButton from "@/elchi/components/common/ElchiIconButton";


type GeneralProps = {
    veri: {
        version: string;
        keyPrefix: string;
        drawerOpen: boolean;
        reduxStore: any[] | undefined;
        reduxAction: any;
        tagMatchPrefix: string;
        drawerClose: () => void;
    }
};

const CommonComponentTWClusters: React.FC<GeneralProps> = ({ veri }) => {
    const dispatch = useDispatch();
    const [stateActiveItem, setStateActiveItem] = useState<number>(0);
    const { vTags } = useTags(veri.version, modtag_clusters);
    const { selectedTags, setSelectedTags, handleChangeRedux, handleChangeTag } = useResourceFormMultiple({
        version: veri.version,
        reduxStore: veri.reduxStore,
        keyPrefix: veri.keyPrefix,
        reduxAction: veri.reduxAction
    });

    const handleDeleteRedux = ({ keys, index }: { keys?: string, index?: number }) => {
        const fullKey = keys ?
            `${veri.keyPrefix}.${index}.${keys}` :
            `${veri.keyPrefix}.${index}`;
        handleChangeResources({ version: veri.version, type: ActionType.Delete, keys: fullKey, resourceType: ResourceType.Resource }, dispatch, veri.reduxAction);
    };

    const onChange = (key: string | string[]) => {
        setStateActiveItem(parseInt(key as string))
    };

    const onRemove = (event: React.MouseEvent<HTMLElement>, index: number) => {
        event.stopPropagation();
        handleDeleteRedux({ index: index })
    };

    const addCluster = () => {
        const cluster: any = { $type: "envoy.extensions.filters.network.tcp_proxy.v3.TcpProxy.WeightedCluster.ClusterWeight" }
        handleChangeResources({ version: veri.version, type: ActionType.Append, keys: veri.keyPrefix, val: cluster, resourceType: ResourceType.Resource }, dispatch, veri.reduxAction);
        setSelectedTags((prevState) => {
            const newSelectedTags = { ...prevState, [veri.reduxStore?.length || 0]: ["name"] }
            return newSelectedTags
        })
    };

    return (
        <Drawer
            key={`draver_${veri.keyPrefix}`}
            title={`Clusters`}
            placement="right"
            closable={false}
            open={veri.drawerOpen}
            onClose={veri.drawerClose}
            size='large'
            width={900}
        >
            <ElchiIconButton style={{ marginBottom: 10 }} onClick={addCluster} key={`button_${veri.keyPrefix}`} />
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
                                    {data.name || `Cluster ${index}`}
                                </span>
                            ),
                            extra:
                                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                    <label style={{
                                        color: 'var(--text-secondary)',
                                        fontSize: 13,
                                        fontWeight: 500
                                    }}>
                                        Weight: <span style={{ color: 'var(--text-primary)' }}>{data.weight || 'auto'}</span>
                                    </label>
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
                                    </Popconfirm>
                                </div>,
                            style: {
                                marginBottom: 8,
                                borderRadius: 12,
                                border: '1px solid var(--border-default)',
                                background: 'var(--card-bg)',
                                backdropFilter: 'blur(10px)',
                            },
                            children:
                                <Row>
                                    <HorizonTags veri={{
                                        tags: vTags.c?.TcpProxy_WeightedCluster_ClusterWeight,
                                        selectedTags: selectedTags[index],
                                        unsupportedTags: ['metadata_match'],
                                        index: index,
                                        handleChangeTag: handleChangeTag,
                                        tagPrefix: ``,
                                        tagMatchPrefix: `${veri.tagMatchPrefix}.clusters`,
                                        required: ["name"],
                                    }} />
                                    <Divider style={{ marginTop: '8px', marginBottom: '8px' }} type="horizontal" />
                                    <Col md={24}>
                                        <EForm>
                                            <CommonComponentCluster veri={{
                                                version: veri.version,
                                                reduxStore: data?.name,
                                                tag: 'name',
                                                reduxAction: veri.reduxAction,
                                                keyPrefix: `${veri.keyPrefix}.${index}`,
                                                tagPrefix: '',
                                                size: 10,
                                                selectedTags: selectedTags[index]
                                            }} />
                                            <FieldComponent veri={{
                                                selectedTags: selectedTags[index],
                                                handleChange: handleChangeRedux,
                                                tag: "weight",
                                                value: data?.weight,
                                                type: FieldTypes.Number,
                                                placeholder: "(number)",
                                                keyPrefix: `${veri.keyPrefix}.${index}`,
                                                spanNum: 8,
                                            }} />
                                        </EForm>
                                    </Col>
                                </Row >
                        })
                    )}
            />
            <ElchiButton onlyText style={{ marginTop: 15 }} onClick={() => veri.drawerClose()}>Close</ElchiButton>
        </Drawer>
    )
};

export default CommonComponentTWClusters;
