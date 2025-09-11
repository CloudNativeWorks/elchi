import React, { useState } from "react";
import { Collapse, Button, Drawer } from 'antd';
import { DeleteTwoTone } from "@ant-design/icons";
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
                                <Button
                                    key={"btn_ " + index.toString()}
                                    icon={<DeleteTwoTone twoToneColor="#eb2f96" />}
                                    size='small'
                                    onClick={(e) => { onRemove(e, index) }}
                                    iconPosition={"end"}
                                />,
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
