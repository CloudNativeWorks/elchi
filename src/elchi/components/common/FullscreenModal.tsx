import React, { ReactNode } from 'react';
import { Modal } from 'antd';
import { FullscreenExitOutlined } from '@ant-design/icons';

interface FullscreenModalProps {
    open: boolean;
    title: string;
    onClose: () => void;
    children: ReactNode;
}

const FullscreenModal: React.FC<FullscreenModalProps> = ({ open, title, onClose, children }) => {
    return (
        <Modal
            title={
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span>{title}</span>
                    <div
                        style={{
                            cursor: 'pointer',
                            transition: 'all 0.3s ease',
                            padding: '4px'
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.transform = 'scale(1.2)';
                            e.currentTarget.style.color = 'var(--color-primary)';
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.transform = 'scale(1)';
                            e.currentTarget.style.color = 'inherit';
                        }}
                    >
                        <FullscreenExitOutlined
                            onClick={onClose}
                            style={{ fontSize: 16 }}
                        />
                    </div>
                </div>
            }
            open={open}
            onCancel={onClose}
            footer={null}
            width="95vw"
            style={{ top: 0, maxWidth: '95vw', paddingBottom: 0 }}
            styles={{
                body: {
                    height: 'calc(100vh - 80px)',
                    overflowY: 'auto',
                    overflowX: 'hidden'
                }
            }}
            closable={false}
        >
            {children}
        </Modal>
    );
};

export default FullscreenModal;
