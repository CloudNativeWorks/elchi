import React from 'react';
import { Card, Col, Drawer, Row } from 'antd';
import { createStyles, useTheme } from 'antd-style';
import type { DrawerClassNames, DrawerStyles } from 'antd/es/drawer/DrawerPanel';
import { parseError } from '@/utils/tools';


interface ResourceDrawerProps {
    visible: boolean;
    onClose: () => void;
    message: any;
}

const ErrResourceDrawer: React.FC<ResourceDrawerProps> = ({ visible, onClose, message }) => {
    const token = useTheme();
    const headerStyle = { background: token['red-3'] }

    const useStyle = createStyles(() => ({
        'my-drawer-body': {
            background: token.blue1,
        },
        'my-drawer-mask': {
            boxShadow: `inset 0 0 15px #fff`,
        },
        'my-drawer-header': headerStyle,
        'my-drawer-footer': {
            color: token.colorPrimary,
        },
        'my-drawer-content': {
            borderLeft: '2px dotted #333',
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
            boxShadow: '-10px 0 10px #666',
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

    return (
        <Drawer
            title={"Error Result"}
            placement="bottom"
            closable={true}
            onClose={onClose}
            open={visible}
            key="top"
            classNames={classNames}
            styles={drawerStyles}
        >
            <Row>
                <Col span={24}>
                    <Card style={{ height: "100%" }}>
                        {message?.data !== null && message?.data?.data?.map((item: string, index: number) => {
                            const parts = item.split('|').map(part => part.trim());
                            return (
                                <div
                                    key={index}
                                    style={{
                                        backgroundColor: '#f5f5f5',
                                        padding: '10px',
                                        marginBottom: '10px',
                                        borderRadius: '4px',
                                    }}
                                >
                                    {parts.map((part, i) => (
                                        <div key={i} style={{ marginLeft: i * 20 }}>
                                            <h4>{part}</h4>
                                        </div>
                                    ))}
                                </div>
                            );
                        })}
                        {parseError(message?.message)}
                    </Card>
                </Col>
            </Row>
        </Drawer>
    );
};

export default ErrResourceDrawer;