import React, { useState } from 'react';
import { Row, Col, Button } from 'antd';
import { ButtonProps } from 'antd/lib/button';
import { InType } from '@/elchi/tags/tagsType';
import InfoModal, { InfoTypes } from './InfoModal';



export interface InfoItem {
    icon: React.ReactNode;
    title: string;
    type: ButtonProps['type'];
    info_type: InfoTypes;
    data?: InType[];
}

interface InfoContainerProps {
    Infos: InfoItem[];
}

const InfoBar: React.FC<InfoContainerProps> = ({ Infos }) => {
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const [activeInfo, setActiveInfo] = useState<InfoTypes | null>(null);
    const [modalData, setModalData] = useState<InType[] | undefined>(undefined);

    const handleOpenModal = (infoType: InfoTypes, data?: InType[]) => {
        setActiveInfo(infoType);
        setModalData(data);
        setIsModalOpen(true);
    };

    return (
        <>
            <div className="container-border">
                <Row gutter={[8, 8]}>
                    {Infos.map((Info) => (
                        <Col key={Info.title}>
                            <Button
                                size="small"
                                title={Info.title}
                                onClick={() => handleOpenModal(Info.info_type, Info.data)}
                                style={{
                                    background: 'linear-gradient(90deg, #056ccd 0%, #00c6fb 100%)',
                                    border: 'none',
                                    color: '#fff',
                                    fontWeight: 500,
                                    fontSize: 12,
                                    borderRadius: 7,
                                    padding: '0 8px',
                                    height: 24,
                                    minWidth: 28,
                                    boxShadow: '0 2px 8px 0 rgba(5,117,230,0.10)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 6,
                                    transition: 'all 0.18s',
                                }}
                                className="modern-add-icon-btn-info"
                            >
                                {Info.icon}
                            </Button>
                        </Col>
                    ))}
                </Row>
            </div>

            <InfoModal
                isOpen={isModalOpen}
                infoType={activeInfo}
                data={modalData}
                onClose={() => setIsModalOpen(false)}
            />
        </>
    );
};

export default InfoBar;