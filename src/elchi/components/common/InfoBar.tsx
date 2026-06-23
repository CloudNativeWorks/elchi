import React, { useState } from 'react';
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
            <div className="elchi-info-bar">
                {Infos.map((Info) => (
                    <button
                        key={Info.title}
                        type="button"
                        title={Info.title}
                        onClick={() => handleOpenModal(Info.info_type, Info.data)}
                        className="elchi-info-pill"
                    >
                        <span className="elchi-info-pill__icon">{Info.icon}</span>
                        <span className="elchi-info-pill__label">{Info.title}</span>
                    </button>
                ))}
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