import React from "react";
import { Col, Row, Card, Typography, } from "antd";
import { NavLink } from "react-router-dom";
import { useCustomGetQuery } from "@/common/api";


const { Title } = Typography

export interface ResourceTemplate {
    name: string;
    scenario: number;
    description: string;
    components: ComponentTemplate[];
}

export interface ComponentTemplate {
    name: string;
    title: string;
    description: string;
}

const QuickStart: React.FC = () => {
    const { data: dataQuery } = useCustomGetQuery({
        queryKey: `templates`,
        enabled: true,
        path: `scenario/scenario_list`,
    });

    return (
        <Row style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'flex-start' }}>
            {dataQuery && dataQuery?.map((filter: ResourceTemplate) => (
                <Card variant={'borderless'} className="criclebox2" key={filter.name}>
                    <Col xs={24}>
                        <NavLink to={`/scenario/${filter.scenario}`}>
                            <Title level={4}>{filter.name}</Title>
                        </NavLink>
                    </Col>
                    <Col xs={24}>
                        <Row justify="space-between" align="middle">
                            <p> {filter.description} </p>
                        </Row>
                    </Col>
                </Card>
            ))}
        </Row>
    );
}

export default QuickStart;
