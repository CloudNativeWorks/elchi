import { Row, Col, Input, Button, Switch, Card, Space, Typography } from 'antd';
import { RenderCreateUpdate } from './CreateUpdate';
import { ConfigDiscovery } from '@/common/types';
import { GTypeFieldsBase } from '@/common/statics/gtypes';
import NodeWarnings from './NodeWarnings';
import { InfoCircleOutlined, FileTextOutlined, CodeOutlined, RocketOutlined } from '@ant-design/icons';
import { useProjectVariable } from '@/hooks/useProjectVariable';
import { useCustomGetQuery } from '@/common/api';
import { useState } from 'react';
import SnapshotDetails from './SnapshotDetails';
import HowToStart from './HowTo';

const { Text, Title } = Typography;


interface RenderFormItemProps {
    generalName: string;
    version: string;
    changeGeneralName?: any;
    locationCheck: boolean;
    createUpdate: createUpdate;
}

interface RenderFormItemPropsListener {
    generalName: string;
    version: string;
    changeGeneralName: any;
    changeGeneralManaged: any;
    locationCheck: boolean;
    managed: boolean;
    createUpdate: createUpdate;
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

export const HeadOfResource = ({ generalName, version, changeGeneralName, locationCheck, createUpdate }: RenderFormItemProps) => {
    const [showHowTo, setShowHowTo] = useState(false);
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
                        <Col span={8}>
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
                        {
                            createUpdate.gtype === "envoy.config.bootstrap.v3.Bootstrap" &&
                            <Col span={8}>
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
                        }
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
                        />
                    </div>
                </Col>
            </Row>
            <HowToStart open={showHowTo} onClose={() => setShowHowTo(false)} />
        </Card>
    )
};



export const HeadOfResourceListener = ({ generalName, version, managed, changeGeneralName, changeGeneralManaged, locationCheck, createUpdate, callBack }: RenderFormItemPropsListener) => {
    const { project } = useProjectVariable();
    const [open, setOpen] = useState(false);

    const { data: queryData } = useCustomGetQuery({
        queryKey: `custom_lis_snap_detail${generalName}`,
        enabled: createUpdate.location_path !== "/create/listener",
        path: `bridge/snapshot_details?metadata_node_id=${generalName}:${project}&version=${version}`,
    });

    const showDrawer = () => {
        setOpen(true);
    };

    const onClose = () => {
        setOpen(false);
    };

    return (
        <>
            <NodeWarnings err={queryData?.client?.errors} />
            <SnapshotDetails open={open} onClose={onClose} data={queryData?.client} />

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
                            <Col span={6}>
                                <div>
                                    <Text style={{ fontSize: 12, fontWeight: 500, color: '#595959', display: 'block', marginBottom: 6 }}>
                                        Name <Text type="danger">*</Text>
                                    </Text>
                                    <Input
                                        value={generalName}
                                        onChange={(event) => changeGeneralName(event.target.value)}
                                        disabled={!locationCheck}
                                        placeholder="Listener name"
                                        style={{ 
                                            borderRadius: 6,
                                            fontSize: 14
                                        }}
                                    />
                                </div>
                            </Col>
                            <Col span={6}>
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
                            <Col span={6}>
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
                                            {managed ? 'True' : 'False'}
                                        </Text>
                                        <Switch
                                            size="small"
                                            checked={managed}
                                            disabled={!locationCheck}
                                            onChange={(val) => changeGeneralManaged(val)}
                                        />
                                    </div>
                                </div>
                            </Col>
                            <Col span={6}>
                                <div>
                                    <Text style={{ fontSize: 12, fontWeight: 500, color: '#595959', display: 'block', marginBottom: 6 }}>
                                        Info
                                    </Text>
                                    <Button 
                                        onClick={showDrawer}
                                        icon={<InfoCircleOutlined />}
                                        style={{ 
                                            width: '100%',
                                            borderRadius: 6,
                                            height: 32
                                        }}
                                    >
                                        Details
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
                                callBack={callBack}
                                managed={managed}
                                GType={createUpdate.GType}
                            />
                        </div>
                    </Col>
                </Row>
            </Card>
        </>
    )
};