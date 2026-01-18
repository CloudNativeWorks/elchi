/**
 * Snippet Drawer Component - Main interface for snippet management
 */

import React, { useState } from 'react';
import {
  Drawer,
  Button,
  Input,
  Space,
  Typography,
  Empty,
  Card,
  Form,
  App as AntdApp
} from 'antd';
import {
  SaveOutlined,
  ThunderboltOutlined,
  DeleteOutlined,
  CloseOutlined,
  EditOutlined
} from '@ant-design/icons';
import { useComponentSnippets } from '../hooks/useSnippets';
import { useSnippetActions } from '../hooks/useSnippetActions';
import { ResourceSnippet } from '../core/types';
import { discoverPath } from '../core/pathDiscovery';

const { Text, Title } = Typography;
const { Search } = Input;

// Modern style constants
const MODERN_STYLES = {
  card: {
    background: 'var(--bg-surface)',
    border: '1px solid var(--border-default)',
    borderRadius: 12,
    boxShadow: 'var(--shadow-sm)',
  },
  primaryCard: {
    background: 'var(--gradient-primary)',
    border: 'none',
    borderRadius: 12,
    color: 'white',
  },
  successCard: {
    background: 'var(--gradient-success)',
    border: 'none',
    borderRadius: 12,
    color: 'white',
  },
  warningCard: {
    background: 'var(--gradient-warning)',
    border: 'none',
    borderRadius: 12,
    color: 'white',
  },
  codeBlock: {
    background: 'var(--code-bg)',
    border: '1px solid var(--border-default)',
    borderRadius: 8,
    fontFamily: 'JetBrains Mono, Monaco, Consolas, "Courier New", monospace',
    color: 'var(--text-primary)',
  },
  actionButton: {
    border: 'none',
    borderRadius: 8,
    background: 'var(--bg-active)',
    backdropFilter: 'blur(10px)',
    transition: 'all 0.2s ease',
    boxShadow: 'var(--shadow-sm)',
  },
  glassmorphism: {
    background: 'var(--bg-elevated)',
    backdropFilter: 'blur(10px)',
    border: '1px solid var(--border-default)',
    borderRadius: 16,
  }
};

interface SnippetDrawerProps {
  open: boolean;
  onClose: () => void;

  // Component context
  ctype: string;
  keys?: string;
  title?: string;
  reduxStore: any;
  toJSON: (data: any) => any;
  onApply: (keys: string, data: any) => void;
  version: string;
  gtype?: string;
}

