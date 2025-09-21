import React, { useState } from "react";
import { Col, Divider } from 'antd';
import { HorizonTags } from "@/elchi/components/common/HorizonTags";
import { compareVeri, memorizeComponent } from "@/hooks/useMemoComponent";
import CCard from "@/elchi/components/common/CopyPasteCard";
import CommonComponentComparison from "@resources/common/Comparison/Comparison";
import { FieldConfigType, matchesEndOrStartOf } from "@/utils/tools";
import { navigateCases } from "@/elchi/helpers/navigate-cases";
import { FieldTypes } from "@/common/statics/general";
import useResourceForm from "@/hooks/useResourceForm";
import { useTags } from "@/hooks/useTags";
import { modtag_accesslog_filter, modtag_us_accesslog } from "./_modtag_";
import { useModels } from "@/hooks/useModels";
import { ConditionalComponent } from "@/elchi/components/common/ConditionalComponent";
import { EForm } from "@/elchi/components/common/e-components/EForm";
import { EFields } from "@/elchi/components/common/e-components/EFields";


type GeneralProps = {
    veri: {
        version: string;
        reduxStore: any;
        keyPrefix: string;
        tagMatchPrefix: string;
    }
};

interface State {
    show_header_filter: boolean;
}

const ComponentFilter: React.FC<GeneralProps> = ({ veri }) => {
    const [state, setState] = useState<State>({ show_header_filter: false });
    const { vModels } = useModels(veri.version, modtag_accesslog_filter);
    const { vTags } = useTags(veri.version, modtag_accesslog_filter);
    const { selectedTags, handleChangeRedux, handleChangeTag } = useResourceForm({
        version: veri.version,
        reduxStore: veri.reduxStore,
    });

    const fieldConfigs: FieldConfigType[] = [
        {
            tag: "header_filter", type: FieldTypes.ArrayIcon, tagPrefix: 'filter_specifier', fieldPath: 'header_filter', spanNum: 4, condition: true,
            drawerShow: () => {
                const updatedState = { ...state };
                updatedState.show_header_filter = true;
                setState(updatedState);
            },
        },
    ]

    return (
        <CCard reduxStore={veri.reduxStore} toJSON={vModels.alf?.AccessLogFilter.toJSON} keys={veri.keyPrefix} Paste={handleChangeRedux} ctype="acfilter" title="Filter">
            <HorizonTags veri={{
                tags: vTags.alf?.AccessLogFilter,
                unsupportedTags: modtag_us_accesslog["filter"],
                selectedTags: selectedTags,
                keyPrefix: veri.keyPrefix,
                handleChangeTag: handleChangeTag,
                tagMatchPrefix: `${veri.tagMatchPrefix}`,
                tagPrefix: `filter_specifier`,
                onlyOneTag: [["filter_specifier.status_code_filter", 'filter_specifier.duration_filter']],
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
            </Col>
            <ConditionalComponent
                shouldRender={matchesEndOrStartOf("filter_specifier.status_code_filter", selectedTags)}
                Component={CommonComponentComparison}
                componentProps={{
                    version: veri.version,
                    reduxStore: navigateCases(veri.reduxStore, "filter_specifier.status_code_filter.comparison"),
                    keyPrefix: `${veri.keyPrefix}.status_code_filter.comparison`,
                    id: `filter_specifier.status_code_filter_0`,
                }}
            />
            <ConditionalComponent
                shouldRender={matchesEndOrStartOf("filter_specifier.duration_filter", selectedTags)}
                Component={CommonComponentComparison}
                componentProps={{
                    version: veri.version,
                    reduxStore: navigateCases(veri.reduxStore, "filter_specifier.duration_filter.comparison"),
                    keyPrefix: `${veri.keyPrefix}.duration_filter.comparison`,
                    id: `filter_specifier.duration_filter_0`,
                }}
            />
            {/* {matchesEndOrStartOf("filter_specifier.header_filter", selectedTags) &&
                <CommonComponentHeaderMatcher veri={{
                    version: veri.version,
                    reduxStore: navigateCases(veri.reduxStore, "filter_specifier.header_filter.header"),
                    componentTags: veri.tags[`${veri.tagMatchPrefix}.filter_specifier.header_filter.header`],
                    keyPrefix: `${veri.keyPrefix}.header_filter.header`,
                    tagMatchPrefix: `${veri.tagMatchPrefix}.filter_specifier.header_filter.header`,
                    reduxAction: ResourceAction,
                    drawerOpen: state.show_header_filter,
                    drawerClose: () => {
                        const updatedState = { ...state };
                        updatedState.show_header_filter = false;
                        setState(updatedState);
                    }
                }} />
            } */}
        </CCard>
    )
};


export default memorizeComponent(ComponentFilter, compareVeri);
