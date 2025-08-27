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
import { GTypes } from "@/common/statics/gtypes";
import { EForm } from "@/elchi/components/common/e-components/EForm";


type GeneralProps = {
    veri: {
        version: string;
        reduxStore: any;
        keyPrefix: string;
        prettyName: string;
    }
};

const ComponentUTMLink: React.FC<GeneralProps> = ({ veri }) => {
    const { project } = useProjectVariable();
    const dispatch = useDispatch();
    const [state, setState] = useState<any>()
    const { data: queryData } = useCustomGetQuery({
        queryKey: "custom_utm",
        enabled: true,
        path: `custom/resource_list?collection=extensions&gtype=${GTypes.UTM}&version=${veri.version}&project=${project}`
    });

    useEffect(() => {
        setState(ByteToObj(veri.reduxStore))
    }, [veri.reduxStore]);

    const handleChangeRedux = (_: string, val: string) => {
        const matched_typed = queryData.find((obj: any) => obj.name === val);
        const typed = { name: matched_typed.category, typed_config: { type_url: matched_typed.gtype, value: matched_typed } }
        handleChangeResources({ version: veri.version, type: ActionType.Update, keys: veri.keyPrefix, val: ObjToBase64(typed), resourceType: ResourceType.Resource }, dispatch, ResourceAction);
    };

    return (
        <ECard title={"Uri Template Matcher"}>
            <Col md={24}>
                <EForm>
                    <FieldComponent
                        veri={{
                            alwaysShow: true,
                            selectedTags: [],
                            handleChange: handleChangeRedux,
                            tag: `${veri.prettyName}`,
                            value: state?.typed_config?.value?.name,
                            type: FieldTypes.Select,
                            placeholder: `(${veri.prettyName})`,
                            values: queryData?.map((obj: any) => obj.name) || [],
                            keyPrefix: `${veri.keyPrefix}`,
                            spanNum: 24
                        }}
                    />
                    
                </EForm>
            </Col>
        </ECard>
    )
};

export default memorizeComponent(ComponentUTMLink, compareVeri);
