import React, { useRef } from 'react';
import { Card, Typography, Space, Button, Row, Col, Alert } from 'antd';
import { DownloadOutlined, PrinterOutlined, WarningOutlined } from '@ant-design/icons';
import { useReactToPrint } from 'react-to-print';
import jsPDF from 'jspdf';

const { Text, Title } = Typography;

interface BackupCodesDisplayProps {
    codes: string[];
    username?: string;
}

export const BackupCodesDisplay: React.FC<BackupCodesDisplayProps> = ({ codes, username }) => {
    const printRef = useRef<HTMLDivElement>(null);

    const handlePrint = useReactToPrint({
        content: () => printRef.current,
        documentTitle: `2FA_Backup_Codes_${username || 'User'}`
    });

    const handleDownloadPDF = () => {
        const doc = new jsPDF();
        const pageWidth = doc.internal.pageSize.getWidth();

        // Header
        doc.setFontSize(18);
        doc.text('2FA Backup Codes', pageWidth / 2, 20, { align: 'center' });

        doc.setFontSize(12);
        doc.text(`Generated for: ${username || 'User'}`, pageWidth / 2, 30, { align: 'center' });
        doc.text(`Date: ${new Date().toLocaleString()}`, pageWidth / 2, 38, { align: 'center' });

        // Warning
        doc.setFontSize(10);
        doc.setTextColor(200, 0, 0);
        doc.text('PRIVATE - DO NOT SHARE', pageWidth / 2, 48, { align: 'center' });
        doc.setTextColor(0, 0, 0);

        // Codes
        doc.setFontSize(14);
        doc.setFont('courier');
        let yPos = 65;
        codes.forEach((code, index) => {
            doc.text(`${index + 1}.  ${code}`, pageWidth / 2, yPos, { align: 'center' });
            yPos += 12;
        });

        // Footer
        doc.setFontSize(9);
        doc.setFont('helvetica');
        doc.setTextColor(100, 100, 100);
        yPos += 15;
        doc.text('Keep these codes in a secure location.', pageWidth / 2, yPos, { align: 'center' });
        doc.text('Each code can only be used once.', pageWidth / 2, yPos + 5, { align: 'center' });

        doc.save(`2FA_Backup_Codes_${username || 'User'}.pdf`);
    };

    return (
        <>
            <Card
                style={{
                    background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
                    border: '1px solid #e8edf2',
                    borderRadius: 12
                }}
            >
                <Space direction="vertical" style={{ width: '100%' }} size="middle">
                    <div style={{ textAlign: 'center' }}>
                        <Title level={4} style={{ margin: 0 }}>
                            <WarningOutlined style={{ color: '#faad14', marginRight: 8 }} />
                            Save Your Backup Codes
                        </Title>
                        <Text type="secondary" style={{ fontSize: 13 }}>
                            These codes can be used if you lose access to your authenticator app
                        </Text>
                    </div>

                    <Alert
                        message="Important"
                        description="Save these codes now! They will not be shown again. Each code can only be used once."
                        type="warning"
                        showIcon
                        style={{ marginBottom: 8 }}
                    />

                    <div ref={printRef} style={{ padding: 16 }}>
                        {username && (
                            <Text strong style={{ display: 'block', marginBottom: 12, textAlign: 'center' }}>
                                Backup Codes for: {username}
                            </Text>
                        )}
                        <Row gutter={[12, 12]}>
                            {codes.map((code, index) => (
                                <Col span={12} key={index}>
                                    <div
                                        style={{
                                            padding: '10px 12px',
                                            background: '#fff',
                                            border: '1px solid #e8edf2',
                                            borderRadius: 8,
                                            fontFamily: 'monospace',
                                            fontSize: 14,
                                            fontWeight: 600,
                                            textAlign: 'center',
                                            letterSpacing: 1
                                        }}
                                    >
                                        {code}
                                    </div>
                                </Col>
                            ))}
                        </Row>
                    </div>

                    <Space style={{ width: '100%', justifyContent: 'center' }}>
                        <Button
                            type="primary"
                            icon={<DownloadOutlined />}
                            onClick={handleDownloadPDF}
                            style={{
                                background: 'linear-gradient(90deg, #056ccd 0%, #00c6fb 100%)',
                                border: 'none'
                            }}
                        >
                            Download PDF
                        </Button>
                        <Button
                            icon={<PrinterOutlined />}
                            onClick={handlePrint}
                        >
                            Print
                        </Button>
                    </Space>

                    <Alert
                        message="Security Tips"
                        description={
                            <ul style={{ margin: '8px 0 0 0', paddingLeft: 20 }}>
                                <li>Store codes in a secure password manager</li>
                                <li>Keep a printed copy in a safe place</li>
                                <li>Never share these codes with anyone</li>
                                <li>Each code works only once</li>
                            </ul>
                        }
                        type="info"
                        showIcon
                    />
                </Space>
            </Card>
        </>
    );
};
