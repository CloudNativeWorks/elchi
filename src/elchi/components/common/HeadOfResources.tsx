import { Row, Col, Input, Button, Switch, Card, Space, Typography } from 'antd';
import { RenderCreateUpdate } from './CreateUpdate';
import { ConfigDiscovery } from '@/common/types';
import { GTypeFieldsBase } from '@/common/statics/gtypes';
import { FileTextOutlined, CodeOutlined, RocketOutlined, CloudServerOutlined, FileOutlined } from '@ant-design/icons';
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { ResourceAction } from '@/redux/reducers/slice';
import { ActionType, ResourceType } from '@/redux/reducer-helpers/common';
import HowToStart from './HowTo';
import DiscoveryModal from './DiscoveryModal';
import TemplateModal from './TemplateModal';

const { Text, Title } = Typography;


interface RenderFormItemProps {
    generalName: string;
    version: string;
    changeGeneralName?: any;
    locationCheck: boolean;
    createUpdate: createUpdate;
    // Optional managed field props
    managed?: boolean;
    changeGeneralManaged?: any;
    callBack?: any;
}

type createUpdate = {
    location_path: string;
    offset: number;
    name: string;
    reduxStore: any;
    voidToJSON: any;
    queryResource: any;
    envoyVersion: string;
    gtype: string;
    configDiscovery?: ConfigDiscovery[];
    GType: GTypeFieldsBase;
    rawQuery?: any;
}

