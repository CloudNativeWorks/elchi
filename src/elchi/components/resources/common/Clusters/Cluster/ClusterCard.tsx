import React from "react";
import { Col, Row } from 'antd';
import { compareVeri, memorizeComponent } from "@/hooks/useMemoComponent";
import CommonComponentCluster from './Cluster';
import ECard from "@/elchi/components/common/ECard";
import { EForm } from "@/elchi/components/common/e-components/EForm";


type GeneralProps = {
    veri: {
        version: string;
        reduxStore: string | undefined;
        keyPrefix?: string;
        reduxAction: any;
        alwaysShow: boolean;
        tag: string
        selectedTags?: string[];
        id?: string;
    }
};

const CommonComponentClusterCard: React.FC<GeneralProps> = ({ veri }) => {
    return (
        <ECard title="Cluster" id={veri.id}>
            <Row>
                <Col md={24}>
                    <EForm>
                        <CommonComponentCluster veri={{
                            ...veri,
                            size: 10,
                            alwaysShow: veri.alwaysShow,
                            selectedTags: veri.selectedTags || [],
                        }} />
                    </EForm>
                </Col>
            </Row>
        </ECard>
    )
};

export default memorizeComponent(CommonComponentClusterCard, compareVeri);