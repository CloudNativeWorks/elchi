import React from "react";
import { Card, Col, Divider, Row } from 'antd';
import { memorizeComponent, compareVeri } from "@/hooks/useMemoComponent";
import { HorizonTags } from "@/elchi/components/common/HorizonTags";
import { navigateCases } from "@/elchi/helpers/navigate-cases";
import { FieldConfigType, startsWithAny } from "@/utils/tools";
import CommonComponentRegexMatchAndSubstitute from '../common/RegexMatchAndSubstitute/RegexMatchAndSubstitute';
import useResourceForm from "@/hooks/useResourceForm";
import { useTags } from "@/hooks/useTags";
import { modtag_redirect_action } from "./_modtag_";
import { generateFields } from "@/common/generate-fields";
import { ConditionalComponent } from "../../common/ConditionalComponent";
import { EForm } from "../../common/e-components/EForm";
import { EFields } from "../../common/e-components/EFields";


type GeneralProps = {
    veri: {
        version: string;
        keyPrefix: string;
        reduxStore: any;
        reduxAction: any;
        tagMatchPrefix: string;
    }
};

const ComponentRedirect: React.FC<GeneralProps> = ({ veri }) => {
    const { vTags } = useTags(veri.version, modtag_redirect_action);
    const { selectedTags, handleChangeRedux, handleChangeTag } = useResourceForm({
        version: veri.version,
        reduxStore: veri.reduxStore,
    });

    const fieldConfigs: FieldConfigType[] = [
        ...generateFields({
            f: vTags.ra?.RedirectAction,
            sf: vTags.ra?.RedirectAction_SingleFields,
        }),
    ]

    return (
        <Card size='small' title={'Redirect'} styles={{ header: { background: 'white', color: 'black' } }} style={{ marginBottom: 8, width: '100%' }}>
            <Row>
                <HorizonTags veri={{
                    tags: vTags.ra?.RedirectAction,
                    selectedTags: selectedTags,
                    handleChangeTag: handleChangeTag,
                    tagPrefix: ``,
                    tagMatchPrefix: `${veri.tagMatchPrefix}`,
                    keyPrefix: veri.keyPrefix,
                    onlyOneTag: [
                        ['scheme_rewrite_specifier.https_redirect', 'scheme_rewrite_specifier.scheme_redirect'],
                        ['path_rewrite_specifier.path_redirect', 'path_rewrite_specifier.prefix_rewrite', 'path_rewrite_specifier.regex_rewrite']
                    ],
                    specificTagPrefix: {
                        'https_redirect': 'scheme_rewrite_specifier',
                        'scheme_redirect': 'scheme_rewrite_specifier',
                        'prefix_rewrite': 'path_rewrite_specifier',
                        'path_redirect': 'path_rewrite_specifier',
                        'regex_rewrite': 'path_rewrite_specifier'
                    }
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
                        shouldRender={startsWithAny("path_rewrite_specifier.regex_rewrite", selectedTags)}
                        Component={CommonComponentRegexMatchAndSubstitute}
                        componentProps={{
                            version: veri.version,
                            reduxAction: veri.reduxAction,
                            reduxStore: navigateCases(veri.reduxStore, 'path_rewrite_specifier.regex_rewrite'),
                            keyPrefix: `${veri.keyPrefix}.regex_rewrite`,
                            tagPrefix: `path_rewrite_specifier.regex_rewrite`,
                            tagMatchPrefix: `${veri.tagMatchPrefix}.path_rewrite_specifier.regex_rewrite`,
                            id: `${veri.keyPrefix}.regex_rewrite`,
                        }}
                    />
                </Col>
            </Row>
        </Card>
    )
};

export default memorizeComponent(ComponentRedirect, compareVeri);
