import { FormatTimestamp } from '@/utils/date-time-tool';
import { Col, Drawer, Form, Row, Typography } from 'antd';
import React from 'react';


interface SnapshotDetailsProps {
    data: any;
    open: boolean;
    onClose: any;
}

const { Text } = Typography;


const SnapshotDetails: React.FC<SnapshotDetailsProps> = ({ data, open, onClose }) => {
    return (
        <Drawer title="Snapshot Info" onClose={onClose} open={open} placement='top' height={150}>
            {data?.node_id === undefined ? <Text strong >Listener is not yet in use..</Text> :
                <Form
                    labelCol={{ span: 24 }}
                    wrapperCol={{ span: 24 }}
                    layout="vertical"
                    size="small"
                    style={{ maxWidth: "100%" }}
                >
                    <Row gutter={[5, 1]}>
                        <Col span={5}>
                            <Form.Item label={`Node ID:`} style={{ display: 'inline-block', width: "100%" }}>
                                <Text strong keyboard>{data?.node_id}</Text>
                            </Form.Item>
                        </Col>
                        <Col span={3}>
                            <Form.Item label={`Server:`} style={{ display: 'inline-block', width: "100%" }}>
                                <Text strong keyboard>{data?.server_address}</Text>
                            </Form.Item>
                        </Col>
                        <Col span={3}>
                            <Form.Item label={`First Seen:`} style={{ display: 'inline-block', width: "100%" }}>
                                <Text strong keyboard>{FormatTimestamp(data?.first_connected)}</Text>
                            </Form.Item>
                        </Col>
                        <Col span={3}>
                            <Form.Item label={`Last Seen:`} style={{ display: 'inline-block', width: "100%" }}>
                                <Text strong keyboard>{FormatTimestamp(data?.last_seen)}</Text>
                            </Form.Item>
                        </Col>
                        <Col span={3}>
                            <Form.Item label={`Conf Req Count:`} style={{ display: 'inline-block', width: "100%" }}>
                                <Text strong keyboard>{data?.request_count}</Text>
                            </Form.Item>
                        </Col>
                        <Col span={3}>
                            <Form.Item label={`Conn Count:`} style={{ display: 'inline-block', width: "100%" }}>
                                <Text strong keyboard>{data?.connection_count}</Text>
                            </Form.Item>
                        </Col>

                    </Row>
                </Form>
            }
        </Drawer>
    );
};

export default SnapshotDetails;