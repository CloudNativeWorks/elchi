import React from "react";
import { Col, Divider } from 'antd';
import { HorizonTags } from "@/elchi/components/common/HorizonTags";
import { compareVeri, memorizeComponent } from "@/hooks/useMemoComponent";
import { FieldConfigType, startsWithAny } from "@/utils/tools";
import useResourceForm from "@/hooks/useResourceForm";
import ECard from "@/elchi/components/common/ECard";
import { modtag_tls_key_log } from "./_modtag_";
import { useTags } from "@/hooks/useTags";
import { generateFields } from "@/common/generate-fields";
import { EForm } from "@/elchi/components/common/e-components/EForm";
import { EFields } from "@/elchi/components/common/e-components/EFields";
import CommonComponentCidrRange from "@/elchi/components/resources/common/CidrRange/CidrRange";
import TabComponent from "@/elchi/components/common/TabComponent";


type GeneralProps = {
    veri: {
        version: string;
        reduxStore: any;
        keyPrefix: string;
        title: string;
    }
};

const CommonComponentTlsKeyLog: React.FC<GeneralProps> = ({ veri }) => {
    const { vTags } = useTags(veri.version, modtag_tls_key_log);
    const { selectedTags, handleChangeRedux, handleChangeTag } = useResourceForm({
        version: veri.version,
        reduxStore: veri.reduxStore,
    });

    const fieldConfigs: FieldConfigType[] = [
        ...generateFields({
            f: vTags.tkl?.TlsKeyLog,
            sf: vTags.tkl?.TlsKeyLog_SingleFields,
            r: ["path"]
        })
    ];

    return (
        <ECard title={veri.title}>
            <HorizonTags veri={{
                tags: vTags.tkl?.TlsKeyLog,
                selectedTags: selectedTags,
                unsupportedTags: [],
                handleChangeTag: handleChangeTag,
                keyPrefix: veri.keyPrefix,
                required: ["path"],
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
                </EForm>
                {startsWithAny("local_address_range", selectedTags) &&
                    <TabComponent veri={{
                        version: veri.version,
                        title: 'Local Address Ranges',
                        reduxStore: veri.reduxStore?.local_address_range,
                        keyPrefix: `${veri.keyPrefix}.local_address_range`,
                        label: 'Cidr',
                        component: CommonComponentCidrRange,
                        veri: {
                            title: 'Local Address Range',
                            version: veri.version,
                        }
                    }} />
                }
                {startsWithAny("remote_address_range", selectedTags) &&
                    <TabComponent veri={{
                        version: veri.version,
                        title: 'Remote Address Ranges',
                        reduxStore: veri.reduxStore?.remote_address_range,
                        keyPrefix: `${veri.keyPrefix}.remote_address_range`,
                        label: 'Cidr',
                        component: CommonComponentCidrRange,
                        veri: {
                            title: 'Remote Address Range',
                            version: veri.version,
                        }
                    }} />
                }
            </Col>
        </ECard>
    )
};

export default memorizeComponent(CommonComponentTlsKeyLog, compareVeri);
