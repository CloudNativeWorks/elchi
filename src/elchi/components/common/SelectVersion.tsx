import React, { useEffect, useState } from "react";
import { Row, Typography, Select, Col, Modal } from 'antd';
import { ClearResources } from "@/redux/reducers/slice";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { GTypeFieldsBase } from "@/common/statics/gtypes";
import { multipleResource } from "@/common/statics/multiple-resources";
import ElchiButton from "./ElchiButton";


const { Title } = Typography;

interface RenderFormItemProps<T> {
    setState: React.Dispatch<React.SetStateAction<T>>;
    currentState: T;
    GType: GTypeFieldsBase;
}

const SelectVersion = <T,>({ setState, currentState, GType }: RenderFormItemProps<T>): JSX.Element => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [initValue, setInitValue] = useState(GType.initialValue);

    useEffect(() => {
        if (GType.module && multipleResource[GType.module]) {
            setState({ ...currentState, gtype: multipleResource[GType.module].defaultValue });
        }
    }, [GType]);

    const handleChangeGtype = (gtype: string) => {
        setState({ ...currentState, gtype });
        if (gtype === 'envoy.extensions.transport_sockets.tls.v3.TlsCertificate') {
            setInitValue([]);
        }
    };

    const handleVersionChange = (version: string) => {
        if (initValue) {
            dispatch(ClearResources({ version, initialValue: initValue }));
        }
        setState({ ...currentState, version });
    };

    const renderSelect = () => {
        if (GType.module && multipleResource[GType.module]) {
            const config = multipleResource[GType.module];
            return (
                <Select
                    placeholder={GType.module.toUpperCase()}
                    onChange={handleChangeGtype}
                    style={{ width: '250px', marginBottom: '10px' }}
                    defaultValue={config.defaultValue}
                    options={config.options}
                />
            );
        }
        return null;
    };

    return (
        <Modal
            centered
            open={true}
            okButtonProps={{ hidden: true }}
            cancelButtonProps={{ hidden: false }}
            closable={false}
            onCancel={() => navigate(-1)}
            footer={[
                <div key={`footer_${GType.module}`} style={{ display: 'flex', justifyContent: 'flex-end', gap: 10 }}>
                    <ElchiButton onlyText onClick={() => navigate(-1)}>Cancel</ElchiButton>
                </div>
            ]}
        >
            <Row style={{ marginTop: 10 }}>
                <Col>
                    <Title level={5} style={{ marginRight: 10 }}>
                        {multipleResource[GType.module]?.name ? `Select Envoy Version & ${multipleResource[GType.module]?.name}` : 'Select Envoy Version'}
                    </Title>
                    {renderSelect()}
                    <Select
                        placeholder="Version"
                        onChange={handleVersionChange}
                        style={{ width: '250px' }}
                        options={GType.availableVersions.map(v => ({
                            value: v,
                            label: v
                        }))}
                    />
                </Col>
            </Row>
        </Modal>
    );
};

export default SelectVersion;