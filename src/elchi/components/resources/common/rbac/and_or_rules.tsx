import React from "react";
import { Drawer } from 'antd';
import { memorizeComponent, compareVeri } from "@/hooks/useMemoComponent";
import ComponentPermissions from "./permissions";
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

const CommonComponentAndOrRules: React.FC<GeneralProps> = ({ veri }) => {
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
            <ComponentPermissions key={`Permissions`} veri={{
                version: veri.version,
                keyPrefix: `${veri.keyPrefix}.rules`,
                reduxStore: veri.reduxStore?.rules,
            }} />
            <ElchiButton onlyText style={{ marginTop: 15 }} onClick={() => veri.drawerClose()}>Close</ElchiButton>
        </Drawer>
    )
};

export default memorizeComponent(CommonComponentAndOrRules, compareVeri);


