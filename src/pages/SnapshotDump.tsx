import React, { useState } from "react";
import { Button, Row } from "antd";
import JsonView from "react18-json-view";
import { useCustomGetQuery } from "@/common/api";
import { useProjectVariable } from "@/hooks/useProjectVariable";
import { useParams, useSearchParams } from "react-router-dom";
import 'react18-json-view/src/style.css';


const SnapshotDump: React.FC = () => {
    const { project } = useProjectVariable();
    const { listenerName } = useParams();
    const [searchParams] = useSearchParams();
    const version = searchParams.get('version');
    const { data: dataQuery } = useCustomGetQuery({
        queryKey: `querysnapshotfor_${listenerName}`,
        enabled: true,
        path: `bridge/stats/${listenerName}:${project}?version=${version}`,
    });

    const [isCollapsed, setIsCollapsed] = useState<number | boolean>(4);
    const toggleCollapse = () => {
        setIsCollapsed(isCollapsed === 4 ? false : 4);
    };

    return (
        <Row>
            <Button onClick={toggleCollapse} style={{ marginBottom: '10px' }}>
                {isCollapsed === 4 ? 'Expand All' : 'Collapse All'}
            </Button>
            <JsonView
                src={dataQuery}
                style={{ width: '100%', minHeight: '100px', background: '#e6f7fc', padding: '10px' }}
                theme="winter-is-coming"
                collapsed={isCollapsed}
            />
        </Row>
    );
}

export default SnapshotDump;