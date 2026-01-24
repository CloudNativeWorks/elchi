import { Anchor, Tag, Popover, List, Alert, Badge } from 'antd';
import { getHref, getMatchingPrefix, isOnlyOne, matchesEndOrStartOf, prettyTag, removePrefix } from "@/utils/tools";
import { InfoCircleTwoTone, VerticalAlignMiddleOutlined, WarningOutlined } from "@ant-design/icons";
import { compareResourceConfKeys, memorizeComponent } from "@/hooks/useMemoComponent";
import { AnchorLinkItemProps } from 'antd/es/anchor/Anchor';
import { InType } from '@/elchi/tags/tagsType';
import InfoBar, { InfoItem } from './InfoBar';
import { InfoTypes } from './InfoModal';


const { CheckableTag } = Tag;
interface RenderFormItemProps {
    resourceConfKeys: InType[] | undefined;
    handleChangeTag: any;
    selectedTags: string[];
    unsuportedTags?: string[];
    singleOptionKeys?: string[];
    headerOptionKeys?: string[];
    index?: number;
    tagMatchPrefix?: string;
    keyPrefix?: string;
    tagPrefix?: string;
    onlyOneTag?: string[][];
    lastUnionField?: string;
    specificTagPrefix?: Record<string, string>;
    hiddenTags?: string[];
    doNotChange?: string[];
    required?: string[];
    infoBar?: any;
    skipUnchangeble?: string[];
    unchangeableTags?: string[];
}

interface TagProps {
    tag: string;
    index: number;
    isChecked: boolean;
    UnchangeableTags: string[];
    keyPrefix?: string | null;
    newTagPrefix?: string;
    doNotChange?: string[];
    orginTag?: string;
    handleChangeTag: any;
    prettyTag: any;
    skipUnchangeble?: string[];
}

const TagComponent: React.FC<TagProps> = ({
    tag,
    index,
    isChecked,
    UnchangeableTags,
    keyPrefix,
    newTagPrefix,
    doNotChange,
    orginTag,
    handleChangeTag,
    prettyTag,
    skipUnchangeble
}) => {
    const isUnchangeable = UnchangeableTags?.includes(tag) && (!skipUnchangeble || !skipUnchangeble?.includes(tag));

    return (
        <CheckableTag
            key={`${tag}${index?.toString()}`}
            checked={isChecked}
            style={{
                background: isChecked ? 'linear-gradient(90deg, #056ccd 0%, #00c6fb 100%)' : undefined,
                color: isChecked ? '#fff' : undefined,
                border: undefined,
                fontWeight: isChecked ? 550 : 500,
                transition: 'all 0.18s'
            }}
            className={isUnchangeable ? "ellipsis-tag unchangeable-tag" : "ellipsis-tag"}
            onChange={(checked) => {
                if (!isUnchangeable) {
                    handleChangeTag(
                        keyPrefix || null,
                        newTagPrefix,
                        tag,
                        checked,
                        index,
                        doNotChange ? doNotChange.includes(orginTag!) : false
                    );
                }
            }}
        >
            {prettyTag(tag)}
        </CheckableTag>
    );
};


