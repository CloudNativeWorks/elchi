import React, { useState } from "react";
import { Col, Collapse, Divider, Row, Button, Drawer, Empty } from 'antd';
import { DeleteTwoTone, ClusterOutlined } from "@ant-design/icons";
import { useDispatch } from "react-redux";
import { ActionType, ResourceType } from "@/redux/reducer-helpers/common";
import { handleChangeResources } from '@/redux/dispatcher';
import { HorizonTags } from '@/elchi/components/common/HorizonTags';
import { headerOptionFields } from '@/common/statics/general';
import { getCollapseItems } from '@/elchi/components/common/CollapseItems';
import { FieldConfigType } from '@/utils/tools';
import CommonComponentCluster from '../../Cluster/Cluster';
import CommonComponentHeaderOptions from "../../../HeaderOptions/HeaderOptions";
import useResourceFormMultiple from '@/hooks/useResourceFormMultiple';
import { useTags } from "@/hooks/useTags";
import { modtag_us_wc, modtag_weighted_clusters_cluster_weight } from "./_modtag_";
import { generateFields } from "@/common/generate-fields";
import { useModels } from "@/hooks/useModels";
import { EForm } from "@/elchi/components/common/e-components/EForm";
import { EFields } from "@/elchi/components/common/e-components/EFields";
import ElchiIconButton from "@/elchi/components/common/ElchiIconButton";
import ElchiButton from "@/elchi/components/common/ElchiButton";


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

const excludeFields = ["response_headers_to_remove", "request_headers_to_remove"];

const CommonComponentWClusters: React.FC<GeneralProps> = ({ veri }) => {
    const dispatch = useDispatch();
    const { vModels } = useModels(veri.version, modtag_weighted_clusters_cluster_weight);
    const { vTags } = useTags(veri.version, modtag_weighted_clusters_cluster_weight);
    const [stateActiveItem, setStateActiveItem] = useState<number>(0);
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
        const cluster: any = { $type: vModels.wccw?.WeightedCluster_ClusterWeight.$type }
        handleChangeResources({ version: veri.version, type: ActionType.Append, keys: veri.keyPrefix, val: cluster, resourceType: ResourceType.Resource }, dispatch, veri.reduxAction);
        setSelectedTags((prevState) => {
            const newSelectedTags = { ...prevState, [veri.reduxStore?.length || 0]: ["name"] }
            return newSelectedTags
        })
    };

    const fieldConfigs: FieldConfigType[] = [
        ...generateFields({
            f: vTags.wccw?.WeightedCluster_ClusterWeight,
            sf: vTags.wccw?.WeightedCluster_ClusterWeight_SingleFields,
            e: ["name"]
        })
    ];

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
            <ElchiIconButton key={`button_${veri.keyPrefix}`} onClick={addCluster} style={{ marginBottom: 10 }} />

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
                        image={<ClusterOutlined style={{ fontSize: 48, color: '#94a3b8' }} />}
                        description={
                            <div style={{ marginTop: 16 }}>
                                <h4 style={{
                                    color: '#475569',
                                    marginBottom: 8,
                                    fontSize: 16,
                                    fontWeight: 500
                                }}>
                                    No Weighted Clusters
                                </h4>
                                <p style={{
                                    color: '#64748b',
                                    margin: 0,
                                    fontSize: 14,
                                    lineHeight: 1.5
                                }}>
                                    Click the + button above to add your first weighted cluster configuration
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
                                        {data.name || data.cluster_header}
                                    </span>
                                ),
                                extra:
                                    <>
                                        <label style={{
                                            marginRight: 20,
                                            color: '#64748b',
                                            fontSize: 13,
                                            fontWeight: 500
                                        }}>
                                            Weight: <span style={{ color: '#1e293b' }}>{data.weight || 'auto'}</span>
                                        </label>
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
                                        />
                                    </>,
                                style: {
                                    marginBottom: 8,
                                    borderRadius: 12,
                                    border: '1px solid rgba(226, 232, 240, 0.5)',
                                    background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.9) 0%, rgba(248, 250, 252, 0.8) 100%)',
                                    backdropFilter: 'blur(10px)',
                                },
                                children:
                                <>
                                    <Row>
                                        <HorizonTags veri={{
                                            tags: vTags.wccw?.WeightedCluster_ClusterWeight,
                                            selectedTags: selectedTags[index],
                                            unsupportedTags: modtag_us_wc['WeightedClusters'],
                                            index: index,
                                            handleChangeTag: handleChangeTag,
                                            tagMatchPrefix: `${veri.tagMatchPrefix}.clusters`,
                                            required: ["name", "cluster_header", "weight"],
                                            onlyOneTag: [["name", "cluster_header"]],
                                            specificTagPrefix: { 'host_rewrite_literal': 'host_rewrite_specifier' }
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
                                                <EFields
                                                    fieldConfigs={fieldConfigs.filter(conf => !excludeFields.includes(conf.tag))}
                                                    selectedTags={selectedTags[index]}
                                                    handleChangeRedux={handleChangeRedux}
                                                    reduxStore={data}
                                                    keyPrefix={`${veri.keyPrefix}.${index}`}
                                                    version={veri.version}
                                                />
                                            </EForm>
                                        </Col>
                                    </Row>
                                    <Collapse accordion bordered={false} size="small"
                                        style={{ width: '100%', marginBottom: 10, background: "#1890ff" }}
                                        items={getCollapseItems([
                                            {
                                                reduxStore: {
                                                    response_headers_to_remove: data.response_headers_to_remove,
                                                    response_headers_to_add: data.response_headers_to_add,
                                                    request_headers_to_remove: data.request_headers_to_remove,
                                                    request_headers_to_add: data.request_headers_to_add,
                                                },
                                                version: veri.version,
                                                reduxAction: veri.reduxAction,
                                                selectedTags: selectedTags[index],
                                                componentName: 'Header Option',
                                                component: CommonComponentHeaderOptions,
                                                toJSON: vModels.wccw?.WeightedCluster_ClusterWeight.toJSON,
                                                keyPrefix: `${veri.keyPrefix}.${index}`,
                                                tagMatchPrefix: `${veri.tagMatchPrefix}`,
                                                condition: selectedTags[index]?.some(item => headerOptionFields.includes(item)),
                                            }
                                        ])}
                                    />
                                </>
                            })
                        )}
                />
            )}
            <ElchiButton onlyText style={{ marginTop: 15 }} onClick={() => veri.drawerClose()}>Close</ElchiButton>
        </Drawer>
    )
};

export default CommonComponentWClusters;
