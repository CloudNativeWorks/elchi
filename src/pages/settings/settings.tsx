import React from 'react';
import { Card, Col, Row, Typography, } from 'antd';
import { NavLink } from 'react-router-dom';


const { Title } = Typography
const Settings: React.FC = () => {
    return (
        <Row style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'left' }}>
            <Col md={8} >
                <NavLink to={'/settings/users'}>
                    <Card variant={'borderless'} className="criclebox" style={{ width: '97%', padding: 15 }}>
                        <Title level={3}>Users</Title>
                    </Card>
                </NavLink>
            </Col>
            <Col md={8} >
                <Card variant={'borderless'} className="criclebox" style={{ width: '97%', padding: 15 }}>
                    <Col xs={24}>
                        <NavLink to={'/settings/groups'}>
                            <Title level={3}>Groups</Title>
                        </NavLink>
                    </Col>
                </Card>
            </Col>
            <Col md={8}>
                <Card variant={'borderless'} className="criclebox" style={{ width: '97%', padding: 15 }}>
                    <Col xs={24}>
                        <NavLink to={'/settings/projects'}>
                            <Title level={3}>Projects</Title>
                        </NavLink>
                    </Col>
                </Card>
            </Col>
        </Row>
    );
};


export default Settings;