import React from "react";
import { Col, Divider } from 'antd';
import { HorizonTags } from "@/elchi/components/common/HorizonTags";
import { compareVeri, memorizeComponent } from "@/hooks/useMemoComponent";
import useResourceForm from "@/hooks/useResourceForm";
import { modtag_rbac_principal_authenticated } from "./_modtag_";
import { useTags } from "@/hooks/useTags";
import { startsWithAny } from "@/utils/tools";
import CommonComponentStringMatcher from "@resources/common/StringMatcher/StringMatcher";
import { ResourceAction } from "@/redux/reducers/slice";
import { ConditionalComponent } from "@/elchi/components/common/ConditionalComponent";


type GeneralProps = {
    veri: {
        version: string;
        reduxStore: any;
        keyPrefix: string;
    }
};

const ComponentAuthenticated: React.FC<GeneralProps> = ({ veri }) => {
    const { vTags } = useTags(veri.version, modtag_rbac_principal_authenticated);
    const { selectedTags, handleChangeTag } = useResourceForm({
        version: veri.version,
        reduxStore: veri.reduxStore,
    });

    return (
        <>
            <HorizonTags veri={{
                tags: vTags.rpa?.Principal_Authenticated,
                selectedTags: selectedTags,
                unsupportedTags: [],
                handleChangeTag: handleChangeTag,
                keyPrefix: veri.keyPrefix,
            }} />
            <Divider style={{ marginTop: '8px', marginBottom: '8px' }} type="horizontal" />
            <Col md={24}>
                <ConditionalComponent
                    shouldRender={startsWithAny("principal_name", selectedTags)}
                    Component={CommonComponentStringMatcher}
                    componentProps={{
                        version: veri.version,
                        reduxAction: ResourceAction,
                        reduxStore: veri.reduxStore?.principal_name,
                        keyPrefix: `${veri.keyPrefix}.principal_name`,
                        tagMatchPrefix: "rule",
                        title: "Principal Name",
                        id: `principal_name_0`,
                    }}
                />
            </Col>
        </>
    )
};

export default memorizeComponent(ComponentAuthenticated, compareVeri);
