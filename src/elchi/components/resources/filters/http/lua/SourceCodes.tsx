import React, { useCallback, useEffect, useState } from "react";
import { Col, Form, Tabs, Row, Divider, Input } from 'antd';
import { memorizeComponent, compareVeri } from "@/hooks/useMemoComponent";
import useResourceFormMultiple from "@/hooks/useResourceFormMultiple";
import ECard from "@/elchi/components/common/ECard";
import CommonComponentDataSource from "@resources/common/DataSource/DataSource";
import { ActionType, ResourceType } from "@/redux/reducer-helpers/common";
import { useDispatch } from "react-redux";
import { handleChangeResources } from "@/redux/dispatcher";
import { FieldTypes } from "@/common/statics/general";


type GeneralProps = {
    veri: {
        version: string;
        reduxAction: any;
        reduxStore: any | undefined;
        keyPrefix: string;
    };
};

type TabState = {
    activeTab: string;
    updateCount: number;
};

const ComponentSourceCodes: React.FC<GeneralProps> = ({ veri }) => {
    const dispatch = useDispatch();
    const [state, setState] = useState<TabState>({
        activeTab: "sc_1",
        updateCount: 0
    });
    const [tabsData, setTabsData] = useState(Object.entries(veri.reduxStore || {}));
    const { handleChangeRedux } = useResourceFormMultiple({
        version: veri.version,
        reduxStore: veri.reduxStore,
        keyPrefix: veri.keyPrefix,
        reduxAction: veri.reduxAction
    });

    useEffect(() => {
        setTabsData(Array.from(veri.reduxStore || []));
    }, [veri.reduxStore]);

    const onChangeTabs = useCallback((newActiveKey: string) => {
        setState((prevState) => ({
            ...prevState,
            activeTab: newActiveKey
        }));
    }, []);

    const incrementUpdateCount = useCallback(() => {
        setState((prevState) => ({
            ...prevState,
            updateCount: prevState.updateCount + 1
        }));
    }, []);

    const addTab = useCallback((targetKey, action: 'add' | 'remove') => {
        if (action === 'add') {
            const existingNumbers = tabsData.map(([key]) => parseInt(key.split('_')[1], 10));
            const maxNumber = existingNumbers.length > 0 ? Math.max(...existingNumbers) : 0;

            const newIndex = maxNumber + 1;
            const newKey = `sc_${newIndex}`;

            handleChangeResources({
                version: veri.version,
                type: ActionType.Update,
                keys: `${veri.keyPrefix}.${newKey}`,
                val: {},
                resourceType: ResourceType.Resource
            }, dispatch, veri.reduxAction);

            onChangeTabs(newKey);
        } else if (action === 'remove' && targetKey) {
            const keys = Object.keys(veri.reduxStore || {});
            const targetKeyIndex = keys.indexOf(targetKey as string);

            const newActiveKey = targetKeyIndex > 0
                ? keys[targetKeyIndex - 1]
                : keys.length > 1
                    ? keys[1]
                    : keys[0];

            incrementUpdateCount();
            onChangeTabs(newActiveKey);

            handleChangeResources({
                version: veri.version,
                type: ActionType.Delete,
                keys: `${veri.keyPrefix}.${targetKey}`,
                resourceType: ResourceType.Resource
            }, dispatch, veri.reduxAction);
        }
    }, [veri.reduxStore, veri.keyPrefix, veri.version, onChangeTabs, incrementUpdateCount, dispatch, veri.reduxAction, tabsData]);

    return (
        <ECard title="Source Codes">
            <Tabs
                onChange={onChangeTabs}
                type="editable-card"
                activeKey={state.activeTab}
                onEdit={addTab}
                style={{ width: "99%" }}
                items={tabsData.map(([key, data]) => ({
                    key,
                    label: `${key}`,
                    forceRender: true,
                    children: (
                        <>
                            <Row>
                                <Divider style={{ marginTop: '8px', marginBottom: '8px' }} type="horizontal" />
                                <Col md={24}>
                                    <Form
                                        labelCol={{ span: 24 }}
                                        wrapperCol={{ span: 24 }}
                                        layout="vertical"
                                        size="small"
                                        style={{ maxWidth: "100%" }}
                                        labelWrap
                                    >
                                        <Form.Item
                                            style={{ display: "inline-block", width: `25%`, zIndex: 900 }}
                                            label={
                                                <div className="smoothAnimation" style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>Key</div>
                                            }
                                        >
                                            <Input
                                                value={key}
                                                placeholder="string"
                                                disabled={true}
                                                width={20}
                                                style={{ marginBottom: '8px' }}
                                                onChange={(e) => handleChangeRedux(`${veri.keyPrefix}.${key}`, e.target.value)}
                                            />
                                        </Form.Item>
                                    </Form>
                                </Col>
                            </Row>
                            <CommonComponentDataSource veri={{
                                version: veri.version,
                                reduxStore: data,
                                keyPrefix: `${veri.keyPrefix}.${key}`,
                                tagPrefix: '',
                                parentName: 'Value',
                                fileName: 'Code file',
                                inlineStringType: FieldTypes.Lua,
                            }} />
                        </>
                    )
                }))}
            />
        </ECard>
    );
};

export default memorizeComponent(ComponentSourceCodes, compareVeri);