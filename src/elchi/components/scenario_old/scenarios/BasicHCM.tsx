import { Card, Form, Row } from "antd";
import { processChangedValues } from "../HandleChange";
import SSelect from "../components/SSelect";
import SInput from "../components/SInput";
import { ScenarioProps } from "../Models";
import useFormValidation from "../hooks/useFormValidation";
import STags from "../components/STags";
import { useEffect } from "react";


const codecTypeOptions = [
    { value: "AUTO", label: "AUTO" },
    { value: "HTTP1", label: "HTTP1" },
    { value: "HTTP2", label: "HTTP2" },
    { value: "HTTP3", label: "HTTP3" },
];

const matchKeyOptions = [
    { value: "prefix", label: "Prefix" },
    { value: "path", label: "Path" },
];

const BasicHCM: React.FC<ScenarioProps> = ({ reduxStore, handleChangeRedux, registerForm, unregisterForm }) => {
    const [form] = Form.useForm();

    useFormValidation({
        form,
        formKey: "BasicHCM",
        registerForm,
        unregisterForm,
    });

    const handleValuesChange = (changedValues: any) => {
        processChangedValues("hcm", changedValues, handleChangeRedux);
    };

    useEffect(() => {
        handleChangeRedux("hcm.cluster", reduxStore.cluster?.cluster_name);
    }, [reduxStore]);

    return (
        <Form
            form={form}
            layout="vertical"
            onValuesChange={handleValuesChange}
            initialValues={{
                name: reduxStore.hcm?.name,
                stat_prefix: reduxStore.hcm?.stat_prefix,
                codec_type: reduxStore.hcm?.codec_type,
                domains: reduxStore.hcm?.domains,
                cluster: reduxStore.cluster?.cluster_name,
                match_key: reduxStore.hcm?.match_key,
                match_value: reduxStore.hcm?.match_value,
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

                <SInput
                    span={4}
                    name="stat_prefix"
                    label="Stat Prefix"
                    rules={[{ required: true, message: "Please enter the Stat prefix!" }]}
                    placeholder="Enter Stat prefix"
                />

                <SSelect
                    span={4}
                    name="codec_type"
                    label="Codec Type"
                    rules={[{ required: true, message: "Please select a Codec type!" }]}
                    options={codecTypeOptions}
                    placeholder="Select Codec type"
                />

                <STags
                    span={10}
                    name="domains"
                    label="Domains"
                    rules={[{ required: true, message: "Please enter domain!" }]}
                    options={reduxStore.hcm?.domains || []}
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

export default BasicHCM;