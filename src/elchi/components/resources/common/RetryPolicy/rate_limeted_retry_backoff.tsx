import React from "react";
import { Divider } from 'antd';
import { HorizonTags } from "@/elchi/components/common/HorizonTags";
import { compareVeri, memorizeComponent } from "@/hooks/useMemoComponent";
import { FieldConfigType, startsWithAny } from "@/utils/tools";
import { useTags } from "@/hooks/useTags";
import { modtag_rate_limited_retry_backoff } from "./_modtag_";
import { ResourceAction } from "@/redux/reducers/slice";
import { FieldTypes } from "@/common/statics/general";
import useResourceForm from "@/hooks/useResourceForm";
import ECard from "@/elchi/components/common/ECard";
import ResetHeaders from "./reset_headers";
import { ConditionalComponent } from "@/elchi/components/common/ConditionalComponent";
import { EForm } from "@/elchi/components/common/e-components/EForm";
import { EFields } from "@/elchi/components/common/e-components/EFields";


type GeneralProps = {
    veri: {
        version: string;
        reduxStore: any;
        keyPrefix: string;
    }
};

const CommonRateLimitedRetryBackoff: React.FC<GeneralProps> = ({ veri }) => {
    const { vTags } = useTags(veri.version, modtag_rate_limited_retry_backoff);
    const [state, setState] = React.useState(false);
    const { selectedTags, handleChangeRedux, handleChangeTag } = useResourceForm({
        version: veri.version,
        reduxStore: veri.reduxStore,
    });

    const fieldConfigs: FieldConfigType[] = [
        {
            tag: "reset_headers", type: FieldTypes.ArrayIcon, fieldPath: 'rate_limited_retry_back_off.reset_headers', spanNum: 6, navigate: true, condition: true, required: true, keyPrefix: `${veri.keyPrefix}`,
            drawerShow: () => {
                setState(true);
            }
        },
        { tag: "max_interval", type: FieldTypes.Duration, placeHolder: "(duration)", fieldPath: 'rate_limited_retry_back_off.max_interval', spanNum: 6, navigate: true, keyPrefix: `${veri.keyPrefix}.rate_limited_retry_back_off`, },
    ];

    return (
        <ECard title={"Rate Limited Retry Back Off"}>
            <EForm>
                <HorizonTags veri={{
                    tags: vTags.rlrbo?.RetryPolicy_RateLimitedRetryBackOff,
                    selectedTags: selectedTags,
                    unsupportedTags: [],
                    handleChangeTag: handleChangeTag,
                    tagPrefix: `rate_limited_retry_back_off`,
                    keyPrefix: `${veri.keyPrefix}.rate_limited_retry_back_off`,
                    required: ['reset_headers']
                }} />
            </EForm>
            <Divider style={{ marginTop: '8px', marginBottom: '8px' }} type="horizontal" />
            <EForm>
                <EFields
                    fieldConfigs={fieldConfigs}
                    selectedTags={selectedTags}
                    handleChangeRedux={handleChangeRedux}
                    reduxStore={veri.reduxStore}
                    keyPrefix={`${veri.keyPrefix}.rate_limited_retry_back_off`}
                    tagPrefix='rate_limited_retry_back_off'
                    version={veri.version}
                />
            </EForm>
            <ConditionalComponent
                shouldRender={startsWithAny("reset_headers", selectedTags)}
                Component={ResetHeaders}
                componentProps={{
                    version: veri.version,
                    drawerOpen: state,
                    reduxStore: veri.reduxStore?.reset_headers,
                    reduxAction: ResourceAction,
                    keyPrefix: `${veri.keyPrefix}.rate_limited_retry_back_off.reset_headers`,
                    drawerClose: () => {
                        setState(false);
                    },
                    id: `reset_headers_0`,
                }}
            />
        </ECard>
    )
};

export default memorizeComponent(CommonRateLimitedRetryBackoff, compareVeri);
