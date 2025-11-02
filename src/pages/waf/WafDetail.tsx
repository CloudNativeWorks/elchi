/**
 * WAF Configuration Detail Page
 * Create and edit WAF configurations
 */

import React, { useEffect, useState } from 'react';
import { Form, Spin, Alert, Modal } from 'antd';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import { useParams } from 'react-router-dom';
import { useProjectVariable } from '@/hooks/useProjectVariable';
import { useQuery } from '@tanstack/react-query';
import { wafApi } from './wafApi';
import { useWafMutations } from './hooks/useWafMutations';
import { useDirectiveManager } from './hooks/useDirectiveManager';
import WafHeader from './components/WafHeader';
import WafForm from './components/WafForm';
import DirectiveSetsManager from './components/DirectiveSetsManager';
import FormattingPreviewModal from './components/FormattingPreviewModal';
import CrsRuleBrowser from './CrsRuleBrowser';
import { CrsRule } from './types';

const { confirm } = Modal;

const WafDetail: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const { project } = useProjectVariable();
    const [form] = Form.useForm();
    const isCreateMode = id === 'create';

    // State
    const [directiveSets, setDirectiveSets] = useState<{ [key: string]: string[] }>({});
    const [newSetName, setNewSetName] = useState('');
    const [metricLabels, setMetricLabels] = useState<{ [key: string]: string }>({});
    const [perAuthorityDirectives, setPerAuthorityDirectives] = useState<{ [domain: string]: string }>({});
    const [newAuthorityDomain, setNewAuthorityDomain] = useState('');
    const [newAuthorityDirectiveSet, setNewAuthorityDirectiveSet] = useState('');
    const [pendingCrsItem, setPendingCrsItem] = useState<{ type: 'rule' | 'file'; data: CrsRule | string } | null>(null);
    const [selectSetModalVisible, setSelectSetModalVisible] = useState(false);

    // Fetch WAF config
    const { data: wafConfig, isLoading, error } = useQuery({
        queryKey: ['waf-config', id, project],
        queryFn: () => wafApi.getWafConfig(id!, project),
        enabled: !isCreateMode && !!id && !!project,
    });

    // Mutations
    const { createMutation, updateMutation, deleteMutation, isLoading: isSaving } = useWafMutations(id, project);

    // Directive manager
    const directiveManager = useDirectiveManager({
        directiveSets,
        onDirectiveSetsChange: setDirectiveSets
    });

    // Initialize form
    useEffect(() => {
        if (isCreateMode) {
            setDirectiveSets({});
            setMetricLabels({});
            setPerAuthorityDirectives({});
        } else if (wafConfig) {
            form.setFieldsValue({
                name: wafConfig.name,
                default_directives: wafConfig.data.default_directives
            });
            setDirectiveSets(wafConfig.data.directives_map);
            setMetricLabels(wafConfig.data.metric_labels || {});
            setPerAuthorityDirectives(wafConfig.data.per_authority_directives || {});
        }
    }, [wafConfig, isCreateMode, form]);

    // Handlers
    const handleSave = async () => {
        try {
            const values = await form.validateFields();

            const data = {
                name: values.name,
                project: project,
                data: {
                    directives_map: directiveSets,
                    default_directives: values.default_directives,
                    ...(Object.keys(metricLabels).length > 0 && { metric_labels: metricLabels }),
                    ...(Object.keys(perAuthorityDirectives).length > 0 && { per_authority_directives: perAuthorityDirectives })
                }
            };

            if (isCreateMode) {
                createMutation.mutate(data);
            } else {
                updateMutation.mutate(data);
            }
        } catch (error) {
            console.error('Validation failed:', error);
        }
    };

    const handleDelete = () => {
        confirm({
            title: 'Delete WAF Config',
            icon: <ExclamationCircleOutlined />,
            content: `Are you sure you want to delete "${wafConfig?.name}"?`,
            okText: 'Delete',
            okType: 'danger',
            cancelText: 'Cancel',
            onOk() {
                deleteMutation.mutate();
            },
        });
    };

    const handleAddDirectiveSet = () => {
        if (newSetName && !directiveSets[newSetName]) {
            setDirectiveSets({
                ...directiveSets,
                [newSetName]: []
            });
            setNewSetName('');
        }
    };

    const handleRemoveDirectiveSet = (setName: string) => {
        const newSets = { ...directiveSets };
        delete newSets[setName];
        setDirectiveSets(newSets);

        const currentDefault = form.getFieldValue('default_directives');
        if (currentDefault === setName) {
            form.setFieldValue('default_directives', undefined);
        }
    };

    const handleSelectCrsRule = (rule: CrsRule) => {
        const setNames = Object.keys(directiveSets);

        if (setNames.length === 0 || !rule.description.rule) {
            return;
        }

        // Decode escape sequences
        let ruleDirective = rule.description.rule
            .replace(/\\n/g, '\n')
            .replace(/\\t/g, '\t')
            .replace(/\\"/g, '"')
            .replace(/\u0026/g, '&');

        if (setNames.length === 1) {
            directiveManager.addCrsItemToSet(setNames[0], ruleDirective);
        } else {
            setPendingCrsItem({ type: 'rule', data: rule });
            setSelectSetModalVisible(true);
        }
    };

    const handleSelectCrsFile = (filename: string) => {
        const setNames = Object.keys(directiveSets);

        if (setNames.length === 0) {
            return;
        }

        const includeDirective = `Include @owasp_crs/${filename}`;

        if (setNames.length === 1) {
            directiveManager.addCrsItemToSet(setNames[0], includeDirective);
        } else {
            setPendingCrsItem({ type: 'file', data: filename });
            setSelectSetModalVisible(true);
        }
    };

    const handleConfirmSetSelection = (selectedSet: string) => {
        if (!pendingCrsItem) return;

        let directive: string;

        if (pendingCrsItem.type === 'rule') {
            const rule = pendingCrsItem.data as CrsRule;
            if (!rule.description.rule) return;

            directive = rule.description.rule
                .replace(/\\n/g, '\n')
                .replace(/\\t/g, '\t')
                .replace(/\\"/g, '"')
                .replace(/\u0026/g, '&');
        } else {
            const filename = pendingCrsItem.data as string;
            directive = `Include @owasp_crs/${filename}`;
        }

        directiveManager.addCrsItemToSet(selectedSet, directive);

        setPendingCrsItem(null);
        setSelectSetModalVisible(false);
    };

    // Loading state
    if (isLoading) {
        return (
            <div style={{ textAlign: 'center', padding: '100px 0' }}>
                <Spin size="large" />
            </div>
        );
    }

    // Error state
    if (!isCreateMode && (error || !wafConfig)) {
        return (
            <Alert
                message="Error"
                description="Failed to load WAF configuration"
                type="error"
                showIcon
            />
        );
    }

    return (
        <>
            <WafHeader
                title={isCreateMode ? 'Create WAF Configuration' : wafConfig?.name || ''}
                isCreateMode={isCreateMode}
                isSaving={isSaving}
                onSave={handleSave}
                onDelete={!isCreateMode ? handleDelete : undefined}
            />

            <WafForm
                form={form}
                isCreateMode={isCreateMode}
                directiveSets={directiveSets}
                metricLabels={metricLabels}
                setMetricLabels={setMetricLabels}
                perAuthorityDirectives={perAuthorityDirectives}
                setPerAuthorityDirectives={setPerAuthorityDirectives}
                newAuthorityDomain={newAuthorityDomain}
                setNewAuthorityDomain={setNewAuthorityDomain}
                newAuthorityDirectiveSet={newAuthorityDirectiveSet}
                setNewAuthorityDirectiveSet={setNewAuthorityDirectiveSet}
            />

            <DirectiveSetsManager
                form={form}
                directiveSets={directiveSets}
                newSetName={newSetName}
                setNewSetName={setNewSetName}
                onAddDirectiveSet={handleAddDirectiveSet}
                onRemoveDirectiveSet={handleRemoveDirectiveSet}
                newDirective={directiveManager.newDirective}
                setNewDirective={directiveManager.setNewDirective}
                onAddDirective={directiveManager.handleAddDirective}
                onQuickAddDirective={directiveManager.handleQuickAddDirective}
                editingDirective={directiveManager.editingDirective}
                editValue={directiveManager.editValue}
                setEditValue={directiveManager.setEditValue}
                onMoveUp={directiveManager.handleMoveDirectiveUp}
                onMoveDown={directiveManager.handleMoveDirectiveDown}
                onStartEdit={directiveManager.handleStartEditDirective}
                onSaveEdit={directiveManager.handleSaveEditDirective}
                onCancelEdit={directiveManager.handleCancelEditDirective}
                onDelete={directiveManager.handleRemoveDirective}
                pendingCrsItem={pendingCrsItem}
                setPendingCrsItem={setPendingCrsItem}
                selectSetModalVisible={selectSetModalVisible}
                setSelectSetModalVisible={setSelectSetModalVisible}
                onConfirmSetSelection={handleConfirmSetSelection}
            />

            <FormattingPreviewModal
                visible={directiveManager.formattingPreview?.visible || false}
                formatResult={directiveManager.formattingPreview?.formatResult || null}
                onConfirm={directiveManager.handleConfirmFormatting}
                onCancel={directiveManager.handleCancelFormatting}
            />

            <CrsRuleBrowser
                onSelectRule={handleSelectCrsRule}
                onSelectFile={handleSelectCrsFile}
                selectedSetName={Object.keys(directiveSets).length > 0 ? Object.keys(directiveSets)[0] : undefined}
            />
        </>
    );
};

export default WafDetail;
