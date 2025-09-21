/**
 * Snippet Apply Modal - Preview and apply snippets with array support
 */

import React, { useState } from 'react';
import { Modal, Button, Radio, Space, Divider } from 'antd';
import type { RadioChangeEvent } from 'antd';
import { ResourceSnippet, ApplySnippetOptions } from '../core/types';

interface SnippetApplyModalProps {
  open: boolean;
  onClose: () => void;
  snippet: ResourceSnippet | null;
  currentData?: any;
  isArray?: boolean;
  onApply: (snippet: ResourceSnippet, options?: ApplySnippetOptions) => void;
}

export const SnippetApplyModal: React.FC<SnippetApplyModalProps> = ({
  open,
  onClose,
  snippet,
  currentData,
  isArray,
  onApply,
}) => {
  const [applyOption, setApplyOption] = useState<'replace' | 'append' | number>('replace');

  if (!snippet) return null;

  const handleApply = () => {
    if (typeof applyOption === 'number') {
      // Apply to specific index
      onApply(snippet, { targetIndex: applyOption });
    } else if (applyOption === 'append') {
      // Append to array
      onApply(snippet, { appendToArray: true });
    } else {
      // Replace entire data
      onApply(snippet);
    }
  };

  const handleOptionChange = (e: RadioChangeEvent) => {
    setApplyOption(e.target.value);
  };

  // Generate options for array data
  const renderArrayOptions = () => {
    if (!isArray || !Array.isArray(currentData)) {
      return null;
    }

    return (
      <div style={{ marginBottom: 16 }}>
        <div style={{ marginBottom: 8, fontWeight: 500 }}>
          Where do you want to apply this snippet?
        </div>
        <Radio.Group value={applyOption} onChange={handleOptionChange}>
          <Space direction="vertical">
            {currentData.map((item, index) => (
              <Radio key={index} value={index}>
                Replace item {index + 1} {item.name ? `(${item.name})` : ''}
              </Radio>
            ))}
            <Radio value="append">
              Add as new item
            </Radio>
            <Radio value="replace">
              Replace all items
            </Radio>
          </Space>
        </Radio.Group>
      </div>
    );
  };

  return (
    <Modal
      title={`Apply Snippet: ${snippet.name}`}
      open={open}
      onCancel={onClose}
      width={600}
      footer={[
        <Button key="cancel" onClick={onClose}>
          Cancel
        </Button>,
        <Button key="apply" type="primary" onClick={handleApply}>
          Apply
        </Button>,
      ]}
    >
      {/* Array options */}
      {renderArrayOptions()}

      {/* Snippet preview */}
      <div>
        <div style={{ marginBottom: 8, fontWeight: 500, color: '#666' }}>
          Snippet Content:
        </div>
        <pre
          style={{
            background: '#f5f5f5',
            border: '1px solid #d9d9d9',
            borderRadius: 4,
            padding: 12,
            maxHeight: 400,
            overflow: 'auto',
            fontSize: 12,
            fontFamily: 'Monaco, Consolas, "Courier New", monospace',
            margin: 0,
          }}
        >
          {JSON.stringify(snippet.snippet_data, null, 2)}
        </pre>
      </div>

      {/* Current data preview for comparison */}
      {currentData && (
        <>
          <Divider />
          <div>
            <div style={{ marginBottom: 8, fontWeight: 500, color: '#666' }}>
              Current Data:
            </div>
            <pre
              style={{
                background: '#fff7e6',
                border: '1px solid #ffd591',
                borderRadius: 4,
                padding: 12,
                maxHeight: 300,
                overflow: 'auto',
                fontSize: 12,
                fontFamily: 'Monaco, Consolas, "Courier New", monospace',
                margin: 0,
              }}
            >
              {JSON.stringify(currentData, null, 2)}
            </pre>
          </div>
        </>
      )}
    </Modal>
  );
};