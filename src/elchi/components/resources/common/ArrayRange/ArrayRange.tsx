import React, { useState } from "react";
import { Col, Collapse, Divider, InputNumber, Row, Space, Button, Drawer } from 'antd';
import { DeleteTwoTone } from "@ant-design/icons";
import { useDispatch } from "react-redux";
import { ActionType, ResourceType } from "@/redux/reducer-helpers/common";
import { handleChangeResources } from '@/redux/dispatcher';
import { ResourceAction } from "@/redux/reducers/slice";
import { EForm } from "@/elchi/components/common/e-components/EForm";
import ElchiButton from "@/elchi/components/common/ElchiButton";
import ElchiIconButton from "@/elchi/components/common/ElchiIconButton";


type GeneralProps = {
    veri: {
        version: string;
        keyPrefix: string;
        drawerOpen: boolean;
        reduxStore: any[] | undefined;
        drawerClose: () => void;
    }
};


const CommonComponentArrayRange: React.FC<GeneralProps> = ({ veri }) => {
    const dispatch = useDispatch();
    const [stateActiveItem, setStateActiveItem] = useState<number>(0);

    const handleChangeRedux = (keys: string, val: string | boolean | number) => {
        handleChangeResources({ version: veri.version, type: ActionType.Update, keys, val, resourceType: ResourceType.Resource }, dispatch, ResourceAction);
    };

    const handleDeleteRedux = ({ keys, index }: { keys?: string, index?: number }) => {
        const fullKey = keys ?
            `${veri.keyPrefix}.${index}.${keys}` :
            `${veri.keyPrefix}.${index}`;

        handleChangeResources({ version: veri.version, type: ActionType.Delete, keys: fullKey, resourceType: ResourceType.Resource }, dispatch, ResourceAction);
    };

    const onChange = (key: string | string[]) => {
        setStateActiveItem(parseInt(key as string))
    };

    const onRemove = (event: React.MouseEvent<HTMLElement>, index: number) => {
        event.stopPropagation();
        handleDeleteRedux({ index: index })
    };

    const addCluster = () => {
        const cluster: any = { start: 0, end: 0 };
        handleChangeResources({ version: veri.version, type: ActionType.Append, keys: veri.keyPrefix, val: cluster, resourceType: ResourceType.Resource }, dispatch, ResourceAction);
    };

    return (
        <Drawer
            key={`draver_${veri.keyPrefix}`}
            title={`Range`}
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
                            label: `${data?.start} - ${data?.end}`,
                            extra:
                                <Button
                                    key={"btn_ " + index.toString()}
                                    icon={<DeleteTwoTone twoToneColor="#eb2f96" />}
                                    size='small'
                                    onClick={(e) => { onRemove(e, index) }}
                                    iconPosition={"end"}
                                />,
                            children:
                                <Row>
                                    <Divider style={{ marginTop: '8px', marginBottom: '8px' }} type="horizontal" />
                                    <Col md={24}>
                                        <EForm>
                                            <Space>
                                                <InputNumber
                                                    addonBefore="Start"
                                                    min={0}
                                                    max={4294967295}
                                                    style={{ width: "100%" }}
                                                    type="number"
                                                    value={data?.start}
                                                    placeholder="number"
                                                    onChange={(val) => handleChangeRedux(`${veri.keyPrefix}.${index}.start`, val)}
                                                />
                                                <InputNumber
                                                    addonBefore="End"
                                                    min={0}
                                                    max={4294967295}
                                                    style={{ width: "100%" }}
                                                    type="number"
                                                    value={data?.end}
                                                    placeholder="number"
                                                    onChange={(val) => handleChangeRedux(`${veri.keyPrefix}.${index}.end`, val)}
                                                />
                                            </Space>
                                        </EForm>
                                    </Col>
                                </Row>
                        })
                    )}
            />
            <ElchiButton onlyText style={{ marginTop: 15 }} onClick={() => veri.drawerClose()}>Close</ElchiButton>
        </Drawer>
    )
};

export default CommonComponentArrayRange;
