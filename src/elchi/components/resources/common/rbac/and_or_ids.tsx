import React from "react";
import { Drawer } from 'antd';
import { memorizeComponent, compareVeri } from "@/hooks/useMemoComponent";
import ComponentPrincipals from "./principals";
import ElchiButton from "@/elchi/components/common/ElchiButton";


type GeneralProps = {
    veri: {
        version: string;
        drawerOpen: boolean;
        drawerClose: any;
        reduxStore: any | undefined;
        keyPrefix: string;
        title: string;
    };
};

const CommonComponentAndOrIds: React.FC<GeneralProps> = ({ veri }) => {
    return (
        <Drawer
            title={veri.title}
            placement="right"
            closable={false}
            onClose={veri.drawerClose}
            open={veri.drawerOpen}
            size='large'
            width={1400}
        >
            <ComponentPrincipals key={`Principals`} veri={{
                version: veri.version,
                keyPrefix: `${veri.keyPrefix}.ids`,
                reduxStore: veri.reduxStore?.ids,
            }} />
            <ElchiButton onlyText style={{ marginTop: 15 }} onClick={() => veri.drawerClose()}>Close</ElchiButton>
        </Drawer>
    )
};

export default memorizeComponent(CommonComponentAndOrIds, compareVeri);


