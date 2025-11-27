import React, { useState } from "react";
import { Button, Collapse, Drawer, Empty } from 'antd';
import { compareVeri, memorizeComponent } from "@/hooks/useMemoComponent";
import { FieldComponent } from "@/elchi/components/common/FormItems";
import { FieldTypes } from "@/common/statics/general";
import ComponentJwtHeader from "./JwtHeader";
import { handleChangeResources } from "@/redux/dispatcher";
import { ActionType, ResourceType } from "@/redux/reducer-helpers/common";
import { useDispatch } from "react-redux";
import { DeleteTwoTone, UnorderedListOutlined } from "@ant-design/icons";
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

const ComponentJwtHeaders: React.FC<GeneralProps> = ({ veri }) => {
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
                            image={<UnorderedListOutlined style={{ fontSize: 48, color: '#94a3b8' }} />}
                            description={
                                <div style={{ marginTop: 16 }}>
                                    <h4 style={{
                                        color: '#475569',
                                        marginBottom: 8,
                                        fontSize: 16,
                                        fontWeight: 500
                                    }}>
                                        No JWT Headers
                                    </h4>
                                    <p style={{
                                        color: '#64748b',
                                        margin: 0,
                                        fontSize: 14,
                                        lineHeight: 1.5
                                    }}>
                                        Click the + button above to add your first JWT header configuration
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
                                            {`${index}) JWT Header`}
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
                                        <ComponentJwtHeader veri={{
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
                )}
                <ElchiButton onlyText style={{ marginTop: 15 }} onClick={() => setState(false)}>Close</ElchiButton>
            </Drawer>
        </>
    )
};

export default memorizeComponent(ComponentJwtHeaders, compareVeri);
