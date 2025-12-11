/**
 * Snippet Save Modal - Minimal modal for saving snippets
 */

import React, { useState, useEffect } from 'react';
import { Modal, Input, Button } from 'antd';

interface SnippetSaveModalProps {
  open: boolean;
  onClose: () => void;
  onSave: (name: string) => void;
  preview?: any;
  loading?: boolean;
}

export const SnippetSaveModal: React.FC<SnippetSaveModalProps> = ({
  open,
  onClose,
  onSave,
  preview,
  loading = false,
}) => {
  const [name, setName] = useState('');

  // Reset name when modal opens
  useEffect(() => {
    if (open) {
      setName('');
    }
  }, [open]);

  const handleSave = () => {
    if (name.trim()) {
      onSave(name.trim());
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && name.trim()) {
      handleSave();
    }
  };

  return (
    <Modal
      title="Save as Snippet"
      open={open}
      onCancel={onClose}
      width={500}
      footer={[
        <Button key="cancel" onClick={onClose}>
          Cancel
        </Button>,
        <Button
          key="save"
          type="primary"
          onClick={handleSave}
          loading={loading}
          disabled={!name.trim()}
        >
          Save
        </Button>,
      ]}
    >
      <div style={{ marginBottom: 16 }}>
        <Input
          placeholder="Enter snippet name..."
          value={name}
          onChange={(e) => setName(e.target.value)}
          onKeyPress={handleKeyPress}
          autoFocus
          maxLength={100}
        />
      </div>

      {preview && (
        <div>
          <div style={{ marginBottom: 8, fontWeight: 500, color: '#666' }}>
            Preview:
          </div>
          <pre
            style={{
              background: '#f5f5f5',
              border: '1px solid #d9d9d9',
              borderRadius: 4,
              padding: 12,
              maxHeight: 300,
              overflow: 'auto',
              fontSize: 12,
              fontFamily: 'Monaco, Consolas, "Courier New", monospace',
              margin: 0,
            }}
          >
            {JSON.stringify(preview, null, 2)}
          </pre>
        </div>
      )}
    </Modal>
  );
};