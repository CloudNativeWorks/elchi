import React, { useEffect, useState, useCallback } from "react";
import { Col, Form, Row, Select } from 'antd';
import { useDispatch } from "react-redux";
import { useCustomGetQuery } from "@/common/api";
import { ConfDiscovery } from "@/common/types";
import { ActionType, ResourceType } from "@/redux/reducer-helpers/common";
import { DeltaGrpcConfigSource } from "@/common/statics/config-source-ads";
import { compareVeri, memorizeComponent } from "@/hooks/useMemoComponent";
import { ResourceAction } from "@/redux/reducers/slice";
import { useProjectVariable } from "@/hooks/useProjectVariable";
import ECard from "../../common/ECard";
import { debounce } from "lodash";


type GeneralProps = {
    veri: {
        version: string;
        vhds: any;
        reduxStore: ConfDiscovery[];
        reduxAction: any;
        disabled?: boolean;
        routeName: string | undefined;
        keyPrefix: string | undefined;
    }
};

const Vhds: React.FC<GeneralProps> = ({ veri }) => {
    const dispatch = useDispatch();
    const { project } = useProjectVariable();

    const [searchQuery, setSearchQuery] = useState<string>('');
    const debouncedSearch = useCallback(debounce((value: string) => setSearchQuery(value), 300), []);

    const { data: queryData } = useCustomGetQuery({
        queryKey: `custom_vhds_${searchQuery}`,
        enabled: true,
        path: `custom/resource_list_search?collection=virtual_hosts&type=virtual_host&version=${veri.version}&project=${project}&search=${searchQuery}`
    });


    const handleConfigDiscovery = (vhdsName: string) => {
        const filteredItem = queryData.find(item => item.name === vhdsName);
        if (!filteredItem) return;

        const newExtension = {
            name: filteredItem.name,
            gtype: filteredItem.gtype,
            priority: 0,
            category: "virtual_host",
            canonical_name: filteredItem.canonical_name,
            parent_name: veri.routeName
        };

        const updatedConfigDiscovery = [...veri.reduxStore];
        let parentNameIndex = updatedConfigDiscovery.findIndex(item => item.parent_name === veri.routeName);

        if (parentNameIndex !== -1) {
            updatedConfigDiscovery[parentNameIndex] = newExtension

        } else {
            updatedConfigDiscovery.push(newExtension);
            parentNameIndex = updatedConfigDiscovery.length - 1;
        }

        handleChange(updatedConfigDiscovery, parentNameIndex);
    };

    const handleChange = (updatedConfigDiscovery: any, index: number) => {
        dispatch(ResourceAction({
            version: veri.version,
            type: ActionType.Update,
            keys: [`${index}`],
            val: updatedConfigDiscovery[index],
            resourceType: ResourceType.ConfigDiscovery
        }));

        if (!veri.vhds) {
            const key = veri.keyPrefix ? [veri.keyPrefix, "vhds"] : ["vhds"];
            dispatch(veri.reduxAction({ version: veri.version, type: ActionType.Update, keys: key, val: DeltaGrpcConfigSource, resourceType: ResourceType.Resource }));
        }
    };

    useEffect(() => {
        const vhdsItemIndex = veri.reduxStore?.findIndex((item: any) => item.category === 'virtual_host');
        if (vhdsItemIndex === -1) {
            return;
        }

        const vhdsItem = veri.reduxStore[vhdsItemIndex];
        if (vhdsItem.parent_name === veri.routeName) {
            return;
        }

        const updatedConfigDiscovery = [...veri.reduxStore];
        updatedConfigDiscovery[vhdsItemIndex] = {
            ...vhdsItem,
            parent_name: veri.routeName
        };

        handleChange(updatedConfigDiscovery, vhdsItemIndex);
    }, [veri.routeName, veri.reduxStore]);

    return (
        <ECard title={"VHDS"} >
            <Row>
                <Col md={24}>
                    <Form
                        labelCol={{ span: 24 }}
                        wrapperCol={{ span: 24 }}
                        layout="vertical"
                        size="small"
                        disabled={veri.disabled}
                        style={{ maxWidth: "100%" }}
                    >
                        <Form.Item required label={<div className="smoothAnimation">vhds</div>} style={{ display: 'inline-block', width: 'calc(33% - 8px)' }}>
                            <Select
                                size="small"
                                showSearch
                                placeholder={"vhds"}
                                value={
                                    veri.reduxStore
                                        .find(item => item.category === "virtual_host")?.name || undefined
                                }
                                onChange={(val) => handleConfigDiscovery(val)}
                                onSearch={debouncedSearch}
                                filterOption={false}
                                options={
                                    (queryData ? queryData.map((item: { name: string }) => item.name) : []).map((option: string) => ({
                                        value: option,
                                        label: option,
                                    }))
                                }
                            />
                        </Form.Item>
                    </Form>
                </Col>
            </Row>
        </ECard>
    )
};

export default memorizeComponent(Vhds, compareVeri);


