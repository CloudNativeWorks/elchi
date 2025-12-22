import React from 'react';
import { Space, Button } from 'antd';
import { SaveOutlined, DeleteOutlined, SafetyCertificateOutlined, ArrowLeftOutlined } from '@ant-design/icons';
import ElchiButton from '@/elchi/components/common/ElchiButton';

interface CertificateHeaderProps {
  title: string;
  onSave?: () => void;
  onDelete?: () => void;
  onBack?: () => void;
  saveLoading?: boolean;
  deleteLoading?: boolean;
  showSave?: boolean;
  showDelete?: boolean;
  showBack?: boolean;
  extraActions?: React.ReactNode;
}

const CertificateHeader: React.FC<CertificateHeaderProps> = ({
  title,
  onSave,
  onDelete,
  onBack,
  saveLoading = false,
  deleteLoading = false,
  showSave = true,
  showDelete = false,
  showBack = false,
  extraActions,
}) => {
  return (
    <div
      style={{
        marginBottom: 24,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}
    >
      <Space size="middle">
        {showBack && onBack && (
          <Button
            icon={<ArrowLeftOutlined />}
            onClick={onBack}
            type="text"
          />
        )}
        <SafetyCertificateOutlined style={{ fontSize: 24, color: '#056ccd' }} />
        <h2 style={{ margin: 0, fontSize: 20, fontWeight: 600 }}>{title}</h2>
      </Space>

      <Space>
        {extraActions}
        {showDelete && onDelete && (
          <Button
            danger
            icon={<DeleteOutlined />}
            onClick={onDelete}
            loading={deleteLoading}
            style={{
              borderRadius: 8,
            }}
          >
            Delete
          </Button>
        )}
        {showSave && onSave && (
          <ElchiButton
            type="primary"
            icon={<SaveOutlined />}
            onClick={onSave}
            loading={saveLoading}
          >
            {saveLoading ? 'Creating...' : 'Create Certificate'}
          </ElchiButton>
        )}
      </Space>
    </div>
  );
};

export default CertificateHeader;
