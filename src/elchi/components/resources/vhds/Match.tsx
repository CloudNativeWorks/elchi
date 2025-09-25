import React, { useState } from 'react';
import { Card, Col, Divider } from 'antd';
import { HorizonTags } from '@/elchi/components/common/HorizonTags';
import { memorizeComponent, compareVeri } from '@/hooks/useMemoComponent';
import { FieldConfigType, matchesEndOrStartOf, startsWithAny } from '@/utils/tools';
import { FieldTypes } from '@/common/statics/general';
import CommonComponentRuntimeFractionalPercent from '../common/RuntimeFractionalPercent/RuntimeFractionalPercent';
import CommonComponentHeaderMatcher from '../common/HeaderMatcher/HeaderMatcher';
import ComponentQueryParameter from './QueryParameter';
import ComponentTlsContext from './TlsContext';
import useResourceForm from '@/hooks/useResourceForm';
import { useTags } from '@/hooks/useTags';
import { modtag_route_match, modtag_us_virtualhost } from './_modtag_';
import { generateFields } from '@/common/generate-fields';
import { navigateCases } from '@/elchi/helpers/navigate-cases';
import ComponentUTMLink from '@/elchi/components/resources/extension/utm/UtmLink';
import { ConditionalComponent } from '../../common/ConditionalComponent';
import { EForm } from '../../common/e-components/EForm';
import { EFields } from '../../common/e-components/EFields';


type GeneralProps = {
    veri: {
        version: string;
        reduxStore: any;
        reduxAction: any,
        keyPrefix: string,
        tagMatchPrefix: string,
    }
};

interface State {
    show_headers: boolean;
    show_queryParameters: boolean;
}

