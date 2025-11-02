import React, { useState, useCallback } from "react";
import { Col, Row, Divider } from 'antd';
import { HorizonTags } from "@/elchi/components/common/HorizonTags";
import { useCustomGetQuery } from "@/common/api";
import { memorizeComponent, compareVeri } from "@/hooks/useMemoComponent";
import { FieldConfigType, startsWithAny } from "@/utils/tools";
import { FieldTypes } from "@/common/statics/general";
import { useProjectVariable } from "@/hooks/useProjectVariable";
import { useTags } from "@/hooks/useTags";
import { modtag_rq_mirror_policy } from "./_modtag_";
import { useModels } from "@/hooks/useModels";
import { generateFields } from "@/common/generate-fields";
import CommonComponentRuntimeFractionalPercent from '../RuntimeFractionalPercent/RuntimeFractionalPercent';
import CCard from "@/elchi/components/common/CopyPasteCard";
import useTabManager from "@/hooks/useTabManager";
import useResourceFormMultiple from "@/hooks/useResourceFormMultiple";
import { ConditionalComponent } from "@/elchi/components/common/ConditionalComponent";
import { EForm } from "@/elchi/components/common/e-components/EForm";
import { EFields } from "@/elchi/components/common/e-components/EFields";
import { ETabs } from "@/elchi/components/common/e-components/ETabs";
import { debounce } from "lodash";


type GeneralProps = {
    veri: {
        version: string;
        reduxAction: any;
        reduxStore: any[] | undefined;
        keyPrefix: string;
        tagMatchPrefix: string;
    }
};

const CommonComponentRequestMirrorPolicy: React.FC<GeneralProps> = ({ veri }) => {
    const { project } = useProjectVariable();
    const { vModels } = useModels(veri.version, modtag_rq_mirror_policy);
    const { vTags } = useTags(veri.version, modtag_rq_mirror_policy);
    const { selectedTags, handleChangeRedux, handleChangeTag } = useResourceFormMultiple({
        version: veri.version,
        reduxStore: veri.reduxStore,
        keyPrefix: veri.keyPrefix,
        reduxAction: veri.reduxAction
    });

    const { state, onChangeTabs, addTab } = useTabManager({
        initialActiveTab: "0",
        reduxStore: veri.reduxStore,
        keyPrefix: veri.keyPrefix,
        version: veri.version,
        reduxAction: veri.reduxAction
    });

    const [searchQuery, setSearchQuery] = useState<string>('');
    const debouncedSearch = useCallback(debounce((value: string) => setSearchQuery(value), 300), []);

    const { data: queryData } = useCustomGetQuery({
        queryKey: `custom_rmp_${searchQuery}`,
        enabled: true,
        path: `custom/resource_list_search?collection=clusters&type=clusters&version=${veri.version}&project=${project}&search=${searchQuery}`
    });

    const fieldConfigs: FieldConfigType[] = [
        { tag: "cluster", type: FieldTypes.Select, placeHolder: "(Cluster)", fieldPath: 'cluster', spanNum: 12, required: true, values: queryData ? queryData.map((item: { name: string }) => item.name) : [], onSearch: debouncedSearch },
        ...generateFields({
            f: vTags.rmp?.RouteAction_RequestMirrorPolicy,
            sf: vTags.rmp?.RouteAction_RequestMirrorPolicy_SingleFields,
            ssn: { "cluster_header": 12 },
            e: ["cluster"],
            r: ["cluster_header", "cluster"]
        }),
    ];

    const tabItems = veri.reduxStore?.map((data: any, index: number) => ({
        key: index.toString(),
        label: `rmp: ${index}`,
        forceRender: true,
        children: (
            <>
                <Row>
                    <HorizonTags veri={{
                        tags: vTags.rmp?.RouteAction_RequestMirrorPolicy,
                        selectedTags: selectedTags[index],
                        unsupportedTags: ["request_headers_mutations"],
                        index: index,
                        tagPrefix: '',
                        tagMatchPrefix: `${veri.tagMatchPrefix}`,
                        handleChangeTag: handleChangeTag,
                        required: ['cluster', 'cluster_header'],
                        onlyOneTag: [['cluster', 'cluster_header']]
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
                    </Col>
                </Row>
                <ConditionalComponent
                    shouldRender={startsWithAny("runtime_fraction", selectedTags[index])}
                    Component={CommonComponentRuntimeFractionalPercent}
                    componentProps={{
                        version: veri.version,
                        reduxAction: veri.reduxAction,
                        reduxStore: data?.runtime_fraction,
                        keyPrefix: `${veri.keyPrefix}.${index}.runtime_fraction`,
                        tagPrefix: `runtime_fraction`,
                        tagMatchPrefix: `${veri.tagMatchPrefix}.runtime_fraction`,
                        title: 'Runtime Fraction',
                        id: `runtime_fraction_0`,
                    }}
                />
            </>
        ),
    }));

    return (
        <CCard ctype="request_mirror_policy" reduxStore={veri.reduxStore} toJSON={vModels.rmp?.RouteAction_RequestMirrorPolicy.toJSON} keys={veri.keyPrefix} Paste={handleChangeRedux} version={veri.version} title="Request Mirror Policies">
            <ETabs
                onChange={onChangeTabs}
                onEdit={addTab}
                activeKey={state.activeTab}
                items={tabItems}
                style={{ width: "99%" }}
                type="editable-card"
            />
        </CCard>
    )
};

export default memorizeComponent(CommonComponentRequestMirrorPolicy, compareVeri);
