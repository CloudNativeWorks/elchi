import React, { useState } from "react";
import { Col, Collapse, Divider, Row, Button, Drawer } from 'antd';
import { DeleteTwoTone } from "@ant-design/icons";
import { useDispatch } from "react-redux";
import { ActionType, ResourceType } from "@/redux/reducer-helpers/common";
import { handleChangeResources } from '@/redux/dispatcher';
import { HorizonTags } from '@/elchi/components/common/HorizonTags';
import { navigateCases } from "@/elchi/helpers/navigate-cases";
import { FieldConfigType, startsWithAny } from '@/utils/tools';
import { FieldTypes } from '@/common/statics/general';
import CommonComponentStringMatcher from '../common/StringMatcher/StringMatcher'
import useResourceFormMultiple from '@/hooks/useResourceFormMultiple';
import { useTags } from "@/hooks/useTags";
import { modtag_query_parameter_matcher } from "./_modtag_";
import { ConditionalComponent } from "../../common/ConditionalComponent";
import { EForm } from "../../common/e-components/EForm";
import { EFields } from "../../common/e-components/EFields";
import ElchiButton from "../../common/ElchiButton";
import ElchiIconButton from "../../common/ElchiIconButton";


type GeneralProps = {
    veri: {
        version: string;
        keyPrefix: string;
        drawerOpen: boolean;
        reduxStore: any[] | undefined;
        reduxAction: any;
        tagMatchPrefix: string;
        parentName: string;
        drawerClose: () => void;
    }
};

const ComponentQueryParameter: React.FC<GeneralProps> = ({ veri }) => {
    const dispatch = useDispatch();
    const { vTags } = useTags(veri.version, modtag_query_parameter_matcher);
    const [stateActiveItem, setStateActiveItem] = useState<number>(-1);
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

    const addQueryParam = () => {
        const queryParam = { $type: "envoy.config.route.v3.QueryParameterMatcher", name: "" }
        handleChangeResources({ version: veri.version, type: ActionType.Append, keys: veri.keyPrefix, val: queryParam, resourceType: ResourceType.Resource }, dispatch, veri.reduxAction);
        setSelectedTags((prevState) => {
            const newSelectedTags = { ...prevState, [veri.reduxStore?.length || 0]: ["name"] }
            return newSelectedTags
        })
    };

    const fieldConfigs: FieldConfigType[] = [
        { tag: "name", type: FieldTypes.String, fieldPath: 'name', placeHolder: '(string)', spanNum: 8 },
        { tag: "present_match", type: FieldTypes.Boolean, fieldPath: 'query_parameter_match_specifier.present_match', tagPrefix: 'query_parameter_match_specifier', navigate: true, spanNum: 8 },
    ];

    return (
        <Drawer
            key={`draver_${veri.keyPrefix}`}
            title={`${veri.parentName}`}
            placement="right"
            closable={false}
            open={veri.drawerOpen}
            onClose={veri.drawerClose}
            size='large'
            width={900}
        >
            <ElchiIconButton style={{ marginBottom: 10 }} onClick={addQueryParam} key={`button_${veri.keyPrefix}`} />
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
                            label: data.name,
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
                                    <HorizonTags veri={{
                                        tags: vTags.qpm?.QueryParameterMatcher,
                                        selectedTags: selectedTags[index],
                                        unsupportedTags: [],
                                        index: index,
                                        handleChangeTag: handleChangeTag,
                                        tagPrefix: `query_parameter_match_specifier`,
                                        tagMatchPrefix: `${veri.tagMatchPrefix}`,
                                        required: ["name", "range_match", "present_match", "string_match"],
                                        hiddenTags: ["exact_match", "safe_regex_match", "prefix_match", "suffix_match", "contains_match"],
                                        onlyOneTag: [["query_parameter_match_specifier.present_match", "query_parameter_match_specifier.string_match"]]
                                    }} />
                                    <Divider style={{ marginTop: '8px', marginBottom: '8px' }} type="horizontal" />
                                    <Col md={24}>
                                        <EForm>
                                            <EFields
                                                fieldConfigs={fieldConfigs}
                                                selectedTags={selectedTags[index]}
                                                handleChangeRedux={handleChangeRedux}
                                                reduxStore={data}
                                                keyPrefix={`${veri.keyPrefix}.${index}`}
                                                version={veri.version}
                                            />
                                        </EForm>
                                        <ConditionalComponent
                                            shouldRender={startsWithAny("query_parameter_match_specifier.string_match", selectedTags[index])}
                                            Component={CommonComponentStringMatcher}
                                            componentProps={{
                                                version: veri.version,
                                                reduxAction: veri.reduxAction,
                                                reduxStore: navigateCases(data, "query_parameter_match_specifier.string_match"),
                                                keyPrefix: `${veri.keyPrefix}.${index}.string_match`,
                                                tagMatchPrefix: `${veri.tagMatchPrefix}.query_parameter_match_specifier.string_match`,
                                                title: "String Match",
                                                id: `${veri.keyPrefix}.${index}.string_match`,
                                            }}
                                        />
                                    </Col>
                                </Row>
                        })
                    )}
            />
            <ElchiButton onlyText style={{ marginTop: 15 }} onClick={() => veri.drawerClose()}>Close</ElchiButton>
        </Drawer>
    )
};

export default ComponentQueryParameter;
