import { Card, Form, Row } from "antd";
import { processChangedValues } from "../HandleChange";
import SSelect from "../components/SSelect";
import SInput from "../components/SInput";
import { ScenarioProps } from "../Models";
import useFormValidation from "../hooks/useFormValidation";
import STags from "../components/STags";
import { useEffect } from "react";


const matchKeyOptions = [
    { value: "prefix", label: "Prefix" },
    { value: "path", label: "Path" },
];

const VirtualHost: React.FC<ScenarioProps> = ({ reduxStore, handleChangeRedux, registerForm, unregisterForm }) => {
    const [form] = Form.useForm();

    useFormValidation({
        form,
        formKey: "VirtualHost",
        registerForm,
        unregisterForm,
    });

    const handleValuesChange = (changedValues: any) => {
        processChangedValues("virtual_host", changedValues, handleChangeRedux);
    };

    useEffect(() => {
        handleChangeRedux("virtual_host.cluster", reduxStore.cluster?.cluster_name);
    }, [reduxStore]);

    return (
        <Form
            form={form}
            layout="vertical"
            onValuesChange={handleValuesChange}
            initialValues={{
                name: reduxStore.virtual_host?.name,
                domains: reduxStore.virtual_host?.domains,
                cluster: reduxStore.cluster?.cluster_name,
                match_key: reduxStore.virtual_host?.match_key,
                match_value: reduxStore.virtual_host?.match_value,
            }}
        >
            <Row gutter={[16, 16]}>
                <SInput
                    span={6}
                    name="name"
                    label="Name"
                    rules={[{ required: true, message: "Please enter the Name!" }]}
                    placeholder="Enter Name"
                />

                <STags
                    span={10}
                    name="domains"
                    label="Domains"
                    rules={[{ required: true, message: "Please enter domain!" }]}
                    options={reduxStore.virtual_host?.domains || []}
                    placeholder="Enter Domain"
                />
            </Row>
            <Card title="Route">
                <Row gutter={[16, 16]} align="middle">
                    <SSelect
                        span={6}
                        name="match_key"
                        label="Match Key"
                        rules={[{ required: true, message: "Please select a Match key!" }]}
                        options={matchKeyOptions}
                        placeholder="Select Match key"
                    />

                    <SInput
                        span={6}
                        name="match_value"
                        label="Match Value"
                        rules={[{ required: true, message: "Please enter the Match value!" }]}
                        placeholder="Enter Match value"
                    />

                    <SSelect
                        span={6}
                        name="cluster"
                        label="Route Cluster"
                        rules={[{ required: true, message: "Please select a Cluster!" }]}
                        options={[{ value: reduxStore.cluster?.cluster_name, label: reduxStore.cluster?.cluster_name }]}
                        placeholder="Select Match key"
                    />
                </Row>
            </Card>
        </Form>
    );
};

export default VirtualHost;
