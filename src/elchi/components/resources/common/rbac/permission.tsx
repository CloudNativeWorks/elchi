import React, { useState } from "react";
import { Col, Divider } from 'antd';
import { HorizonTags } from "@/elchi/components/common/HorizonTags";
import { compareVeri, memorizeComponent } from "@/hooks/useMemoComponent";
import { FieldConfigType, startsWithAny } from "@/utils/tools";
import useResourceForm from "@/hooks/useResourceForm";
import ECard from "@/elchi/components/common/ECard";
import { modtag_rbac_permission } from "./_modtag_";
import { useTags } from "@/hooks/useTags";
import { generateFields } from "@/common/generate-fields";
import ComponentUTMLink from "@/elchi/components/resources/extension/utm/UtmLink";
import { navigateCases } from "@/elchi/helpers/navigate-cases";
import CommonComponentHeaderMatcher from "@resources/common/HeaderMatcher/HeaderMatcherSingle";
import { ResourceAction } from "@/redux/reducers/slice";
import { FieldTypes } from "@/common/statics/general";
import CommonComponentPathMatcher from "@resources/common/PathMatcher/PathMatcher";
import CommonComponentCidrRange from "@resources/common/CidrRange/CidrRange";
import CommonComponentStringMatcher from "@resources/common/StringMatcher/StringMatcher";
import CommonComponentInt32Range from "@resources/common/Int32Range/Int32Range";
import CommonComponentAndOrRules from "./and_or_rules";
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

