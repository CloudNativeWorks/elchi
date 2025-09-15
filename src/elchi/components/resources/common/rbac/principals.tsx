import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { Divider, Button, Table, Modal, Input, Select } from "antd";
import { ActionType, ResourceType } from "@/redux/reducer-helpers/common";
import { handleChangeResources } from "@/redux/dispatcher";
import { compareVeriReduxStoreOnly, memorizeComponent } from "@/hooks/useMemoComponent";
import type { ColumnsType } from 'antd/es/table';
import { ResourceAction } from "@/redux/reducers/slice";
import { AddSVG, AddIpSVG } from "@/assets/svg/icons";
import { DeleteTwoTone, InboxOutlined } from '@ant-design/icons';
import ECard from "@/elchi/components/common/ECard";
import ComponentPrincipal from "./principal";
import { useModels } from "@/hooks/useModels";
import { modtag_rbac_principal } from "./_modtag_";


type GeneralProps = {
    veri: {
        version: string;
        keyPrefix: string;
        reduxStore: any[] | undefined;
    }
};

interface VirtualHostWithIndex {
    tableIndex: number;
    [key: string]: any;
}

const ComponentPrincipals: React.FC<GeneralProps> = ({ veri }) => {
    const dispatch = useDispatch();
    const [dataSource, setDataSource] = useState<VirtualHostWithIndex[]>([]);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [ipInput, setIpInput] = useState<string>("");
    const [ipType, setIpType] = useState<string>("direct_remote_ip");
    const { vModels } = useModels(veri.version, modtag_rbac_principal);

    // Snippet apply fonksiyonu - ECard için uygun format  
    const handleApplySnippet = (keys: string, data: any) => {
        handleChangeResources({
            version: veri.version,
            type: ActionType.Update,
            keys: keys,
            val: data,
            resourceType: ResourceType.Resource
        }, dispatch, ResourceAction);
    };


    useEffect(() => {
        if (Array.isArray(veri.reduxStore)) {
            const updatedData = veri.reduxStore?.map((data: any, index: number) => ({
                ...data,
                tableIndex: index,
            }));
            setDataSource(updatedData);
        }
    }, [veri.reduxStore]);

    const handleDeleteRedux = ({ index, event }: { keys?: string, index?: number, event?: React.MouseEvent<HTMLElement> }) => {
        if (event) { event.stopPropagation(); }
        const fullKey = veri.keyPrefix ? `${veri.keyPrefix}.${index}` : `${index}`;
        handleChangeResources({ version: veri.version, type: ActionType.Delete, keys: fullKey, resourceType: ResourceType.Resource }, dispatch, ResourceAction);
    };

    const addPermission = () => {
        handleChangeResources({
            version: veri.version,
            type: ActionType.Append,
            keys: veri.keyPrefix,
            val: { any: true },
            resourceType: ResourceType.Resource
        }, dispatch, ResourceAction);
    };

    const handleAddIPs = () => {
        setIsModalVisible(true);
    };

    const handleOk = () => {
        const ipList = ipInput
            .split(/[\n,]+/)
            .map(ip => ip.trim())
            .filter(ip => ip);
    
        const ipObjects = ipList.map(ip => {
            const [address, prefix] = ip.includes("/") ? ip.split("/") : [ip, "32"];
            return {
                [ipType]: {
                    address_prefix: address.trim(),
                    prefix_len: parseInt(prefix, 10)
                }
            };
        });
    
        ipObjects.forEach(ipObject => {
            handleChangeResources({
                version: veri.version,
                type: ActionType.Append,
                keys: veri.keyPrefix,
                val: ipObject,
                resourceType: ResourceType.Resource
            }, dispatch, ResourceAction);
        });
    
        setIsModalVisible(false);
        setIpInput("");
        setIpType("direct_remote_ip");
    };

    const handleCancel = () => {
        setIsModalVisible(false);
        setIpInput("");
    };

    const columns: ColumnsType<VirtualHostWithIndex> = [
        {
            title: 'Name',
            width: "90%",
            key: 'name',
            render: () => { return "Principal" }
        },
        {
            title: 'Delete',
            width: "10%",
            key: 'x',
            render: (_, __, index) =>
                <Button
                    icon={<DeleteTwoTone twoToneColor="#eb2f96" />}
                    size='small'
                    onClick={(e) => handleDeleteRedux({ event: e, index: index })}
                    style={{ marginRight: 8 }}
                    iconPosition={"end"}
                />,
        },
    ];

    return (
        <ECard 
            title={"Principals"}
            reduxStore={veri.reduxStore}
            ctype="rbac_principals"
            toJSON={vModels.rprp?.Principal.toJSON}
            onApply={handleApplySnippet}
            keys={veri.keyPrefix}
            version={veri.version}
        >
            <div style={{ display: "flex", alignItems: "center", gap: "5px", marginBottom: 5 }}>
                <AddSVG onClick={() => addPermission()} />
                <AddIpSVG onClick={() => handleAddIPs()} />
            </div>
            <Divider type="horizontal" style={{ marginBottom: 3, marginTop: -1 }} />
            <Table
                size="small"
                scroll={{ y: 950 }}
                pagination={false}
                rowClassName="cursor-row"
                dataSource={dataSource}
                columns={columns}
                rowKey={(record) => `item-${record.tableIndex}`}
                locale={{
                    emptyText: (
                        <div>
                            <InboxOutlined style={{ fontSize: 48, marginBottom: 8 }} />
                            <div>No Principals</div>
                        </div>
                    )
                }}
                expandable={{
                    fixed: true,
                    expandRowByClick: true,
                    expandedRowRender: (data, index) => expandedRowRenderFunction(data, index, veri)
                }}
            />
            <Modal
                title="Add IPs"
                open={isModalVisible}
                onOk={handleOk}
                onCancel={handleCancel}
                okText="Add"
                cancelText="Cancel"
            >
                <Select
                    style={{ width: '100%', marginBottom: '10px' }}
                    value={ipType}
                    onChange={(value) => setIpType(value)}
                    options={[{
                        label: "Source IP",
                        value: "source_ip"
                    }, {
                        label: "Direct Remote IP",
                        value: "direct_remote_ip"
                    }, {
                        label: "Remote IP",
                        value: "remote_ip"
                    }]}
                />
                <Input.TextArea
                    rows={4}
                    value={ipInput}
                    onChange={(e) => setIpInput(e.target.value)}
                    placeholder="Enter IPs (e.g., 192.168.1.1/24, 192.168.1.2)"
                />
            </Modal>
        </ECard>
    )
}

memorizeComponent(ComponentPrincipal, compareVeriReduxStoreOnly);
export default ComponentPrincipals;

const expandedRowRenderFunction = (data: any, index: number, veri: any) => {
    return (
        <ComponentPrincipal
            veri={{
                version: veri.version,
                reduxStore: data,
                keyPrefix: `${veri.keyPrefix}.${index}`,
                title: "Principal",
            }}
        />
    );
};