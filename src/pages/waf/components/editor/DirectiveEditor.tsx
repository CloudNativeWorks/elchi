import React, { useEffect, useMemo, useRef } from 'react';
import { Empty, Input, Tag, Tooltip, Typography } from 'antd';
import { StarFilled } from '@ant-design/icons';
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
import { useActiveSet, useWafEditor } from '../../state/wafEditorStore';
import { lintDirectives } from '../../utils/clientLint';
import DirectiveRow from './DirectiveRow';
import AddDirectiveBar from './AddDirectiveBar';
import LintBadge from './LintBadge';

const { Text } = Typography;

interface DirectiveEditorProps {
    onOpenTemplate: () => void;
}

/**
 * Main editor pane: shows the active directive set's directives as a
 * sortable list, with an add bar at the bottom and a lint summary at the top.
 *
 * If no set is selected (or none exist), surface a helpful empty state.
 */
const DirectiveEditor: React.FC<DirectiveEditorProps> = ({ onOpenTemplate }) => {
    const { state, dispatch } = useWafEditor();
    const activeSet = useActiveSet();

    const sensors = useSensors(
        useSensor(PointerSensor, { activationConstraint: { distance: 4 } }),
        useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
    );

    // Debounced client-side lint until the BE endpoint ships.
    const lintTimer = useRef<number | null>(null);
    useEffect(() => {
        if (!activeSet) {
            dispatch({ type: 'SET_LINT', result: null });
            return;
        }
        if (lintTimer.current) window.clearTimeout(lintTimer.current);
        lintTimer.current = window.setTimeout(() => {
            const result = lintDirectives(activeSet.directives.map((d) => d.text));
            dispatch({ type: 'SET_LINT', result });
        }, 400);
        return () => {
            if (lintTimer.current) window.clearTimeout(lintTimer.current);
        };
    }, [activeSet, dispatch]);

    const isDefault = activeSet?.id === state.editor.defaultSetId;

    const itemIds = useMemo(() => activeSet?.directives.map((d) => d.id) ?? [], [activeSet]);

    if (!activeSet) {
        return (
            <Empty
                description={
                    state.editor.sets.length === 0
                        ? 'No directive sets yet. Create one from the sidebar to begin.'
                        : 'Select a directive set on the left to start editing.'
                }
                style={{ padding: '64px 0' }}
            />
        );
    }

    const handleDragEnd = (e: DragEndEvent) => {
        const { active, over } = e;
        if (!over || active.id === over.id) return;
        const oldIndex = itemIds.indexOf(String(active.id));
        const newIndex = itemIds.indexOf(String(over.id));
        if (oldIndex < 0 || newIndex < 0) return;
        const next = [...itemIds];
        next.splice(oldIndex, 1);
        next.splice(newIndex, 0, String(active.id));
        dispatch({ type: 'REORDER_DIRECTIVES', setId: activeSet.id, orderedIds: next });
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', minHeight: 0, height: '100%' }}>
            <div
                style={{
                    padding: '12px 16px',
                    borderBottom: '1px solid var(--border-default)',
                }}
            >
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <Text strong style={{ fontSize: 16 }}>
                        {activeSet.name}
                    </Text>
                    {isDefault && (
                        <Tooltip title="This set is applied when no per-authority override matches">
                            <Tag color="gold" icon={<StarFilled />} style={{ marginInlineEnd: 0 }}>
                                Default
                            </Tag>
                        </Tooltip>
                    )}
                    <Tag>{activeSet.directives.length} directive{activeSet.directives.length === 1 ? '' : 's'}</Tag>
                    <div style={{ flex: 1 }} />
                    <LintBadge result={state.ui.lint} />
                </div>
                <Input
                    placeholder="Optional description (e.g. 'Paranoia 4 + custom DDoS rules')"
                    value={activeSet.description ?? ''}
                    onChange={(e) =>
                        dispatch({
                            type: 'SET_SET_DESCRIPTION',
                            id: activeSet.id,
                            description: e.target.value,
                        })
                    }
                    maxLength={280}
                    showCount={Boolean(activeSet.description)}
                    variant="borderless"
                    style={{
                        marginTop: 6,
                        padding: 0,
                        fontSize: 12.5,
                        color: 'var(--text-secondary)',
                    }}
                />
            </div>

            <div style={{ flex: 1, minHeight: 0, overflow: 'auto', padding: 16 }}>
                {activeSet.directives.length === 0 ? (
                    <Empty
                        description="This set has no directives yet. Add one below or use Templates."
                        style={{ padding: '32px 0' }}
                    />
                ) : (
                    <DndContext
                        sensors={sensors}
                        collisionDetection={closestCenter}
                        modifiers={[restrictToVerticalAxis, restrictToParentElement]}
                        onDragEnd={handleDragEnd}
                    >
                        <SortableContext items={itemIds} strategy={verticalListSortingStrategy}>
                            {activeSet.directives.map((d) => (
                                <DirectiveRow
                                    key={d.id}
                                    directive={d}
                                    onChange={(text) =>
                                        dispatch({
                                            type: 'UPDATE_DIRECTIVE',
                                            setId: activeSet.id,
                                            directiveId: d.id,
                                            text,
                                        })
                                    }
                                    onDelete={() =>
                                        dispatch({
                                            type: 'REMOVE_DIRECTIVE',
                                            setId: activeSet.id,
                                            directiveId: d.id,
                                        })
                                    }
                                />
                            ))}
                        </SortableContext>
                    </DndContext>
                )}
            </div>

            <AddDirectiveBar
                onAdd={(text) => dispatch({ type: 'ADD_DIRECTIVE', setId: activeSet.id, text })}
                onOpenTemplate={onOpenTemplate}
            />
        </div>
    );
};

export default DirectiveEditor;
