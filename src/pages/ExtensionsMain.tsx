import React, { useState } from "react";
import { Col, Row, Card, Typography, Statistic, Button, Modal } from "antd";
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

const extensions = {
    category: 'Extensions',
    filters: [
        { 
            name: 'Access Log', 
            path: '/extensions/access_log', 
            data: "The Access Log extension provides detailed logging capabilities for HTTP requests and responses. It enables comprehensive monitoring and debugging of traffic patterns and request processing.",
            category: "envoy.access_loggers" 
        },
        { 
            name: 'Compressor Library', 
            path: '/extensions/compressor_library', 
            data: "The Compressor Library extension offers various compression algorithms for HTTP responses. It helps reduce bandwidth usage and improve performance by compressing response data.",
            category: "envoy.compression.compressor" 
        },
        { 
            name: 'HealthCheck Event File Sink', 
            path: '/extensions/hcefs', 
            data: "The HealthCheck Event File Sink extension captures and logs health check events to files. It provides detailed monitoring of service health status and state changes.",
            category: "envoy.health_check.event_sinks" 
        },
        { 
            name: 'Http Protocol Options', 
            path: '/extensions/http_protocol_options', 
            data: "The HTTP Protocol Options extension configures HTTP protocol-specific settings. It controls various aspects of HTTP/1.1 and HTTP/2 protocol behavior and optimization.",
            category: "envoy.upstreams.http.http_protocol_options" 
        },
        { 
            name: 'Uri Template Match', 
            path: '/extensions/utm', 
            data: "The URI Template Match extension provides flexible URI matching capabilities using template patterns. It enables sophisticated routing and request matching based on URI patterns.",
            category: "envoy.path.match.uri_template.uri_template_matcher" 
        },
        { 
            name: 'Stateful Session State', 
            path: '/extensions/session_state', 
            data: "The Stateful Session State extension manages session state information across requests. It enables session persistence and stateful routing for HTTP traffic.",
            category: "envoy.http.stateful_session" 
        },
        { 
            name: 'Stat Sinks', 
            path: '/extensions/stat_sinks', 
            data: "The Stat Sinks extension provides detailed logging capabilities for HTTP requests and responses. It enables comprehensive monitoring and debugging of traffic patterns and request processing.",
            category: "envoy.stats_sinks" 
        },
    ]
};

const ExtensionsMain: React.FC = () => {
    const { project } = useProjectVariable();
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [modalContent, setModalContent] = useState("");

    const { data: dataQuery } = useCustomGetQuery({
        queryKey: `query_${project}`,
        enabled: true,
        path: `custom/count/filters?project=${project}&collection=extensions&category=extension`,
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
                {extensions.filters.map((filter) => (
                    <Card variant={'borderless'} className="criclebox" key={filter.name}>
                        <Col xs={24}>
                            <NavLink to={filter.path}>
                                <Title level={4}>{filter.name}</Title>
                            </NavLink>
                        </Col>
                        <Col xs={24}>
                            <Row justify="space-between" align="middle">
                                <Statistic value={dataQuery?.[filter?.category] || 0} formatter={formatter} />
                                <Button onClick={() => openModalWithFilterData(filter.data)}><InfoCircleOutlined /></Button>
                            </Row>
                        </Col>
                    </Card>
                ))}
            </Row>
            <Modal
                title="Extension Details"
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

export default ExtensionsMain;