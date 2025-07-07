import React from "react";
import { Col } from 'antd';
import { useDispatch } from "react-redux";
import { memorizeComponent, compareVeri } from "@/hooks/useMemoComponent";
import { ActionType, ResourceType } from "@/redux/reducer-helpers/common";
import { FieldComponent } from "@/elchi/components/common/FormItems";
import { handleChangeResources } from "@/redux/dispatcher";
import { FieldTypes } from "@/common/statics/general";
import { ResourceAction } from "@/redux/reducers/slice";
import { useCustomGetQuery } from "@/common/api";
import { navigateCases } from "@/elchi/helpers/navigate-cases";
import { useProjectVariable } from "@/hooks/useProjectVariable";
import ECard from "../../common/ECard";
import { EForm } from "../../common/e-components/EForm";


type GeneralProps = {
    veri: {
        version: string;
        keyPrefix: string;
        reduxStore: any;
    }
};

const ComponentValidationSdsConfig: React.FC<GeneralProps> = ({ veri }) => {
    const dispatch = useDispatch();
    const { project } = useProjectVariable();
    const { data: queryData } = useCustomGetQuery({
        queryKey: "custom_secrets_validation_sds",
        enabled: true,
        path: `custom/resource_list?collection=secrets&gtype=envoy.extensions.transport_sockets.tls.v3.CertificateValidationContext&version=${veri.version}&project=${project}`
    });

    const handleChangeRedux = (_: string, val: string | boolean | number) => {
        const sds_config = { name: val, sds_config: { ads: {}, initial_fetch_timeout: "15s", resource_api_version: "V3" } }
        handleChangeResources({ version: veri.version, type: ActionType.Update, keys: veri.keyPrefix, val: sds_config, resourceType: ResourceType.Resource }, dispatch, ResourceAction);
    };

    return (
        <ECard title={"Validation Context Sds Secret Config"}>
            <Col md={24}>
                <EForm>
                    <FieldComponent
                        veri={{
                            alwaysShow: true,
                            selectedTags: [],
                            handleChange: handleChangeRedux,
                            tag: 'Name',
                            value: navigateCases(veri.reduxStore, 'validation_context_sds_secret_config.name'),
                            type: FieldTypes.Select,
                            placeholder: "(Validation Context)",
                            values: queryData?.map((obj: any) => obj.name) || [],
                            keyPrefix: `${veri.keyPrefix}`,
                            spanNum: 8
                        }}
                    />
                </EForm>
            </Col>
        </ECard>
    )
};

export default memorizeComponent(ComponentValidationSdsConfig, compareVeri);
