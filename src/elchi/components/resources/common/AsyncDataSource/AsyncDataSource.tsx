import React from "react";
import { Divider } from 'antd';
import { HorizonTags } from "@/elchi/components/common/HorizonTags";
import { compareVeri, memorizeComponent } from "@/hooks/useMemoComponent";
import { useTags } from "@/hooks/useTags";
import { modtag_async_data_source } from "./_modtag_";
import useResourceForm from "@/hooks/useResourceForm";
import ECard from "@/elchi/components/common/ECard";
import { ConditionalComponent } from "@/elchi/components/common/ConditionalComponent";
import { matchesEndOrStartOf } from "@/utils/tools";
import CommonComponentDataSource from "@/elchi/components/resources/common/DataSource/DataSource";
import CommonRemoteDataSource from "./RemoteDataSource";

type GeneralProps = {
    veri: {
        version: string;
        reduxStore: any;
        keyPrefix: string;
        title?: string;
    }
};

const CommonAsyncDataSource: React.FC<GeneralProps> = ({ veri }) => {
    const { vTags } = useTags(veri.version, modtag_async_data_source);
    const { selectedTags, handleChangeRedux, handleChangeTag } = useResourceForm({
        version: veri.version,
        reduxStore: veri.reduxStore,
    });

    const handleApplySnippet = (keys: string, data: any) => {
        handleChangeRedux(keys, data);
    };

    return (
        <ECard title={veri.title || "Async Data Source"}>
            <HorizonTags veri={{
                tags: vTags.ads?.AsyncDataSource,
                selectedTags: selectedTags,
                unsupportedTags: [],
                handleChangeTag: handleChangeTag,
                keyPrefix: veri.keyPrefix,
                tagPrefix: 'specifier',
                onlyOneTag: [['specifier.local', 'specifier.remote']]
            }} />
            <Divider style={{ marginTop: '8px', marginBottom: '8px' }} type="horizontal" />
            <ConditionalComponent
                shouldRender={matchesEndOrStartOf("specifier.local", selectedTags)}
                Component={CommonComponentDataSource}
                componentProps={{
                    version: veri.version,
                    reduxStore: veri.reduxStore?.specifier?.local,
                    keyPrefix: `${veri.keyPrefix}.local`,
                    tagPrefix: 'specifier',
                    parentName: 'Local Data Source',
                    fileName: 'local-data',
                }}
            />
            <ConditionalComponent
                shouldRender={matchesEndOrStartOf("specifier.remote", selectedTags)}
                Component={CommonRemoteDataSource}
                componentProps={{
                    version: veri.version,
                    reduxStore: veri.reduxStore?.specifier?.remote,
                    keyPrefix: `${veri.keyPrefix}.remote`,
                }}
            />
        </ECard>
    )
};

export default memorizeComponent(CommonAsyncDataSource, compareVeri);