const CustomAnchor = ({
    resourceConfKeys,
    singleOptionKeys,
    headerOptionKeys,
    selectedTags,
    index,
    handleChangeTag,
    unsuportedTags,
    tagMatchPrefix,
    keyPrefix,
    tagPrefix = '',
    onlyOneTag,
    lastUnionField,
    specificTagPrefix,
    hiddenTags,
    doNotChange,
    required,
    infoBar,
    skipUnchangeble,
    unchangeableTags
}: RenderFormItemProps) => {
    const unsupportedTags: AnchorLinkItemProps[] = [];
    const supportedTags: AnchorLinkItemProps[] = [];

    const infoBars: InfoItem[] = [{
        title: "Config Info",
        icon: <InfoCircleTwoTone />,
        type: "primary",
        info_type: InfoTypes.FieldInfo,
        data: resourceConfKeys
    }, ...(infoBar ?? [])]

    const createAnchorLinkItem = (tag: string, isChecked: boolean, newTagPrefix: string | null, orginTag: string, isDeprecated: boolean) => {
        if (hiddenTags?.includes(tag)) { return null }
        let component: React.ReactNode;
        const href = getHref(tag, singleOptionKeys, headerOptionKeys, index);
        const hashLink = (
            <div
                key={index}
                onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();

                    const targetId = href;
                    const targetElement = document.getElementById(targetId);
                    if (targetElement) {
                        targetElement.scrollIntoView({
                            behavior: 'smooth',
                            block: 'center'
                        });

                        let cardElement = targetElement.closest('.ant-card') as HTMLElement;

                        if (!cardElement) {
                            cardElement = targetElement.querySelector('.ant-card') as HTMLElement;
                        }

                        if (!cardElement) {
                            let parent = targetElement.parentElement;
                            while (parent && !parent.classList.contains('ant-card')) {
                                parent = parent.parentElement;
                            }
                            cardElement = parent as HTMLElement;
                        }

                        if (cardElement) {
                            cardElement.style.transition = 'all 0.2s ease';
                            cardElement.style.boxShadow = '0 8px 24px rgba(24, 144, 255, 0.3)';
                            cardElement.style.transform = 'scale(1.02)';
                            cardElement.style.zIndex = '999';

                            setTimeout(() => {
                                cardElement.style.boxShadow = '';
                                cardElement.style.transform = '';
                                cardElement.style.zIndex = '';
                            }, 700);
                        } else {
                            targetElement.style.transition = 'all 0.2s ease';
                            targetElement.style.boxShadow = '0 8px 24px rgba(24, 144, 255, 0.3)';
                            targetElement.style.transform = 'scale(1.02)';
                            targetElement.style.zIndex = '999';

                            setTimeout(() => {
                                targetElement.style.boxShadow = '';
                                targetElement.style.transform = '';
                                targetElement.style.zIndex = '';
                            }, 700);
                        }
                    } else {
                        const elements = document.querySelectorAll(`[id*="${targetId}"]`);
                        if (elements.length > 0) {
                            const firstElement = elements[0] as HTMLElement;
                            firstElement.scrollIntoView({
                                behavior: 'smooth',
                                block: 'center'
                            });

                            let cardElement = firstElement.closest('.ant-card') as HTMLElement;

                            if (!cardElement) {
                                cardElement = firstElement.querySelector('.ant-card') as HTMLElement;
                            }

                            if (!cardElement) {
                                let parent = firstElement.parentElement;
                                while (parent && !parent.classList.contains('ant-card')) {
                                    parent = parent.parentElement;
                                }
                                cardElement = parent as HTMLElement;
                            }

                            if (cardElement) {
                                cardElement.style.transition = 'all 0.2s ease';
                                cardElement.style.boxShadow = '0 8px 24px rgba(24, 144, 255, 0.3)';
                                cardElement.style.transform = 'scale(1.02)';
                                cardElement.style.zIndex = '999';

                                setTimeout(() => {
                                    cardElement.style.boxShadow = '';
                                    cardElement.style.transform = '';
                                    cardElement.style.zIndex = '';
                                }, 700);
                            } else {
                                firstElement.style.transition = 'all 0.2s ease';
                                firstElement.style.boxShadow = '0 8px 24px rgba(24, 144, 255, 0.3)';
                                firstElement.style.transform = 'scale(1.02)';
                                firstElement.style.zIndex = '999';

                                setTimeout(() => {
                                    firstElement.style.boxShadow = '';
                                    firstElement.style.transform = '';
                                    firstElement.style.zIndex = '';
                                }, 700);
                            }
                        }
                    }
                }}

                style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            >
                <VerticalAlignMiddleOutlined />
            </div>
        );

        const prefixHandle = (
            <div style={{ width: '14px', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', marginRight: '4px' }}>
                {isChecked ? hashLink : null}
            </div>
        );

        if (isOnlyOne(orginTag, onlyOneTag, selectedTags)) {
            component = (
                <div className='arc-div-style' onClick={(e) => { e.stopPropagation(); e.preventDefault(); }}>
                    {prefixHandle}
                    <button
                        className='only-one-button'
                        onClick={(e) => { e.stopPropagation(); e.preventDefault(); }}
                    >
                        <Popover key={tag + index?.toString()}
                            content={
                                <div>
                                    <List
                                        size="small"
                                        dataSource={onlyOneTag?.find(tagGroup => tagGroup.includes(orginTag)) || []}
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
                            <Tag
                                className="ellipsis-tag unsupported-tags">
                                <span>{prettyTag(tag)}</span>
                            </Tag>
                        </Popover>
                    </button>
                </div>
            );

            supportedTags.push({
                key: tag + "_" + (index || "0"),
                href: "#",
                title: component,
            })
        } else {
            if (required?.includes(tag)) {
                component = (
                    <div className='elipsis-tag-main' onClick={(e) => { e.stopPropagation(); e.preventDefault(); }}>
                        {prefixHandle}
                        <button
                            className='elipsis-tag-span point-button'
                            onClick={(e) => { e.stopPropagation(); e.preventDefault(); }}
                        >
                            <Badge
                                status={isChecked ? undefined : "processing"}
                                color="var(--color-primary)"
                                dot
                                className='elipsis-tag-badge'
                                offset={[-3, 4]}
                                key={tag + index?.toString()}
                            >
                                <TagComponent
                                    key={tag + index?.toString()}
                                    tag={tag}
                                    index={index}
                                    isChecked={isChecked}
                                    UnchangeableTags={unchangeableTags}
                                    keyPrefix={keyPrefix}
                                    newTagPrefix={newTagPrefix}
                                    doNotChange={doNotChange}
                                    orginTag={orginTag}
                                    handleChangeTag={handleChangeTag}
                                    prettyTag={prettyTag}
                                    skipUnchangeble={skipUnchangeble}
                                />
                            </Badge>
                        </button>
                    </div>
                )
            } else if (isDeprecated) {
                component = (
                    <div className='arc-div-style' onClick={(e) => { e.stopPropagation(); e.preventDefault(); }}>
                        {prefixHandle}
                        <button
                            className='elipsis-tag-span point-button'
                            onClick={(e) => { e.stopPropagation(); e.preventDefault(); }}
                        >
                            <Badge
                                count={<WarningOutlined style={{ color: 'var(--color-warning)' }} />}
                                className='elipsis-tag-badge'
                                offset={[-9, 9]}
                                key={tag + index?.toString()}
                                title='Deprecated'
                            >
                                <TagComponent
                                    key={tag + index?.toString()}
                                    tag={tag}
                                    index={index}
                                    isChecked={isChecked}
                                    UnchangeableTags={unchangeableTags}
                                    keyPrefix={keyPrefix}
                                    newTagPrefix={newTagPrefix}
                                    doNotChange={doNotChange}
                                    orginTag={orginTag}
                                    handleChangeTag={handleChangeTag}
                                    prettyTag={prettyTag}
                                    skipUnchangeble={skipUnchangeble}
                                />
                            </Badge>
                        </button>
                    </div >
                )
            } else {
                component = (
                    <div className='arc-div-style' onClick={(e) => { e.stopPropagation(); e.preventDefault(); }}>
                        {prefixHandle}
                        <button
                            className='elipsis-tag-span norm-button'
                            onClick={(e) => { e.stopPropagation(); e.preventDefault(); }}
                        >
                            <TagComponent
                                key={tag + index?.toString()}
                                tag={tag}
                                index={index}
                                isChecked={isChecked}
                                UnchangeableTags={unchangeableTags}
                                keyPrefix={keyPrefix}
                                newTagPrefix={newTagPrefix}
                                doNotChange={doNotChange}
                                orginTag={orginTag}
                                handleChangeTag={handleChangeTag}
                                prettyTag={prettyTag}
                                skipUnchangeble={skipUnchangeble}
                            />
                        </button>
                    </div>
                )
            }

            supportedTags.push({
                key: tag + "_" + (index || "0"),
                href: "#",
                title: component
            })
        }
    };

    resourceConfKeys?.filter((originalTag: InType) => {
        return !originalTag.notImp && !unsuportedTags?.includes(originalTag.name);
    }).map((originalTag: InType) => {
        const parts = originalTag.name.split(".");
        const tag = parts[parts.length - 1];
        const orginTag = removePrefix(originalTag.name, tagMatchPrefix)
        const isChecked = matchesEndOrStartOf(orginTag, selectedTags)
        const prefixesToMatch = [tagPrefix];

        if (lastUnionField) {
            prefixesToMatch.push(`${tagPrefix}.${lastUnionField}`);
        }

        let newTagPrefix = getMatchingPrefix(orginTag, prefixesToMatch, tag);
        if (specificTagPrefix?.[tag]) {
            newTagPrefix = tagPrefix ? `${tagPrefix}.${specificTagPrefix[tag]}` : specificTagPrefix[tag];
        }

        createAnchorLinkItem(tag, isChecked, newTagPrefix, orginTag, originalTag.isDeprecated);
    });

    return (
        <>
            {<InfoBar Infos={infoBars} />}
            <Anchor
                replace
                affix={false}
                style={{ marginRight: 5 }}
                direction="vertical"
                items={[...supportedTags, ...unsupportedTags]}
            />
        </>
    )
};

export default memorizeComponent(CustomAnchor, compareResourceConfKeys);
