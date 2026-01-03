import React from "react";
import { Col, Form, Row, Select } from 'antd';
import { useDispatch } from "react-redux";
import { memorizeComponent, compareVeri } from "@/hooks/useMemoComponent";
import { ActionType, ResourceType } from "@/redux/reducer-helpers/common";
import ECard from "../../common/ECard";

type GeneralProps = {
    veri: {
        keyPrefix: string;
        version: string;
        reduxAction: any;
        reduxStore: string[];
        disabled?: boolean;
    }
};


const Domains: React.FC<GeneralProps> = ({ veri }) => {
    const dispatch = useDispatch();

    const handleChange = (value: string[]) => {
        const keys = veri.keyPrefix.split(".")
        keys.push("domains");
        dispatch(veri.reduxAction({
            version: veri.version,
            type: ActionType.Update,
            keys: keys,
            val: value,
            resourceType: ResourceType.Resource
        }));
    };

    return (
        <ECard title={"Domains"}>
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
                        <Form.Item required label={"Domains"} style={{ display: 'inline-block', width: 'calc(100% - 8px)' }}>
                            <Select
                                mode="tags"
                                style={{ width: '100%' }}
                                value={veri.reduxStore}
                                onChange={(val) => handleChange(val)}
                                options={[]}
                                className="domains-select"
                            />
                        </Form.Item>
                    </Form>
                </Col>
            </Row>
        </ECard>
    )
};

export default memorizeComponent(Domains, compareVeri);
