import React from 'react';
import { Tooltip } from 'antd';
import { CheckCircleOutlined, CloseCircleOutlined, WarningOutlined } from '@ant-design/icons';
import { LintResult } from '../../types';

interface LintBadgeProps {
    result: LintResult | null;
    loading?: boolean;
}

const LintBadge: React.FC<LintBadgeProps> = ({ result, loading }) => {
    if (loading) {
        return (
            <span style={{ color: 'var(--text-secondary)', fontSize: 12 }}>
                Linting…
            </span>
        );
    }

    if (!result) {
        return (
            <span style={{ color: 'var(--text-secondary)', fontSize: 12 }}>
                Lint not run
            </span>
        );
    }

    const { ok, warnings, errors } = result.summary;

    return (
        <Tooltip
            title={
                <div style={{ fontSize: 12 }}>
                    {result.diagnostics.length === 0
                        ? 'No diagnostics'
                        : result.diagnostics.slice(0, 6).map((d, i) => (
                              <div key={i}>
                                  L{d.line + 1}: {d.message}
                              </div>
                          ))}
                </div>
            }
        >
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8, fontSize: 12 }}>
                <span style={{ color: 'var(--color-success)' }}>
                    <CheckCircleOutlined /> {ok} ok
                </span>
                <span style={{ color: warnings > 0 ? 'var(--color-warning)' : 'var(--text-secondary)' }}>
                    <WarningOutlined /> {warnings} warn
                </span>
                <span style={{ color: errors > 0 ? 'var(--color-danger)' : 'var(--text-secondary)' }}>
                    <CloseCircleOutlined /> {errors} err
                </span>
            </span>
        </Tooltip>
    );
};

export default LintBadge;
