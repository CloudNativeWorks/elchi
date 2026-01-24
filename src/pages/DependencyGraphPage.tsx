import React from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import DependencyGraph from '@/elchi/components/common/dependency';

/**
 * Dependency Graph Page Wrapper
 * Extracts URL params and passes them to DependencyGraph component
 */
const DependencyGraphPage: React.FC = () => {
    const { name } = useParams<{ name: string }>();
    const [searchParams] = useSearchParams();

    const collection = searchParams.get('collection') || '';
    const gtype = searchParams.get('gtype') || '';
    const version = searchParams.get('version') || '';

    if (!name || !collection || !gtype || !version) {
        return (
            <div
                style={{
                    width: '100%',
                    height: '100vh',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    background: 'var(--bg-body)',
                }}
            >
                <div style={{ textAlign: 'center', color: 'var(--text-secondary)' }}>
                    <h3>Missing required parameters</h3>
                    <p>Please provide name, collection, gtype, and version</p>
                </div>
            </div>
        );
    }

    return (
        <DependencyGraph
            name={decodeURIComponent(name)}
            collection={collection}
            gtype={gtype}
            version={version}
        />
    );
};

export default DependencyGraphPage;
