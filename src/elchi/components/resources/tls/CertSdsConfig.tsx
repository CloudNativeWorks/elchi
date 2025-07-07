import React from "react";
import { Col, Tabs } from 'antd';
import { useDispatch } from "react-redux";
import { memorizeComponent, compareVeri } from "@/hooks/useMemoComponent";
import { ActionType, ResourceType } from "@/redux/reducer-helpers/common";
import { FieldComponent } from "@/elchi/components/common/FormItems";
import { handleChangeResources } from "@/redux/dispatcher";
import { FieldTypes } from "@/common/statics/general";
import { ResourceAction } from "@/redux/reducers/slice";
import { useCustomGetQuery } from "@/common/api";
import { useProjectVariable } from "@/hooks/useProjectVariable";
import useTabManager from "@/hooks/useTabManager";
import ECard from "../../common/ECard";
import { EForm } from "../../common/e-components/EForm";


type GeneralProps = {
    veri: {
        version: string;
        keyPrefix: string;
        reduxStore: any[];
        tagMatchPrefix: string;
        tagPrefix: string;
        unsupportedTags: string[];
    }
};

const ComponentCertSdsConfig: React.FC<GeneralProps> = ({ veri }) => {
    const dispatch = useDispatch();
    const { project } = useProjectVariable();
    const { state, onChangeTabs, addTab } = useTabManager({
        initialActiveTab: "0",
        reduxStore: veri.reduxStore,
        keyPrefix: veri.keyPrefix,
        version: veri.version,
        reduxAction: ResourceAction
    });

    const { data: queryData } = useCustomGetQuery({
        queryKey: "custom_secrets_cert_sds",
        enabled: true,
        path: `custom/resource_list?collection=secrets&gtype=envoy.extensions.transport_sockets.tls.v3.TlsCertificate&version=${veri.version}&project=${project}`
    });

    const handleChangeRedux = (keys: string, val: string) => {
        const sds_config = { name: val, sds_config: { ads: {}, initial_fetch_timeout: "15s", resource_api_version: "V3" } }
        handleChangeResources({ version: veri.version, type: ActionType.Update, keys: keys.replace('.name', ''), val: sds_config, resourceType: ResourceType.Resource }, dispatch, ResourceAction);
    };

    return (
        <ECard title={'TLS Certificate'}>
            <Tabs
                onChange={onChangeTabs}
                type="editable-card"
                activeKey={state.activeTab}
                onEdit={addTab}
                style={{ width: "99%" }}
                items={veri.reduxStore?.map((data: any, index: number) => {
                    return {
                        key: index.toString(),
                        label: "Cert: " + index.toString(),
                        forceRender: true,
                        children: (
                            <Col md={24}>
                                <EForm>
                                    <FieldComponent
                                        veri={{
                                            alwaysShow: true,
                                            selectedTags: [],
                                            handleChange: handleChangeRedux,
                                            tag: 'name',
                                            value: data?.name,
                                            type: FieldTypes.Select,
                                            placeholder: "(TLS Certificate)",
                                            values: queryData?.map((obj: any) => obj.name) || [],
                                            keyPrefix: `${veri.keyPrefix}.${index}`,
                                            spanNum: 8
                                        }}
                                    />
                                </EForm>
                            </Col>
                        ),
                    };
                })
                }
            />
        </ECard >
    )
};

export default memorizeComponent(ComponentCertSdsConfig, compareVeri);
