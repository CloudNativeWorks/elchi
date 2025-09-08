import React, { useEffect, useState, useCallback } from "react";
import { Col, Tabs } from 'antd';
import { useDispatch } from "react-redux";
import { ActionType, ResourceType } from "@/redux/reducer-helpers/common";
import { handleChangeResources } from "@/redux/dispatcher";
import { compareVeri, memorizeComponent } from "@/hooks/useMemoComponent";
import { ResourceAction } from "@/redux/reducers/slice";
import { useCustomGetQuery } from "@/common/api";
import { FieldComponent } from "@/elchi/components/common/FormItems";
import { FieldTypes } from "@/common/statics/general";
import { ByteToObj, ObjToBase64 } from "@/utils/typed-config-op";
import { useProjectVariable } from "@/hooks/useProjectVariable";
import useTabManager from "@/hooks/useTabManager";
import ECard from "@/elchi/components/common/ECard";
import { EForm } from "@/elchi/components/common/e-components/EForm";
import { debounce } from "lodash";


type GeneralProps = {
    veri: {
        version: string;
        reduxStore: any;
        keyPrefix: string;
        tagMatchPrefix: string;
        gtype: string;
        prettyName: string;
    }
};

type GeneralPropsChild = {
    veri: {
        version: string;
        reduxStore: any;
        keyPrefix: string;
        tagMatchPrefix: string;
        gtype: string;
        prettyName: string;
        queryData: any;
        onSearch: (value: string) => void;
    }
};

const ComponentHCEFSLink: React.FC<GeneralProps> = ({ veri }) => {
    const { project } = useProjectVariable();
    
    const [searchQuery, setSearchQuery] = useState<string>('');
    const debouncedSearch = useCallback(debounce((value: string) => setSearchQuery(value), 300), []);
    
    const { data: queryData } = useCustomGetQuery({
        queryKey: `custom_hcefs_${searchQuery}`,
        enabled: true,
        path: `custom/resource_list_search?collection=extensions&gtype=${veri.gtype}&version=${veri.version}&project=${project}&search=${searchQuery}`
    });

    const { state, onChangeTabs, addTab } = useTabManager({
        initialActiveTab: "0",
        reduxStore: veri.reduxStore,
        keyPrefix: veri.keyPrefix,
        version: veri.version,
        reduxAction: ResourceAction,
    });

    return (
        <ECard title="Event Logger">
            <Tabs
                onChange={onChangeTabs}
                type="editable-card"
                activeKey={state.activeTab}
                onEdit={addTab}
                style={{ width: "99%" }}
                items={veri.reduxStore?.map((data: any, index: number) => {
                    return {
                        key: index.toString(),
                        label: "Event Log: " + index.toString(),
                        forceRender: true,
                        children: (
                            <ComponentHCEFSLinkChild key="hcefs_link" veri={{
                                queryData: queryData,
                                version: veri.version,
                                reduxStore: data,
                                keyPrefix: `${veri.keyPrefix}.${index}`,
                                tagMatchPrefix: veri.tagMatchPrefix,
                                gtype: veri.gtype,
                                prettyName: veri.prettyName,
                                onSearch: debouncedSearch,
                            }} />
                        )
                    }
                })} />
        </ECard>
    )
};


const ComponentHCEFSLinkChild: React.FC<GeneralPropsChild> = ({ veri }) => {
    const dispatch = useDispatch();
    const [state, setState] = useState<any>()

    useEffect(() => {
        setState(ByteToObj(veri.reduxStore))
    }, [veri.reduxStore]);

    const handleChangeRedux = (_: string, val: string) => {
        const matched_typed = veri.queryData.find((obj: any) => obj.name === val);
        const typed = { name: matched_typed.category, typed_config: { type_url: matched_typed.gtype, value: matched_typed } }
        handleChangeResources({ version: veri.version, type: ActionType.Update, keys: veri.keyPrefix, val: ObjToBase64(typed), resourceType: ResourceType.Resource }, dispatch, ResourceAction);
    };

    return (
        <ECard title={"Event Logger"}>
            <Col md={24}>
                <EForm>
                    <FieldComponent
                        veri={{
                            alwaysShow: true,
                            selectedTags: [],
                            handleChange: handleChangeRedux,
                            tag: `${veri.prettyName}`,
                            value: state?.typed_config?.value?.name,
                            type: FieldTypes.Select,
                            placeholder: `(${veri.prettyName})`,
                            values: veri.queryData?.map((obj: any) => obj.name) || [],
                            keyPrefix: `${veri.keyPrefix}`,
                            spanNum: 12,
                            onSearch: veri.onSearch,
                        }}
                    />
                </EForm>
            </Col>
        </ECard>
    )
};

export default memorizeComponent(ComponentHCEFSLink, compareVeri);
