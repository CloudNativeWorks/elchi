import { Form, Row, Card } from "antd";
import { processChangedValues } from "../HandleChange";
import SInput from "../components/SInput";
import { ScenarioProps } from "../Models";
import useFormValidation from "../hooks/useFormValidation";
import { useEffect } from "react";
import SSelect from "../components/SSelect";


const ClusterEDS: React.FC<ScenarioProps> = ({ reduxStore, handleChangeRedux, registerForm, unregisterForm }) => {
    const [form] = Form.useForm();

    useFormValidation({
        form,
        formKey: "ClusterEDS",
        registerForm,
        unregisterForm,
    });

    const handleValuesChange = (changedValues: any) => {
        processChangedValues("cluster", changedValues, handleChangeRedux);
    };

    useEffect(() => {
        handleChangeRedux("cluster.eds_config", reduxStore.endpoint?.cluster_name);
    }, [reduxStore]);


    return (
        <Form
            form={form}
            layout="vertical"
            onValuesChange={handleValuesChange}
            initialValues={{
                cluster_name: reduxStore.cluster?.cluster_name,
                eds_config: reduxStore.endpoint?.cluster_name,
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

            <Card title="Endpoint Cluster Config">
                <SSelect
                    span={8}
                    name="eds_config"
                    label="EDS Config"
                    rules={[{ required: true, message: "Please enter the Cluster name!" }]}
                    options={[{ value: reduxStore.endpoint?.cluster_name, label: reduxStore.endpoint?.cluster_name }]}
                    placeholder="Select Cluster name"
                />
            </Card>
        </Form>
    );
};

export default ClusterEDS;