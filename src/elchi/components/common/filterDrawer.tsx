import { useState } from "react";
import { Divider, Drawer, Input, List, Modal, Select } from 'antd';
import { Extensions } from "@/common/types";
import ElchiButton from "./ElchiButton";


interface RenderFormItemProps {
    setOpen: any;
    open: boolean;
    dataQuery: Extensions[];
    extensions?: any[];
    addFilter: any;
    title: string;
    isTypedPerConfig: boolean;
    httpFilterMain?: any;
    parentName?: string;
    onSearch?: (value: string) => void;
}

export const FilterDrawer = ({ setOpen, open, dataQuery, extensions, addFilter, title, isTypedPerConfig, httpFilterMain, parentName, onSearch }: RenderFormItemProps) => {
    const [searchValue, setSearchValue] = useState('');
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedFilter, setSelectedFilter] = useState<string | null>(null);
    const [selectedItem, setSelectedItem] = useState<any>(null);

    const handleOk = () => {
        if (selectedItem && selectedFilter) {
            addFilter({
                name: selectedItem.name,
                gtype: selectedItem.gtype,
                priority: 0,
                category: selectedItem.category,
                canonical_name: selectedItem.canonical_name,
                parent_name: selectedFilter,
            });
        }
        setModalVisible(false);
    };

    const handleTypedConfigAction = (item: any) => {
        setSelectedItem(item);
        setModalVisible(true);
    };

    const handleAddFilterAction = (item: any) => {
        addFilter({
            name: item.name,
            gtype: item.gtype,
            priority: 0,
            category: item.category,
            canonical_name: item.canonical_name,
            collection: item.collection,
            type: item.type
        });
    };

    return (
        <>
            <Drawer
                title={title}
                placement="right"
                closable={false}
                onClose={() => setOpen(false)}
                open={open}
                size='large'
                zIndex={1950}
            >
                <Input
                    placeholder="Search"
                    value={searchValue}
                    onChange={e => {
                        const value = e.target.value;
                        setSearchValue(value);
                        if (onSearch) {
                            onSearch(value);
                        }
                    }}
                />
                <Divider type="horizontal"></Divider>
                <List
                    itemLayout="horizontal"
                    dataSource={onSearch ? dataQuery : dataQuery?.filter((item: Extensions) =>
                        item.name?.toLowerCase().includes(searchValue.toLowerCase()) ||
                        item.gtype?.toLowerCase().includes(searchValue.toLowerCase())
                    )}
                    size='small'
                    renderItem={(item: Extensions, index) => (
                        <List.Item
                            key={index}
                            actions={[
                                <ElchiButton
                                    onlyText={true}
                                    disabled={extensions?.some(
                                        reduxItem => reduxItem.name === item.name && (!parentName || reduxItem.parent_name.startsWith(parentName))
                                    )}
                                    key="list-loadmore-edit"
                                    onClick={() => {
                                        if (isTypedPerConfig) {
                                            handleTypedConfigAction(item)
                                        } else {
                                            handleAddFilterAction(item)
                                        }
                                    }}>
                                    Add
                                </ElchiButton>

                            ]}>
                            <List.Item.Meta
                                title={item.name}
                                description={item.gtype.replace('envoy.', '')}
                            />
                        </List.Item>
                    )}
                />
                <ElchiButton onlyText={true} style={{ marginTop: 15 }} onClick={() => setOpen(false)}> Close</ElchiButton>
            </Drawer >

            <Modal
                title="Typed Filter Per Route Key (Main HTTP Filter Name)"
                open={modalVisible}
                onOk={handleOk}
                onCancel={() => setModalVisible(false)}
                styles={{ mask: { backdropFilter: 'blur(10px)' }, wrapper: { zIndex: 1961 } }}
            >
                <Select
                    style={{ width: '100%' }}
                    onChange={(value) => setSelectedFilter(value)}
                    placeholder="Choose a filter"
                    optionLabelProp="label"
                    value={selectedFilter}
                    getPopupContainer={(trigger) => trigger.parentElement || document.body}
                    styles={{ popup: { root: { zIndex: 1971 } } }}
                >
                    {httpFilterMain?.filter((item: Extensions) => item?.canonical_name === selectedItem?.canonical_name).map((filter: any) => (
                        <Select.Option key={filter.name} value={filter.name} label={filter.name}>
                            <div>
                                <span>{filter.name}</span>
                                <br />
                                <small style={{ color: 'var(--text-tertiary)' }}>{filter.gtype.replace('envoy.', '')}</small>
                            </div>
                        </Select.Option>
                    ))}
                </Select>
            </Modal>
        </>
    );
};
