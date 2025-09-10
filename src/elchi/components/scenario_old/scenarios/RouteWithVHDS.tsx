import { Card, Form, Row } from "antd";
import { processChangedValues } from "../HandleChange";
import SSelect from "../components/SSelect";
import SInput from "../components/SInput";
import { ScenarioProps } from "../Models";
import useFormValidation from "../hooks/useFormValidation";
import { useEffect } from "react";


const RouteWithVHDS: React.FC<ScenarioProps> = ({ reduxStore, handleChangeRedux, registerForm, unregisterForm }) => {
    const [form] = Form.useForm();

    useFormValidation({
        form,
        formKey: "RouteWithVHDS",
        registerForm,
        unregisterForm,
    });

    const handleValuesChange = (changedValues: any) => {
        processChangedValues("route", changedValues, handleChangeRedux);
    };

    useEffect(() => {
        handleChangeRedux("route.vhds", reduxStore.virtual_host?.name);
    }, [reduxStore]);

    return (
        <Form
            form={form}
            layout="vertical"
            onValuesChange={handleValuesChange}
            initialValues={{
                name: reduxStore.route?.name,
                vhds: reduxStore.virtual_host?.name,
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
            </Row>
            <Card title="VHDS">
                <Row gutter={[16, 16]} align="middle">
                    <SSelect
                        span={8}
                        name="vhds"
                        label="VHDS"
                        rules={[{ required: true, message: "Please select a Vhds!" }]}
                        options={[{ value: reduxStore.virtual_host?.name, label: reduxStore.virtual_host?.name }]}
                        placeholder="Select vhds"
                    />
                </Row>
            </Card>
        </Form>
    );
};

export default RouteWithVHDS;
