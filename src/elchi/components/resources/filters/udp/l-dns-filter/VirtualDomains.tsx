import React from "react";
import { Col, Row, Drawer, Button, Table, Space } from "antd";
import { navigateCases } from "@/elchi/helpers/navigate-cases";
import { ActionType, ResourceType } from "@/redux/reducer-helpers/common";
import { useDispatch } from "react-redux";
import type { ColumnsType } from 'antd/es/table';
import { handleChangeResources } from "@/redux/dispatcher";
import { memorizeComponent, compareVeri } from "@/hooks/useMemoComponent";
import { ResourceAction } from "@/redux/reducers/slice";
import { DeleteTwoTone, InboxOutlined } from '@ant-design/icons';
import ComponentDnsVirtualDomain from "./DnsVirtualDomain";
import { getDurationValueAsNumber } from "@/elchi/helpers/duration";
import ElchiButton from "@/elchi/components/common/ElchiButton";


type GeneralProps = {
    veri: {
        version: string;
        keyPrefix: string;
        drawerOpen: boolean;
        reduxStore: any;
        drawerClose: () => void;
    }
};

interface TableDataWithIndex {
    tableIndex: number;
}

const ComponentVirtualDomains: React.FC<GeneralProps> = ({ veri }) => {
    const dispatch = useDispatch();

    const columns: ColumnsType<TableDataWithIndex> = [
        {
            title: 'Name',
            width: "60%",
            key: 'name',
            render: (_, record) => { return navigateCases(record, "name") }
        },
        {
            title: 'TTL',
            width: "25%",
            key: 'answer_ttl',
            render: (_, record) => { return `${getDurationValueAsNumber(record?.["answer_ttl"], veri.version)}s` }
        },
        {
            title: 'Action',
            width: "15%",
            key: 'x',
            render: (_, __, index) =>
                <Button
                    icon={<DeleteTwoTone twoToneColor="#eb2f96" />}
                    size='small'
                    onClick={(e) => handleDelete(e, index)}
                    style={{ marginRight: 8 }}
                    iconPosition={"end"}
                />,
        },
    ];

    const handleDelete = (event: React.MouseEvent<HTMLElement>, index: any) => {
        const fullKey = `${veri.keyPrefix}.${index}`
        event.stopPropagation();
        handleChangeResources({ version: veri.version, type: ActionType.Delete, keys: fullKey, resourceType: ResourceType.Resource }, dispatch, ResourceAction);
    };

    const addResolver = () => {
        handleChangeResources({ keys: `${veri.keyPrefix}`, version: veri.version, type: ActionType.Append, val: {}, resourceType: ResourceType.Resource }, dispatch, ResourceAction);
    };

    return (
        <Drawer
            title={`Virtual Domains`}
            placement="right"
            closable={false}
            width={"60%"}
            open={veri.drawerOpen}
            onClose={veri.drawerClose}
            size='large'
        >
            <Row>
                <div style={{
                    background: 'var(--card-bg)',
                    padding: '4px 4px 12px 4px',
                    borderRadius: 12,
                    boxShadow: 'var(--shadow-sm)',
                    margin: '4px 0',
                    border: '1px solid var(--border-default)'
                }}>
                    <ElchiButton style={{ marginBottom: 10 }} onClick={addResolver} key={`button_${veri.keyPrefix}`} onlyText>Add Resolver</ElchiButton>

                    <Table
                        size="small"
                        scroll={{ y: "auto" }}
                        pagination={{ pageSize: 50 }}
                        rowClassName="cursor-row"
                        dataSource={Array.isArray(veri.reduxStore)
                            ? veri.reduxStore?.map((record, index) => ({
                                ...record,
                                tableIndex: index
                            }))
                            : []
                        }
                        columns={columns}
                        rowKey={(record) => record.tableIndex}
                        locale={{
                            emptyText: (
                                <div>
                                    <InboxOutlined style={{ fontSize: 48, marginBottom: 8 }} />
                                    <div>No Virtual Domains</div>
                                </div>
                            )
                        }}
                        expandable={{
                            expandRowByClick: true,
                            rowExpandable: () => true,
                            expandedRowRender: (record, index) => (
                                <Space direction="vertical" size="middle" style={{ display: 'flex' }}>
                                    <Col md={24}>
                                        <ComponentDnsVirtualDomain veri={{
                                            version: veri.version,
                                            reduxStore: record,
                                            keyPrefix: `${veri.keyPrefix}.${index}`,
                                            title: "Virtual Domain",
                                        }} />
                                    </Col>
                                </Space>
                            ),
                        }}
                    />
                </div>
            </Row>
            <ElchiButton onlyText style={{ marginTop: 15 }} onClick={() => veri.drawerClose()}>Close</ElchiButton>
        </Drawer>
    );
}
export default memorizeComponent(ComponentVirtualDomains, compareVeri);
