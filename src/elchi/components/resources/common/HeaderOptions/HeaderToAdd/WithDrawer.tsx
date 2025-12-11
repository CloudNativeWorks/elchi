import React from "react";
import { Drawer, Row } from 'antd';
import HeaderToAdd from './HeaderToAdd';
import ElchiButton from "@/elchi/components/common/ElchiButton";


type GeneralProps = {
    veri: {
        version: string;
        keyPrefix: string;
        drawerOpen: boolean;
        reduxStore: any[] | undefined;
        reduxAction: any;
        tagMatchPrefix: string;
        drawerClose: () => void;
    }
};

const CommonComponentHeaderAddD: React.FC<GeneralProps> = ({ veri }) => {
    return (
        <Drawer
            key={`draver_${veri.keyPrefix}`}
            title={`Initial Metadata`}
            placement="right"
            closable={false}
            open={veri.drawerOpen}
            onClose={veri.drawerClose}
            size='large'
            width={900}
        >
            <Row>
                <HeaderToAdd veri={{
                    title: "Header To Add",
                    version: veri.version,
                    reduxStore: veri.reduxStore,
                    keyPrefix: `${veri.keyPrefix}`,
                    reduxAction: veri.reduxAction
                }} />
            </Row>

            <ElchiButton onlyText style={{ marginTop: 15 }} onClick={() => veri.drawerClose()}>Close</ElchiButton>
        </Drawer>
    )
};

export default CommonComponentHeaderAddD;
