import React from "react";
import { Form, Input, Col } from "antd";


interface Props {
    span: number;
    name: any;
    label: string;
    restField?: any;
}

const SPort: React.FC<Props> = ({ span, name, label, restField }) => {
    return (
        <Col span={span}>
            <Form.Item
                {...restField}
                label={label}
                name={name}
                rules={[
                    { required: true, message: "Please enter the port!" },
                    {
                        validator: (_, value) => {
                            if (
                                !value ||
                                (Number(value) >= 1 && Number(value) <= 65535)
                            ) {
                                return Promise.resolve();
                            }
                            return Promise.reject(
                                new Error("Port must be between 1 and 65535!")
                            );
                        },
                    },
                ]}
            >
                <Input type="number" placeholder="Enter port (e.g., 8080)" />
            </Form.Item>
        </Col>
    );
};

export default SPort;
