import React, { useState } from "react";
import { Col, Divider } from 'antd';
import { HorizonTags } from "@/elchi/components/common/HorizonTags";
import { compareVeri, memorizeComponent } from "@/hooks/useMemoComponent";
import { FieldConfigType, startsWithAny } from "@/utils/tools";
import useResourceForm from "@/hooks/useResourceForm";
import ECard from "@/elchi/components/common/ECard";
import { modtag_rbac_principal } from "./_modtag_";
import { useTags } from "@/hooks/useTags";
import { generateFields } from "@/common/generate-fields";
import CommonComponentHeaderMatcher from "@resources/common/HeaderMatcher/HeaderMatcherSingle";
import { navigateCases } from "@/elchi/helpers/navigate-cases";
import { ResourceAction } from "@/redux/reducers/slice";
import { FieldTypes } from "@/common/statics/general";
import CommonComponentCidrRange from "@resources/common/CidrRange/CidrRange";
import CommonComponentPathMatcher from "@resources/common/PathMatcher/PathMatcher";
import ComponentAuthenticated from "./authenticated";
import CommonComponentAndOrIds from "./and_or_ids";
import { ConditionalComponent } from "@/elchi/components/common/ConditionalComponent";
import { EForm } from "@/elchi/components/common/e-components/EForm";
import { EFields } from "@/elchi/components/common/e-components/EFields";


type GeneralProps = {
    veri: {
        version: string;
        reduxStore: any;
        keyPrefix: string;
        title: string;
    }
};

