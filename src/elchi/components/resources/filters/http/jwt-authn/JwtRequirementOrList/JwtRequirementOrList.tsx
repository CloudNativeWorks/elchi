import React, { useState, useEffect } from "react";
import { Button, Collapse, Drawer, Empty, Divider } from 'antd';
import { compareVeri, memorizeComponent } from "@/hooks/useMemoComponent";
import { FieldComponent } from "@/elchi/components/common/FormItems";
import { FieldTypes } from "@/common/statics/general";
import ComponentJwtRequirement from "../JwtRequirement/JwtRequirement";
import { handleChangeResources } from "@/redux/dispatcher";
import { ActionType, ResourceType } from "@/redux/reducer-helpers/common";
import { useDispatch } from "react-redux";
import { DeleteTwoTone, UnorderedListOutlined } from "@ant-design/icons";
import ECard from "@/elchi/components/common/ECard";
import { EForm } from "@/elchi/components/common/e-components/EForm";
import ElchiIconButton from "@/elchi/components/common/ElchiIconButton";
import ElchiButton from "@/elchi/components/common/ElchiButton";
import { useTags } from "@/hooks/useTags";
import { modtag_jwt_requirement_or_list } from "./_modtag_";
import { generateFields } from "@/common/generate-fields";
import { HorizonTags } from "@/elchi/components/common/HorizonTags";
import useResourceForm from "@/hooks/useResourceForm";
import { EFields } from "@/elchi/components/common/e-components/EFields";
import { FieldConfigType } from "@/utils/tools";


type GeneralProps = {
    veri: {
        version: string;
        reduxStore: any;
        reduxAction: any;
        keyPrefix: string;
        title: string;
    }
};

const ComponentJwtRequirementOrList: React.FC<GeneralProps> = ({ veri }) => {
    const [state, setState] = useState<boolean>(false);
    const [stateActiveItem, setStateActiveItem] = useState<number>(0);
    const dispatch = useDispatch();

    const { vTags, loading } = useTags(veri.version, modtag_jwt_requirement_or_list);
    const { selectedTags, handleChangeRedux, handleChangeTag } = useResourceForm({
        version: veri.version,
        reduxStore: veri.reduxStore,
    });

    // Initialize empty array in Redux when component mounts if not exists
    useEffect(() => {
        if (!veri.reduxStore?.requirements) {
            handleChangeResources(
                {
                    version: veri.version,
                    type: ActionType.Update,
                    keys: `${veri.keyPrefix}.requirements`,
                    val: [],
                    resourceType: ResourceType.Resource
                },
                dispatch,
                veri.reduxAction
            );
        }
    }, []);

    if (loading || !vTags.jrol) {
        return null;
    }

    const fieldConfigs: FieldConfigType[] = [
        ...generateFields({
            f: vTags.jrol?.JwtRequirementOrList,
            sf: vTags.jrol?.JwtRequirementOrList_SingleFields,
        }),
    ];

    const handleDeleteRedux = ({ keys, index }: { keys?: string, index?: number }) => {
        const fullKey = keys ?
            `${veri.keyPrefix}.requirements.${index}.${keys}` :
            `${veri.keyPrefix}.requirements.${index}`;

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
        handleChangeResources({ version: veri.version, type: ActionType.Append, keys: `${veri.keyPrefix}.requirements`, val: {}, resourceType: ResourceType.Resource }, dispatch, veri.reduxAction);
    };

    return (
        <>
            <ECard title={veri.title}>
                <HorizonTags veri={{
                    tags: vTags.jrol?.JwtRequirementOrList,
                    selectedTags: selectedTags,
                    unsupportedTags: [],
                    handleChangeTag: handleChangeTag,
                    keyPrefix: veri.keyPrefix,
                    tagPrefix: '',
                    specificTagPrefix: {},
                    required: [],
                    onlyOneTag: [],
                }} />
                <Divider style={{ marginTop: '8px', marginBottom: '8px' }} type="horizontal" />
                <EForm>
                    <EFields
                        fieldConfigs={fieldConfigs}
                        selectedTags={selectedTags}
                        handleChangeRedux={handleChangeRedux}
                        reduxStore={veri.reduxStore}
                        keyPrefix={veri.keyPrefix}
                        version={veri.version}
                    />
                    <FieldComponent veri={{
                        required: true,
                        selectedTags: selectedTags,
                        keyPrefix: `${veri.keyPrefix}.requirements`,
                        handleChange: null,
                        tag: "requirements",
                        value: veri.reduxStore?.requirements,
                        type: FieldTypes.ArrayIcon,
                        spanNum: 12,
                        condition: Array.isArray(veri.reduxStore?.requirements),
                        drawerShow: () => {
                            setState(true);
                        }
                    }} />
                </EForm>
            </ECard>
            <Drawer
                key={`drawer_${veri.keyPrefix}`}
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

                {!veri.reduxStore?.requirements || veri.reduxStore.requirements.length === 0 ? (
                    <div style={{
                        background: 'var(--empty-state-gradient)',
                        border: '2px dashed var(--border-default)',
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
                                        No JWT Requirements (OR)
                                    </h4>
                                    <p style={{
                                        color: 'var(--text-secondary)',
                                        margin: 0,
                                        fontSize: 14,
                                        lineHeight: 1.5
                                    }}>
                                        Click the + button above to add JWT requirements. Any one of them must pass.
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
                            veri.reduxStore?.requirements?.map((data: any, index: number) => (
                                {
                                    label: (
                                        <span style={{
                                            fontWeight: 500,
                                            color: 'var(--text-primary)',
                                            fontSize: 14
                                        }}>
                                            {`${index}) JWT Requirement (OR)`}
                                        </span>
                                    ),
                                    extra:
                                        <Button
                                            key={"btn_ " + index.toString()}
                                            icon={<DeleteTwoTone twoToneColor="var(--color-danger)" />}
                                            size='small'
                                            onClick={(e) => { onRemove(e, index) }}
                                            iconPosition={"end"}
                                            style={{
                                                borderRadius: 8,
                                                border: '1px solid var(--color-danger-border)',
                                                background: 'var(--color-danger-bg)',
                                            }}
                                        />,
                                    style: {
                                        marginBottom: 8,
                                        borderRadius: 12,
                                        border: '1px solid var(--border-default)',
                                        background: 'var(--card-bg)',
                                        backdropFilter: 'blur(10px)',
                                    },
                                    children:
                                        <ComponentJwtRequirement veri={{
                                            version: veri.version,
                                            keyPrefix: `${veri.keyPrefix}.requirements.${index}`,
                                            reduxStore: data,
                                            reduxAction: veri.reduxAction,
                                        }} />
                                })
                            )}
                    />
                )}
                <ElchiButton onlyText style={{ marginTop: 15 }} onClick={() => setState(false)}>Close</ElchiButton>
            </Drawer>
        </>
    )
};

export default memorizeComponent(ComponentJwtRequirementOrList, compareVeri);
