import React, { ReactNode, useState } from 'react';
import { Card } from 'antd';
import { CollapseSVG, ExpandSVG, SnippetSVG } from '@/assets/svg/icons';
import { SnippetDrawer } from '@/elchi/snippets/components/SnippetDrawer';


interface CustomCardProps {
    children?: ReactNode;
    title: string;
    // Snippet props (optional - only for components that support snippets)
    reduxStore?: any;
    ctype?: string;
    toJSON?: (data: any) => any;
    onApply?: (keys: string, data: any) => void;
    keys?: string;
    version?: string;
    [key: string]: any;
}

const ECard: React.FC<CustomCardProps> = ({ 
    children, 
    title, 
    reduxStore, 
    ctype, 
    toJSON, 
    onApply, 
    keys, 
    version, 
    ...props 
}) => {
    const [expanded, setExpanded] = useState(true);
    const [snippetDrawerOpen, setSnippetDrawerOpen] = useState(false);
    const toggleExpand = () => {
        setExpanded(!expanded);
    };

    return (
        <>
            <Card
                size="small"
                style={{
                    width: "100%",
                    marginBottom: "8px"
                }}
                styles={{
                    body: { padding: expanded ? '8px' : '0px', minHeight: '8px' }
                }} {...props}
                extra={
                    <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                        {/* Snippet Button */}
                        {version && ctype && toJSON && onApply && (
                            <div style={{ display: 'inline-block', marginTop: 5 }}>
                                <SnippetSVG onClick={() => setSnippetDrawerOpen(true)} />
                            </div>
                        )}
                        
                        {/* Collapse/Expand */}
                        {expanded
                            ? <CollapseSVG onClick={toggleExpand} />
                            : <ExpandSVG onClick={toggleExpand} />
                        }
                    </div>
                }
                title={title}
            >
                {expanded && (children)
                }
            </Card>
            
            {/* Snippet Drawer */}
            {version && ctype && toJSON && onApply && (
                <SnippetDrawer
                    open={snippetDrawerOpen}
                    onClose={() => setSnippetDrawerOpen(false)}
                    ctype={ctype}
                    keys={keys}
                    title={title}
                    reduxStore={reduxStore}
                    toJSON={toJSON}
                    onApply={onApply}
                    version={version}
                    gtype={reduxStore?.$type || (Array.isArray(reduxStore) ? reduxStore[0]?.$type : undefined)}
                />
            )}
        </>
    );
};

export default ECard;
