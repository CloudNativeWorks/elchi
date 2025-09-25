import React, { useState } from 'react';
import CryptoJS from 'crypto-js';
import { Form, Input, Button, Card, Typography, Space } from 'antd';
import { copyToClipboard as copyToClipboardUtil } from '@/utils/clipboard';

const { TextArea } = Input;

const UserHashGenerator: React.FC = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [hashedPassword, setHashedPassword] = useState<string | null>(null);

    const generateHash = () => {
        if (!username || !password) {
            return;
        }

        const shaHash = CryptoJS.SHA1(password).toString(CryptoJS.enc.Base64);
        const finalHash = `${username}:{SHA}${shaHash}`;
        setHashedPassword(finalHash);
    };

    const copyToClipboard = async () => {
        if (hashedPassword) {
            copyToClipboardUtil(hashedPassword, 'Hash copied successfully!');
        }
    };

    return (
        <Card
            style={{ padding: '10px' }}
            variant={'borderless'}
        >
            <Form layout="vertical" onFinish={generateHash} autoComplete="off">
                <Form.Item label="Username" required>
                    <Input
                        name="disable-autofill-username"
                        placeholder="Enter username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        autoComplete="off"
                        data-lpignore="true"
                        data-1p-ignore="true"
                        data-form-type="other"
                    />
                </Form.Item>

                <Form.Item label="Password" required>
                    <Input.Password
                        name="disable-autofill-pass"
                        placeholder="Enter password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        autoComplete="off"
                        data-lpignore="true"
                        data-1p-ignore="true"
                        data-form-type="other"
                    />
                </Form.Item>

                <Form.Item>
                    <Button type="primary" htmlType="submit" block style={{ background: 'linear-gradient(90deg, #0456a0 0%, #0090b7 100%)' }}>
                        Generate Hash
                    </Button>
                </Form.Item>
            </Form>

            {hashedPassword && (
                <div style={{ marginTop: '20px' }}>
                    <Typography.Title level={5}>Generated Hash:</Typography.Title>
                    <Space direction="vertical" style={{ width: '100%' }}>
                        <TextArea value={hashedPassword} readOnly autoSize />
                        <Button onClick={copyToClipboard} type="default" block>
                            Copy to Clipboard
                        </Button>
                    </Space>
                </div>
            )}
        </Card>
    );
};

export default UserHashGenerator;