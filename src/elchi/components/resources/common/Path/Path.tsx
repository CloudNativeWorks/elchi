import React from "react";
import { Col, Form, Input, Row } from 'antd';
import { useDispatch } from "react-redux";
import { memorizeComponent, compareVeri } from "@/hooks/useMemoComponent";
import { ActionType, ResourceType } from "@/redux/reducer-helpers/common";
import { prettyTag } from "@/utils/tools";
import ECard from "@/elchi/components/common/ECard";


type GeneralProps = {
    veri: {
        version: string;
        index?: string;
        title: string;
        reduxAction: any;
        reduxStore: string | undefined;
        disabled?: boolean;
        uniqID?: string;
    }
};

const CommonComponentPath: React.FC<GeneralProps> = ({ veri }) => {
    const dispatch = useDispatch();
    const handleChange = (value: string) => {
        dispatch(veri.reduxAction({
            version: veri.version,
            type: ActionType.Update,
            keys: veri.index ? [veri.index, veri.title] : [veri.title],
            val: veri.uniqID ? value + veri.uniqID : value,
            resourceType: ResourceType.Resource
        }));
    };

    return (
        <ECard title={prettyTag(veri.title)}>
            <Row>
                <Col md={24}>
                    <Form
                        labelCol={{ span: 24 }}
                        wrapperCol={{ span: 24 }}
                        layout="vertical"
                        size="small"
                        disabled={veri.disabled}
                        style={{ maxWidth: "100%" }}
                    >
                        <Form.Item required label={<div className="smoothAnimation">{prettyTag(veri.title)}</div>} style={{ display: 'inline-block', width: 'calc(33% - 8px)' }}>
                            <Input value={veri.reduxStore} onChange={(e) => handleChange(e.target.value)} />
                        </Form.Item>
                    </Form>
                </Col>
            </Row>
        </ECard>
    )
};

export default memorizeComponent(CommonComponentPath, compareVeri);
