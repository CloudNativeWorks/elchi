import { Card, Form, Row } from "antd";
import { processChangedValues } from "../HandleChange";
import SSelect from "../components/SSelect";
import SInput from "../components/SInput";
import { ScenarioProps } from "../Models";
import useFormValidation from "../hooks/useFormValidation";
import SPort from "../components/SPort";
import { useEffect } from "react";


const protocolOptions = [
    { value: "TCP", label: "TCP" },
    { value: "UDP", label: "UDP" },
];

const SingleListenerHTTP: React.FC<ScenarioProps> = ({ reduxStore, handleChangeRedux, registerForm, unregisterForm }) => {
    const [form] = Form.useForm();

    useFormValidation({
        form,
        formKey: "SingleListenerHTTP",
        registerForm,
        unregisterForm,
    });

    const handleValuesChange = (changedValues: any) => {
        processChangedValues("listener", changedValues, handleChangeRedux);
    };

    useEffect(() => {
        handleChangeRedux("listener.hcm", reduxStore.hcm?.name);

        if (reduxStore.managed) {
            handleChangeRedux("listener.address", '0.0.0.0');
        }
    }, [reduxStore]);

    return (
        <Form
            form={form}
            layout="vertical"
            onValuesChange={handleValuesChange}
            initialValues={{
                name: reduxStore.listener?.name,
                protocol: reduxStore.listener?.protocol,
                address: '0.0.0.0',
                port: reduxStore.listener?.port,
                hcm: reduxStore.hcm?.name,
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

                <SSelect
                    span={6}
                    name="protocol"
                    label="Protocol"
                    rules={[{ required: true, message: "Please select a Protocol!" }]}
                    options={protocolOptions}
                    placeholder="Select Protocol"
                />

                <SInput
                    span={6}
                    name="address"
                    label="Address"
                    rules={[{ required: true, message: "Please enter the Address!" }]}
                    disabled={reduxStore.managed}
                    value={reduxStore.listener?.address}
                    placeholder={"Enter Address"}
                />

                <SPort
                    span={6}
                    name="port"
                    label="Port"
                />
            </Row>
            <Card title="Network Filter">
                <Row gutter={[16, 16]} align="middle">
                    <SSelect
                        span={6}
                        name="hcm"
                        label="Http Connection Manager"
                        rules={[{ required: true, message: "Please select a HCM!" }]}
                        options={[{ value: reduxStore.hcm?.name, label: reduxStore.hcm?.name }]}
                        placeholder="Select HCM"
                    />
                </Row>
            </Card>
        </Form>
    );
};

export default SingleListenerHTTP;