export const HeadOfResource = ({ generalName, version, changeGeneralName, locationCheck, createUpdate, managed, changeGeneralManaged, callBack }: RenderFormItemProps) => {
    const dispatch = useDispatch();
    const [showHowTo, setShowHowTo] = useState(false);
    const [showDiscovery, setShowDiscovery] = useState(false);
    const [showTemplate, setShowTemplate] = useState(false);
    
    // These parameters are used conditionally in JSX
    void managed; void changeGeneralManaged; void callBack;

    const isEndpointType = createUpdate.gtype === "envoy.config.endpoint.v3.ClusterLoadAssignment";

    // Get discovery data from Redux
    const discoveryData = useSelector((state: any) =>
        state.VersionedResources[version]?.ElchiDiscovery || []
    );

    const handleDiscoverySave = (discoveries: any[]) => {
        // Save to Redux
        dispatch(
            ResourceAction({
                version: version,
                type: ActionType.Set,
                val: discoveries,
                keys: [],
                resourceType: ResourceType.ElchiDiscovery
            })
        );
    };
    return (
        <Card
            style={{
                borderRadius: 12,
                boxShadow: '0 2px 8px rgba(5,117,230,0.06)',
                marginBottom: 24
            }}
            styles={{
                body: { padding: 16 }
            }}
        >
            <Row align="middle" justify="space-between">
                <Col flex="1" style={{ paddingRight: 24 }}>
                    <div style={{ marginBottom: 16 }}>
                        <Space align="center">
                            <FileTextOutlined style={{ color: '#1890ff', fontSize: 18 }} />
                            <Title level={5} style={{ margin: 0, color: '#262626' }}>General</Title>
                        </Space>
                    </div>

                    <Row gutter={[16, 12]}>
                        <Col span={8}>
                            <div>
                                <Text style={{ fontSize: 12, fontWeight: 500, color: '#595959', display: 'block', marginBottom: 6 }}>
                                    Name <Text type="danger">*</Text>
                                </Text>
                                <Input
                                    value={generalName}
                                    onChange={(event) => changeGeneralName(event.target.value)}
                                    disabled={!locationCheck}
                                    placeholder="Resource name"
                                    style={{
                                        borderRadius: 6,
                                        fontSize: 14
                                    }}
                                />
                            </div>
                        </Col>
                        <Col span={4}>
                            <div>
                                <Text style={{ fontSize: 12, fontWeight: 500, color: '#595959', display: 'block', marginBottom: 6 }}>
                                    Version <Text type="danger">*</Text>
                                </Text>
                                <Input
                                    value={version}
                                    disabled
                                    prefix={<CodeOutlined style={{ color: '#bfbfbf', fontSize: 14 }} />}
                                    style={{
                                        borderRadius: 6,
                                        backgroundColor: '#fafafa',
                                        fontSize: 14
                                    }}
                                />
                            </div>
                        </Col>
                        {isEndpointType && (
                            <Col span={4}>
                                <div>
                                    <Text style={{ fontSize: 12, fontWeight: 500, color: '#595959', display: 'block', marginBottom: 6 }}>
                                        Discovery
                                    </Text>
                                    <Button
                                        onClick={() => setShowDiscovery(true)}
                                        icon={<CloudServerOutlined />}
                                        style={{
                                            width: '100%',
                                            borderRadius: 6,
                                            height: 32,
                                            backgroundColor: discoveryData.length > 0 ? '#e6f7ff' : undefined,
                                            borderColor: discoveryData.length > 0 ? '#1890ff' : undefined,
                                            color: discoveryData.length > 0 ? '#1890ff' : undefined
                                        }}
                                    >
                                        {discoveryData.length > 0 ? `${discoveryData.length} Clusters` : 'Configure Discovery'}
                                    </Button>
                                </div>
                            </Col>
                        )}
                        {createUpdate.gtype === "envoy.config.bootstrap.v3.Bootstrap" && (
                            <Col span={4}>
                                <div>
                                    <Text style={{ fontSize: 12, fontWeight: 500, color: '#595959', display: 'block', marginBottom: 6 }}>
                                        Documentation
                                    </Text>
                                    <Button
                                        onClick={() => setShowHowTo(true)}
                                        icon={<RocketOutlined />}
                                        style={{
                                            width: '100%',
                                            borderRadius: 6,
                                            height: 32
                                        }}
                                    >
                                        How to Start
                                    </Button>
                                </div>
                            </Col>
                        )}
                        {managed !== undefined && (
                            <Col span={4}>
                                <div>
                                    <Text style={{ fontSize: 12, fontWeight: 500, color: '#595959', display: 'block', marginBottom: 6 }}>
                                        Managed <Text type="danger">*</Text>
                                    </Text>
                                    <div style={{
                                        background: managed ? '#e6f7ff' : '#f5f5f5',
                                        border: `1px solid ${managed ? '#91d5ff' : '#d9d9d9'}`,
                                        borderRadius: 6,
                                        padding: '4px 12px',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'space-between',
                                        height: 32,
                                        fontSize: 14
                                    }}>
                                        <Text style={{ fontSize: 13, color: managed ? '#096dd9' : '#595959' }}>
                                            {managed ? 'Yes' : 'No'}
                                        </Text>
                                        <Switch
                                            size="small"
                                            checked={managed}
                                            disabled={!locationCheck}
                                            onChange={(val) => changeGeneralManaged && changeGeneralManaged(val)}
                                        />
                                    </div>
                                </div>
                            </Col>
                        )}
                        <Col span={4}>
                            <div>
                                <Text style={{ fontSize: 12, fontWeight: 500, color: '#595959', display: 'block', marginBottom: 6 }}>
                                    Template
                                </Text>
                                <Button
                                    onClick={() => setShowTemplate(true)}
                                    icon={<FileOutlined />}
                                    style={{
                                        width: '100%',
                                        borderRadius: 6,
                                        height: 32
                                    }}
                                >
                                    Template
                                </Button>
                            </div>
                        </Col>
                    </Row>
                </Col>

                <Col>
                    <div style={{
                        borderLeft: '1px solid #f0f0f0',
                        paddingLeft: 20,
                        height: 100,
                        display: 'flex',
                        alignItems: 'center'
                    }}>
                        <RenderCreateUpdate
                            location_path={createUpdate?.location_path}
                            offset={createUpdate.offset}
                            name={createUpdate.name}
                            reduxStore={createUpdate.reduxStore}
                            voidToJSON={createUpdate.voidToJSON}
                            queryResource={createUpdate.queryResource}
                            envoyVersion={createUpdate.envoyVersion}
                            gtype={createUpdate.gtype}
                            configDiscovery={createUpdate.configDiscovery}
                            GType={createUpdate.GType}
                            rawQuery={createUpdate.rawQuery}
                            callBack={callBack}
                            managed={managed}
                        />
                    </div>
                </Col>
            </Row>
            <HowToStart open={showHowTo} onClose={() => setShowHowTo(false)} />
            <DiscoveryModal
                open={showDiscovery}
                onClose={() => setShowDiscovery(false)}
                onSave={handleDiscoverySave}
                initialData={discoveryData}
            />
            <TemplateModal
                visible={showTemplate}
                onClose={() => setShowTemplate(false)}
                gtype={createUpdate.gtype}
                version={version}
                reduxStore={createUpdate.reduxStore}
                voidToJSON={createUpdate.voidToJSON}
            />
        </Card>
    )
};

