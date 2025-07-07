import React from "react";
import { Form } from "antd";

export const EForm: React.FC<{ children?: React.ReactNode }> = ({ children }) => {
    return (
        <Form
            labelCol={{ span: 24 }}
            wrapperCol={{ span: 24 }}
            layout="vertical"
            size="small"
            style={{ maxWidth: "100%" }}
        >
            {children}
        </Form>
    );
};