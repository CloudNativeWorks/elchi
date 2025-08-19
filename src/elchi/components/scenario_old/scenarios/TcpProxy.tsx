import { Card, Form, Row } from "antd";
import { processChangedValues } from "../HandleChange";
import SSelect from "../components/SSelect";
import SInput from "../components/SInput";
import { ScenarioProps } from "../Models";
import useFormValidation from "../hooks/useFormValidation";
import { useEffect } from "react";


const TcpProxy: React.FC<ScenarioProps> = ({ reduxStore, handleChangeRedux, registerForm, unregisterForm }) => {
    const [form] = Form.useForm();

    useFormValidation({
        form,
        formKey: "TcpProxy",
        registerForm,
        unregisterForm,
    });

    const handleValuesChange = (changedValues: any) => {
        processChangedValues("tcp_proxy", changedValues, handleChangeRedux);
    };

    useEffect(() => {
        handleChangeRedux("tcp_proxy.cluster", reduxStore.cluster?.cluster_name);
    }, [reduxStore]);

    return (
        <Form
            form={form}
            layout="vertical"
            onValuesChange={handleValuesChange}
            initialValues={{
                name: reduxStore.tcp_proxy?.name,
                stat_prefix: reduxStore.tcp_proxy?.stat_prefix,
                cluster: reduxStore.cluster?.cluster_name,
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

            </Row>
            <Card title="Cluster">
                <Row gutter={[16, 16]} align="middle">
                    <SSelect
                        span={6}
                        name="cluster"
                        label="Cluster"
                        rules={[{ required: true, message: "Please select a Cluster!" }]}
                        options={[{ value: reduxStore.cluster?.cluster_name, label: reduxStore.cluster?.cluster_name }]}
                        placeholder="Select Cluster"
                    />
                </Row>
            </Card>
        </Form>
    );
};

export default TcpProxy;