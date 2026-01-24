import React from "react";
import { Col, Tabs, Row, Input } from 'antd';
import { useDispatch } from "react-redux";
import CommonComponentDataSource from "../common/DataSource/DataSource";
import { handleChangeResources } from "@/redux/dispatcher";
import { ActionType, ResourceType } from "@/redux/reducer-helpers/common";
import { ResourceAction } from "@/redux/reducers/slice";
import ECard from "@/elchi/components/common/ECard";
import { Form } from "antd";
import { prettyTag } from "@/utils/tools";


type GeneralProps = {
    veri: {
        version: string;
        reduxStore: { [key: string]: any } | undefined;
        keyPrefix: string;
    }
};

const ComponentGenericSecrets: React.FC<GeneralProps> = ({ veri }) => {
    const dispatch = useDispatch();
    const secrets = veri.reduxStore;
    const secretKeys = secrets instanceof Map
        ? Array.from(secrets.keys())
        : Object.keys(secrets || {});

    const [activeKey, setActiveKey] = React.useState(secretKeys[0] || '0');
    const [newKeyName, setNewKeyName] = React.useState('');

    // Update activeKey when a new secret is added
    React.useEffect(() => {
        if (secretKeys.length > 0 && !secretKeys.includes(activeKey)) {
            setActiveKey(secretKeys[secretKeys.length - 1]);
        }
    }, [secretKeys, activeKey]);

    const handleRemoveSecret = (targetKey: any) => {
        // Remove secret entry
        handleChangeResources({
            version: veri.version,
            type: ActionType.Delete,
            keys: `${veri.keyPrefix}.${targetKey}`,
            resourceType: ResourceType.Resource
        }, dispatch, ResourceAction);

        // Switch to another tab
        const remainingKeys = secretKeys.filter(k => k !== targetKey);
        if (remainingKeys.length > 0) {
            setActiveKey(remainingKeys[0]);
        }
    };

    const handleAddSecret = () => {
        const secretExists = secrets instanceof Map
            ? secrets.has(newKeyName)
            : secrets?.[newKeyName];

        if (!newKeyName || secretExists) {
            return; // Don't add if name is empty or already exists
        }
        // Add new secret entry
        handleChangeResources({
            version: veri.version,
            type: ActionType.Update,
            keys: `${veri.keyPrefix}.${newKeyName}`,
            val: {},
            resourceType: ResourceType.Resource
        }, dispatch, ResourceAction);
        setActiveKey(newKeyName);
        setNewKeyName('');
    };

    return (
        <ECard title="Multiple Secrets">
            <Row style={{ marginBottom: 16 }}>
                <Col span={24}>
                    <Form layout="inline">
                        <Form.Item label={prettyTag("New Secret Name")}>
                            <Input
                                placeholder="Enter secret name"
                                value={newKeyName}
                                onChange={(e) => setNewKeyName(e.target.value)}
                                onPressEnter={handleAddSecret}
                                style={{ width: 200 }}
                            />
                        </Form.Item>
                    </Form>
                </Col>
            </Row>
            <Tabs
                type="editable-card"
                activeKey={activeKey}
                onChange={setActiveKey}
                onEdit={(targetKey, action) => {
                    if (action === 'add') {
                        handleAddSecret();
                    } else {
                        handleRemoveSecret(targetKey);
                    }
                }}
                items={secretKeys.map((key) => {
                    const secretData = secrets instanceof Map
                        ? secrets.get(key)
                        : secrets?.[key];

                    return {
                        key: key,
                        label: key,
                        closable: true,
                        children: (
                            <Row>
                                <Col span={24}>
                                    <CommonComponentDataSource veri={{
                                        version: veri.version,
                                        parentName: `Secret: ${key}`,
                                        reduxStore: secretData,
                                        keyPrefix: `${veri.keyPrefix}.${key}`,
                                        tagPrefix: '',
                                        fileName: `${key}-secret`,
                                    }} />
                                </Col>
                            </Row>
                        ),
                    };
                })}
            />
            {secretKeys.length === 0 && (
                <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-tertiary)' }}>
                    No secrets added. Enter a name above and click the + button or press Enter to add a secret.
                </div>
            )}
        </ECard>
    );
};

export default ComponentGenericSecrets;
