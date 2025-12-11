import React from 'react';
import { useLocation } from 'react-router-dom';
import { Col, Row, Divider } from 'antd';
import { ResourceAction } from '@/redux/reducers/slice';
import { HeadOfResource } from '@/elchi/components/common/HeadOfResources';
import { FieldConfigType, matchesEndOrStartOf } from '@/utils/tools';
import CommonComponentSingleOptions from '@/elchi/components/resources/common/SingleOptions/SingleOptions';
import CommonComponentFaultDelay from '@/elchi/components/resources/common/FaultDelay/FaultDelay';
import CustomAnchor from '@/elchi/components/common/CustomAnchor';
import { GTypes } from '@/common/statics/gtypes';
import { useGTypeFields } from '@/hooks/useGtypes';
import useResourceMain from '@/hooks/useResourceMain';
import { useModels } from '@/hooks/useModels';
import { useTags } from '@/hooks/useTags';
import { modtag_mongo_proxy, modtag_us_mongoproxy } from './_modtag_';
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

const ComponentMongoProxy: React.FC<GeneralProps> = ({ veri }) => {
    const GType = useGTypeFields(GTypes.MongoProxy);
    const location = useLocation();
    const { vModels, loading_m } = useModels(veri.version, modtag_mongo_proxy);
    const { vTags, loading } = useTags(veri.version, modtag_mongo_proxy);
    const { loadingCount } = useLoading();
    const { reduxStore, selectedTags, handleChangeTag } = useResourceMain({
        version: veri.version,
        alias: "mp",
        vModels,
        vTags,
        modelName: "MongoProxy",
    });

    const fieldConfigs: FieldConfigType[] = [
        ...generateFields({
            f: vTags.mp?.MongoProxy,
            sf: vTags.mp?.MongoProxy_SingleFields,
            e: [],
            r: ['stat_prefix']
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
                    voidToJSON: vModels.mp?.MongoProxy.toJSON,
                    queryResource: veri.queryResource,
                    envoyVersion: veri.version,
                    gtype: reduxStore?.$type,
                }}
            />
            <Divider type='horizontal' orientation='left' orientationMargin='0'>Mongo Proxy</Divider>
            <Row>
                <Col md={4} style={{ display: "block", maxHeight: "auto", overflowY: "auto" }}>
                    <CustomAnchor
                        resourceConfKeys={vTags.mp?.MongoProxy}
                        unsuportedTags={modtag_us_mongoproxy['MongoProxy']}
                        singleOptionKeys={vTags.mp?.MongoProxy_SingleFields}
                        selectedTags={selectedTags}
                        handleChangeTag={handleChangeTag}
                        tagMatchPrefix={'MongoProxy'}
                        required={['stat_prefix']}
                    />
                </Col>
                <Col md={20}>
                    <ConditionalComponent
                        shouldRender={selectedTags?.some(item => vTags.mp?.MongoProxy_SingleFields.includes(item))}
                        Component={CommonComponentSingleOptions}
                        componentProps={{
                            version: veri.version,
                            selectedTags: selectedTags,
                            fieldConfigs: fieldConfigs,
                            reduxStore: reduxStore,
                            id: `single_options_0`,
                        }}
                    />
                    <ConditionalComponent
                        shouldRender={matchesEndOrStartOf('delay', selectedTags)}
                        Component={CommonComponentFaultDelay}
                        componentProps={{
                            version: veri.version,
                            reduxStore: reduxStore?.delay,
                            reduxAction: ResourceAction,
                            keyPrefix: `delay`,
                            tagMatchPrefix: 'MongoProxy',
                            id: `delay_0`,
                        }}
                    />
                </Col>
            </Row>
        </>
    );
}

export default React.memo(ComponentMongoProxy);