export const SnippetDrawer: React.FC<SnippetDrawerProps> = ({
  open,
  onClose,
  ctype,
  keys,
  title,
  reduxStore,
  toJSON,
  onApply,
  version,
  gtype,
}) => {
  const { modal } = AntdApp.useApp();
  const [mode, setMode] = useState<'list' | 'save' | 'apply' | 'update'>('list');
  const [selectedSnippet, setSelectedSnippet] = useState<ResourceSnippet | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [saveForm] = Form.useForm();

  // Discover path metadata
  const pathData = discoverPath({ ctype, keys, title, reduxStore, gtype });

  // Fetch snippets for this component
  const {
    data: snippets,
    isLoading: snippetsLoading,
    error: snippetsError
  } = useComponentSnippets(ctype, pathData.gtype, version, { enabled: open });

  // Ensure snippets is always an array with fallback
  const safeSnippets = Array.isArray(snippets) ? snippets : [];

  const { saveAsSnippet, updateSnippet, deleteSnippet, isSaving, isUpdating, isDeleting } = useSnippetActions();

  // Filter snippets by search term
  const filteredSnippets = safeSnippets.filter(snippet =>
    snippet?.name?.toLowerCase()?.includes(searchTerm.toLowerCase()) || false
  );

  /**
   * Handle save as snippet
   */
  const handleSaveAsSnippet = async (values: { name: string }) => {
    try {
      await saveAsSnippet({
        name: values.name,
        ctype,
        keys,
        title,
        reduxStore,
        toJSON,
        version,
        gtype,
      });
      setMode('list');
      saveForm.resetFields();
    } catch (error) {
      console.error('Failed to save snippet:', error);
    }
  };

  /**
   * Handle update snippet 
   */
  const handleUpdateSnippet = async (values: { name: string }) => {
    if (!selectedSnippet) return;

    try {
      // Convert current redux data to JSON for update
      let snippetData: any;
      if (Array.isArray(reduxStore)) {
        snippetData = reduxStore.map(item => typeof toJSON === 'function' ? toJSON(item) : item);
      } else if (reduxStore !== undefined) {
        snippetData = typeof toJSON === 'function' ? toJSON(reduxStore) : reduxStore;
      } else {
        throw new Error('No data to update snippet');
      }

      await updateSnippet(selectedSnippet.id, {
        name: values.name,
        snippet_data: snippetData,
      }, version);
      setMode('list');
      setSelectedSnippet(null);
      saveForm.resetFields();
    } catch (error) {
      console.error('Failed to update snippet:', error);
    }
  };

  /**
   * Handle edit snippet (switch to update mode)
   */
  const handleEditSnippet = (snippet: ResourceSnippet) => {
    setSelectedSnippet(snippet);
    setMode('update');
    // Pre-fill form with current snippet name
    saveForm.setFieldsValue({ name: snippet.name });
  };

  /**
   * Handle apply snippet - use current component's keys for cross-location compatibility
   */
  const handleApplySnippet = (snippet: ResourceSnippet) => {
    // Use current component's keys instead of snippet's field_path
    // This allows applying snippets across different locations with the same component type
    const currentKeys = keys || snippet.field_path || snippet.component_type;
    onApply(currentKeys, snippet.snippet_data);
    onClose(); // Close drawer after applying
  };

  /**
   * Handle final apply - use current context keys
   */
  const handleFinalApply = () => {
    if (!selectedSnippet) return;

    // Use current component's keys for apply
    const currentKeys = keys || selectedSnippet.field_path || selectedSnippet.component_type;
    onApply(currentKeys, selectedSnippet.snippet_data);
    setMode('list');
    setSelectedSnippet(null);
    onClose();
  };

  /**
   * Handle delete snippet
   */
  const handleDeleteSnippet = (snippet: ResourceSnippet) => {
    modal.confirm({
      title: 'Delete Snippet',
      content: `Are you sure you want to delete "${snippet.name}"?`,
      okText: 'Delete',
      okType: 'danger',
      cancelText: 'Cancel',
      onOk: async () => {
        try {
          await deleteSnippet(snippet.id, version);
        } catch (error) {
          console.error('Failed to delete snippet:', error);
        }
      },
    });
  };

  /**
   * Handle preview snippet
   */
  const handlePreviewSnippet = (snippet: ResourceSnippet) => {
    setSelectedSnippet(snippet);
    setMode('apply');
  };

  /**
   * Reset drawer state when closing
   */
  const handleClose = () => {
    setMode('list');
    setSelectedSnippet(null);
    setSearchTerm('');
    saveForm.resetFields();
    onClose();
  };

  /**
   * Render drawer title based on mode
   */
  const renderTitle = () => {
    const backButton = (
      <Button
        type="text"
        icon={<CloseOutlined />}
        onClick={() => setMode('list')}
        style={{
          ...MODERN_STYLES.actionButton,
          width: 32,
          height: 32,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      />
    );

    switch (mode) {
      case 'save':
        return (
          <Space align="center" size={12}>
            {backButton}
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <SaveOutlined style={{ color: 'var(--color-success)', fontSize: 16 }} />
              <Title level={5} style={{ margin: 0, color: 'var(--color-success)' }}>Save Snippet</Title>
            </div>
            <div style={{
              ...MODERN_STYLES.glassmorphism,
              padding: '4px 12px',
              fontSize: 12,
              fontWeight: 500,
            }}>
              {title || ctype}
            </div>
          </Space>
        );
      case 'apply':
        return (
          <Space align="center" size={12}>
            {backButton}
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <ThunderboltOutlined style={{ color: '#fa8c16', fontSize: 16 }} />
              <Title level={5} style={{ margin: 0, color: '#fa8c16' }}>Apply Snippet</Title>
            </div>
            <div style={{
              ...MODERN_STYLES.glassmorphism,
              padding: '4px 12px',
              fontSize: 12,
              fontWeight: 500,
            }}>
              {selectedSnippet?.name}
            </div>
          </Space>
        );
      case 'update':
        return (
          <Space align="center" size={12}>
            {backButton}
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <EditOutlined style={{ color: 'var(--color-purple)', fontSize: 16 }} />
              <Title level={5} style={{ margin: 0, color: 'var(--color-purple)' }}>Update Snippet</Title>
            </div>
            <div style={{
              ...MODERN_STYLES.glassmorphism,
              padding: '4px 12px',
              fontSize: 12,
              fontWeight: 500,
            }}>
              {selectedSnippet?.name}
            </div>
          </Space>
        );
      default:
        return (
          <Space align="center" size={12}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <SaveOutlined style={{ color: 'var(--color-primary)', fontSize: 18 }} />
              <Title level={4} style={{ margin: 0, color: 'var(--color-primary)' }}>Snippets</Title>
            </div>
            <div style={{
              ...MODERN_STYLES.glassmorphism,
              padding: '6px 14px',
              fontSize: 13,
              fontWeight: 500,
            }}>
              {title || ctype}
            </div>
          </Space>
        );
    }
  };

  /**
   * Render drawer extra actions based on mode
   */
  const renderExtra = () => {
    const baseButtonStyle = {
      ...MODERN_STYLES.actionButton,
      height: 36,
      fontWeight: 500,
      fontSize: 14,
      display: 'flex',
      alignItems: 'center',
      gap: 6,
    };

    switch (mode) {
      case 'save':
        return (
          <Button
            icon={<SaveOutlined />}
            onClick={() => saveForm.submit()}
            loading={isSaving}
            style={{
              ...baseButtonStyle,
              background: 'linear-gradient(135deg, #52c41a, #389e0d)',
              color: 'white',
              border: 'none',
            }}
          >
            Save
          </Button>
        );
      case 'apply':
        return (
          <Button
            icon={<ThunderboltOutlined />}
            onClick={handleFinalApply}
            disabled={!selectedSnippet}
            style={{
              ...baseButtonStyle,
              background: selectedSnippet
                ? 'linear-gradient(135deg, #fa8c16, #d4380d)'
                : 'rgba(0, 0, 0, 0.1)',
              color: 'white',
              border: 'none',
            }}
          >
            Apply
          </Button>
        );
      case 'update':
        return (
          <Button
            icon={<EditOutlined />}
            onClick={() => saveForm.submit()}
            loading={isUpdating}
            style={{
              ...baseButtonStyle,
              background: 'linear-gradient(135deg, #722ed1, #531dab)',
              color: 'white',
              border: 'none',
            }}
          >
            Update
          </Button>
        );
      default:
        return (
          <Button
            icon={<SaveOutlined />}
            onClick={() => setMode('save')}
            disabled={!reduxStore}
            style={{
              ...baseButtonStyle,
              background: reduxStore
                ? 'linear-gradient(135deg, #1890ff, #096dd9)'
                : 'rgba(0, 0, 0, 0.1)',
              color: 'white',
              border: 'none',
            }}
          >
            Save Current
          </Button>
        );
    }
  };

  /**
   * Render update form with comparison
   */
  const renderUpdateForm = () => (
    <div>
      <Form
        form={saveForm}
        layout="vertical"
        onFinish={handleUpdateSnippet}
        style={{ marginBottom: 16 }}
      >
        <Form.Item
          name="name"
          label="Update Snippet Name"
          rules={[{ required: true, message: 'Please enter a name for the snippet' }]}
        >
          <Input placeholder="Update snippet name..." autoFocus />
        </Form.Item>
      </Form>

      {/* Modern Component Info */}
      <Card
        size="small"
        style={{
          ...MODERN_STYLES.card,
          marginBottom: 16,
          overflow: 'hidden',
        }}
      >
        <div style={{
          background: 'var(--color-purple-light)',
          margin: '-12px -16px 12px -16px',
          padding: '12px 16px',
          borderBottom: '1px solid var(--border-default)',
        }}>
          <Text strong style={{ color: 'var(--color-purple)', fontSize: 14 }}>
            📦 Component Information
          </Text>
        </div>
        <Space direction="vertical" size={6} style={{ width: '100%' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Text style={{ fontSize: 13, fontWeight: 500 }}>Component:</Text>
            <Text style={{ fontSize: 13, color: 'var(--color-purple)', textAlign: 'right' }}>{title || ctype}</Text>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Text style={{ fontSize: 13, fontWeight: 500 }}>Field:</Text>
            <Text style={{ fontSize: 13, color: 'var(--color-success)', textAlign: 'right' }}>{pathData.field_path}</Text>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Text style={{ fontSize: 13, fontWeight: 500 }}>Type:</Text>
            <Text style={{ fontSize: 13, color: 'var(--color-warning)', textAlign: 'right' }}>
              {pathData.is_array ? '📝 Array' : '📄 Object'}
            </Text>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Text style={{ fontSize: 13, fontWeight: 500 }}>Version:</Text>
            <Text style={{ fontSize: 13, color: 'var(--color-purple)', textAlign: 'right' }}>{version}</Text>
          </div>
        </Space>
      </Card>

      {/* Current Snippet Data */}
      {selectedSnippet && (
        <Card size="small" style={{ marginBottom: 16 }}>
          <div style={{ marginBottom: 8, fontWeight: 500 }}>
            Current Snippet: "{selectedSnippet.name}"
          </div>
          <pre
            style={{
              ...MODERN_STYLES.codeBlock,
              background: 'var(--color-warning-light)',
              borderColor: 'var(--color-warning-border)',
              padding: 12,
              maxHeight: 200,
              overflow: 'auto',
              fontSize: 12,
              margin: 0,
            }}
          >
            {JSON.stringify(selectedSnippet.snippet_data, null, 2)}
          </pre>
        </Card>
      )}

      {/* New Data Preview */}
      <Card size="small" style={{ marginBottom: 16 }}>
        <div style={{ marginBottom: 8, fontWeight: 500 }}>
          New Data (Will Replace Current Snippet)
        </div>
        <pre
          style={{
            ...MODERN_STYLES.codeBlock,
            background: 'var(--color-success-light)',
            borderColor: 'var(--color-success-border)',
            padding: 12,
            maxHeight: 300,
            overflow: 'auto',
            fontSize: 12,
            margin: 0,
          }}
        >
          {JSON.stringify(
            Array.isArray(reduxStore)
              ? reduxStore.map(item => typeof toJSON === 'function' ? toJSON(item) : item)
              : typeof toJSON === 'function' ? toJSON(reduxStore) : reduxStore,
            null, 2
          )}
        </pre>
      </Card>
    </div>
  );

  /**
   * Render save form with modern styling
   */
  const renderSaveForm = () => (
    <div>
      <Form
        form={saveForm}
        layout="vertical"
        onFinish={handleSaveAsSnippet}
        style={{ marginBottom: 16 }}
      >
        <Form.Item
          name="name"
          label="Snippet Name"
          rules={[{ required: true, message: 'Please enter a name for the snippet' }]}
        >
          <Input placeholder="Enter snippet name..." autoFocus />
        </Form.Item>
      </Form>

      {/* Modern Component Info */}
      <Card
        size="small"
        style={{
          ...MODERN_STYLES.card,
          marginBottom: 16,
          overflow: 'hidden',
        }}
      >
        <div style={{
          background: 'var(--color-success-light)',
          margin: '-12px -16px 12px -16px',
          padding: '12px 16px',
          borderBottom: '1px solid var(--border-default)',
        }}>
          <Text strong style={{ color: 'var(--color-success)', fontSize: 14 }}>
            📦 Component Information
          </Text>
        </div>
        <Space direction="vertical" size={6} style={{ width: '100%' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Text style={{ fontSize: 13, fontWeight: 500 }}>Component:</Text>
            <Text style={{ fontSize: 13, color: 'var(--color-success)', textAlign: 'right' }}>{title || ctype}</Text>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Text style={{ fontSize: 13, fontWeight: 500 }}>Field:</Text>
            <Text style={{ fontSize: 13, color: 'var(--color-primary)', textAlign: 'right' }}>{pathData.field_path}</Text>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Text style={{ fontSize: 13, fontWeight: 500 }}>Type:</Text>
            <Text style={{ fontSize: 13, color: 'var(--color-warning)', textAlign: 'right' }}>
              {pathData.is_array ? '📝 Array' : '📄 Object'}
            </Text>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Text style={{ fontSize: 13, fontWeight: 500 }}>Version:</Text>
            <Text style={{ fontSize: 13, color: 'var(--color-purple)', textAlign: 'right' }}>{version}</Text>
          </div>
        </Space>
      </Card>

      {/* Modern Preview Data */}
      <Card
        size="small"
        style={{
          ...MODERN_STYLES.card,
          marginBottom: 16,
          overflow: 'hidden',
        }}
      >
        <div style={{
          background: 'var(--color-primary-light)',
          margin: '-12px -16px 12px -16px',
          padding: '12px 16px',
          borderBottom: '1px solid var(--border-default)',
        }}>
          <Text strong style={{ color: 'var(--color-primary)', fontSize: 14 }}>
            👁️ Preview Current Data
          </Text>
        </div>
        <pre
          style={{
            ...MODERN_STYLES.codeBlock,
            padding: 12,
            maxHeight: 300,
            overflow: 'auto',
            fontSize: 12,
            margin: 0,
          }}
        >
          {JSON.stringify(
            Array.isArray(reduxStore)
              ? reduxStore.map(item => typeof toJSON === 'function' ? toJSON(item) : item)
              : typeof toJSON === 'function' ? toJSON(reduxStore) : reduxStore,
            null, 2
          )}
        </pre>
      </Card>
    </div>
  );

  /**
   * Render apply interface - simplified preview only
   */
  const renderApplyInterface = () => {
    if (!selectedSnippet) return null;

    return (
      <div>
        {/* Snippet preview */}
        <Card size="small" style={{ marginBottom: 16 }}>
          <div style={{ marginBottom: 8, fontWeight: 500 }}>
            Snippet: {selectedSnippet.name}
          </div>
          <pre
            style={{
              ...MODERN_STYLES.codeBlock,
              padding: 12,
              maxHeight: 300,
              overflow: 'auto',
              fontSize: 12,
              margin: 0,
            }}
          >
            {JSON.stringify(selectedSnippet.snippet_data, null, 2)}
          </pre>
        </Card>

        {/* Current data preview for comparison */}
        {reduxStore && (
          <Card size="small" style={{ marginBottom: 16 }}>
            <div style={{ marginBottom: 8, fontWeight: 500 }}>
              Compare with Current Data
            </div>
            <pre
              style={{
                ...MODERN_STYLES.codeBlock,
                background: 'var(--color-warning-light)',
                borderColor: 'var(--color-warning-border)',
                padding: 12,
                maxHeight: 300,
                overflow: 'auto',
                fontSize: 12,
                margin: 0,
              }}
            >
              {JSON.stringify(
                Array.isArray(reduxStore)
                  ? reduxStore.map(item => typeof toJSON === 'function' ? toJSON(item) : item)
                  : typeof toJSON === 'function' ? toJSON(reduxStore) : reduxStore,
                null, 2
              )}
            </pre>
          </Card>
        )}
      </div>
    );
  };

  /**
   * Render snippet list
   */
  const renderSnippetList = () => (
    <div>
      {/* Modern Search Bar */}
      <div style={{ marginBottom: 20 }}>
        <Search
          placeholder="🔍 Search snippets..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          allowClear
          style={{
            borderRadius: 12,
            overflow: 'hidden',
          }}
          styles={{
            input: {
              fontSize: 14,
              padding: '8px 12px',
            }
          }}
        />
      </div>

      {/* Modern Component Info */}
      <Card
        size="small"
        style={{
          ...MODERN_STYLES.card,
          marginBottom: 20,
          overflow: 'hidden',
        }}
      >
        <div style={{
          background: 'var(--color-primary-light)',
          margin: '-12px -16px 12px -16px',
          padding: '12px 16px',
          borderBottom: '1px solid var(--border-default)',
        }}>
          <Text strong style={{ color: 'var(--color-primary)', fontSize: 14 }}>
            📦 Component Information
          </Text>
        </div>
        <Space direction="vertical" size={6} style={{ width: '100%' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Text style={{ fontSize: 13, fontWeight: 500 }}>Component:</Text>
            <Text style={{ fontSize: 13, color: 'var(--color-primary)', textAlign: 'right' }}>{title || ctype}</Text>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Text style={{ fontSize: 13, fontWeight: 500 }}>Field:</Text>
            <Text style={{ fontSize: 13, color: 'var(--color-success)', textAlign: 'right' }}>{pathData.field_path}</Text>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Text style={{ fontSize: 13, fontWeight: 500 }}>Type:</Text>
            <Text style={{ fontSize: 13, color: 'var(--color-warning)', textAlign: 'right' }}>
              {pathData.is_array ? '📝 Array' : '📄 Object'}
            </Text>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Text style={{ fontSize: 13, fontWeight: 500 }}>Version:</Text>
            <Text style={{ fontSize: 13, color: 'var(--color-purple)', textAlign: 'right' }}>{version}</Text>
          </div>
        </Space>
      </Card>

      {/* Modern Section Title */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: 8,
        marginBottom: 16,
        padding: '8px 0',
      }}>
        <div style={{
          width: 4,
          height: 20,
          background: 'var(--gradient-primary)',
          borderRadius: 2,
        }} />
        <Title level={5} style={{ margin: 0, color: 'var(--color-primary)' }}>
          Available Snippets ({filteredSnippets.length})
        </Title>
      </div>

      {/* Snippets List */}
      {snippetsLoading ? (
        <div style={{ textAlign: 'center', padding: 32 }}>
          Loading snippets...
        </div>
      ) : snippetsError ? (
        <div style={{ textAlign: 'center', padding: 32 }}>
          <Text type="danger">Error loading snippets</Text>
        </div>
      ) : filteredSnippets.length === 0 ? (
        <Empty
          description={
            searchTerm ? "No snippets match your search" : "No snippets found for this component"
          }
          image={Empty.PRESENTED_IMAGE_SIMPLE}
        />
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {filteredSnippets.map((snippet) => (
            <Card
              key={snippet.id}
              size="small"
              style={{
                ...MODERN_STYLES.card,
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                position: 'relative',
                overflow: 'hidden',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = 'var(--shadow-md)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'var(--shadow-sm)';
              }}
              onClick={() => handlePreviewSnippet(snippet)}
            >
              {/* Snippet Header */}
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: 8,
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <div style={{
                    width: 8,
                    height: 8,
                    borderRadius: '50%',
                    background: 'var(--gradient-success)',
                  }} />
                  <Text strong style={{ fontSize: 14, color: 'var(--color-primary)' }}>
                    {snippet.name}
                  </Text>
                </div>
                <Text style={{ fontSize: 11, color: 'var(--text-tertiary)' }}>
                  {new Date(snippet.created_at || '').toLocaleDateString()}
                </Text>
              </div>

              {/* Action Buttons */}
              <div style={{
                display: 'flex',
                justifyContent: 'flex-end',
                gap: 6,
                marginTop: 8,
              }}>
                <Button
                  size="small"
                  icon={<EditOutlined />}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleEditSnippet(snippet);
                  }}
                  style={{
                    ...MODERN_STYLES.actionButton,
                    width: 28,
                    height: 28,
                    minWidth: 28,
                    background: 'var(--color-purple-light)',
                    color: 'var(--color-purple)',
                  }}
                  title="Update"
                />
                <Button
                  size="small"
                  icon={<DeleteOutlined />}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteSnippet(snippet);
                  }}
                  loading={isDeleting}
                  style={{
                    ...MODERN_STYLES.actionButton,
                    width: 28,
                    height: 28,
                    minWidth: 28,
                    background: 'var(--color-danger-light)',
                    color: 'var(--color-danger)',
                  }}
                  title="Delete"
                />
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );

  return (
    <Drawer
      title={renderTitle()}
      placement="right"
      open={open}
      onClose={handleClose}
      width={624}
      extra={renderExtra()}
      styles={{
        body: {
          background: 'var(--modal-bg)',
          padding: '24px',
        },
        header: {
          background: 'var(--bg-glass)',
          backdropFilter: 'blur(10px)',
          borderBottom: '1px solid var(--border-default)',
        }
      }}
    >
      <div style={{
        minHeight: 'calc(100vh - 120px)',
        background: 'transparent',
      }}>
        {mode === 'save' && renderSaveForm()}
        {mode === 'update' && renderUpdateForm()}
        {mode === 'apply' && renderApplyInterface()}
        {mode === 'list' && renderSnippetList()}
      </div>
    </Drawer>
  );
};