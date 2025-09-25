import React from "react";
import { Form, Select, Col } from "antd";


interface STagsProps {
    span: number;
    name: string;
    label: string;
    rules: any[];
    options: string[];
    placeholder: string;
}

const STags: React.FC<STagsProps> = ({ span, name, label, rules, options, placeholder }) => {
    return (
        <Col span={span}>
            <Form.Item label={label} name={name} rules={rules}>
                <Select
                    value={options}
                    mode="tags"
                    placeholder={placeholder}
                    options={
                        (options)?.map((option) => ({
                            value: option,
                            label: option,
                        }))
                    }
                />
            </Form.Item>
        </Col>
    );
};

export default STags;