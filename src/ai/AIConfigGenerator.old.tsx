import React, { useState, useEffect } from 'react';
import { 
  Card, 
  Steps, 
  Button, 
  message, 
  Spin, 
  Result,
  Space,
  Modal,
  Typography,
  Divider
} from 'antd';
import { 
  RobotOutlined, 
  CheckCircleOutlined, 
  ExclamationCircleOutlined,
  EyeOutlined,
  CloudUploadOutlined
} from '@ant-design/icons';
import { useAppDispatch, useAppSelector } from '../../hooks/redux';
import { 
  generateConfig, 
  applyConfigs, 
  updateFormData, 
  clearError,
  clearGeneratedConfig
} from '../../redux/slices/aiConfigSlice';

// Import form components
import BasicInfoForm from './forms/BasicInfoForm';
import FeaturesForm from './forms/FeaturesForm';
import UpstreamForm from './forms/UpstreamForm';
import SecurityForm from './forms/SecurityForm';
import PerformanceForm from './forms/PerformanceForm';
import AdvancedForm from './forms/AdvancedForm';
import PreviewApplyForm from './forms/PreviewApplyForm';

import type { ConfigRequest, ApplyConfig } from '../../types/aiConfig';

const { Text, Paragraph } = Typography;

interface AIConfigGeneratorProps {
  onConfigGenerated?: (config: any) => void;
  onConfigApplied?: (result: any) => void;
}

