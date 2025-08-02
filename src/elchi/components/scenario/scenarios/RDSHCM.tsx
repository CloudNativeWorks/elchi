import { Card, Form, Row } from "antd";
import { processChangedValues } from "../HandleChange";
import SSelect from "../components/SSelect";
import SInput from "../components/SInput";
import { ScenarioProps } from "../Models";
import useFormValidation from "../hooks/useFormValidation";
import { useEffect } from "react";


const codecTypeOptions = [
    { value: "AUTO", label: "AUTO" },
    { value: "HTTP1", label: "HTTP1" },
    { value: "HTTP2", label: "HTTP2" },
    { value: "HTTP3", label: "HTTP3" },
];

const RDSHcm: React.FC<ScenarioProps> = ({ reduxStore, handleChangeRedux, registerForm, unregisterForm }) => {
    const [form] = Form.useForm();

    useFormValidation({
        form,
        formKey: "RDSHcm",
        registerForm,
        unregisterForm,
    });

    const handleValuesChange = (changedValues: any) => {
        processChangedValues("hcm", changedValues, handleChangeRedux);
    };

    useEffect(() => {
        handleChangeRedux("hcm.rds", reduxStore.route?.name);
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
                rds: reduxStore.route?.name,
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

            </Row>
            <Card title="RDS">
                <Row gutter={[16, 16]} align="middle">
                    <SSelect
                        span={6}
                        name="rds"
                        label="RDS"
                        rules={[{ required: true, message: "Please select a RDS!" }]}
                        options={[{ value: reduxStore.route?.name, label: reduxStore.route?.name }]}
                        placeholder="Select RDS"
                    />
                </Row>
            </Card>
        </Form>
    );
};

export default RDSHcm;