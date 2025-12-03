import React from "react";
import ComponentUriTemplateRewriter from './UriTemplateRewriter';


type GeneralProps = {
    veri: {
        version: string;
        gtype: string;
        queryResource: any;
        generalName: string;
        changeGeneralName: any,
    }
};

const ComponentPathRewritePolicy: React.FC<GeneralProps> = ({ veri }) => {
    const componentMap = {
        'envoy.extensions.path.rewrite.uri_template.v3.UriTemplateRewriteConfig': ComponentUriTemplateRewriter,
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

export default React.memo(ComponentPathRewritePolicy);
