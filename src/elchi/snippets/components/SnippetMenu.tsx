/**
 * Snippet Menu Component - Dropdown menu for CCard integration
 */

import React, { useState } from 'react';
import { Button, Dropdown, Modal } from 'antd';
import type { MenuProps } from 'antd';
import { 
  SaveOutlined, 
  ThunderboltOutlined,
  EyeOutlined,
  DeleteOutlined
} from '@ant-design/icons';
import { SnippetSVG } from '@/assets/svg/icons';
import { useComponentSnippets } from '../hooks/useSnippets';
import { useSnippetActions } from '../hooks/useSnippetActions';
import { ResourceSnippet } from '../core/types';
import { SnippetSaveModal } from './SnippetSaveModal';
import { SnippetApplyModal } from './SnippetApplyModal';
import { discoverPath } from '../core/pathDiscovery';

interface SnippetMenuProps {
  // CCard props
  ctype: string;           // Component type
  keys?: string;           // keyPrefix
  title?: string;          // Card title
  reduxStore: any;         // Current redux data
  toJSON: (data: any) => any; // JSON converter function
  onApply: (data: any) => void; // Apply function (Paste function from CCard)
  
  // Additional context
  version: string;         // Current Envoy version
  gtype?: string;          // Explicit GType if available
}

export const SnippetMenu: React.FC<SnippetMenuProps> = ({
  ctype,
  keys,
  title,
  reduxStore,
  toJSON,
  onApply,
  version,
  gtype = undefined,
}) => {
  const [saveModalOpen, setSaveModalOpen] = useState(false);
  const [applyModalOpen, setApplyModalOpen] = useState(false);
  const [selectedSnippet, setSelectedSnippet] = useState<ResourceSnippet | null>(null);

  // Discover path metadata for filtering
  const pathData = discoverPath({ ctype, keys, title, reduxStore, gtype });

  // Fetch snippets for this component
  const { 
    data: snippets = [], 
    isLoading: snippetsLoading 
  } = useComponentSnippets(ctype, pathData.gtype, version);

  const { saveAsSnippet, applySnippet, deleteSnippet, isSaving, isDeleting } = useSnippetActions();

  /**
   * Handle save as snippet
   */
  const handleSaveAsSnippet = async (name: string) => {
    try {
      await saveAsSnippet({
        name,
        ctype,
        keys,
        title,
        reduxStore,
        toJSON,
        version,
        gtype,
      });
      setSaveModalOpen(false);
      // Success notification is handled by API response handler
    } catch (error) {
      console.error('Failed to save snippet:', error);
      // Error notification is handled by API response handler
    }
  };

  /**
   * Handle apply snippet
   */
  const handleApplySnippet = (snippet: ResourceSnippet) => {
    if (pathData.is_array && Array.isArray(reduxStore) && reduxStore.length > 0) {
      // If target is array with existing data, show selector modal
      setSelectedSnippet(snippet);
      setApplyModalOpen(true);
    } else {
      // Direct apply (no notification needed - it's a local operation)
      applySnippet(snippet, onApply);
    }
  };

  /**
   * Handle delete snippet
   */
  const handleDeleteSnippet = (snippet: ResourceSnippet, event: React.MouseEvent) => {
    event.stopPropagation();
    
    Modal.confirm({
      title: 'Delete Snippet',
      content: `Are you sure you want to delete "${snippet.name}"?`,
      okText: 'Delete',
      okType: 'danger',
      cancelText: 'Cancel',
      onOk: async () => {
        try {
          await deleteSnippet(snippet.id);
          // Success notification is handled by API response handler
        } catch (error) {
          // Error notification is handled by API response handler
          console.error('Failed to delete snippet:', error);
        }
      },
    });
  };

  /**
   * Build menu items
   */
  const menuItems: MenuProps['items'] = [
    // Save current as snippet
    {
      key: 'save',
      label: 'Save as Snippet',
      icon: <SaveOutlined />,
      onClick: () => setSaveModalOpen(true),
      disabled: !reduxStore || isSaving,
    },
    
    // Divider if there are snippets
    ...(snippets.length > 0 ? [{ type: 'divider' as const }] : []),
    
    // Apply snippets submenu
    ...(snippets.length > 0 ? [{
      key: 'apply',
      label: 'Apply Snippet',
      icon: <ThunderboltOutlined />,
      children: snippets.map(snippet => ({
        key: `apply-${snippet.id}`,
        label: (
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span>{snippet.name}</span>
            <div style={{ display: 'flex', gap: 4 }}>
              <Button
                type="text"
                size="small"
                icon={<EyeOutlined />}
                onClick={(e: React.MouseEvent) => {
                  e.stopPropagation();
                  setSelectedSnippet(snippet);
                  setApplyModalOpen(true);
                }}
              />
              <Button
                type="text"
                size="small"
                icon={<DeleteOutlined />}
                onClick={(e: React.MouseEvent) => handleDeleteSnippet(snippet, e)}
                loading={isDeleting}
              />
            </div>
          </div>
        ),
        onClick: () => handleApplySnippet(snippet),
      })),
    }] : []),
    
    // No snippets message
    ...(snippets.length === 0 && !snippetsLoading ? [{
      key: 'no-snippets',
      label: 'No snippets available',
      disabled: true,
    }] : []),
  ];

  return (
    <>
      <Dropdown
        menu={{ items: menuItems }}
        trigger={['click']}
        placement="bottomRight"
        disabled={snippetsLoading}
      >
        <div style={{ display: 'inline-block', marginTop: 5 }}>
          <SnippetSVG onClick={() => {}} />
        </div>
      </Dropdown>

      {/* Save Modal */}
      <SnippetSaveModal
        open={saveModalOpen}
        onClose={() => setSaveModalOpen(false)}
        onSave={handleSaveAsSnippet}
        preview={reduxStore}
        loading={isSaving}
      />

      {/* Apply Modal */}
      <SnippetApplyModal
        open={applyModalOpen}
        onClose={() => {
          setApplyModalOpen(false);
          setSelectedSnippet(null);
        }}
        snippet={selectedSnippet}
        currentData={reduxStore}
        isArray={pathData.is_array}
        onApply={(snippet, options) => {
          applySnippet(snippet, onApply, options);
          setApplyModalOpen(false);
          setSelectedSnippet(null);
          // No notification needed - local operation
        }}
      />
    </>
  );
};