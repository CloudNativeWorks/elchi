import React, { useState } from 'react';
import { Modal, Button, Space, Typography, Card, Divider, Drawer, Alert } from 'antd';
import { FileOutlined, SaveOutlined, DeleteOutlined, ExclamationCircleOutlined, EyeOutlined } from '@ant-design/icons';
import MonacoEditor from '@monaco-editor/react';
import { useResourceTemplate } from '@/hooks/useResourceTemplate';
import { useSelector, useDispatch } from 'react-redux';
import { ResourceAction } from '@/redux/reducers/slice';
import { ActionType, ResourceType } from '@/redux/reducer-helpers/common';
import type { CreateTemplateRequest } from '@/types/template';

const { Text } = Typography;

interface TemplateModalProps {
  visible: boolean;
  onClose: () => void;
  gtype: string;
  version: string;
  reduxStore: any;
  voidToJSON: any;
  isCreateMode: boolean;
}

const TemplateModal: React.FC<TemplateModalProps> = ({
  visible,
  onClose,
  gtype,
  version,
  reduxStore,
  voidToJSON,
  isCreateMode
}) => {
  const dispatch = useDispatch();
  const [deleteConfirmVisible, setDeleteConfirmVisible] = useState(false);
  const [showTemplateData, setShowTemplateData] = useState(false);
  const [useTemplateConfirmVisible, setUseTemplateConfirmVisible] = useState(false);
  const [updateConfirmVisible, setUpdateConfirmVisible] = useState(false);
  const [shouldFetchTemplate, setShouldFetchTemplate] = useState(false);
  
  const { 
    useCheckTemplate, 
    useGetTemplate, 
    useSaveTemplate, 
    useDeleteTemplate 
  } = useResourceTemplate();

  // Template hooks
  const templateCheck = useCheckTemplate(gtype, version);
  const templateQuery = useGetTemplate(gtype, version, shouldFetchTemplate && templateCheck.data?.exists === true);
  const saveTemplateMutation = useSaveTemplate();
  const deleteTemplateMutation = useDeleteTemplate();

  // Check if this is a bootstrap template
  const isBootstrap = gtype === "envoy.config.bootstrap.v3.Bootstrap";

  // Redux selectors
  const configDiscovery = useSelector((state: any) =>
    state.VersionedResources[version]?.ConfigDiscovery || []
  );
  const elchiDiscovery = useSelector((state: any) =>
    state.VersionedResources[version]?.ElchiDiscovery || []
  );
  const customResource = useSelector((state: any) =>
    state.VersionedResources[version]?.CustomResource || []
  );

  const hasTemplate = templateCheck.data?.exists;
  const templateData = templateQuery.data;

  const handleSaveTemplate = async () => {
    const template: CreateTemplateRequest = {
      general: {
        config_discovery: configDiscovery,
        typed_config: customResource,
        elchi_discovery: elchiDiscovery
      },
      resource: Array.isArray(reduxStore) ?
        reduxStore.map((item: any) => voidToJSON(item)) :
        voidToJSON(reduxStore)
    };

    await saveTemplateMutation.mutateAsync({
      gtype,
      version,
      template
    });
    
    setShouldFetchTemplate(false);
    onClose();
  };

  const handleUpdateTemplate = async () => {
    await handleSaveTemplate();
    setUpdateConfirmVisible(false);
  };


  const handleUseTemplate = () => {
    if (!templateData) return;


    try {
      // Load general fields into Redux - ensure data is properly structured
      const configDiscoveryData = Array.isArray(templateData.general.config_discovery) ? 
        templateData.general.config_discovery : [];
      
      const elchiDiscoveryData = Array.isArray(templateData.general.elchi_discovery) ? 
        templateData.general.elchi_discovery : [];
        
      const customResourceData = Array.isArray(templateData.general.typed_config) ? 
        templateData.general.typed_config : [];

      dispatch(ResourceAction({
        version,
        type: ActionType.Set,
        val: configDiscoveryData,
        keys: [],
        resourceType: ResourceType.ConfigDiscovery
      }));

      dispatch(ResourceAction({
        version,
        type: ActionType.Set,
        val: elchiDiscoveryData,
        keys: [],
        resourceType: ResourceType.ElchiDiscovery
      }));

      dispatch(ResourceAction({
        version,
        type: ActionType.Set,
        val: customResourceData,
        keys: [],
        resourceType: ResourceType.CustomResource
      }));

      // Load resource data - ensure proper structure
      const resourceData = templateData.resource || {};
      dispatch(ResourceAction({
        version,
        type: ActionType.Set,
        val: resourceData,
        keys: [],
        resourceType: ResourceType.Resource
      }));

      setUseTemplateConfirmVisible(false);
      onClose();
    } catch (error) {
      console.error('Template load error:', error);
    }
  };

  const handleDeleteTemplate = async () => {
    await deleteTemplateMutation.mutateAsync({ gtype, version });
    setDeleteConfirmVisible(false);
    setShouldFetchTemplate(false); // Reset fetch flag after delete
    onClose();
  };

  const handleUseTemplateClick = () => {
    setShouldFetchTemplate(true);
    setUseTemplateConfirmVisible(true);
  };

  const handleShowTemplateClick = () => {
    setShouldFetchTemplate(true);
    setShowTemplateData(true);
  };

  const handleModalClose = () => {
    setShouldFetchTemplate(false);
    onClose();
  };

  return (
    <>
      <Modal
        title={
          <Space>
            <FileOutlined style={{ color: '#1890ff' }} />
            Template Management
          </Space>
        }
        open={visible}
        onCancel={handleModalClose}
        footer={null}
        width={500}
      >
        <div style={{ marginBottom: 16 }}>
          <Text type="secondary">
            Manage templates for <Text code>{gtype}</Text> ({version})
          </Text>
        </div>

        {isBootstrap && (
          <Alert
            message="Bootstrap Template Warning"
            description="Dynamic fields like dynamic_resources, admin, node.cluster, and node.id will be excluded from the template as they are generated dynamically."
            type="warning"
            showIcon
            style={{ marginBottom: 16 }}
          />
        )}

        {templateCheck.isLoading ? (
          <div style={{ textAlign: 'center', padding: '40px 0' }}>
            <Text>Checking template...</Text>
          </div>
        ) : !hasTemplate ? (
          // No template exists
          <Card size="small" style={{ textAlign: 'center', marginBottom: 16 }}>
            <div style={{ padding: '20px 0' }}>
              <FileOutlined style={{ fontSize: 32, color: '#d9d9d9', marginBottom: 12 }} />
              <div style={{ marginBottom: 16 }}>
                <Text>No template exists for this resource type</Text>
              </div>
              <Button
                type="primary"
                icon={<SaveOutlined />}
                onClick={handleSaveTemplate}
                loading={saveTemplateMutation.isPending}
                size="large"
              >
                Save as Template
              </Button>
            </div>
          </Card>
        ) : (
          // Template exists
          <div>
            <Card size="small" style={{ marginBottom: 16, backgroundColor: '#f6ffed' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div>
                  <Text strong>Template Available</Text>
                  <br />
                  <Text type="secondary" style={{ fontSize: 12 }}>
                    {isBootstrap 
                      ? 'You can view, update, or delete the bootstrap template. Note: Use template is disabled for bootstrap configurations.'
                      : isCreateMode 
                        ? 'You can use, update, or delete the existing template'
                        : 'You can view, update, or delete the existing template. Note: Use template is only available in create mode.'
                    }
                  </Text>
                </div>
                <FileOutlined style={{ fontSize: 24, color: '#52c41a' }} />
              </div>
            </Card>

            <Space direction="vertical" size="middle" style={{ width: '100%' }}>
              {!isBootstrap && isCreateMode && (
                <Button
                  type="primary"
                  icon={<FileOutlined />}
                  onClick={handleUseTemplateClick}
                  loading={templateQuery.isLoading}
                  block
                  size="large"
                >
                  Use Template
                </Button>
              )}

              <Button
                icon={<EyeOutlined />}
                onClick={handleShowTemplateClick}
                block
                size="large"
              >
                Show Template
              </Button>

              <Button
                icon={<SaveOutlined />}
                onClick={() => setUpdateConfirmVisible(true)}
                loading={saveTemplateMutation.isPending}
                block
                size="large"
              >
                Update Template
              </Button>

              <Divider style={{ margin: '12px 0' }} />

              <Button
                danger
                icon={<DeleteOutlined />}
                onClick={() => setDeleteConfirmVisible(true)}
                loading={deleteTemplateMutation.isPending}
                block
              >
                Delete Template
              </Button>
            </Space>
          </div>
        )}
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        title="Delete Template"
        open={deleteConfirmVisible}
        onOk={handleDeleteTemplate}
        onCancel={() => setDeleteConfirmVisible(false)}
        okText="Delete"
        cancelText="Cancel"
        okButtonProps={{ danger: true, loading: deleteTemplateMutation.isPending }}
      >
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
          <ExclamationCircleOutlined style={{ color: '#ff4d4f', fontSize: 22, marginTop: 2 }} />
          <div>
            <Text>Are you sure you want to delete this template?</Text>
            <br />
            <Text type="secondary" style={{ fontSize: 12 }}>
              Template for <Text code>{gtype}</Text> (v{version}) will be permanently removed.
            </Text>
          </div>
        </div>
      </Modal>

      {/* Use Template Confirmation Modal */}
      <Modal
        title="Use Template"
        open={useTemplateConfirmVisible}
        onOk={handleUseTemplate}
        onCancel={() => setUseTemplateConfirmVisible(false)}
        okText="Yes, Load Template"
        cancelText="Cancel"
        okButtonProps={{ loading: templateQuery.isLoading }}
      >
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
          <ExclamationCircleOutlined style={{ color: '#faad14', fontSize: 22, marginTop: 2 }} />
          <div>
            <Text>Are you sure you want to load this template?</Text>
            <br />
            <Text type="secondary" style={{ fontSize: 12 }}>
              This will replace your current configuration with the template data for <Text code>{gtype}</Text> (v{version}).
            </Text>
          </div>
        </div>
      </Modal>

      {/* Update Template Confirmation Modal */}
      <Modal
        title="Update Template"
        open={updateConfirmVisible}
        onOk={handleUpdateTemplate}
        onCancel={() => setUpdateConfirmVisible(false)}
        okText="Yes, Update Template"
        cancelText="Cancel"
        okButtonProps={{ loading: saveTemplateMutation.isPending }}
      >
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
          <ExclamationCircleOutlined style={{ color: '#faad14', fontSize: 22, marginTop: 2 }} />
          <div>
            <Text>Are you sure you want to update this template?</Text>
            <br />
            <Text type="secondary" style={{ fontSize: 12 }}>
              This will replace the existing template for <Text code>{gtype}</Text> (v{version}) with your current configuration.
            </Text>
          </div>
        </div>
      </Modal>

      {/* Template JSON Viewer Drawer */}
      <Drawer
        title={
          <Space>
            <EyeOutlined style={{ color: '#1890ff' }} />
            Template JSON Data
          </Space>
        }
        open={showTemplateData}
        onClose={() => setShowTemplateData(false)}
        width={800}
        placement="right"
      >
        {templateData && (
          <MonacoEditor
            height="100%"
            language="json"
            value={JSON.stringify(templateData, null, 2)}
            theme="vs-dark"
            options={{
              minimap: { enabled: true },
              automaticLayout: true,
              scrollBeyondLastLine: false,
              readOnly: true,
              padding: { top: 10 },
              bracketPairColorization: { enabled: true },
              renderWhitespace: "all",
              renderLineHighlight: "all",
              selectionHighlight: true,
            }}
          />
        )}
      </Drawer>
    </>
  );
};

export default TemplateModal;