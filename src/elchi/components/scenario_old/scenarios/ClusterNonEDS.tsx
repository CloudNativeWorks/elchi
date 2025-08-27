import { Col, Form, Row, Button, Card } from "antd";
import { processChangedValues } from "../HandleChange";
import SSelect from "../components/SSelect";
import SInput from "../components/SInput";
import { ScenarioProps } from "../Models";
import useFormValidation from "../hooks/useFormValidation";
import SPort from "../components/SPort";


const protocolOptions = [
    { value: "TCP", label: "TCP" },
    { value: "UDP", label: "UDP" },
];

const typeOptions = [
    { value: "STATIC", label: "STATIC" },
    { value: "STRICT_DNS", label: "STRICT_DNS" },
    { value: "LOGICAL_DNS", label: "LOGICAL_DNS" },
];

const ClusterNonEDS: React.FC<ScenarioProps> = ({ reduxStore, handleChangeRedux, handleDeleteRedux, registerForm, unregisterForm }) => {
    const [form] = Form.useForm();

    useFormValidation({
        form,
        formKey: "ClusterNonEDS",
        registerForm,
        unregisterForm,
    });

    const handleValuesChange = (changedValues: any) => {
        processChangedValues("cluster", changedValues, handleChangeRedux);
    };

    return (
        <Form
            form={form}
            layout="vertical"
            onValuesChange={handleValuesChange}
            initialValues={{
                cluster_name: reduxStore.cluster?.cluster_name,
                protocol: reduxStore.cluster?.protocol,
                type: reduxStore.cluster?.type,
                lb_endpoints: reduxStore.cluster?.lb_endpoints || [
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

                <SSelect
                    span={8}
                    name="type"
                    label="Type"
                    rules={[{ required: true, message: "Please select a type!" }]}
                    options={typeOptions}
                    placeholder="Select type"
                />

                <SSelect
                    span={8}
                    name="protocol"
                    label="Protocol"
                    rules={[{ required: true, message: "Please select a protocol!" }]}
                    options={protocolOptions}
                    placeholder="Select protocol"
                />
            </Row>

            <Card title="Load Balancer Endpoints">
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
                                                handleDeleteRedux(`cluster.lb_endpoints.${index}`);
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

export default ClusterNonEDS;