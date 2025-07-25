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

const ComponentSessionStateLink: React.FC<GeneralProps> = ({ veri }) => {
    const { project } = useProjectVariable();
    const dispatch = useDispatch();
    const [state, setState] = useState<any>()
    const [data, setData] = useState<any>()
    const { data: queryDataHeader } = useCustomGetQuery({
        queryKey: "custom_session_state_header",
        enabled: true,
        path: `custom/resource_list?collection=extensions&gtype=${GTypes.HeaderBasedSessionState}&version=${veri.version}&project=${project}`
    });

    const { data: queryDataCookie } = useCustomGetQuery({
        queryKey: "custom_session_state_cookie",
        enabled: true,
        path: `custom/resource_list?collection=extensions&gtype=${GTypes.CookieBasedSessionState}&version=${veri.version}&project=${project}`
    });

    useEffect(() => {
        setState(ByteToObj(veri.reduxStore))
    }, [veri.reduxStore]);

    useEffect(() => {
        setData([...queryDataHeader || [], ...queryDataCookie || []])
    }, [queryDataCookie, queryDataHeader]);

    const handleChangeRedux = (_: string, val: string) => {
        const matched_typed = data.find((obj: any) => obj.name === val);
        const typed = { name: matched_typed.category, typed_config: { type_url: matched_typed.gtype, value: matched_typed } }
        handleChangeResources({ version: veri.version, type: ActionType.Update, keys: veri.keyPrefix, val: ObjToBase64(typed), resourceType: ResourceType.Resource }, dispatch, ResourceAction);
    };

    return (
        <ECard title={"Session State"}>
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
                            values: data?.map((obj: any) => obj.name) || [],
                            keyPrefix: `${veri.keyPrefix}`,
                            spanNum: 24
                        }}
                    />

                </EForm>
            </Col>
        </ECard>
    )
};

export default memorizeComponent(ComponentSessionStateLink, compareVeri);