const ComponentPrincipal: React.FC<GeneralProps> = ({ veri }) => {
    const { vTags } = useTags(veri.version, modtag_rbac_principal);
    const [drawerStates, setDrawerStates] = useState<{ [key: string]: boolean }>({});
    const { selectedTags, handleChangeRedux, handleChangeTag } = useResourceForm({
        version: veri.version,
        reduxStore: veri.reduxStore,
    });

    const toggleDrawer = (key: string, isOpen: boolean) => {
        setDrawerStates(prevStates => ({ ...prevStates, [key]: isOpen }));
    };

    const fieldConfigs: FieldConfigType[] = [
        ...generateFields({
            f: vTags.rprp?.Principal,
            sf: vTags.rprp?.Principal_SingleFields,
        }),
        {
            type: FieldTypes.ArrayIcon, tag: "header", tagPrefix: "rule", fieldPath: 'identifier.header', condition: true, navigate: true, keyPrefix: veri.keyPrefix, spanNum: 4,
            drawerShow: () => toggleDrawer(`${veri.keyPrefix}.header`, true)
        },
        {
            type: FieldTypes.ArrayIcon, tag: "and_ids", tagPrefix: "rule", fieldPath: 'identifier.and_ids', condition: true, navigate: true, keyPrefix: veri.keyPrefix, spanNum: 4,
            drawerShow: () => toggleDrawer(`${veri.keyPrefix}.and_ids`, true)
        },
        {
            type: FieldTypes.ArrayIcon, tag: "or_ids", tagPrefix: "rule", fieldPath: 'identifier.or_ids', condition: true, navigate: true, keyPrefix: veri.keyPrefix, spanNum: 4,
            drawerShow: () => toggleDrawer(`${veri.keyPrefix}.or_ids`, true)
        },
    ];

    return (
        <ECard title={veri.title}>
            <HorizonTags veri={{
                tags: vTags.rprp?.Principal,
                selectedTags: selectedTags,
                unsupportedTags: ["identifier.metadata", "identifier.filter_state"],
                handleChangeTag: handleChangeTag,
                keyPrefix: veri.keyPrefix,
                tagPrefix: 'identifier',
                onlyOneTag: [[
                    "identifier.and_ids",
                    "identifier.or_ids",
                    "identifier.any",
                    "identifier.authenticated",
                    "identifier.source_ip",
                    "identifier.direct_remote_ip",
                    "identifier.remote_ip",
                    "identifier.header",
                    "identifier.url_path",
                    "identifier.not_id",
                ]]
            }} />
            <Divider style={{ marginTop: '8px', marginBottom: '8px' }} type="horizontal" />
            <Col md={24}>
                <EForm>
                    <EFields
                        fieldConfigs={fieldConfigs}
                        selectedTags={selectedTags}
                        handleChangeRedux={handleChangeRedux}
                        reduxStore={veri.reduxStore}
                        keyPrefix={veri.keyPrefix}
                        tagPrefix='identifier'
                        version={veri.version}
                    />
                </EForm>
                <ConditionalComponent
                    shouldRender={startsWithAny("identifier.authenticated", selectedTags)}
                    Component={ComponentAuthenticated}
                    componentProps={{
                        version: veri.version,
                        reduxStore: navigateCases(veri.reduxStore, "identifier.authenticated"),
                        keyPrefix: `${veri.keyPrefix}.authenticated`,
                        id: `identifier.authenticated_0`,
                    }}
                />
                <ConditionalComponent
                    shouldRender={startsWithAny("identifier.source_ip", selectedTags)}
                    Component={CommonComponentCidrRange}
                    componentProps={{
                        version: veri.version,
                        reduxStore: navigateCases(veri.reduxStore, "identifier.source_ip"),
                        keyPrefix: `${veri.keyPrefix}.source_ip`,
                        title: "Source Ip",
                        id: `identifier.source_ip_0`,
                    }}
                />
                <ConditionalComponent
                    shouldRender={startsWithAny("identifier.direct_remote_ip", selectedTags)}
                    Component={CommonComponentCidrRange}
                    componentProps={{
                        version: veri.version,
                        reduxStore: navigateCases(veri.reduxStore, "identifier.direct_remote_ip"),
                        keyPrefix: `${veri.keyPrefix}.direct_remote_ip`,
                        title: "Direct Remote Ip",
                        id: `identifier.direct_remote_ip_0`,
                    }}
                />
                <ConditionalComponent
                    shouldRender={startsWithAny("identifier.remote_ip", selectedTags)}
                    Component={CommonComponentCidrRange}
                    componentProps={{
                        version: veri.version,
                        reduxStore: navigateCases(veri.reduxStore, "identifier.remote_ip"),
                        keyPrefix: `${veri.keyPrefix}.remote_ip`,
                        title: "Remote Ip",
                        id: `identifier.remote_ip_0`,
                    }}
                />
                <ConditionalComponent
                    shouldRender={startsWithAny("identifier.header", selectedTags)}
                    Component={CommonComponentHeaderMatcher}
                    componentProps={{
                        version: veri.version,
                        keyPrefix: `${veri.keyPrefix}.header`,
                        reduxStore: navigateCases(veri.reduxStore, "identifier.header"),
                        reduxAction: ResourceAction,
                        tagMatchPrefix: `header`,
                        parentName: "Header",
                        drawerOpen: drawerStates[`${veri.keyPrefix}.header`],
                        drawerClose: () => toggleDrawer(`${veri.keyPrefix}.header`, false),
                        id: `identifier.header_0`,
                    }}
                />
                <ConditionalComponent
                    shouldRender={startsWithAny("identifier.url_path", selectedTags)}
                    Component={CommonComponentPathMatcher}
                    componentProps={{
                        version: veri.version,
                        reduxStore: navigateCases(veri.reduxStore, "identifier.url_path"),
                        keyPrefix: `${veri.keyPrefix}.url_path`,
                        title: "Url Path",
                        id: `identifier.url_path_0`,
                    }}
                />
                <ConditionalComponent
                    shouldRender={startsWithAny("identifier.not_id", selectedTags)}
                    Component={ComponentPrincipal}
                    componentProps={{
                        version: veri.version,
                        reduxStore: navigateCases(veri.reduxStore, "identifier.not_id"),
                        keyPrefix: `${veri.keyPrefix}.not_id`,
                        title: "Not Id",
                        id: `identifier.not_id_0`,
                    }}
                />
                <ConditionalComponent
                    shouldRender={startsWithAny("identifier.and_ids", selectedTags)}
                    Component={CommonComponentAndOrIds}
                    componentProps={{
                        version: veri.version,
                        reduxStore: navigateCases(veri.reduxStore, "identifier.and_ids"),
                        keyPrefix: `${veri.keyPrefix}.and_ids`,
                        title: "And Ids",
                        drawerOpen: drawerStates[`${veri.keyPrefix}.and_ids`],
                        drawerClose: () => toggleDrawer(`${veri.keyPrefix}.and_ids`, false),
                        id: `identifier.and_ids_0`,
                    }}
                />
                <ConditionalComponent
                    shouldRender={startsWithAny("identifier.or_ids", selectedTags)}
                    Component={CommonComponentAndOrIds}
                    componentProps={{
                        version: veri.version,
                        reduxStore: navigateCases(veri.reduxStore, "identifier.or_ids"),
                        keyPrefix: `${veri.keyPrefix}.or_ids`,
                        title: "Or Ids",
                        drawerOpen: drawerStates[`${veri.keyPrefix}.or_ids`],
                        drawerClose: () => toggleDrawer(`${veri.keyPrefix}.or_ids`, false),
                        id: `identifier.or_ids_0`,
                    }}
                />
            </Col>
        </ECard>
    )
};

export default memorizeComponent(ComponentPrincipal, compareVeri);