const ComponentRouteMatch: React.FC<GeneralProps> = ({ veri }) => {
    const { vTags } = useTags(veri.version, modtag_route_match);
    const { selectedTags, handleChangeRedux, handleChangeTag } = useResourceForm({
        version: veri.version,
        reduxStore: veri.reduxStore,
    });

    const [state, setState] = useState<State>({
        show_headers: false,
        show_queryParameters: false
    });

    const fieldConfigs: FieldConfigType[] = [
        ...generateFields({
            f: vTags.rm?.RouteMatch,
            sf: vTags.rm?.RouteMatch_SingleFields,
            r: ["prefix"]
        }),
        {
            type: FieldTypes.Regex,
            tag: "safe_regex",
            fieldPath: 'path_specifier.safe_regex.regex',
            tagPrefix: 'path_specifier',
            additionalTags: ['regex'],
            navigate: true,
            keyPrefix: veri.keyPrefix,
            placeHolder: '(google regex)',
            spanNum: 24,
        },
        {
            type: FieldTypes.ArrayIcon, tag: "headers", fieldPath: 'headers', keyPrefix: veri.keyPrefix, spanNum: 6,
            drawerShow: () => {
                const updatedState = { ...state };
                updatedState.show_headers = true;
                setState(updatedState);
            }
        },
        {
            type: FieldTypes.ArrayIcon, tag: "query_parameters", fieldPath: 'query_parameters', keyPrefix: veri.keyPrefix, spanNum: 6,
            drawerShow: () => {
                const updatedState = { ...state };
                updatedState.show_queryParameters = true;
                setState(updatedState);
            }
        },
        { type: FieldTypes.EmptyObject, tag: "grpc", fieldPath: 'grpc', additionalTags: ['grpc.$type'], keyPrefix: veri.keyPrefix, spanNum: 6 },
    ]

    return (
        <Card size='small' title={'Match'} styles={{ header: { background: 'white', color: 'black' } }} style={{ marginBottom: 8, width: '100%' }}>
            <HorizonTags veri={{
                tags: vTags.rm?.RouteMatch,
                selectedTags: selectedTags,
                unsupportedTags: modtag_us_virtualhost['match'],
                handleChangeTag: handleChangeTag,
                tagMatchPrefix: veri.tagMatchPrefix,
                keyPrefix: veri.keyPrefix,
                tagPrefix: ``,
                specificTagPrefix: {
                    'prefix': 'path_specifier',
                    'path': 'path_specifier',
                    'safe_regex': 'path_specifier',
                    'path_separated_prefix': 'path_specifier',
                    'path_match_policy': 'path_specifier',
                },
                onlyOneTag: [['path_specifier.prefix', 'path_specifier.path', 'path_specifier.safe_regex', 'path_specifier.path_separated_prefix', 'path_specifier.path_match_policy']],
                required: ["prefix", "path", "safe_regex", "path_separated_prefix"],
            }} />
            <Divider style={{ marginTop: '8px', marginBottom: '8px' }} type='horizontal' />
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
            </Col>
            <ConditionalComponent
                shouldRender={startsWithAny("path_specifier.path_match_policy", selectedTags)}
                Component={ComponentUTMLink}
                componentProps={{
                    version: veri.version,
                    reduxStore: navigateCases(veri.reduxStore, "path_specifier.path_match_policy"),
                    keyPrefix: `${veri.keyPrefix}.path_match_policy`,
                    prettyName: "path_match_policy",
                    id: `${veri.keyPrefix}.path_match_policy`,
                }}
            />
            <ConditionalComponent
                shouldRender={startsWithAny("runtime_fraction", selectedTags)}
                Component={CommonComponentRuntimeFractionalPercent}
                componentProps={{
                    version: veri.version,
                    reduxAction: veri.reduxAction,
                    reduxStore: veri.reduxStore?.runtime_fraction,
                    keyPrefix: `${veri.keyPrefix}.runtime_fraction`,
                    tagPrefix: `runtime_fraction`,
                    tagMatchPrefix: `${veri.tagMatchPrefix}.runtime_fraction`,
                    title: "Runtime Fraction",
                    id: `${veri.keyPrefix}.runtime_fraction`,
                }}
            />
            <ConditionalComponent
                shouldRender={matchesEndOrStartOf("tls_context", selectedTags)}
                Component={ComponentTlsContext}
                componentProps={{
                    version: veri.version,
                    reduxStore: veri.reduxStore?.tls_context,
                    reduxAction: veri.reduxAction,
                    keyPrefix: `${veri.keyPrefix}.tls_context`,
                    tagMatchPrefix: `${veri.tagMatchPrefix}.tls_context`,
                    id: `${veri.keyPrefix}.tls_context`,
                }}
            />
            <ConditionalComponent
                shouldRender={startsWithAny("headers", selectedTags)}
                Component={CommonComponentHeaderMatcher}
                componentProps={{
                    version: veri.version,
                    keyPrefix: `${veri.keyPrefix}.headers`,
                    drawerOpen: state.show_headers,
                    reduxStore: veri.reduxStore?.headers,
                    reduxAction: veri.reduxAction,
                    tagMatchPrefix: `${veri.tagMatchPrefix}.headers`,
                    parentName: "Headers",
                    drawerClose: () => {
                        const updatedState = { ...state };
                        updatedState.show_headers = false;
                        setState(updatedState);
                    },
                    id: `${veri.keyPrefix}.headers`,
                }}
            />
            <ConditionalComponent
                shouldRender={startsWithAny("query_parameters", selectedTags)}
                Component={ComponentQueryParameter}
                componentProps={{
                    version: veri.version,
                    keyPrefix: `${veri.keyPrefix}.query_parameters`,
                    drawerOpen: state.show_queryParameters,
                    reduxStore: veri.reduxStore?.query_parameters,
                    reduxAction: veri.reduxAction,
                    tagMatchPrefix: `${veri.tagMatchPrefix}.query_parameters`,
                    parentName: "Query Parameters",
                    drawerClose: () => {
                        const updatedState = { ...state };
                        updatedState.show_queryParameters = false;
                        setState(updatedState);
                    },
                    id: `${veri.keyPrefix}.query_parameters`,
                }}
            />
        </Card>
    )
};

export default memorizeComponent(ComponentRouteMatch, compareVeri);
