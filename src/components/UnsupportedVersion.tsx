import React from 'react';
import { Result, Button } from 'antd';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';

interface UnsupportedVersionProps {
    version: string;
}

const UnsupportedVersion: React.FC<UnsupportedVersionProps> = ({ version }) => {
    const navigate = useNavigate();

    return (
        <Result
            icon={<ExclamationCircleOutlined style={{ color: '#ff4d4f' }} />}
            title="Unsupported Version"
            subTitle={
                <div style={{ textAlign: 'center' }}>
                    <p>The version <strong>{version}</strong> is not supported.</p>
                    <p>Please select a supported version or return to the main page.</p>
                </div>
            }
            extra={[
                <Button type="primary" key="home" onClick={() => navigate('/')}>
                    Go to Dashboard
                </Button>,
                <Button key="back" onClick={() => navigate(-1)}>
                    Go Back
                </Button>
            ]}
            style={{
                padding: '60px 24px',
                background: 'var(--card-bg)',
                borderRadius: 8,
                border: '1px solid var(--border-default)'
            }}
        />
    );
};

export default UnsupportedVersion;