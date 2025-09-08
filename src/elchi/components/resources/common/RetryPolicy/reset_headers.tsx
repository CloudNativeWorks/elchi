import React, { useState } from "react";
import { Input, Form, Button, List, Drawer, Select } from 'antd';
import { PlusOutlined, DeleteTwoTone } from "@ant-design/icons";
import { useDispatch } from "react-redux";
import { ActionType, ResourceType } from "@/redux/reducer-helpers/common";
import { handleChangeResources } from "@/redux/dispatcher";
import { modtag_reset_header } from "./_modtag_";
import { useTags } from "@/hooks/useTags";
import { EForm } from "@/elchi/components/common/e-components/EForm";


type GeneralProps = {
    veri: {
        version: string;
        keyPrefix: string;
        drawerOpen: boolean;
        reduxStore: any[] | undefined;
        reduxAction: any;
        drawerClose: () => void;
    }
};

const ResetHeaders: React.FC<GeneralProps> = ({ veri }) => {
    const dispatch = useDispatch();
    const { vTags } = useTags(veri.version, modtag_reset_header);
    const [headerName, setHeaderName] = useState<string | null>(null);
    const [headerFormat, setHeaderFormat] = useState<any>();

    const addHeader = () => {
        const resHeader: any = {
            name: headerName, format: headerFormat
        }
        handleChangeResources({ version: veri.version, type: ActionType.Append, keys: veri.keyPrefix, val: resHeader, resourceType: ResourceType.Resource }, dispatch, veri.reduxAction);
    };

    const removeHeader = (index: number) => {
        handleChangeResources({ version: veri.version, type: ActionType.Delete, keys: `${veri.keyPrefix}.${index.toString()}`, resourceType: ResourceType.Resource }, dispatch, veri.reduxAction);
    };

    const header_format = vTags.rh?.RetryPolicy_ResetHeader?.filter(item => item.name === "format")?.[0]?.enums || [];
    return (
        <Drawer
            title="Reset Headers"
            placement="right"
            closable={false}
            onClose={veri.drawerClose}
            open={veri.drawerOpen}
            size='large'
            width={900}
        /* zIndex={1} */
        >
            <EForm>
                <Form.Item
                    label={"name"}
                    style={{ display: "inline-block", width: `calc(${45}% )` }}
                    required
                >
                    <Input
                        onChange={(e) => {
                            setHeaderName(e.target.value)
                        }}
                        placeholder={"header name eg: path"}
                    />
                </Form.Item>
                <Form.Item
                    required
                    label={"format"}
                    style={{ display: "inline-block", width: `calc(${45}% )` }}
                >
                    <Select
                        size="small"
                        onChange={(val) => {
                            setHeaderFormat(val)
                        }}
                        options={header_format.map(item => ({
                            value: item,
                            label: item
                        }))}
                    />
                </Form.Item>
                <Form.Item
                    label={"Add"}
                    style={{ display: "inline-block", width: `calc(${10}% )` }}
                >
                    <Button type="dashed" icon={<PlusOutlined />} size={"small"} onClick={addHeader} style={{ marginBottom: 7 }} />
                </Form.Item>
            </EForm>
            <List
                itemLayout="horizontal"
                dataSource={veri.reduxStore}
                size='small'
                renderItem={(item: any, index) => (
                    <List.Item
                        actions={[
                            <Button
                                key={"btn_ " + index.toString()}
                                icon={<DeleteTwoTone twoToneColor="#eb2f96" />}
                                size='small'
                                onClick={() => { removeHeader(index) }}
                                iconPosition={"end"}
                            />
                        ]}
                    >
                        <List.Item.Meta
                            title={item.name}
                            description={item.format}
                        />
                    </List.Item>
                )}
            />
            <Button style={{ marginTop: 15 }} onClick={() => veri.drawerClose()}>Close</Button>
        </Drawer>
    )
};

export default ResetHeaders;
