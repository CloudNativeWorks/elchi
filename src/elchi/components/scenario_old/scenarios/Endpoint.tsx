import { Col, Form, Row, Button, Card } from "antd";
import { processChangedValues } from "../HandleChange";
import SInput from "../components/SInput";
import { ScenarioProps } from "../Models";
import useFormValidation from "../hooks/useFormValidation";
import SPort from "../components/SPort";


const Endpoint: React.FC<ScenarioProps> = ({ reduxStore, handleChangeRedux, handleDeleteRedux, registerForm, unregisterForm }) => {
    const [form] = Form.useForm();

    useFormValidation({
        form,
        formKey: "Endpoint",
        registerForm,
        unregisterForm,
    });

    const handleValuesChange = (changedValues: any) => {
        processChangedValues("endpoint", changedValues, handleChangeRedux);
    };

    return (
        <Form
            form={form}
            layout="vertical"
            onValuesChange={handleValuesChange}
            initialValues={{
                cluster_name: reduxStore.endpoint?.cluster_name,
                lb_endpoints: reduxStore.endpoint?.lb_endpoints || [
                    { address: "", port: undefined },
                ],
            }}
        >
            <Row gutter={[16, 16]}>
                <SInput
                    span={8}
                    name="cluster_name"
                    label="Cluster Name"
                    rules={[{ required: true, message: "Please enter the cluster name!" }]}
                    placeholder="Enter cluster name"
                />
            </Row>

            <Card title="Endpoints">
                <Form.List name="lb_endpoints">
                    {(fields, { add, remove }) => (
                        <>
                            {fields.map(({ key, name, ...restField }, index) => (
                                <Row key={key} gutter={[16, 16]} align="middle">
                                    <SInput
                                        restField={restField}
                                        span={10}
                                        name={[name, "address"]}
                                        label="Address"
                                        rules={[{ required: true, message: "Please enter the address!" }]}
                                        placeholder="Enter address (e.g., 192.168.1.1 or example.com)"
                                    />
                                    <SPort
                                        span={8}
                                        name={[name, "port"]}
                                        label="Port"
                                        restField={restField}
                                    />
                                    <Col span={6} style={{ marginTop: 7 }}>
                                        <Button
                                            danger
                                            disabled={fields.length === 1}
                                            onClick={() => {
                                                handleDeleteRedux(`endpoint.lb_endpoints.${index}`);
                                                remove(name)
                                            }}
                                        >
                                            Remove
                                        </Button>
                                    </Col>
                                </Row>
                            ))}
                            <Row>
                                <Col span={24}>
                                    <Button
                                        type="dashed"
                                        onClick={() => add()}
                                    >
                                        Add Endpoint
                                    </Button>
                                </Col>
                            </Row>
                        </>
                    )}
                </Form.List>
            </Card>
        </Form>
    );
};

export default Endpoint;
