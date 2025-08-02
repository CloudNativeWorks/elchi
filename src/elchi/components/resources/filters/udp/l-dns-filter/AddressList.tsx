import React from "react";
import { Col } from 'antd';
import { compareVeri, memorizeComponent } from "@/hooks/useMemoComponent";
import useResourceForm from "@/hooks/useResourceForm";
import { modtag_dns_table_address_list } from "./_modtag_";
import { useTags } from "@/hooks/useTags";
import { FieldConfigType } from "@/utils/tools";
import { generateFields } from "@/common/generate-fields";
import { EForm } from "@/elchi/components/common/e-components/EForm";
import { EFields } from "@/elchi/components/common/e-components/EFields";


type GeneralProps = {
    veri: {
        version: string;
        reduxStore: any;
        keyPrefix: string;
        title: string;
    }
};

const ComponentAddressList: React.FC<GeneralProps> = ({ veri }) => {
    const { vTags } = useTags(veri.version, modtag_dns_table_address_list);
    const { selectedTags, handleChangeRedux } = useResourceForm({
        version: veri.version,
        reduxStore: veri.reduxStore,
    });

    const fieldConfigs: FieldConfigType[] = [
        ...generateFields({
            f: vTags.dtal?.DnsTable_AddressList,
            sf: vTags.dtal?.DnsTable_AddressList_SingleFields,
            sn: 24
        })
    ];

    return (
        <Col md={24}>
            <EForm>
                <EFields
                    fieldConfigs={fieldConfigs}
                    selectedTags={selectedTags}
                    handleChangeRedux={handleChangeRedux}
                    reduxStore={veri.reduxStore}
                    keyPrefix={veri.keyPrefix}
                    alwaysShow={true}
                    version={veri.version}
                />
            </EForm>
        </Col>
    )
};

export default memorizeComponent(ComponentAddressList, compareVeri);
