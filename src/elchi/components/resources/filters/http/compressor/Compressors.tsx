import React from "react";
import ComponentCompressor from './compressor';
import ComponentCompressorPerRoute from './CompressorPerRoute';


type GeneralProps = {
    veri: {
        version: string;
        gtype: string;
        queryResource: any;
        generalName: string;
        changeGeneralName: any,
    }
};

const ComponentCompressors: React.FC<GeneralProps> = ({ veri }) => {
    const componentMap = {
        'envoy.extensions.filters.http.compressor.v3.Compressor': ComponentCompressor,
        'envoy.extensions.filters.http.compressor.v3.CompressorPerRoute': ComponentCompressorPerRoute,
    };

    const SelectedComponent = componentMap[veri.gtype];

    return (
        <SelectedComponent veri={{
            version: veri.version,
            gtype: veri.gtype,
            queryResource: veri.queryResource,
            generalName: veri.generalName,
            changeGeneralName: veri.changeGeneralName
        }} />
    )
}

export default React.memo(ComponentCompressors);
