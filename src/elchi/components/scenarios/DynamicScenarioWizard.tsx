import React, { useState, useEffect } from 'react';
import { Steps, Card, Spin, Alert, Button } from 'antd';
import { useNavigate, useParams } from 'react-router-dom';
import { useProjectVariable } from '@/hooks/useProjectVariable';
import { showErrorNotification, showSuccessNotification } from '@/common/notificationHandler';
import { 
    useScenarioAPI, 
    ComponentInstance, 
    generateScenarioId,
    ValidateScenarioResponse 
} from './hooks/useScenarioAPI';

// Import step components
import BasicInfoStep from './steps/BasicInfoStep';
import DynamicComponentBuilder from './DynamicComponentBuilder';
import ReviewStep from './steps/ReviewStep';
import ValidationErrorDisplay from './ValidationErrorDisplay';

interface BasicInfo {
    name: string;
    description: string;
    scenario_id: string;
    is_global?: boolean;
}

const DynamicScenarioWizard: React.FC = () => {
    const navigate = useNavigate();
    const { scenarioId } = useParams<{ scenarioId?: string }>();
    const { project } = useProjectVariable();
    const { 
        useCreateScenario, 
        useUpdateScenario,
        useGetScenario 
    } = useScenarioAPI();
    
    const createMutation = useCreateScenario();
    const updateMutation = useUpdateScenario();
    const { data: existingScenario, isLoading: scenarioLoading, error: scenarioError } = useGetScenario(scenarioId || '');
    
    const isEditMode = Boolean(scenarioId);

    const [currentStep, setCurrentStep] = useState(0);
    const [basicInfo, setBasicInfo] = useState<BasicInfo>({
        name: '',
        description: '',
        scenario_id: '',
        is_global: false
    });
    const [components, setComponents] = useState<ComponentInstance[]>([]);
    const [apiValidationError, setApiValidationError] = useState<ValidateScenarioResponse | null>(null);
    const [formattedErrorMessage, setFormattedErrorMessage] = useState<string | null>(null);
    const [createError, setCreateError] = useState<string | null>(null);
    
    // Load existing scenario data for edit mode
    useEffect(() => {
        if (existingScenario && isEditMode) {
            setBasicInfo({
                name: existingScenario.name,
                description: existingScenario.description,
                scenario_id: existingScenario.scenario_id,
                is_global: !existingScenario.project
            });
            setComponents(existingScenario.components);
        }
    }, [existingScenario, isEditMode]);

    // Scroll to top when create error appears
    useEffect(() => {
        if (createError) {
            // Use setTimeout to ensure the error is rendered first
            setTimeout(() => {
                window.scrollTo({ 
                    top: 0, 
                    behavior: 'smooth' 
                });
                // Alternative fallback
                document.documentElement.scrollTop = 0;
            }, 100);
        }
    }, [createError]);

    const steps = [
        {
            title: 'Basic Information',
            description: 'Scenario name and description'
        },
        {
            title: 'Resources & Fields',
            description: 'Select resources and their fields'
        },
        {
            title: 'Review & Create',
            description: 'Review your configuration'
        }
    ];

    const handleBasicInfoNext = (values: BasicInfo) => {
        const scenarioId = values.scenario_id || generateScenarioId(values.name);
        setBasicInfo({
            ...values,
            scenario_id: scenarioId
        });
        setCurrentStep(1);
    };

    const handleComponentsNext = (selectedComponents: ComponentInstance[]) => {
        setComponents(selectedComponents);
        setApiValidationError(null); // Clear API errors when moving forward
        setFormattedErrorMessage(null); // Clear formatted errors when moving forward
        setCreateError(null); // Clear create errors when moving forward
        setCurrentStep(2);
    };

    const handleCreateScenario = async () => {
        if (!project && !basicInfo.is_global) {
            showErrorNotification('Project not selected');
            return;
        }

        try {
            if (isEditMode && scenarioId) {
                // Update existing scenario
                const updateData = {
                    name: basicInfo.name,
                    description: basicInfo.description,
                    components: components
                };
                
                await updateMutation.mutateAsync({
                    scenarioId,
                    data: updateData
                });
                showSuccessNotification('Scenario updated successfully!');
            } else {
                // Create new scenario
                const scenarioData = {
                    name: basicInfo.name,
                    description: basicInfo.description,
                    scenario_id: basicInfo.scenario_id,
                    components: components,
                    project: basicInfo.is_global ? undefined : project
                };

                await createMutation.mutateAsync(scenarioData);
                showSuccessNotification('Scenario created successfully!');
            }
            
            navigate('/scenarios');
        } catch (error: any) {            
            // Check if this is a validation error with enhanced structure
            const responseData = error.response?.data;
            if (responseData?.data && 
                responseData.data.hasOwnProperty('valid') && 
                responseData.data.hasOwnProperty('errors')) {
                // Enhanced validation error from backend
                setApiValidationError(responseData.data);
                setFormattedErrorMessage(null);
                setCreateError(null);
                setCurrentStep(1); // Go to component step to show validation errors
            } else if (responseData?.message && responseData.message.includes('Validation failed')) {
                // Handle formatted message from backend - show in component step
                setFormattedErrorMessage(responseData.message);
                setApiValidationError(null);
                setCreateError(null);
                setCurrentStep(1); // Go to component step to show validation errors
            } else {
                // Handle simple error messages - show in review step
                const simpleErrorMessage = responseData?.message || error.message;
                setCreateError(simpleErrorMessage);
                setApiValidationError(null);
                setFormattedErrorMessage(null);
                // Stay in current step (review step) to show the error
            }
        }
    };

    const renderStepContent = () => {
        switch (currentStep) {
            case 0:
                return (
                    <BasicInfoStep
                        initialValues={basicInfo}
                        onNext={handleBasicInfoNext}
                        onCancel={() => navigate('/scenarios')}
                    />
                );
            case 1:
                return (
                    <div>
                        {/* Show API validation errors if present */}
                        {(apiValidationError && !apiValidationError.valid) || formattedErrorMessage ? (
                            <ValidationErrorDisplay
                                validationResult={apiValidationError}
                                errorMessage={formattedErrorMessage}
                                style={{ marginBottom: '16px' }}
                            />
                        ) : null}
                        <DynamicComponentBuilder
                            initialComponents={components}
                            onSubmit={handleComponentsNext}
                            onPrevious={() => {
                                setCurrentStep(0);
                                setApiValidationError(null); // Clear API errors when going back
                                setFormattedErrorMessage(null); // Clear formatted errors when going back
                                setCreateError(null); // Clear create errors when going back
                            }}
                        />
                    </div>
                );
            case 2:
                return (
                    <div>
                        {/* Show create errors if present */}
                        {createError && (
                            <Alert
                                type="error"
                                showIcon
                                style={{ marginBottom: '16px' }}
                                message={isEditMode ? "Failed to Update Scenario" : "Failed to Create Scenario"}
                                description={
                                    <div>
                                        {(() => {
                                            const errorMessage = createError || 'Unknown error';
                                            
                                            // Always show modern error display for any error
                                            const cleanMessage = errorMessage
                                                .replace(/failed to save component .+ to database: failed to save resource via XDS SetResource: Validation error: /, '')
                                                .replace(/Validation error: /, '')
                                                .trim();
                                            
                                            // Split by newlines and filter out empty lines
                                            const validationErrors = cleanMessage
                                                .split(/\n/)
                                                .map(line => line.trim())
                                                .filter(line => line.length > 0)
                                                .map(line => line.startsWith(':') ? line.substring(1).trim() : line);
                                            
                                            // Always show modern card-based display
                                            return (
                                                <div style={{ marginTop: '12px' }}>
                                                    <p style={{ marginBottom: '16px', color: '#ff4d4f', fontWeight: 500 }}>
                                                        Please fix the following configuration issue{validationErrors.length > 1 ? 's' : ''}:
                                                    </p>
                                                    <ul style={{ 
                                                        margin: 0, 
                                                        paddingLeft: '0',
                                                        listStyle: 'none'
                                                    }}>
                                                        {validationErrors.map((error, index) => (
                                                            <li key={index} style={{
                                                                marginBottom: '12px',
                                                                padding: '12px 16px',
                                                                backgroundColor: '#fff2f0',
                                                                border: '1px solid #ffccc7',
                                                                borderRadius: '6px',
                                                                borderLeft: '4px solid #ff4d4f'
                                                            }}>
                                                                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
                                                                    <span style={{
                                                                        display: 'inline-flex',
                                                                        alignItems: 'center',
                                                                        justifyContent: 'center',
                                                                        width: '20px',
                                                                        height: '20px',
                                                                        backgroundColor: '#ff4d4f',
                                                                        color: 'white',
                                                                        borderRadius: '50%',
                                                                        fontSize: '12px',
                                                                        fontWeight: 'bold',
                                                                        flexShrink: 0
                                                                    }}>
                                                                        {index + 1}
                                                                    </span>
                                                                    <span style={{ 
                                                                        color: '#595959',
                                                                        lineHeight: '1.5',
                                                                        fontSize: '14px'
                                                                    }}>
                                                                        {error}
                                                                    </span>
                                                                </div>
                                                            </li>
                                                        ))}
                                                    </ul>
                                                </div>
                                            );
                                        })()}
                                    </div>
                                }
                            />
                        )}
                        <ReviewStep
                            basicInfo={basicInfo}
                            components={components}
                            onPrevious={() => {
                                setCurrentStep(1);
                                setCreateError(null); // Clear error when going back
                            }}
                            onCreate={handleCreateScenario}
                            loading={createMutation.isPending || updateMutation.isPending}
                            isEditMode={isEditMode}
                        />
                    </div>
                );
            default:
                return null;
        }
    };

    // Loading state for edit mode
    if (isEditMode && scenarioLoading) {
        return (
            <div style={{ textAlign: 'center', padding: '50px' }}>
                <Spin size="large" />
                <div style={{ marginTop: '16px' }}>Loading scenario...</div>
            </div>
        );
    }

    // Error state for edit mode
    if (isEditMode && scenarioError) {
        return (
            <div style={{ padding: '24px' }}>
                <Alert
                    message="Scenario Not Found"
                    description="The requested scenario could not be loaded for editing."
                    type="error"
                    showIcon
                    action={
                        <Button onClick={() => navigate('/scenarios')}>
                            Back to Scenarios
                        </Button>
                    }
                />
            </div>
        );
    }

    return (
        <div style={{ padding: '24px' }}>
            <Card>
                <div style={{ marginBottom: '32px' }}>
                    <h2 style={{ marginBottom: '8px' }}>
                        {isEditMode ? 'Edit Scenario' : 'Create Scenario'}
                    </h2>
                    <p style={{ color: '#666', marginBottom: '24px' }}>
                        {isEditMode 
                            ? 'Modify your dynamic scenario configuration. You can update components, fields, and basic information.'
                            : 'Create a fully customizable proxy configuration scenario by selecting resources and their specific fields. Build exactly what you need.'
                        }
                    </p>
                    
                    <Steps
                        current={currentStep}
                        items={steps.map(step => ({
                            title: step.title,
                            description: step.description
                        }))}
                    />
                </div>

                <div style={{ marginTop: '32px' }}>
                    {renderStepContent()}
                </div>
            </Card>
        </div>
    );
};

export default DynamicScenarioWizard;