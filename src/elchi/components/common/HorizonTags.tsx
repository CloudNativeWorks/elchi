import React, { useState } from "react";
import { Alert, Badge, Button, Card, List, Popover, Tag } from 'antd';
import { matchesEndOrStartOf, prettyTag, removePrefix, getMatchingPrefix } from "@/utils/tools";
import { compareVeri, memorizeComponent } from "@/hooks/useMemoComponent";
import { InType } from "../../tags/tagsType";
import { InfoCircleOutlined } from '@ant-design/icons';
import InfoModal, { InfoTypes } from "./InfoModal";


const { CheckableTag } = Tag;
type FormItemProps = {
    veri: {
        tags: InType[];
        selectedTags: string[];
        unsupportedTags?: string[];
        hiddenTags?: string[];
        index?: number;
        handleChangeTag: any;
        tagPrefix?: string;
        keyPrefix?: string;
        tagMatchPrefix?: string;
        lastUnionField?: string;
        tagLastUnion?: string;
        doNotChange?: string[];
        onlyOneTag?: string[][];
        specificTagPrefix?: Record<string, string>;
        required?: string[];
    }
};

const MemorizedHorizonTags = ({ veri }: FormItemProps) => {
    const unsupportedTags: React.ReactNode[] = [];
    const supportedTags: React.ReactNode[] = [];
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

    const isOnlyOne = (originTag: string) => {
        let relatedGroup;
        for (const tagGroup of veri.onlyOneTag || []) {
            if (tagGroup.includes(originTag)) {
                relatedGroup = tagGroup;
                break;
            }
        }

        if (!relatedGroup) return false;
        return relatedGroup.some(t => {
            if (t === originTag) return false;
            return veri.selectedTags?.some(selectedTag => {
                if (selectedTag === t && selectedTag !== originTag) {
                    return true;
                }
                if (selectedTag.startsWith(t) && selectedTag.length > t.length && selectedTag[t.length] === '.' && selectedTag !== originTag) {
                    return true;
                }
                return false;
            });
        });
    };

    const updatedTags = veri.tags
        ?.filter((originalTag: InType) => {
            return !originalTag.notImp && !veri.unsupportedTags?.includes(originalTag.name);
        }).map((originalTag: InType) => {
            const parts = originalTag.name.split(".");
            const tag = parts[parts.length - 1];
            const originTag = removePrefix(originalTag.name, veri.tagMatchPrefix)
            const isChecked = matchesEndOrStartOf(originTag, veri.selectedTags)

            const prefixesToMatch = [veri.tagPrefix];
            if (veri.lastUnionField) {
                prefixesToMatch.push(`${veri.tagPrefix}.${veri.lastUnionField}`);
            }

            let newTagPrefix = getMatchingPrefix(originTag, prefixesToMatch, tag);
            if (veri.specificTagPrefix?.[tag]) {
                newTagPrefix = veri.tagPrefix ? `${veri.tagPrefix}.${veri.specificTagPrefix[tag]}` : veri.specificTagPrefix[tag]
            }
            return { originTag, isChecked, tag, newTagPrefix };
        });

    updatedTags?.map(({ originTag, isChecked, tag, newTagPrefix }) => {
        if (veri.hiddenTags?.includes(tag)) { return null }
        let component: React.ReactNode;

        if (isOnlyOne(originTag)) {
            component = (
                <Popover key={tag + veri.index?.toString()}
                    content={
                        <div>
                            <List
                                size="small"
                                dataSource={
                                    veri.onlyOneTag?.find(tagGroup => tagGroup.includes(originTag)) || []
                                }
                                renderItem={(item) => <List.Item>{prettyTag(item.split('.').pop())}</List.Item>}
                            />
                        </div>
                    }
                    title={
                        <Alert
                            message="You can select only one tag at a time from this group."
                            type="info"
                            showIcon
                        />
                    }>
                    <Tag style={{ marginBottom: 3 }} className={"unsupperted-tags-horizon"}><span>{prettyTag(tag)}</span></Tag>
                </Popover>
            );
            supportedTags.push(component)
        } else {
            component = (
                <CheckableTag
                    style={{
                        background: isChecked ? 'linear-gradient(90deg, #056ccd 0%, #00c6fb 100%)' : undefined,
                        color: isChecked ? '#fff' : undefined,
                        border: "0.5px solid rgb(214, 214, 214)",
                        fontWeight: isChecked ? 550 : 500,
                        transition: 'all 0.10s',
                        marginBottom: 3,
                        cursor: veri.doNotChange?.includes(originTag) ? 'not-allowed' : 'pointer'
                    }}
                    key={tag + veri.index?.toString()}
                    checked={isChecked}
                    onChange={(checked) => {
                        veri.handleChangeTag(
                            veri.keyPrefix ? veri.keyPrefix : null,
                            newTagPrefix,
                            tag,
                            checked,
                            veri.index,
                            veri.doNotChange ? veri.doNotChange.includes(originTag) : false
                        )
                    }} >
                    {prettyTag(tag)}
                </CheckableTag>
            )
            if (veri.required?.includes(tag)) {
                component = (
                    <Badge
                        status={isChecked ? undefined : "processing"}
                        color="linear-gradient(90deg, #056ccd 0%, #00c6fb 100%)"
                        dot
                        offset={[-6, 1]} key={tag + veri.index?.toString()}>
                        {component}
                    </Badge>
                )
            }
            supportedTags.push(component)
        }
    })

    return (
        <>
            <div className="ag-courses_box">
                <div className="ag-courses_item">
                    <div className="ag-courses-item_link">
                        <div className="ag-courses-item_bg"></div>
                        <Card size="small" styles={{ body: { padding: 1, width: '100%' } }} style={{ zIndex: 4, width: '100%', alignItems: 'center', borderLeft: 'none', borderRight: 'none' }}>
                            <div className="grid-container">
                                <div className="tags-container">
                                    {[...supportedTags, ...unsupportedTags]}
                                </div>
                                <div className="info-button">
                                    <Button icon={<InfoCircleOutlined />} type="text" onClick={() => setIsModalOpen(true)} />
                                </div>
                            </div>
                        </Card>
                    </div>
                </div>
            </div>
            <InfoModal
                isOpen={isModalOpen}
                infoType={InfoTypes.FieldInfo}
                data={veri.tags}
                onClose={() => setIsModalOpen(false)}
            />
        </>
    )
};

export const HorizonTags = memorizeComponent(MemorizedHorizonTags, compareVeri);
