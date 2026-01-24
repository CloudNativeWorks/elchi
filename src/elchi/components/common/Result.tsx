import React, { useEffect, useState } from 'react';
import { Card, Col, Drawer, List, Row, Table } from 'antd';
import { createStyles, useTheme } from 'antd-style';
import type { DrawerClassNames, DrawerStyles } from 'antd/es/drawer/DrawerPanel';
import type { TableProps } from 'antd';
import { Link } from 'react-router-dom';
import { InboxOutlined } from '@ant-design/icons';


interface ResourceDrawerProps {
    visible: boolean;
    onClose: () => void;
    message: { message: string, data: { Listeners: string[], Depends: string[] } };
}

interface DataType {
    key: number;
    type: string;
    name: string;

}

const ResourceDrawer: React.FC<ResourceDrawerProps> = ({ visible, onClose, message }) => {
    const token = useTheme();
    const [headerStyle, setHeaderStyle] = useState({ background: token['red-3'] });
    const [data, setData] = useState<DataType[]>([]);

    useEffect(() => {
        if (message?.message === "Success") {
            setHeaderStyle({ background: token['green-3'] });
        } else {
            setHeaderStyle({ background: token['red-3'] });
        }
    }, [message?.message, token]);

    useEffect(() => {
        setData(message?.data?.Depends ? convertArrayToObject(message.data.Depends) : []);
    }, [message]);

    const useStyle = createStyles(() => ({
        'my-drawer-body': {
            background: token.blue1,
        },
        'my-drawer-mask': {
            boxShadow: `inset 0 0 15px var(--shadow-color)`,
        },
        'my-drawer-header': headerStyle,
        'my-drawer-footer': {
            color: token.colorPrimary,
        },
        'my-drawer-content': {
            borderLeft: '2px dotted var(--border-default)',
        },
    }));

    const { styles } = useStyle()

    const classNames: DrawerClassNames = {
        body: styles['my-drawer-body'],
        mask: styles['my-drawer-mask'],
        header: styles['my-drawer-header'],
        footer: styles['my-drawer-footer'],
        content: styles['my-drawer-content'],
    };

    const drawerStyles: DrawerStyles = {
        mask: {
            backdropFilter: 'blur(10px)',
        },
        content: {
            boxShadow: 'var(--shadow-lg)',
        },
        header: {
            ...headerStyle,
            borderBottom: `1px solid ${token.colorPrimary}`,
        },
        body: {
            fontSize: token.fontSizeLG,
            background: token.blue1,
        },
        footer: {
            color: token.colorPrimary,
            borderTop: `1px solid ${token.colorBorder}`,
        },
    };

    const columns: TableProps<DataType>['columns'] = [
        {
            title: 'Name',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: 'Type',
            dataIndex: 'type',
            key: 'type',
        },
    ];

    function convertArrayToObject(arr: string[]): DataType[] {
        return arr.map((item, index) => {
            const [type, name] = item.split("===");
            return { key: index, type, name };
        });
    }

    return (
        <Drawer
            title={`Status: ${message?.message}`}
            placement="bottom"
            closable={true}
            onClose={onClose}
            open={visible}
            key="top"
            classNames={classNames}
            styles={drawerStyles}
        >
            <Row>
                <Col span={6}>
                    <Card title="Affected Listeners" style={{ height: "100%" }}>
                        <List
                            size="small"
                            dataSource={message?.data?.Listeners}
                            renderItem={(item) => (
                                <List.Item>
                                    <Link to={`/resource/listener/${item}`}>{item}</Link>
                                </List.Item>
                            )}
                        />
                    </Card>
                </Col>
                <Col span={18}>
                    <Card title="Linked Components" style={{ height: "100%" }}>
                        <Table
                            columns={columns}
                            locale={{
                                emptyText: (
                                    <div>
                                        <InboxOutlined style={{ fontSize: 48, marginBottom: 8 }} />
                                        <div>No Linked Components</div>
                                    </div>
                                )
                            }}
                            dataSource={data} />
                    </Card>
                </Col>
            </Row>
        </Drawer>
    );
};

export default ResourceDrawer;