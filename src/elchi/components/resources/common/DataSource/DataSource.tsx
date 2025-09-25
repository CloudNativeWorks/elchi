import React, { useEffect, useState } from "react";
import { Col, Divider, Upload, Button, UploadProps } from 'antd';
import { useDispatch } from "react-redux";
import { HorizonTags } from "@/elchi/components/common/HorizonTags";
import { memorizeComponent, compareVeri } from "@/hooks/useMemoComponent";
import { ActionType, ResourceType } from "@/redux/reducer-helpers/common";
import { extractNestedKeys } from "@/utils/get-active-tags";
import { handleChangeResources } from "@/redux/dispatcher";
import { handleAddRemoveTags } from "@/elchi/helpers/tag-operations";
import { FieldConfigType, matchesEndOrStartOf } from "@/utils/tools";
import { Base64FromBytes } from "@/utils/typed-config-op";
import { UploadOutlined } from '@ant-design/icons';
import { navigateCases } from "@/elchi/helpers/navigate-cases";
import { ResourceAction } from "@/redux/reducers/slice";
import ECard from "@/elchi/components/common/ECard";
import { modtag_data_source } from "./_modtag_";
import { useTags } from "@/hooks/useTags";
import { generateFields } from "@/common/generate-fields";
import { FieldTypes } from "@/common/statics/general";
import { EForm } from "@/elchi/components/common/e-components/EForm";
import { EFields } from "@/elchi/components/common/e-components/EFields";
import { showErrorNotification, showSuccessNotification } from '@/common/notificationHandler';


type GeneralProps = {
    veri: {
        version: string;
        reduxStore: any;
        keyPrefix: string;
        tagPrefix: string;
        parentName: string;
        fileName: string;
        unsuportedTags?: string[];
        inlineStringType?: FieldTypes;
    }
};

const CommonComponentDataSource: React.FC<GeneralProps> = ({ veri }) => {
    const dispatch = useDispatch();
    const { vTags } = useTags(veri.version, modtag_data_source);
    const [selectedTags, setSelectedTags] = useState<string[]>(extractNestedKeys(veri.reduxStore));
    const [file, setFile] = useState<any>([])

    useEffect(() => {
        const selecTag = extractNestedKeys(veri.reduxStore)
        setSelectedTags(selecTag)
        const inlineByte = navigateCases(veri.reduxStore, 'specifier.inline_bytes')

        if (inlineByte) {
            setFile([{ name: veri.fileName, uid: "-1" }]);
        } else {
            setFile([]);
        }
    }, [veri.reduxStore, veri.fileName]);

    const handleChangeRedux = (keys: string, val: string | boolean | number) => {
        handleChangeResources({ version: veri.version, type: ActionType.Update, keys, val, resourceType: ResourceType.Resource }, dispatch, ResourceAction);
    };

    const handleDeleteRedux = (keys: string, val?: string | boolean | number) => {
        handleChangeResources({
            version: veri.version, type: ActionType.Delete, keys: `${veri.keyPrefix}.${keys}`, val, resourceType: ResourceType.Resource
        }, dispatch, ResourceAction);
    };

    const handleChangeTag = (keyPrefix: string, tagPrefix: string, tag: string, checked: boolean) => {
        handleAddRemoveTags(keyPrefix, tagPrefix, tag, checked, selectedTags, setSelectedTags, handleDeleteRedux);
    }

    const fieldConfigs: FieldConfigType[] = [
        ...generateFields({
            f: vTags.ds?.DataSource,
            sf: vTags.ds?.DataSource_SingleFields,
            sn: 24,
            rwr: { 'specifier.inline_string': veri.inlineStringType || FieldTypes.InputArea },
        }),
        { tag: "watched_directory.path", type: FieldTypes.String, additionalTags: ["watched_directory", "path"], fieldPath: 'watched_directory.path', spanNum: 24, navigate: true },
    ];

    const props: UploadProps = {
        name: 'file',
        maxCount: 1,
        fileList: file,
        beforeUpload: (file) => {
            const reader = new FileReader();
            reader.onload = e => {
                const base64String = Base64FromBytes(e.target?.result as ArrayBuffer);
                handleChangeRedux(`${veri.keyPrefix}.inline_bytes`, base64String)
            };
            reader.readAsArrayBuffer(file);

            return false;
        },
        onChange(info) {
            if (info.file.status === 'done') {
                showSuccessNotification('file uploaded successfully');
            } else if (info.file.status === 'error') {
                showErrorNotification('file not uploaded!');
            }
        },
    };

    return (
        <>
            <ECard title={veri.parentName}>
                <Col md={24}>
                    <HorizonTags veri={{
                        tags: vTags.ds?.DataSource,
                        selectedTags: selectedTags,
                        unsupportedTags: veri.unsuportedTags || [],
                        tagPrefix: 'specifier',
                        handleChangeTag: handleChangeTag,
                        onlyOneTag: [['specifier.filename', 'specifier.inline_string', 'specifier.environment_variable', 'specifier.inline_bytes']]
                    }} />
                    <Divider style={{ marginTop: '8px', marginBottom: '8px' }} type="horizontal" />
                    <EForm>
                        <EFields
                            fieldConfigs={fieldConfigs}
                            selectedTags={selectedTags}
                            handleChangeRedux={handleChangeRedux}
                            reduxStore={veri.reduxStore}
                            keyPrefix={veri.keyPrefix}
                            version={veri.version}
                        />
                        {matchesEndOrStartOf("specifier.inline_bytes", selectedTags) &&
                            <Upload {...props} key={"upload"}>
                                <Button icon={<UploadOutlined />}>Upload</Button>
                            </Upload>
                        }
                    </EForm>
                </Col>
            </ECard>
        </>
    )
};

export default memorizeComponent(CommonComponentDataSource, compareVeri);
