import React, { ReactNode, useState } from 'react';
import { Card } from 'antd';
import { CollapseSVG, ExpandSVG } from '@/assets/svg/icons';


interface CustomCardProps {
    children?: ReactNode;
    title: string;
    [key: string]: any;
}

const ECard: React.FC<CustomCardProps> = ({ children, title, ...props }) => {
    const [expanded, setExpanded] = useState(true);
    const toggleExpand = () => {
        setExpanded(!expanded);
    };

    return (
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
                <div style={{ display: 'flex', alignItems: 'center' }}>
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
        </Card >
    );
};

export default ECard;
