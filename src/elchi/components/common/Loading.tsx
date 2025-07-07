import React, { memo } from "react";
import { Col, Divider, Row, Skeleton, Space } from 'antd';

interface RenderLoadingProps {
    checkPage: boolean;
    isLoadingQuery: boolean;
    error?: any;
}

const RenderLoading: React.FC<RenderLoadingProps> = memo(({ checkPage, isLoadingQuery, error }) => {
    const renderSkeletons = (count: number) => {
        return Array.from({ length: count }, (_, index) => (
            <Space key={index}>
                <Skeleton.Button active={true} size="small" shape="circle" />
                <Skeleton.Input active={true} size="small" block={true} />
            </Space>
        ));
    };

    const getErrorMessage = (error: unknown) => {
        if (error instanceof Error) {
            return error.message;
        }
        try {
            return JSON.stringify(error);
        } catch {
            return String(error);
        }
    };

    if (!checkPage) return null;
    
    if (error !== "") {
        return (
            <div>
                <strong>An error has occurred:</strong> {getErrorMessage(error)}
            </div>
        );
    }

    if (!isLoadingQuery) return null;

    return (
        <Row>
            <Skeleton active title={false} paragraph={{ rows: 4 }} />
            <Divider />
            <Col md={4}>
                <Space direction="vertical" size="small">
                    {renderSkeletons(25)}
                </Space>
            </Col>
            <Col md={20}>
                <Skeleton active title={false} paragraph={{ rows: 23 }} />
            </Col>
        </Row>
    );
});

RenderLoading.displayName = 'RenderLoading';

export default RenderLoading;