import React, { useState } from "react";
import { Button, Col, Collapse, Drawer, Row } from 'antd';
import { compareVeri, memorizeComponent } from "@/hooks/useMemoComponent";
import { FieldComponent } from "@/elchi/components/common/FormItems";
import { FieldTypes } from "@/common/statics/general";
import CommonComponentStringMatcher from "./StringMatcher";
import { handleChangeResources } from "@/redux/dispatcher";
import { ActionType, ResourceType } from "@/redux/reducer-helpers/common";
import { useDispatch } from "react-redux";
import { DeleteTwoTone } from "@ant-design/icons";
import ECard from "@/elchi/components/common/ECard";
import { EForm } from "@/elchi/components/common/e-components/EForm";
import ElchiIconButton from "@/elchi/components/common/ElchiIconButton";
import ElchiButton from "@/elchi/components/common/ElchiButton";


type GeneralProps = {
    veri: {
        version: string;
        reduxStore: any[] | undefined;
        reduxAction: any;
        selectedTags: string[];
        tag: string;
        keyPrefix: string;
        tagMatchPrefix: string;
        title: string;
    }
};

const CommonComponentStringMatchers: React.FC<GeneralProps> = ({ veri }) => {
    const [state, setState] = useState<boolean>(false);
    const [stateActiveItem, setStateActiveItem] = useState<number>(0);
    const dispatch = useDispatch();

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

    const addItem = () => {
        handleChangeResources({ version: veri.version, type: ActionType.Append, keys: veri.keyPrefix, val: {}, resourceType: ResourceType.Resource }, dispatch, veri.reduxAction);
    };

    return (
        <>
            <ECard title={veri.title}>
                <Row>
                    <Col md={24}>
                        <EForm>
                            <FieldComponent veri={{
                                required: true,
                                selectedTags: veri.selectedTags,
                                keyPrefix: `${veri.keyPrefix}`,
                                handleChange: null,
                                tag: veri.tag,
                                value: veri.reduxStore,
                                type: FieldTypes.ArrayIcon,
                                spanNum: 12,
                                condition: veri.reduxStore?.[0],
                                drawerShow: () => {
                                    setState(true);
                                }
                            }} />
                        </EForm>
                    </Col>
                </Row>
            </ECard>
            <Drawer
                key={`draver_${veri.keyPrefix}`}
                title={veri.title}
                placement="right"
                closable={false}
                open={state}
                onClose={() => setState(false)}
                size='large'
                width={900}
                zIndex={900}
            >
                <ElchiIconButton style={{ marginBottom: 10 }} onClick={addItem} key={`button_${veri.keyPrefix}`} />
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
                                label: `${index}) String Match`,
                                extra:
                                    <Button
                                        key={"btn_ " + index.toString()}
                                        icon={<DeleteTwoTone twoToneColor="#eb2f96" />}
                                        size='small'
                                        onClick={(e) => { onRemove(e, index) }}
                                        iconPosition={"end"}
                                    />,
                                children:
                                    <CommonComponentStringMatcher veri={{
                                        version: veri.version,
                                        keyPrefix: `${veri.keyPrefix}.${index}`,
                                        reduxStore: data,
                                        reduxAction: veri.reduxAction,
                                        tagMatchPrefix: veri.tagMatchPrefix,
                                        title: veri.title,
                                    }} />
                            })
                        )}
                />
                <ElchiButton onlyText style={{ marginTop: 15 }} onClick={() => setState(false)}>Close</ElchiButton>
            </Drawer>
        </>
    )
};

export default memorizeComponent(CommonComponentStringMatchers, compareVeri);

