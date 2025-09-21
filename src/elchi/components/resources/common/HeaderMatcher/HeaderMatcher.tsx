import React, { useState } from "react";
import { Col, Collapse, Divider, Row, Button, Drawer, Empty } from 'antd';
import { DeleteTwoTone, FilterOutlined } from "@ant-design/icons";
import { useDispatch } from "react-redux";
import { ActionType, ResourceType } from "@/redux/reducer-helpers/common";
import { handleChangeResources } from '@/redux/dispatcher';
import { HorizonTags } from '@/elchi/components/common/HorizonTags';
import { navigateCases } from "@/elchi/helpers/navigate-cases";
import { FieldConfigType, startsWithAny } from '@/utils/tools';
import { FieldTypes } from '@/common/statics/general';
import { useTags } from "@/hooks/useTags";
import { modtag_header_matcher } from "./_modtag_";
import CommonComponentStringMatcher from '../StringMatcher/StringMatcher'
import useResourceFormMultiple from '@/hooks/useResourceFormMultiple';
import { useModels } from "@/hooks/useModels";
import { generateFields } from "@/common/generate-fields";
import { ConditionalComponent } from "@/elchi/components/common/ConditionalComponent";
import { EForm } from "@/elchi/components/common/e-components/EForm";
import { EFields } from "@/elchi/components/common/e-components/EFields";
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
        parentName: string;
        drawerClose: () => void;
    }
};

const CommonComponentHeaderMatcher: React.FC<GeneralProps> = ({ veri }) => {
    const dispatch = useDispatch();
    const { vModels } = useModels(veri.version, modtag_header_matcher);
    const { vTags } = useTags(veri.version, modtag_header_matcher);
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

    const addHeaderMatcher = () => {
        const headerMatcher = { $type: vModels.hm?.HeaderMatcher.$type, name: ":method" }
        handleChangeResources({ version: veri.version, type: ActionType.Append, keys: veri.keyPrefix, val: headerMatcher, resourceType: ResourceType.Resource }, dispatch, veri.reduxAction);
        setSelectedTags((prevState) => {
            const newSelectedTags = { ...prevState, [veri.reduxStore?.length || 0]: ["name"] }
            return newSelectedTags
        })
    };

    const fieldConfigs: FieldConfigType[] = [
        ...generateFields({
            f: vTags.hm?.HeaderMatcher,
            sf: vTags.hm?.HeaderMatcher_SingleFields,
            r: ["name"]
        }),
        { tag: "range_match", type: FieldTypes.Range, additionalTags: ["start", "end", "range_match"], tagPrefix: 'header_match_specifier.range_match', fieldPath: 'range_match', spanNum: 8, required: true, range: { start: 'header_match_specifier.range_match.start', end: 'header_match_specifier.range_match.end' } },
    ];

    return (
        <Drawer
            key={`draver_${veri.keyPrefix}`}
            title={`${veri.parentName} (Header Matcher)`}
            placement="right"
            closable={false}
            open={veri.drawerOpen}
            onClose={veri.drawerClose}
            size='large'
            width={900}
        >
            <ElchiIconButton key={`button_${veri.keyPrefix}`} onClick={addHeaderMatcher} style={{ marginBottom: 10 }} />
            
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
                        image={<FilterOutlined style={{ fontSize: 48, color: '#94a3b8' }} />}
                        description={
                            <div style={{ marginTop: 16 }}>
                                <h4 style={{ 
                                    color: '#475569', 
                                    marginBottom: 8,
                                    fontSize: 16,
                                    fontWeight: 500 
                                }}>
                                    No Header Matchers
                                </h4>
                                <p style={{ 
                                    color: '#64748b', 
                                    margin: 0,
                                    fontSize: 14,
                                    lineHeight: 1.5 
                                }}>
                                    Click the + button above to add your first header matcher configuration
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
                                        {data.name}
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
                                    <Row>
                                        <HorizonTags veri={{
                                            tags: vTags.hm?.HeaderMatcher,
                                            selectedTags: selectedTags[index],
                                            unsupportedTags: [],
                                            index: index,
                                            handleChangeTag: handleChangeTag,
                                            tagPrefix: `header_match_specifier`,
                                            tagMatchPrefix: `${veri.tagMatchPrefix}`,
                                            required: ["name", "range_match", "present_match", "string_match"],
                                            hiddenTags: ["exact_match", "safe_regex_match", "prefix_match", "suffix_match", "contains_match"],
                                            onlyOneTag: [["header_match_specifier.present_match", "header_match_specifier.string_match", "header_match_specifier.range_match"]]
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
                                                shouldRender={startsWithAny("header_match_specifier.string_match", selectedTags[index])}
                                                Component={CommonComponentStringMatcher}
                                                componentProps={{
                                                    version: veri.version,
                                                    reduxAction: veri.reduxAction,
                                                    reduxStore: navigateCases(data, "header_match_specifier.string_match"),
                                                    keyPrefix: `${veri.keyPrefix}.${index}.string_match`,
                                                    tagMatchPrefix: `${veri.tagMatchPrefix}.header_match_specifier.string_match`,
                                                    title: "String Match",
                                                    id: `header_match_specifier.string_match_0`,
                                                }}
                                            />
                                        </Col>
                                    </Row>
                            })
                        )}
                />
            )}
            <ElchiButton onlyText style={{ marginTop: 15 }} onClick={() => veri.drawerClose()}>Close</ElchiButton>
        </Drawer>
    )
};

export default CommonComponentHeaderMatcher;
