import React from "react";
import { Col, Row, Drawer, Button, Divider, Table, Space } from "antd";
import { navigateCases } from "@/elchi/helpers/navigate-cases";
import { ActionType, ResourceType } from "@/redux/reducer-helpers/common";
import { useDispatch } from "react-redux";
import type { ColumnsType } from 'antd/es/table';
import { handleChangeResources } from "@/redux/dispatcher";
import { memorizeComponent, compareVeri } from "@/hooks/useMemoComponent";
import { ResourceAction } from "@/redux/reducers/slice";
import { DeleteTwoTone, InboxOutlined } from '@ant-design/icons';
import CommonComponentSocketAddress from "@/elchi/components/resources/common/Address/socket_address";
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

const ComponentResolvers: React.FC<GeneralProps> = ({ veri }) => {
    const dispatch = useDispatch();

    const columns: ColumnsType<TableDataWithIndex> = [
        {
            title: 'Address',
            width: "40%",
            key: 'address',
            render: (_, record) => { return navigateCases(record, "address.socket_address.address") }
        },
        {
            title: 'Port',
            width: "20%",
            key: 'port_value',
            render: (_, record) => { return navigateCases(record, "address.socket_address.port_specifier.port_value") }
        },
        {
            title: 'Protocol',
            width: "20%",
            key: 'protocol',
            render: (_, record) => { return navigateCases(record, "address.socket_address.protocol") }
        },
        {
            title: 'Action',
            width: "20%",
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
            title={`Resolvers`}
            placement="right"
            closable={false}
            width={"60%"}
            open={veri.drawerOpen}
            onClose={veri.drawerClose}
            size='large'
        >
            <ElchiButton onlyText onClick={() => addResolver()} size="small">
                Add Resolver
            </ElchiButton>
            <Divider type="horizontal" />
            <Row>
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
                                <div>No Resolvers</div>
                            </div>
                        )
                    }}
                    expandable={{
                        expandRowByClick: true,
                        rowExpandable: () => true,
                        expandedRowRender: (record, index) => (
                            <Space direction="vertical" size="middle" style={{ display: 'flex' }}>
                                <Col md={24}>
                                    <CommonComponentSocketAddress veri={{
                                        version: veri.version,
                                        reduxStore: navigateCases(record, "address.socket_address"),
                                        keyPrefix: `${veri.keyPrefix}.${index}.socket_address`,
                                        unsupportedAddressTag: [],
                                        unsupportedSocketAddressTag: []
                                    }} />
                                </Col>
                            </Space>
                        ),
                    }}
                />
            </Row>
            <ElchiButton onlyText style={{ marginTop: 15 }} onClick={() => veri.drawerClose()}>Close</ElchiButton>
        </Drawer>
    );
}
export default memorizeComponent(ComponentResolvers, compareVeri);
