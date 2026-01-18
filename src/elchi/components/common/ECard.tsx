import React, { ReactNode, useState } from 'react';
import { Card, Button } from 'antd';
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
                            <SnippetSVG onClick={() => setSnippetDrawerOpen(true)} />
                        )}

                        {/* Fullscreen Button */}
                        <Button
                            className="ADDSVGContainer"
                            onClick={toggleFullscreen}
                            title="Toggle Fullscreen"
                        >
                            <FullscreenOutlined style={{ fontSize: 13 }} />
                        </Button>

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
