import React from 'react';
import { useLocation } from 'react-router-dom';
import { Col, Row, Divider } from 'antd';
import { HeadOfResource } from '@/elchi/components/common/HeadOfResources';
import { FieldConfigType } from '@/utils/tools';
import CommonComponentSingleOptions from '@/elchi/components/resources/common/SingleOptions/SingleOptions';
import CustomAnchor from '@/elchi/components/common/CustomAnchor';
import { GTypes } from '@/common/statics/gtypes';
import { useGTypeFields } from '@/hooks/useGtypes';
import useResourceMain from '@/hooks/useResourceMain';
import { useModels } from '@/hooks/useModels';
import { useTags } from '@/hooks/useTags';
import { modtag_original_src } from './_modtag_';
import { generateFields } from '@/common/generate-fields';
import RenderLoading from '@/elchi/components/common/Loading';
import { useLoading } from '@/hooks/loadingContext';
import { useManagedLoading } from '@/hooks/useManageLoading';
import { ConditionalComponent } from '@/elchi/components/common/ConditionalComponent';


type GeneralProps = {
    veri: {
        version: string;
        queryResource: any;
        generalName: string;
        changeGeneralName: any;
    }
};

const ComponentOriginalSrc: React.FC<GeneralProps> = ({ veri }) => {
    const GType = useGTypeFields(GTypes.ListenerOriginalSrc);
    const location = useLocation();
    const { vModels, loading_m } = useModels(veri.version, modtag_original_src);
    const { vTags, loading } = useTags(veri.version, modtag_original_src);
    const { loadingCount } = useLoading();
    const { reduxStore, selectedTags, handleChangeTag } = useResourceMain({
        version: veri.version,
        alias: "os",
        vModels,
        vTags,
        modelName: "OriginalSrc",
    });

    const fieldConfigs: FieldConfigType[] = [
        ...generateFields({
            f: vTags.os?.OriginalSrc,
            sf: vTags.os?.OriginalSrc_SingleFields,
        })
    ];

    useManagedLoading(loading, loading_m);
    if (loadingCount > 0) {
        return <RenderLoading checkPage={true} isLoadingQuery={true} error={""} />;
    }

    return (
        <>
            <HeadOfResource
                generalName={veri.generalName}
                version={veri.version}
                changeGeneralName={veri.changeGeneralName}
                locationCheck={location.pathname === GType.createPath}
                createUpdate={{
                    location_path: location.pathname,
                    GType: GType,
                    offset: 0,
                    name: veri.generalName,
                    reduxStore: reduxStore,
                    voidToJSON: vModels.os?.OriginalSrc.toJSON,
                    queryResource: veri.queryResource,
                    envoyVersion: veri.version,
                    gtype: reduxStore?.$type,
                }}
            />
            <Divider type='horizontal' orientation='left' orientationMargin='0'>Original Src</Divider>
            <Row>
                <Col md={4} style={{ display: "block", maxHeight: "auto", overflowY: "auto" }}>
                    <CustomAnchor
                        resourceConfKeys={vTags.os?.OriginalSrc}
                        singleOptionKeys={vTags.os?.OriginalSrc_SingleFields}
                        selectedTags={selectedTags}
                        handleChangeTag={handleChangeTag}
                    />
                </Col>
                <Col md={20}>
                    <ConditionalComponent
                        shouldRender={selectedTags?.some(item => vTags.os?.OriginalSrc_SingleFields.includes(item))}
                        Component={CommonComponentSingleOptions}
                        componentProps={{
                            version: veri.version,
                            selectedTags: selectedTags,
                            fieldConfigs: fieldConfigs,
                            reduxStore: reduxStore,
                            id: `single_options_0`,
                        }}
                    />
                </Col>
            </Row>
        </>
    );
}

export default React.memo(ComponentOriginalSrc);