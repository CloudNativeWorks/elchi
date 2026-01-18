import React, { useState } from "react";
import { Collapse, Button, Drawer, Popconfirm } from 'antd';
import { DeleteOutlined } from "@ant-design/icons";
import { useDispatch } from "react-redux";
import { ActionType, ResourceType } from "@/redux/reducer-helpers/common";
import { handleChangeResources } from '@/redux/dispatcher';
import CommonComponentPayload from './Payload';
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
        title: string;
    }
};

const CommonComponentPayloadSlice: React.FC<GeneralProps> = ({ veri }) => {
    const dispatch = useDispatch();
    const [stateActiveItem, setStateActiveItem] = useState<number>(0);

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
        const cluster: any = {};
        handleChangeResources({ version: veri.version, type: ActionType.Append, keys: veri.keyPrefix, val: cluster, resourceType: ResourceType.Resource }, dispatch, veri.reduxAction);
    };

    return (
        <Drawer
            key={`draver_${veri.keyPrefix}`}
            title={`Payload`}
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
                items={
                    veri.reduxStore?.map((data: any, index: number) => (
                        {
                            label: `Payload ${index}`,
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
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            backgroundColor: 'var(--color-danger-light)',
                                            border: '1px solid var(--color-danger-border)',
                                            borderRadius: '6px'
                                        }}
                                    />
                                </Popconfirm>,
                            children:
                                <CommonComponentPayload veri={{
                                    version: veri.version,
                                    index: index,
                                    keyPrefix: `${veri.keyPrefix}.${index}`,
                                    reduxStore: data,
                                    tagMatchPrefix: veri.tagMatchPrefix,
                                    title: veri.title,
                                }} />
                        })
                    )}
            />
            <ElchiButton onlyText style={{ marginTop: 15 }} onClick={() => veri.drawerClose()}>Close</ElchiButton>
        </Drawer>
    )
};

export default CommonComponentPayloadSlice;
