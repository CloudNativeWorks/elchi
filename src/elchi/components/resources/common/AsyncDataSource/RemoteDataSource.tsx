import React from "react";
import { Divider } from 'antd';
import { HorizonTags } from "@/elchi/components/common/HorizonTags";
import { compareVeri, memorizeComponent } from "@/hooks/useMemoComponent";
import { FieldConfigType, matchesEndOrStartOf } from "@/utils/tools";
import { useTags } from "@/hooks/useTags";
import { modtag_remote_data_source } from "./_modtag_";
import { generateFields } from "@/common/generate-fields";
import useResourceForm from "@/hooks/useResourceForm";
import ECard from "@/elchi/components/common/ECard";
import { EForm } from "@/elchi/components/common/e-components/EForm";
import { EFields } from "@/elchi/components/common/e-components/EFields";
import { ConditionalComponent } from "@/elchi/components/common/ConditionalComponent";
import CommonRetryPolicy from "@/elchi/components/resources/common/CoreRetryPolicy/RetryPolicy";
import CommonHttpUri from "@/elchi/components/resources/common/HttpUri/HttpUri";

type GeneralProps = {
    veri: {
        version: string;
        reduxStore: any;
        keyPrefix: string;
    }
};

const CommonRemoteDataSource: React.FC<GeneralProps> = ({ veri }) => {
    const { vTags } = useTags(veri.version, modtag_remote_data_source);
    const { selectedTags, handleChangeRedux, handleChangeTag } = useResourceForm({
        version: veri.version,
        reduxStore: veri.reduxStore,
    });

    const fieldConfigs: FieldConfigType[] = [
        ...generateFields({
            f: vTags.rds?.RemoteDataSource,
            sf: vTags.rds?.RemoteDataSource_SingleFields,
        }),
    ];

    return (
        <ECard title={"Remote Data Source"}>
            <HorizonTags veri={{
                tags: vTags.rds?.RemoteDataSource,
                selectedTags: selectedTags,
                unsupportedTags: [],
                handleChangeTag: handleChangeTag,
                keyPrefix: veri.keyPrefix,
            }} />
            <Divider style={{ marginTop: '8px', marginBottom: '8px' }} type="horizontal" />
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
                shouldRender={matchesEndOrStartOf("http_uri", selectedTags)}
                Component={CommonHttpUri}
                componentProps={{
                    version: veri.version,
                    reduxStore: veri.reduxStore?.http_uri,
                    keyPrefix: `${veri.keyPrefix}.http_uri`,
                }}
            />
            <ConditionalComponent
                shouldRender={matchesEndOrStartOf("retry_policy", selectedTags)}
                Component={CommonRetryPolicy}
                componentProps={{
                    version: veri.version,
                    reduxStore: veri.reduxStore?.retry_policy,
                    keyPrefix: `${veri.keyPrefix}.retry_policy`,
                }}
            />
        </ECard>
    )
};

export default memorizeComponent(CommonRemoteDataSource, compareVeri);
