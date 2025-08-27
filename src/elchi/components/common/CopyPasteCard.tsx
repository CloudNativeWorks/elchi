import React, { ReactNode, useState } from 'react';
import { Card, Dropdown, message } from 'antd';
import { CopySVG, CollapseSVG, ExpandSVG } from '@/assets/svg/icons';
import { CopyPaste, cpItems } from '@/utils/copy-paste-tool';
import { useCustomMessage } from '@/common/message';


interface CustomCardProps {
    children?: ReactNode;
    reduxStore: any;
    title: string;
    Paste: any;
    ctype: string;
    toJSON: any;
    keys?: string;
    [key: string]: any;
}

const CCard: React.FC<CustomCardProps> = ({ children, reduxStore, title, ctype, keys, Paste, toJSON, ...props }) => {
    const [messageApi, contextHolder] = message.useMessage();
    const { successMessage, errorMessage } = useCustomMessage(messageApi);
    const [expanded, setExpanded] = useState(true);

    const toggleExpand = () => {
        setExpanded(!expanded);
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
        <Card size="small"
            style={{
                width: "100%",
                marginBottom: "8px"
            }}
            styles={{
                body: { padding: expanded ? '8px' : '0px', minHeight: '8px' }
            }} {...props}
            extra={
                <div style={{ display: 'flex', alignItems: 'center' }}>
                    <Dropdown menu={{ items: cpItems, onClick: (e) => onCopyPaste(e) }} trigger={['click']}>
                        <div style={{ marginTop: 5 }}>
                            <CopySVG />
                        </div>
                    </Dropdown>
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
            {contextHolder}
            {expanded && (
                children
            )}
        </Card >
    );
};

export default CCard;
