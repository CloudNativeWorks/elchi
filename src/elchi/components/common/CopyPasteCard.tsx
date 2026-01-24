import React, { ReactNode, useState } from 'react';
import { Card, Dropdown, message, Button } from 'antd';
import { FullscreenOutlined } from '@ant-design/icons';
import { CopySVG, CollapseSVG, ExpandSVG, SnippetSVG } from '@/assets/svg/icons';
import { CopyPaste, cpItems } from '@/utils/copy-paste-tool';
import { useCustomMessage } from '@/common/message';
import { SnippetDrawer } from '@/elchi/snippets/components/SnippetDrawer';
import FullscreenModal from './FullscreenModal';


interface CustomCardProps {
    children?: ReactNode;
    reduxStore: any;
    title: string;
    Paste: any;
    ctype: string;
    toJSON: any;
    keys?: string;
    version?: string;  // Add version prop for snippets
    [key: string]: any;
}

const CCard: React.FC<CustomCardProps> = ({ children, reduxStore, title, ctype, keys, Paste, toJSON, version, ...props }) => {
    const [messageApi, contextHolder] = message.useMessage();
    const { successMessage, errorMessage } = useCustomMessage(messageApi);
    const [expanded, setExpanded] = useState(true);
    const [snippetDrawerOpen, setSnippetDrawerOpen] = useState(false);
    const [fullscreen, setFullscreen] = useState(false);

    const toggleExpand = () => {
        setExpanded(!expanded);
    };

    const toggleFullscreen = () => {
        setFullscreen(!fullscreen);
    };

    const onCopyPaste = (e: any) => {
        let JObject: any;
        if (Array.isArray(reduxStore)) {
            JObject = reduxStore.map(item => toJSON(item));
        } else if (reduxStore !== undefined) {
            JObject = toJSON(reduxStore)
        }

        CopyPaste(JObject, e.key, keys || "", Paste, ctype, successMessage, errorMessage);
    }

    return (
        <>{contextHolder}
            <Card size="small"
                style={{
                    width: "100%",
                    marginBottom: "8px"
                }}
                styles={{
                    body: { padding: expanded ? '8px' : '0px', minHeight: '8px' }
                }} {...props}
                extra={
                    <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                        {/* Copy/Paste Menu */}
                        <Dropdown menu={{ items: cpItems, onClick: (e) => onCopyPaste(e) }} trigger={['click']}>
                            <span style={{ display: 'inline-flex', cursor: 'pointer' }}>
                                <CopySVG />
                            </span>
                        </Dropdown>

                        {/* Snippet Button */}
                        {version && (
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
                        {expanded ? <CollapseSVG onClick={toggleExpand} /> : <ExpandSVG onClick={toggleExpand} />}
                    </div>
                }
                title={
                    <Dropdown menu={{ items: cpItems, onClick: (e) => onCopyPaste(e) }} trigger={['contextMenu']}>
                        <div>
                            {title}
                        </div>
                    </Dropdown>
                }
            >
                {expanded && (
                    children
                )}
            </Card >

            {/* Snippet Drawer */}
            {version && (
                <SnippetDrawer
                    open={snippetDrawerOpen}
                    onClose={() => setSnippetDrawerOpen(false)}
                    ctype={ctype}
                    keys={keys}
                    title={title}
                    reduxStore={reduxStore}
                    toJSON={toJSON}
                    onApply={Paste}
                    version={version}
                    gtype={reduxStore?.$type || (Array.isArray(reduxStore) ? reduxStore[0]?.$type : ctype)}
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

export default CCard;
