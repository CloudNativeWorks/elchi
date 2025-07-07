import { Form, Row, Divider, Col, Input, Button, Switch } from 'antd';
import { RenderCreateUpdate } from './CreateUpdate';
import { ConfigDiscovery } from '@/common/types';
import { GTypeFieldsBase } from '@/common/statics/gtypes';
import { EForm } from './e-components/EForm';
import NodeWarnings from './NodeWarnings';
import { InfoCircleTwoTone } from '@ant-design/icons';
import { useProjectVariable } from '@/hooks/useProjectVariable';
import { useCustomGetQuery } from '@/common/api';
import { useState } from 'react';
import SnapshotDetails from './SnapshotDetails';
import HowToStart from './HowTo';


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
        <div style={{ background: '#fff', borderRadius: 12, padding: 12, boxShadow: '0 2px 8px rgba(5,117,230,0.06)', marginBottom: 24 }}>
            <Row id="headofresource" justify="space-around" align="middle">
                <Col md={18}>
                    <Divider type="horizontal" orientation="left" orientationMargin="0">General</Divider>
                    <EForm>
                        <Row gutter={[5, 1]}>
                            <Col span={6}>
                                <Form.Item required label={`Name:`} style={{ display: 'inline-block', width: "100%" }}>
                                    <Input
                                        value={generalName}
                                        onChange={(event) => changeGeneralName(event.target.value)}
                                        disabled={!locationCheck}
                                    />
                                </Form.Item>
                            </Col>
                            <Col span={6}>
                                <Form.Item required label={`Version:`} style={{ display: 'inline-block', width: "100%" }}>
                                    <Input
                                        value={version}
                                        disabled
                                    />
                                </Form.Item>
                            </Col>
                            {
                                createUpdate.gtype === "envoy.config.bootstrap.v3.Bootstrap" &&
                                <Col span={6}>
                                    <Form.Item label={`How to start:`} style={{ display: 'inline-block', width: "100%" }}>
                                        <Button onClick={() => setShowHowTo(true)}>
                                            <InfoCircleTwoTone />
                                        </Button>
                                    </Form.Item>
                                </Col>
                            }
                        </Row>
                    </EForm>
                </Col>
                <Col md={6} style={{ display: 'flex', alignItems: 'center', height: '100%' }}>
                    <div style={{ width: '100%' }}>
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
        </div>
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

            <div style={{ background: '#fff', borderRadius: 12, padding: 12, boxShadow: '0 2px 8px rgba(5,117,230,0.06)', marginBottom: 24 }}>
                <Row id="headofresource" justify="space-around" align="middle">
                    <Col md={18}>
                        <Divider type="horizontal" orientation="left" orientationMargin="0">General</Divider>
                        <Form
                            labelCol={{ span: 24 }}
                            wrapperCol={{ span: 24 }}
                            layout="vertical"
                            size="small"
                            style={{ maxWidth: "100%" }}
                        >
                            <Row gutter={[5, 1]}>
                                <Col span={6}>
                                    <Form.Item required label={`Name:`} style={{ display: 'inline-block', width: "100%" }}>
                                        <Input
                                            value={generalName}
                                            onChange={(event) => changeGeneralName(event.target.value)}
                                            disabled={!locationCheck}
                                        />
                                    </Form.Item>
                                </Col>
                                <Col span={6}>
                                    <Form.Item required label={`Version:`} style={{ display: 'inline-block', width: "100%" }}>
                                        <Input
                                            value={version}
                                            disabled
                                        />
                                    </Form.Item>
                                </Col>
                                <Col span={3}>
                                    <Form.Item required label={`Managed:`} style={{ display: 'inline-block', width: "100%" }}>
                                        <Switch
                                            checkedChildren="True"
                                            unCheckedChildren="False"
                                            checked={managed}
                                            disabled={!locationCheck}
                                            onChange={(val) => changeGeneralManaged(val)}
                                        />
                                    </Form.Item>
                                </Col>
                                <Col span={6}>
                                    <Form.Item label={`Info:`} style={{ display: 'inline-block', width: "100%" }}>
                                        <Button onClick={showDrawer}>
                                            <InfoCircleTwoTone />
                                        </Button>
                                    </Form.Item>
                                </Col>
                            </Row>
                        </Form>
                    </Col>
                    <Col md={6} style={{ display: 'flex', alignItems: 'center', height: '100%' }}>
                        <div style={{ width: '100%' }}>
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
                </Row >
            </div >
        </>
    )
};