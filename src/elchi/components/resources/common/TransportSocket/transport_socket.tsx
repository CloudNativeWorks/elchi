import React, { useEffect, useState } from "react";
import { Col } from 'antd';
import { useDispatch } from "react-redux";
import { compareVeri, memorizeComponent } from "@/hooks/useMemoComponent";
import { useCustomGetQuery } from "@/common/api";
import { FieldComponent } from "@/elchi/components/common/FormItems";
import { FieldTypes } from "@/common/statics/general";
import { ByteToObj } from "@/utils/typed-config-op";
import { useProjectVariable } from "@/hooks/useProjectVariable";
import ECard from "@/elchi/components/common/ECard";
import { EForm } from "@/elchi/components/common/e-components/EForm";
import { handleTransportSocketChange } from "@/utils/typed-config-helpers";


type GeneralProps = {
    veri: {
        version: string;
        reduxStore: any;
        keyPrefix: string;
        tagMatchPrefix: string;
        gtype: string;
        prettyName: string;
    }
};

const CommonComponentTransportSocket: React.FC<GeneralProps> = ({ veri }) => {
    const dispatch = useDispatch();
    const [state, setState] = useState<any>()
    const { project } = useProjectVariable();
    const { data: queryData } = useCustomGetQuery({
        queryKey: "custom_tls",
        enabled: true,
        path: `custom/resource_list?collection=tls&gtype=${veri.gtype}&version=${veri.version}&project=${project}`
    });

    useEffect(() => {
        setState(ByteToObj(veri.reduxStore))
    }, [veri.reduxStore]);

    const handleChangeRedux = (_: string, val: string) => {
        const matchedTLS = queryData.find((obj: any) => obj.name === val);
        
        if (matchedTLS) {
            handleTransportSocketChange({
                version: veri.version,
                keyPrefix: veri.keyPrefix,
                selectedItem: matchedTLS,
                dispatch
            });
        }
    };

    return (
        <ECard title={"Transport Socket"}>
            <Col md={24}>
                <EForm>
                    <FieldComponent
                        veri={{
                            alwaysShow: true,
                            selectedTags: [],
                            handleChange: handleChangeRedux,
                            tag: `${veri.prettyName} TLS`,
                            value: state?.typed_config?.value?.name,
                            type: FieldTypes.Select,
                            placeholder: `(${veri.prettyName}TLS)`,
                            values: queryData?.map((obj: any) => obj.name) || [],
                            keyPrefix: `${veri.keyPrefix}`,
                            spanNum: 12
                        }}
                    />
                </EForm>
            </Col>
        </ECard>
    )
};

export default memorizeComponent(CommonComponentTransportSocket, compareVeri);
