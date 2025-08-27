import React, { useEffect, useState } from "react";
import { Col } from 'antd';
import { useDispatch } from "react-redux";
import { ActionType, ResourceType } from "@/redux/reducer-helpers/common";
import { handleChangeResources } from "@/redux/dispatcher";
import { compareVeri, memorizeComponent } from "@/hooks/useMemoComponent";
import { ResourceAction } from "@/redux/reducers/slice";
import { useCustomGetQuery } from "@/common/api";
import { FieldComponent } from "@/elchi/components/common/FormItems";
import { FieldTypes } from "@/common/statics/general";
import { ByteToObj, ObjToBase64 } from "@/utils/typed-config-op";
import { useProjectVariable } from "@/hooks/useProjectVariable";
import ECard from "@/elchi/components/common/ECard";
import { EForm } from "@/elchi/components/common/e-components/EForm";


type GeneralProps = {
    veri: {
        version: string;
        reduxStore: any;
        keyPrefix: string;
    }
};

const ComponentCompressorLibrary: React.FC<GeneralProps> = ({ veri }) => {
    const dispatch = useDispatch();
    const [rState, setRState] = useState<any>()
    const { project } = useProjectVariable();

    const { data: queryData } = useCustomGetQuery({
        queryKey: "custom_compressor_library",
        enabled: true,
        path: `custom/resource_list?collection=extensions&category=envoy.compression.compressor&version=${veri.version}&project=${project}`
    });

    useEffect(() => {
        if (veri.reduxStore) {
            setRState(ByteToObj(veri.reduxStore))
        }
    }, [veri.reduxStore]);

    const handleChangeRedux = (key: string, val: string) => {
        const matchedAL = queryData.find((obj: any) => obj.name === val);
        if (matchedAL) {
            const accesslog = {
                name: matchedAL.name,
                typed_config: {
                    type_url: matchedAL.gtype,
                    value: matchedAL
                }
            };

            handleChangeResources(
                {
                    version: veri.version,
                    type: ActionType.Update,
                    keys: key,
                    val: ObjToBase64(accesslog),
                    resourceType: ResourceType.Resource
                },
                dispatch,
                ResourceAction
            );
        } else {
            console.error("Matched access log not found for the given value:", val);
        }
    };

    return (
        <ECard title={"Compressor Library"}>
            <Col md={24}>
                <EForm>
                    <FieldComponent
                        veri={{
                            alwaysShow: true,
                            selectedTags: [],
                            handleChange: handleChangeRedux,
                            tag: ``,
                            value: rState?.typed_config?.value?.name,
                            type: FieldTypes.SelectWithGtype,
                            placeholder: "(Compressor Library)",
                            values: queryData || [],
                            keyPrefix: `${veri.keyPrefix}`,
                            spanNum: 24,
                            required: true,
                            displayName: "Compressor Library",
                        }}
                    />

                </EForm>
            </Col>
        </ECard>
    )
};

export default memorizeComponent(ComponentCompressorLibrary, compareVeri);
