import React, { useState, useEffect } from 'react';
import { Row, Col, Tabs } from 'antd';
import { useDispatch } from 'react-redux';
import ECard from '@/elchi/components/common/ECard';
import CommonComponentDataSource from '@resources/common/DataSource/DataSource';
import { handleChangeResources } from '@/redux/dispatcher';
import { ActionType, ResourceType } from '@/redux/reducer-helpers/common';

type Props = {
    veri: {
        version: string;
        reduxStore: any;
        reduxAction: any;
        keyPrefix: string;
    }
};

const ComponentDownstreamAuthPasswords: React.FC<Props> = ({ veri }) => {
    const dispatch = useDispatch();
    const { version, reduxStore, keyPrefix, reduxAction } = veri;
    const [activeKey, setActiveKey] = useState<string>('0');

    const passwords = reduxStore || [];
    const passwordKeys = Array.isArray(passwords)
        ? passwords.map((_, index) => String(index))
        : [];

    useEffect(() => {
        if (passwordKeys.length === 0) {
            handleAddPassword();
        } else if (!passwordKeys.includes(activeKey)) {
            setActiveKey(passwordKeys[0]);
        }
    }, []);

    const handleAddPassword = () => {
        const currentPasswords = Array.isArray(reduxStore) ? [...reduxStore] : [];
        const newIndex = currentPasswords.length;

        currentPasswords.push({});

        handleChangeResources(
            {
                version: version,
                type: ActionType.Update,
                keys: keyPrefix,
                val: currentPasswords,
                resourceType: ResourceType.Resource
            },
            dispatch,
            reduxAction
        );

        setActiveKey(String(newIndex));
    };

    const handleRemovePassword = (targetKey: string | React.MouseEvent | React.KeyboardEvent) => {
        const key = String(targetKey);
        const currentPasswords = Array.isArray(reduxStore) ? [...reduxStore] : [];
        const index = parseInt(key);

        if (index >= 0 && index < currentPasswords.length) {
            currentPasswords.splice(index, 1);

            handleChangeResources(
                {
                    version: version,
                    type: ActionType.Update,
                    keys: keyPrefix,
                    val: currentPasswords,
                    resourceType: ResourceType.Resource
                },
                dispatch,
                reduxAction
            );

            if (activeKey === key) {
                const newIndex = Math.max(0, index - 1);
                setActiveKey(String(newIndex));
            }
        }
    };

    return (
        <ECard title="Downstream Auth Passwords">
            <Tabs
                type="editable-card"
                activeKey={activeKey}
                onChange={setActiveKey}
                onEdit={(targetKey, action) => {
                    if (action === 'add') {
                        handleAddPassword();
                    } else {
                        handleRemovePassword(targetKey);
                    }
                }}
                items={passwordKeys.map((key) => {
                    const index = parseInt(key);
                    const passwordData = Array.isArray(passwords) ? passwords[index] : {};

                    return {
                        key: key,
                        label: `Password ${index}`,
                        closable: passwordKeys.length > 1,
                        children: (
                            <Row>
                                <Col span={24}>
                                    <CommonComponentDataSource veri={{
                                        version: version,
                                        parentName: `Password ${index}`,
                                        reduxStore: passwordData,
                                        keyPrefix: `${keyPrefix}.${index}`,
                                        tagPrefix: 'specifier',
                                        fileName: `password-${index}`,
                                    }} />
                                </Col>
                            </Row>
                        ),
                    };
                })}
            />
        </ECard>
    );
};

export default React.memo(ComponentDownstreamAuthPasswords);
