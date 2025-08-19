import React from "react";
import { Form, Select, Col } from "antd";

const { Option } = Select;

interface OptionItem {
    value: string | number;
    label: string;
}

interface SSelectProps {
    span: number;
    name: string;
    label: string;
    rules: any[];
    options: OptionItem[];
    placeholder: string;
}

const SSelect: React.FC<SSelectProps> = ({ span, name, label, rules, options, placeholder }) => {
    return (
        <Col span={span}>
            <Form.Item label={label} name={name} rules={rules}>
                <Select placeholder={placeholder}>
                    {options.map((option) => (
                        <Option key={option.value} value={option.value}>
                            {option.label}
                        </Option>
                    ))}
                </Select>
            </Form.Item>
        </Col>
    );
};

export default SSelect;