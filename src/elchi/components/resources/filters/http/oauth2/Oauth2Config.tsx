import React, { useState } from "react";
import { Col, Divider } from 'antd';
import { HorizonTags } from "@/elchi/components/common/HorizonTags";
import { compareVeri, memorizeComponent } from "@/hooks/useMemoComponent";
import { FieldConfigType, matchesEndOrStartOf, startsWithAny } from "@/utils/tools";
import useResourceForm from "@/hooks/useResourceForm";
import ECard from "@/elchi/components/common/ECard";
import { modtag_oauth2_config } from "./_modtag_";
import { useTags } from "@/hooks/useTags";
import { generateFields } from "@/common/generate-fields";
import CommonComponentPathMatcher from "@resources/common/PathMatcher/PathMatcher";
import { ConditionalComponent } from "@/elchi/components/common/ConditionalComponent";
import CommonComponentHeaderMatcher from "@resources/common/HeaderMatcher/HeaderMatcher";
import { ResourceAction } from "@/redux/reducers/slice";
import { FieldTypes } from "@/common/statics/general";
import CommonComponentCoreRetryPolicy from "@resources/common/CoreRetryPolicy/RetryPolicy";
import CommonComponentHttpUri from "@resources/common/HttpUri/HttpUri";
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

interface State {
    show_pass_through_matcher: boolean;
    show_deny_redirect_matcher: boolean;
}

const ComponentOAuth2Config: React.FC<GeneralProps> = ({ veri }) => {
    const { vTags } = useTags(veri.version, modtag_oauth2_config);
    const { selectedTags, handleChangeRedux, handleChangeTag } = useResourceForm({
        version: veri.version,
        reduxStore: veri.reduxStore,
    });

    const [state, setState] = useState<State>({
        show_pass_through_matcher: false,
        show_deny_redirect_matcher: false
    });

    const fieldConfigs: FieldConfigType[] = [
        ...generateFields({
            f: vTags.oc?.OAuth2Config,
            sf: vTags.oc?.OAuth2Config_SingleFields,
            r: ["authorization_endpoint", "redirect_uri"]
        }),
        {
            type: FieldTypes.ArrayIcon, tag: "pass_through_matcher", fieldPath: 'pass_through_matcher', keyPrefix: veri.keyPrefix, spanNum: 6,
            drawerShow: () => {
                const updatedState = { ...state };
                updatedState.show_pass_through_matcher = true;
                setState(updatedState);
            }
        },
        {
            type: FieldTypes.ArrayIcon, tag: "deny_redirect_matcher", fieldPath: 'deny_redirect_matcher', keyPrefix: veri.keyPrefix, spanNum: 6,
            drawerShow: () => {
                const updatedState = { ...state };
                updatedState.show_deny_redirect_matcher = true;
                setState(updatedState);
            }
        },
    ];

    return (
        <ECard title={veri.title}>
            <HorizonTags veri={{
                tags: vTags.oc?.OAuth2Config,
                selectedTags: selectedTags,
                unsupportedTags: [],
                handleChangeTag: handleChangeTag,
                keyPrefix: veri.keyPrefix,
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
                        version={veri.version}
                    />
                </EForm>
                <ConditionalComponent
                    shouldRender={startsWithAny("token_endpoint", selectedTags)}
                    Component={CommonComponentHttpUri}
                    componentProps={{
                        version: veri.version,
                        reduxStore: veri.reduxStore?.token_endpoint,
                        keyPrefix: `${veri.keyPrefix}.token_endpoint`,
                        title: "Token Endpoint",
                        id: `token_endpoint_0`,
                    }}
                />
                <ConditionalComponent
                    shouldRender={startsWithAny("redirect_path_matcher", selectedTags)}
                    Component={CommonComponentPathMatcher}
                    componentProps={{
                        version: veri.version,
                        reduxStore: veri.reduxStore?.redirect_path_matcher,
                        keyPrefix: `${veri.keyPrefix}.redirect_path_matcher`,
                        title: "Redirect Path Matcher",
                        id: `redirect_path_matcher_0`,
                    }}
                />
                <ConditionalComponent
                    shouldRender={startsWithAny("signout_path", selectedTags)}
                    Component={CommonComponentPathMatcher}
                    componentProps={{
                        version: veri.version,
                        reduxStore: veri.reduxStore?.signout_path,
                        keyPrefix: `${veri.keyPrefix}.signout_path`,
                        title: "Signout Path",
                        id: `signout_path_0`,
                    }}
                />
                <ConditionalComponent
                    shouldRender={startsWithAny("pass_through_matcher", selectedTags)}
                    Component={CommonComponentHeaderMatcher}
                    componentProps={{
                        version: veri.version,
                        keyPrefix: `${veri.keyPrefix}.pass_through_matcher`,
                        drawerOpen: state.show_pass_through_matcher,
                        reduxStore: veri.reduxStore?.pass_through_matcher,
                        reduxAction: ResourceAction,
                        parentName: "Pass Through Matcher",
                        drawerClose: () => {
                            const updatedState = { ...state };
                            updatedState.show_pass_through_matcher = false;
                            setState(updatedState);
                        },
                        id: `${veri.keyPrefix}.pass_through_matcher`,
                    }}
                />
                <ConditionalComponent
                    shouldRender={startsWithAny("deny_redirect_matcher", selectedTags)}
                    Component={CommonComponentHeaderMatcher}
                    componentProps={{
                        version: veri.version,
                        keyPrefix: `${veri.keyPrefix}.deny_redirect_matcher`,
                        drawerOpen: state.show_deny_redirect_matcher,
                        reduxStore: veri.reduxStore?.deny_redirect_matcher,
                        reduxAction: ResourceAction,
                        parentName: "Deny Redirect Matcher",
                        drawerClose: () => {
                            const updatedState = { ...state };
                            updatedState.show_deny_redirect_matcher = false;
                            setState(updatedState);
                        },
                        id: `${veri.keyPrefix}.deny_redirect_matcher`,
                    }}
                />
                <ConditionalComponent
                    shouldRender={matchesEndOrStartOf("retry_policy", selectedTags)}
                    Component={CommonComponentCoreRetryPolicy}
                    componentProps={{
                        version: veri.version,
                        reduxAction: ResourceAction,
                        reduxStore: veri.reduxStore?.retry_policy,
                        keyPrefix: `${veri.keyPrefix}.retry_policy`,
                        id: `${veri.keyPrefix}_retry_policy`,
                    }}
                />
            </Col>
        </ECard>
    )
};

export default memorizeComponent(ComponentOAuth2Config, compareVeri);
