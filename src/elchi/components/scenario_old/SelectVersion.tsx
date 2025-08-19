import { Row, Typography, Select, Col, Modal, Switch, Divider } from 'antd';
import { useNavigate } from "react-router-dom";
import { useState } from 'react';
import ElchiButton from '../common/ElchiButton';

const { Title } = Typography;

interface RenderFormItemProps {
    setState: any;
    setManaged: any;
    managed: boolean;
}

const SelectVersion = ({ setState, setManaged, managed }: RenderFormItemProps): JSX.Element => {
    const navigate = useNavigate();
    const [selectedVersion, setSelectedVersion] = useState<string>('');
    const [isVersionSelected, setIsVersionSelected] = useState<boolean>(false);

    const handleVersionChange = (version: string) => {
        setSelectedVersion(version);
        setIsVersionSelected(!!version);
    };

    const handleManagedChange = (checked: boolean) => {
        setManaged(checked);
    };

    const handleOk = () => {
        if (isVersionSelected) {
            setState(selectedVersion);
        }
    };

    return (
        <Modal
            centered
            open={true}
            okButtonProps={{ hidden: false, disabled: !isVersionSelected }}
            cancelButtonProps={{ hidden: false }}
            closable={false}
            onCancel={() => navigate(-1)}
            onOk={handleOk}
            okText="OK"
            cancelText="Cancel"
            footer={[
                <div key={"scenario_select_version_footer"} style={{ display: 'flex', justifyContent: 'flex-end', gap: 10 }}>
                    <ElchiButton onlyText onClick={() => navigate(-1)}>Cancel</ElchiButton>
                    <ElchiButton onlyText onClick={handleOk} disabled={!isVersionSelected}>OK</ElchiButton>
                </div>
            ]}
        >
            <Row style={{ marginTop: 10 }}>
                <Col>
                    <Title level={5} style={{ marginRight: 10 }}>
                        {'Select Envoy Version'}
                    </Title>

                    <Select
                        placeholder="Version"
                        onChange={handleVersionChange}
                        style={{ width: '250px' }}
                        options={window.APP_CONFIG.AVAILABLE_VERSIONS.map(v => ({
                            value: v,
                            label: v
                        }))}
                    />
                </Col>
                <Divider type="vertical" style={{ height: '0px', margin: '0 15px' }} />
                <Col>
                    <Title level={5} style={{ marginRight: 10 }}>
                        {'Managed'}
                    </Title>
                    <Switch
                        size='small'
                        checked={managed}
                        onChange={handleManagedChange}
                    />
                </Col>
            </Row>
        </Modal>
    );
};

export default SelectVersion;