const ComponentPermission: React.FC<GeneralProps> = ({ veri }) => {
    const { vTags } = useTags(veri.version, modtag_rbac_permission);
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
            f: vTags.rperm?.Permission,
            sf: vTags.rperm?.Permission_SingleFields,
        }),
        {
            type: FieldTypes.ArrayIcon, tag: "header", tagPrefix: "rule", fieldPath: 'rule.header', condition: true, navigate: true, keyPrefix: veri.keyPrefix, spanNum: 4,
            drawerShow: () => toggleDrawer(`${veri.keyPrefix}.header`, true)
        },
        {
            type: FieldTypes.ArrayIcon, tag: "and_rules", tagPrefix: "rule", fieldPath: 'rule.and_rules', condition: true, navigate: true, keyPrefix: veri.keyPrefix, spanNum: 4,
            drawerShow: () => toggleDrawer(`${veri.keyPrefix}.and_rule`, true)
        },
        {
            type: FieldTypes.ArrayIcon, tag: "or_rules", tagPrefix: "rule", fieldPath: 'rule.or_rules', condition: true, navigate: true, keyPrefix: veri.keyPrefix, spanNum: 4,
            drawerShow: () => toggleDrawer(`${veri.keyPrefix}.or_rule`, true)
        },
    ];

    return (
        <ECard title={veri.title}>
            <HorizonTags veri={{
                tags: vTags.rperm?.Permission,
                selectedTags: selectedTags,
                unsupportedTags: ["rule.metadata", "rule.matcher"],
                handleChangeTag: handleChangeTag,
                keyPrefix: veri.keyPrefix,
                tagPrefix: 'rule',
                onlyOneTag: [[
                    "rule.and_rules",
                    "rule.or_rules",
                    "rule.any",
                    "rule.header",
                    "rule.url_path",
                    "rule.destination_ip",
                    "rule.destination_port",
                    "rule.destination_port_range",
                    "rule.not_rule",
                    "rule.requested_server_name",
                    "rule.uri_template",
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
                        tagPrefix='rule'
                        version={veri.version}
                    />
                </EForm>
                <ConditionalComponent
                    shouldRender={startsWithAny("rule.uri_template", selectedTags)}
                    Component={ComponentUTMLink}
                    componentProps={{
                        version: veri.version,
                        reduxStore: navigateCases(veri.reduxStore, "rule.uri_template"),
                        keyPrefix: `${veri.keyPrefix}.uri_template`,
                        prettyName: "uri_template",
                        id: `rule.uri_template_0`,
                    }}
                />
                <ConditionalComponent
                    shouldRender={startsWithAny("rule.header", selectedTags)}
                    Component={CommonComponentHeaderMatcher}
                    componentProps={{
                        version: veri.version,
                        keyPrefix: `${veri.keyPrefix}.header`,
                        reduxStore: navigateCases(veri.reduxStore, "rule.header"),
                        reduxAction: ResourceAction,
                        tagMatchPrefix: `header`,
                        parentName: "Header",
                        drawerOpen: drawerStates[`${veri.keyPrefix}.header`],
                        drawerClose: () => toggleDrawer(`${veri.keyPrefix}.header`, false),
                        id: `rule.header_0`,
                    }}
                />
                <ConditionalComponent
                    shouldRender={startsWithAny("rule.url_path", selectedTags)}
                    Component={CommonComponentPathMatcher}
                    componentProps={{
                        version: veri.version,
                        reduxStore: navigateCases(veri.reduxStore, "rule.url_path"),
                        keyPrefix: `${veri.keyPrefix}.url_path`,
                        title: "Url Path",
                        id: `rule.url_path_0`,
                    }}
                />
                <ConditionalComponent
                    shouldRender={startsWithAny("rule.destination_ip", selectedTags)}
                    Component={CommonComponentCidrRange}
                    componentProps={{
                        version: veri.version,
                        reduxStore: navigateCases(veri.reduxStore, "rule.destination_ip"),
                        keyPrefix: `${veri.keyPrefix}.destination_ip`,
                        title: "Destination Ip",
                        id: `rule.destination_ip_0`,
                    }}
                />
                <ConditionalComponent
                    shouldRender={startsWithAny("rule.requested_server_name", selectedTags)}
                    Component={CommonComponentStringMatcher}
                    componentProps={{
                        version: veri.version,
                        reduxAction: ResourceAction,
                        reduxStore: navigateCases(veri.reduxStore, "rule.requested_server_name"),
                        keyPrefix: `${veri.keyPrefix}.requested_server_name`,
                        tagMatchPrefix: "rule",
                        title: "Requested Server Name",
                        id: `rule.requested_server_name_0`,
                    }}
                />
                <ConditionalComponent
                    shouldRender={startsWithAny("rule.destination_port_range", selectedTags)}
                    Component={CommonComponentInt32Range}
                    componentProps={{
                        version: veri.version,
                        reduxStore: navigateCases(veri.reduxStore, "rule.destination_port_range"),
                        keyPrefix: `${veri.keyPrefix}.destination_port_range`,
                        title: "Destination Port Range",
                        id: `rule.destination_port_range_0`,
                    }}
                />
                <ConditionalComponent
                    shouldRender={startsWithAny("rule.not_rule", selectedTags)}
                    Component={ComponentPermission}
                    componentProps={{
                        version: veri.version,
                        reduxStore: navigateCases(veri.reduxStore, "rule.not_rule"),
                        keyPrefix: `${veri.keyPrefix}.not_rule`,
                        title: "Not Rule",
                        id: `rule.not_rule_0`,
                    }}
                />
                <ConditionalComponent
                    shouldRender={startsWithAny("rule.and_rules", selectedTags)}
                    Component={CommonComponentAndOrRules}
                    componentProps={{
                        version: veri.version,
                        reduxStore: navigateCases(veri.reduxStore, "rule.and_rules"),
                        keyPrefix: `${veri.keyPrefix}.and_rules`,
                        title: "And Rules",
                        drawerOpen: drawerStates[`${veri.keyPrefix}.and_rule`],
                        drawerClose: () => toggleDrawer(`${veri.keyPrefix}.and_rule`, false),
                        id: `rule.and_rules_0`,
                    }}
                />
                <ConditionalComponent
                    shouldRender={startsWithAny("rule.or_rules", selectedTags)}
                    Component={CommonComponentAndOrRules}
                    componentProps={{
                        version: veri.version,
                        reduxStore: navigateCases(veri.reduxStore, "rule.or_rules"),
                        keyPrefix: `${veri.keyPrefix}.or_rules`,
                        title: "Or Rules",
                        drawerOpen: drawerStates[`${veri.keyPrefix}.or_rule`],
                        drawerClose: () => toggleDrawer(`${veri.keyPrefix}.or_rule`, false),
                        id: `rule.or_rules_0`,
                    }}
                />
            </Col>
        </ECard>
    )
};

export default memorizeComponent(ComponentPermission, compareVeri);
