import React, { useEffect, useState } from "react";
import { Col, Divider, Upload, Button, UploadProps } from 'antd';
import { useDispatch } from "react-redux";
import { HorizonTags } from "@/elchi/components/common/HorizonTags";
import { ActionType, ResourceType } from "@/redux/reducer-helpers/common";
import { extractNestedKeys } from "@/utils/get-active-tags";
import { handleChangeResources } from "@/redux/dispatcher";
import { handleAddRemoveTags } from "@/elchi/helpers/tag-operations";
import { compareVeri, memorizeComponent } from "@/hooks/useMemoComponent";
import { FieldTypes } from "@/common/statics/general";
import { ResourceAction } from "@/redux/reducers/slice";
import { FieldConfigType, matchesEndOrStartOf } from "@/utils/tools";
import { Base64FromBytes } from "@/utils/typed-config-op";
import { navigateCases } from "@/elchi/helpers/navigate-cases";
import { UploadOutlined } from '@ant-design/icons';
import ECard from "@/elchi/components/common/ECard";
import { useTags } from "@/hooks/useTags";
import { modtag_payload } from "./_modtag_";
import { EForm } from "@/elchi/components/common/e-components/EForm";
import { EFields } from "@/elchi/components/common/e-components/EFields";


type GeneralProps = {
    veri: {
        version: string;
        index?: number;
        reduxStore: any;
        keyPrefix: string;
        tagMatchPrefix: string;
        title: string;
    }
};

const CommonComponentPayload: React.FC<GeneralProps> = ({ veri }) => {
    const dispatch = useDispatch();
    const { vTags } = useTags(veri.version, modtag_payload);
    const [selectedTags, setSelectedTags] = useState<string[]>(extractNestedKeys(veri.reduxStore));
    const [file, setFile] = useState<any>([])

    useEffect(() => {
        const selecTag = extractNestedKeys(veri.reduxStore)
        setSelectedTags(selecTag)
        const inlineByte = navigateCases(veri.reduxStore, 'payload.binary')

        if (inlineByte) {
            setFile([{ name: "binary", uid: "-1" }]);
        } else {
            setFile([]);
        }
    }, [veri.reduxStore]);

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
        { tag: "text", type: FieldTypes.InputArea, tagPrefix: "payload", placeHolder: "(string)", fieldPath: 'payload.text', spanNum: 24, navigate: true },
    ];

    const props: UploadProps = {
        name: 'file',
        maxCount: 1,
        fileList: file,
        beforeUpload: (file) => {
            const reader = new FileReader();
            reader.onload = e => {
                const base64String = Base64FromBytes(e.target?.result as ArrayBuffer);
                handleChangeRedux(`${veri.keyPrefix}.binary`, base64String)
            };
            reader.readAsArrayBuffer(file);

            return false;
        },
        onChange(info) {
            if (info.file.status === 'done') {
                console.log('file uploaded successfully');
            } else if (info.file.status === 'error') {
                console.log('file not uploaded!');
            }
        },
    };

    return (
        <ECard title={veri.title}>
            <HorizonTags veri={{
                tags: vTags.hp?.HealthCheck_Payload,
                selectedTags: selectedTags,
                unsupportedTags: [],
                index: veri.index,
                handleChangeTag: handleChangeTag,
                tagMatchPrefix: veri.tagMatchPrefix,
                tagPrefix: `payload`,
                keyPrefix: '',
                onlyOneTag: [["payload.text", "payload.binary"]],
                required: ["text", "binary"]
            }} />
            <Divider style={{ marginTop: '8px', marginBottom: '8px' }} type="horizontal" />
            <Col md={24}>
                <EForm>
                    <EFields
                        fieldConfigs={fieldConfigs}
                        selectedTags={selectedTags}
                        handleChangeRedux={handleChangeRedux}
                        reduxStore={veri.reduxStore}
                        keyPrefix={veri.keyPrefix}
                        version={veri.version}
                    />
                    {matchesEndOrStartOf("payload.binary", selectedTags) &&
                        <Upload {...props} key={"upload"}>
                            <Button icon={<UploadOutlined />}>Upload</Button>
                        </Upload>
                    }
                </EForm>
            </Col>
        </ECard>
    )
};

export default memorizeComponent(CommonComponentPayload, compareVeri);
