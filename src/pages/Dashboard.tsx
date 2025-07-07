import React, { useState } from "react";
import { Col, Row, Card, Typography, Statistic, Button, Divider, Modal } from "antd";
import { NavLink } from "react-router-dom";
import CountUp from 'react-countup';
import { useProjectVariable } from "@/hooks/useProjectVariable";
import { useCustomGetQuery } from "@/common/api";
import { InfoCircleOutlined } from '@ant-design/icons';

const { Title } = Typography;
const formatter = (value: number | string) => {
    const numericValue = typeof value === 'number' ? value : parseFloat(value);
    return <CountUp end={numericValue} />;
};

const resource = {
    category: 'Resources',
    filters: [
        { 
            name: 'Listeners', 
            path: '/resource/listener', 
            data: "Listeners are the primary network interface for Envoy. They handle incoming connections and manage the lifecycle of network connections. Each listener can be configured with various filters and protocols.",
            canonical_name: "listeners" 
        },
        { 
            name: 'Routes', 
            path: '/resource/route', 
            data: "Routes define how incoming requests are matched and forwarded to upstream services. They provide flexible routing rules based on various criteria such as path, headers, and query parameters.",
            canonical_name: "routes" 
        },
        { 
            name: 'Virtual Hosts', 
            path: '/resource/virtual_host', 
            data: "Virtual Hosts enable hosting multiple domains on a single listener. They provide domain-based routing and allow different routing rules for different domains.",
            canonical_name: "virtual_hosts" 
        },
        { 
            name: 'Clusters', 
            path: '/resource/cluster', 
            data: "Clusters represent groups of upstream hosts that provide the same service. They handle load balancing, health checking, and connection management for upstream services.",
            canonical_name: "clusters" 
        },
        { 
            name: 'Endpoints', 
            path: '/resource/endpoint', 
            data: "Endpoints represent individual instances of upstream services. They provide detailed information about service instances and their health status.",
            canonical_name: "endpoints" 
        },
        { 
            name: 'TLS', 
            path: '/resource/tls', 
            data: "TLS configuration manages secure communication settings. It handles certificate management, cipher suites, and other security-related parameters for encrypted connections.",
            canonical_name: "tls" 
        },
        { 
            name: 'Secrets', 
            path: '/resource/secret', 
            data: "Secrets manage sensitive information such as TLS certificates and keys. They provide secure storage and distribution of confidential data.",
            canonical_name: "secrets" 
        },
        { 
            name: 'Filters', 
            path: '/filters', 
            data: "Filters provide modular processing capabilities for requests and responses. They enable various features like authentication, rate limiting, and request transformation.",
            canonical_name: "filters" 
        },
        { 
            name: 'Extensions', 
            path: '/extensions', 
            data: "Extensions add additional functionality to Envoy. They provide custom features and integrations with external systems and services.",
            canonical_name: "extensions" 
        },
    ]
};

const Dashboard: React.FC = () => {
    const { project } = useProjectVariable();
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [modalContent, setModalContent] = useState("");

    const { data: dataQuery } = useCustomGetQuery({
        queryKey: `query_${project}`,
        enabled: true,
        path: `custom/count/all?project=${project}`,
    });

    const openModalWithFilterData = (data: string) => {
        setModalContent(data);
        setIsModalVisible(true);
    };

    const handleModalClose = () => {
        setIsModalVisible(false);
    };

    return (
        <>
            <Row style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'flex-start' }}>
                <Divider type="horizontal" orientation="left" orientationMargin="0">
                    {resource.category}
                </Divider>
                {resource.filters.map((filter) => (
                    <Card variant={'borderless'} className="criclebox" key={filter.name}>
                        <Col xs={24}>
                            <NavLink to={filter.path}>
                                <Title level={4}>{filter.name}</Title>
                            </NavLink>
                        </Col>
                        <Col xs={24}>
                            <Row justify="space-between" align="middle">
                                <Statistic value={dataQuery?.[filter?.canonical_name] || 0} formatter={formatter} />
                                <Button onClick={() => openModalWithFilterData(filter.data)}><InfoCircleOutlined /></Button>
                            </Row>
                        </Col>
                    </Card>
                ))}
            </Row>
            <Modal
                title="Resource Details"
                open={isModalVisible}
                onCancel={handleModalClose}
                footer={null}
            >
                <Typography.Paragraph>
                    {modalContent}
                </Typography.Paragraph>
            </Modal>
        </>
    );
}

export default Dashboard;