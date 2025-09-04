import React from "react";
import ComponentBrotli from './Brotli';
import ComponentGzip from './Gzip';
import ComponentZstd from './Zstd';


type GeneralProps = {
    veri: {
        version: string;
        gtype: string;
        queryResource: any;
        generalName: string;
        changeGeneralName: any,
    }
};

const ComponentCompressorLibrary: React.FC<GeneralProps> = ({ veri }) => {
    const componentMap = {
        'envoy.extensions.compression.brotli.compressor.v3.Brotli': ComponentBrotli,
        'envoy.extensions.compression.gzip.compressor.v3.Gzip': ComponentGzip,
        'envoy.extensions.compression.zstd.compressor.v3.Zstd': ComponentZstd,
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

export default React.memo(ComponentCompressorLibrary);