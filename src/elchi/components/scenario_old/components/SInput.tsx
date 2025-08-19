import React from "react";
import { Form, Input, Col } from "antd";


interface Props {
    span: number;
    name: any;
    label: string;
    rules: any[];
    placeholder: string;
    restField?: any;
    disabled?: boolean;
    value?: string;
}

const SInput: React.FC<Props> = ({ span, name, label, rules, placeholder, restField, disabled, value }) => {
    return (
        <Col span={span}>
            <Form.Item label={label} name={name} rules={rules} {...restField}>
                <Input placeholder={placeholder} disabled={disabled} value={value} />
            </Form.Item>
        </Col>
    );
};

export default SInput;