const AIConfigGenerator: React.FC<AIConfigGeneratorProps> = ({
  onConfigGenerated,
  onConfigApplied
}) => {
  const dispatch = useAppDispatch();
  const { 
    generatedConfig, 
    appliedConfigs, 
    loading, 
    error, 
    currentFormData 
  } = useAppSelector(state => state.aiConfig);

  const [currentStep, setCurrentStep] = useState(0);
  const [validationErrors, setValidationErrors] = useState<Record<string, string[]>>({});
  const [previewVisible, setPreviewVisible] = useState(false);

  const steps = [
    {
      title: 'Temel Bilgiler',
      description: 'Servis bilgilerini girin',
      icon: <RobotOutlined />,
      content: <BasicInfoForm />
    },
    {
      title: 'Özellikler',
      description: 'İhtiyaç duyduğunuz özellikleri seçin',
      content: <FeaturesForm />
    },
    {
      title: 'Upstream',
      description: 'Backend servis ayarları',
      content: <UpstreamForm />
    },
    {
      title: 'Güvenlik',
      description: 'Authentication ve TLS ayarları',
      content: <SecurityForm enableAuth={currentFormData.enable_auth || false} />
    },
    {
      title: 'Performans',
      description: 'Rate limiting ve timeout ayarları',
      content: <PerformanceForm enableRateLimit={currentFormData.enable_rate_limit || false} />
    },
    {
      title: 'Gelişmiş',
      description: 'Custom filter\'lar ve AI talimatları',
      content: <AdvancedForm />
    },
    {
      title: 'Önizleme & Uygula',
      description: 'Konfigürasyonu incele ve uygula',
      content: <PreviewApplyForm 
        config={generatedConfig} 
        onGenerate={handleGenerate}
        onApply={handleApply}
      />
    }
  ];

  useEffect(() => {
    if (error) {
      message.error(error);
      dispatch(clearError());
    }
  }, [error, dispatch]);

  useEffect(() => {
    if (generatedConfig) {
      onConfigGenerated?.(generatedConfig);
      message.success('AI konfigürasyonu başarıyla oluşturuldu!');
    }
  }, [generatedConfig, onConfigGenerated]);

  useEffect(() => {
    if (appliedConfigs) {
      onConfigApplied?.(appliedConfigs);
      message.success('Konfigürasyonlar başarıyla uygulandı!');
    }
  }, [appliedConfigs, onConfigApplied]);

  const validateCurrentStep = (): boolean => {
    const errors: string[] = [];

    switch (currentStep) {
      case 0: // Basic Info
        if (!currentFormData.service_name) errors.push('Servis adı gerekli');
        if (!currentFormData.project) errors.push('Proje seçimi gerekli');
        if (!currentFormData.environment) errors.push('Ortam seçimi gerekli');
        break;
      case 2: // Upstream
        if (!currentFormData.upstream?.hosts?.length) errors.push('En az bir host gerekli');
        if (!currentFormData.upstream?.port) errors.push('Port gerekli');
        if (!currentFormData.upstream?.protocol) errors.push('Protokol seçimi gerekli');
        break;
    }

    if (errors.length > 0) {
      setValidationErrors({ [currentStep]: errors });
      message.error('Lütfen gerekli alanları doldurun');
      return false;
    }

    setValidationErrors({});
    return true;
  };

  const handleNext = () => {
    if (validateCurrentStep()) {
      setCurrentStep(prev => Math.min(prev + 1, steps.length - 1));
    }
  };

  const handlePrev = () => {
    setCurrentStep(prev => Math.max(prev - 1, 0));
  };

  const handleGenerate = async () => {
    if (!validateCurrentStep()) return;

    try {
      const result = await dispatch(generateConfig(currentFormData as ConfigRequest)).unwrap();
      
      // Step'i otomatik olarak önizleme adımına geçir
      if (currentStep < steps.length - 1) {
        setCurrentStep(steps.length - 1);
      }
    } catch (err: any) {
      message.error(`Konfigürasyon oluşturulamadı: ${err.message}`);
    }
  };

  const handleApply = async (applyConfig: ApplyConfig) => {
    if (!generatedConfig) {
      message.error('Önce konfigürasyonu oluşturun');
      return;
    }

    try {
      await dispatch(applyConfigs({ configs: generatedConfig, apply: applyConfig })).unwrap();
    } catch (err: any) {
      message.error(`Konfigürasyonlar uygulanamadı: ${err.message}`);
    }
  };

  const handleReset = () => {
    Modal.confirm({
      title: 'Tüm verileri sıfırla?',
      content: 'Bu işlem tüm form verilerini ve oluşturulan konfigürasyonları silecek.',
      okText: 'Sıfırla',
      okType: 'danger',
      cancelText: 'İptal',
      onOk: () => {
        dispatch(updateFormData({}));
        dispatch(clearGeneratedConfig());
        setCurrentStep(0);
        setValidationErrors({});
      }
    });
  };

  const showPreview = () => {
    setPreviewVisible(true);
  };

  return (
    <div style={{ maxWidth: 1200, margin: '0 auto', padding: '24px' }}>
      <Card 
        title={
          <Space>
            <RobotOutlined style={{ color: '#1890ff' }} />
            <span>AI ile Envoy Konfigürasyonu Oluştur</span>
          </Space>
        }
        extra={
          <Space>
            <Button onClick={showPreview} icon={<EyeOutlined />}>
              Özet Görüntüle
            </Button>
            <Button onClick={handleReset} danger>
              Sıfırla
            </Button>
          </Space>
        }
      >
        <Steps 
          current={currentStep} 
          direction="horizontal"
          size="small"
          style={{ marginBottom: 32 }}
        >
          {steps.map((item, index) => (
            <Steps.Step 
              key={index}
              title={item.title} 
              description={item.description}
              icon={item.icon}
              status={validationErrors[index] ? 'error' : undefined}
            />
          ))}
        </Steps>

        <div style={{ minHeight: 400, marginBottom: 24 }}>
          <Spin spinning={loading} tip="AI konfigürasyonu oluşturuluyor...">
            {error && (
              <Result
                status="error"
                title="Hata Oluştu"
                subTitle={error}
                style={{ marginBottom: 24 }}
              />
            )}
            
            {validationErrors[currentStep] && (
              <div style={{ marginBottom: 16 }}>
                {validationErrors[currentStep].map((err, idx) => (
                  <Text key={idx} type="danger" style={{ display: 'block' }}>
                    <ExclamationCircleOutlined /> {err}
                  </Text>
                ))}
              </div>
            )}

            {steps[currentStep].content}
          </Spin>
        </div>

        <div style={{ textAlign: 'center' }}>
          <Space size="middle">
            <Button 
              onClick={handlePrev} 
              disabled={currentStep === 0}
            >
              Geri
            </Button>
            
            {currentStep < steps.length - 2 && (
              <Button type="primary" onClick={handleNext}>
                İleri
              </Button>
            )}
            
            {currentStep === steps.length - 2 && (
              <Button type="primary" onClick={handleGenerate} loading={loading}>
                <RobotOutlined /> AI ile Oluştur
              </Button>
            )}
            
            {currentStep === steps.length - 1 && generatedConfig && (
              <Button 
                type="primary" 
                icon={<CloudUploadOutlined />}
                onClick={() => {
                  // PreviewApplyForm'dan apply tetiklenir
                }}
                disabled={!generatedConfig}
              >
                Yapılandırmaları Uygula
              </Button>
            )}
          </Space>
        </div>

        {/* Success Result */}
        {appliedConfigs && (
          <Result
            status="success"
            title="Konfigürasyonlar Başarıyla Uygulandı!"
            subTitle={
              <div>
                <Paragraph>
                  AI tarafından oluşturulan Envoy konfigürasyonları sisteminize başarıyla kaydedildi.
                </Paragraph>
                <Paragraph type="secondary">
                  Uygulanan konfigürasyonlar: {Object.keys(appliedConfigs.applied_configs || {}).join(', ')}
                </Paragraph>
              </div>
            }
            extra={
              <Space>
                <Button type="primary" onClick={() => window.location.reload()}>
                  Yeni Konfigürasyon Oluştur
                </Button>
                <Button onClick={() => window.location.href = '/dashboard'}>
                  Dashboard'a Dön
                </Button>
              </Space>
            }
          />
        )}
      </Card>

      {/* Preview Modal */}
      <Modal
        title="Konfigürasyon Özeti"
        open={previewVisible}
        onCancel={() => setPreviewVisible(false)}
        footer={null}
        width={800}
      >
        <div>
          <Text strong>Servis Bilgileri:</Text>
          <ul>
            <li>Servis Adı: {currentFormData.service_name || 'Belirtilmedi'}</li>
            <li>Ortam: {currentFormData.environment || 'Belirtilmedi'}</li>
            <li>Proje: {currentFormData.project || 'Belirtilmedi'}</li>
          </ul>

          <Divider />

          <Text strong>Etkin Özellikler:</Text>
          <ul>
            {currentFormData.require_https && <li>HTTPS Zorunlu</li>}
            {currentFormData.enable_cors && <li>CORS Desteği</li>}
            {currentFormData.enable_auth && <li>Authentication</li>}
            {currentFormData.enable_rate_limit && <li>Rate Limiting</li>}
            {currentFormData.enable_logging && <li>Access Logging</li>}
            {currentFormData.enable_metrics && <li>Metrics Collection</li>}
          </ul>

          {currentFormData.upstream && (
            <>
              <Divider />
              <Text strong>Upstream Ayarları:</Text>
              <ul>
                <li>Host'lar: {currentFormData.upstream.hosts?.join(', ') || 'Belirtilmedi'}</li>
                <li>Port: {currentFormData.upstream.port || 'Belirtilmedi'}</li>
                <li>Protokol: {currentFormData.upstream.protocol || 'Belirtilmedi'}</li>
                <li>Load Balancing: {currentFormData.upstream.load_balancing || 'round_robin'}</li>
              </ul>
            </>
          )}

          {currentFormData.requirements && (
            <>
              <Divider />
              <Text strong>Ek Gereksinimler:</Text>
              <Paragraph style={{ marginTop: 8 }}>
                {currentFormData.requirements}
              </Paragraph>
            </>
          )}
        </div>
      </Modal>
    </div>
  );
};

export default AIConfigGenerator;