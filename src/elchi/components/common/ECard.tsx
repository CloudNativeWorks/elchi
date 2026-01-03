import React, { ReactNode, useState } from 'react';
import { Card } from 'antd';
import { FullscreenOutlined } from '@ant-design/icons';
import { CollapseSVG, ExpandSVG, SnippetSVG } from '@/assets/svg/icons';
import { SnippetDrawer } from '@/elchi/snippets/components/SnippetDrawer';
import FullscreenModal from './FullscreenModal';


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
    const [fullscreen, setFullscreen] = useState(false);
    const toggleExpand = () => {
        setExpanded(!expanded);
    };
    const toggleFullscreen = () => {
        setFullscreen(!fullscreen);
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

                        {/* Fullscreen Button */}
                        <div
                            style={{
                                display: 'inline-block',
                                marginTop: 5,
                                cursor: 'pointer',
                                transition: 'all 0.3s ease'
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.transform = 'scale(1.2)';
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.transform = 'scale(1)';
                            }}
                        >
                            <FullscreenOutlined
                                onClick={toggleFullscreen}
                                style={{
                                    fontSize: 14,
                                    color: '#fff',
                                    filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.2))'
                                }}
                            />
                        </div>

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

            {/* Fullscreen Modal */}
            <FullscreenModal
                open={fullscreen}
                title={title}
                onClose={toggleFullscreen}
            >
                {children}
            </FullscreenModal>
        </>
    );
};

export default ECard;
