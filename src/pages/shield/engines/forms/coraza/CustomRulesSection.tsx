/**
 * The custom-rules editor inside WAF Studio: a sortable list of SecLang rules
 * (drag to reorder, syntax-highlighted, inline edit/delete) with a live lint
 * summary and a quick-add bar. Pure props in/out — the drawer owns the rows.
 *
 * Reuses the WAF page's DirectiveRow / AddDirectiveBar and the shared lint via
 * the `@/components/waf-studio` barrel.
 */

import React, { useMemo } from 'react';
import { Empty, Tag, Typography } from 'antd';
import {
    CheckCircleOutlined,
    ExclamationCircleOutlined,
    WarningOutlined,
} from '@ant-design/icons';
import {
    DndContext,
    DragEndEvent,
    KeyboardSensor,
    PointerSensor,
    closestCenter,
    useSensor,
    useSensors,
} from '@dnd-kit/core';
import { restrictToVerticalAxis, restrictToParentElement } from '@dnd-kit/modifiers';
import {
    SortableContext,
    sortableKeyboardCoordinates,
    verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { AddDirectiveBar, Directive, DirectiveRow, lintDirectives } from '@/components/waf-studio';
import { newRuleRow } from './directivesCodec';

const { Text } = Typography;

interface CustomRulesSectionProps {
    rules: Directive[];
    onChange: (rules: Directive[]) => void;
    onOpenTemplate: () => void;
    disabled?: boolean;
}

const LintSummary: React.FC<{ rules: Directive[] }> = ({ rules }) => {
    const lint = useMemo(() => lintDirectives(rules.map((r) => r.text)), [rules]);
    if (rules.length === 0) return null;
    const { errors, warnings } = lint.summary;
    if (errors > 0) {
        return (
            <Tag icon={<ExclamationCircleOutlined />} color="error">
                {errors} error{errors === 1 ? '' : 's'}
            </Tag>
        );
    }
    if (warnings > 0) {
        return (
            <Tag icon={<WarningOutlined />} color="warning">
                {warnings} warning{warnings === 1 ? '' : 's'}
            </Tag>
        );
    }
    return (
        <Tag icon={<CheckCircleOutlined />} color="success">
            lint clean
        </Tag>
    );
};

const CustomRulesSection: React.FC<CustomRulesSectionProps> = ({
    rules,
    onChange,
    onOpenTemplate,
    disabled,
}) => {
    const sensors = useSensors(
        useSensor(PointerSensor, { activationConstraint: { distance: 4 } }),
        useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
    );

    const itemIds = useMemo(() => rules.map((d) => d.id), [rules]);

    const handleDragEnd = (e: DragEndEvent) => {
        const { active, over } = e;
        if (!over || active.id === over.id) return;
        const oldIndex = itemIds.indexOf(String(active.id));
        const newIndex = itemIds.indexOf(String(over.id));
        if (oldIndex < 0 || newIndex < 0) return;
        const next = [...rules];
        const [moved] = next.splice(oldIndex, 1);
        next.splice(newIndex, 0, moved);
        onChange(next);
    };

    const updateRow = (id: string, text: string) =>
        onChange(rules.map((r) => (r.id === id ? { ...r, text } : r)));

    const deleteRow = (id: string) => onChange(rules.filter((r) => r.id !== id));

    const addRow = (text: string) => onChange([...rules, newRuleRow(text)]);

    return (
        <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                <Text strong style={{ fontSize: 14 }}>Custom Rules</Text>
                <Tag>{rules.length} rule{rules.length === 1 ? '' : 's'}</Tag>
                <LintSummary rules={rules} />
                <div style={{ flex: 1 }} />
                <Text type="secondary" style={{ fontSize: 12 }}>
                    Raw SecLang appended after the CRS — drag to reorder
                </Text>
            </div>

            {rules.length === 0 ? (
                <Empty
                    image={Empty.PRESENTED_IMAGE_SIMPLE}
                    style={{ margin: '12px 0' }}
                    description={
                        <Text type="secondary" style={{ fontSize: 12 }}>
                            No custom rules yet — add one below, build one visually, or copy a rule from the CRS library.
                        </Text>
                    }
                />
            ) : (
                <DndContext
                    sensors={sensors}
                    collisionDetection={closestCenter}
                    modifiers={[restrictToVerticalAxis, restrictToParentElement]}
                    onDragEnd={handleDragEnd}
                >
                    <SortableContext items={itemIds} strategy={verticalListSortingStrategy}>
                        {rules.map((d) => (
                            <DirectiveRow
                                key={d.id}
                                directive={d}
                                onChange={(text) => updateRow(d.id, text)}
                                onDelete={() => deleteRow(d.id)}
                            />
                        ))}
                    </SortableContext>
                </DndContext>
            )}

            {!disabled && (
                <div style={{ marginTop: 8, border: '1px solid var(--border-default)', borderRadius: 8 }}>
                    <AddDirectiveBar onAdd={addRow} onOpenTemplate={onOpenTemplate} />
                </div>
            )}
        </div>
    );
};

export default CustomRulesSection;
