import React from 'react';
import { Modal, Typography } from 'antd';
import AccessLogOperators from '@/elchi/components/resources/extension/access-log/Operators';
import { InType } from '@/elchi/tags/tagsType';
import FieldInfo from '@/elchi/components/common/FieldInfo';
import UserHashGenerator from '../tools/UserHashGenerator';
import { createStyles, useTheme } from 'antd-style';
import ElchiButton from './ElchiButton';


const { Title } = Typography;
/* eslint-disable no-unused-vars */
export enum InfoTypes {
    Operators = 'oprt',
    FieldInfo = 'fi',
    UserHashGenerator = 'uhg',
}

const mapInfoTypeToTitle = {
    [InfoTypes.Operators]: 'Access Log Operators',
    [InfoTypes.FieldInfo]: 'Config Info',
    [InfoTypes.UserHashGenerator]: 'SHA Hash Generator',
}

const useStyle = createStyles(({ token }) => ({
    'my-modal-body': {
        background: 'var(--bg-surface)',
        padding: token.paddingSM,
    },
    'my-modal-mask': {
        boxShadow: 'inset 0 0 15px var(--shadow-color, rgba(0, 0, 0, 0.1))',
    },
    'my-modal-header': {
        borderBottom: `1px dotted ${token.colorPrimary}`,
    },
    'my-modal-footer': {
        color: token.colorPrimary,
    },
    'my-modal-content': {
        border: '1px solid var(--border-default)',
        background: 'var(--card-bg)',
    },
}));

interface InfoModalProps {
    isOpen: boolean;
    infoType: InfoTypes | null;
    data?: InType[];
    onClose: () => void;
}

const InfoModal: React.FC<InfoModalProps> = ({ isOpen, infoType, data, onClose }) => {
    const { styles } = useStyle();
    const token = useTheme();


    const classNames = {
        mask: styles['my-modal-mask'],
        header: styles['my-modal-header'],
        content: styles['my-modal-content'],
    };

    const modalStyles = {
        header: {
            borderLeft: `5px solid ${token.colorPrimary}`,
            borderRadius: 0,
            paddingInlineStart: 12,
            background: 'transparent',
            paddingTop: 12,
            paddingBottom: 12,
        },
        mask: {
            backdropFilter: 'blur(10px)',
        },
        content: {
            boxShadow: 'var(--shadow-lg)',
        },
    };

    const renderModalContent = () => {
        if (infoType === InfoTypes.Operators) {
            return <AccessLogOperators />;
        } else if (infoType === InfoTypes.FieldInfo && data) {
            return <FieldInfo data={data} />;
        } else if (infoType === InfoTypes.UserHashGenerator) {
            return <UserHashGenerator />;
        }
        return null;
    };

    return (
        <Modal
            centered
            width={1400}
            height={"80%"}
            title={<Title level={4} style={{ margin: 0, color: 'var(--text-primary)' }}>{mapInfoTypeToTitle[infoType || '']}</Title>}
            open={isOpen}
            onCancel={onClose}
            style={{ top: 20 }}
            classNames={classNames}
            styles={modalStyles}
            footer={[
                <ElchiButton onlyText key="close" onClick={onClose}>
                    Close
                </ElchiButton>
            ]}
        >
            {renderModalContent()}
        </Modal>
    );
};

export default InfoModal;