import React, { useState, useEffect, useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@redux/store';
import { Divider, Table, Button, Tag } from 'antd';
import { HeadOfResource } from '@/elchi/components/common/HeadOfResources';
import { ActionType, ResourceType } from '@/redux/reducer-helpers/common';
import { handleChangeResources } from '@/redux/dispatcher';
import { clearUniqID, generateUniqueId, insertDashBeforeUniqID } from '@/utils/tools';
import { ConfDiscovery } from '@/common/types';
import { ColumnsType } from 'antd/es/table';
import { navigateCases } from '@/elchi/helpers/navigate-cases';
import { deleteMatchedConfigDiscovery } from './helpers';
import { ResourceAction } from '@/redux/reducers/slice';
import { DeleteTwoTone, InboxOutlined } from '@ant-design/icons';
import { useGTypeFields } from '@/hooks/useGtypes';
import { GTypes } from '@/common/statics/gtypes';
import { modtag_listener } from './_modtag_';
import RenderLoading from '../../common/Loading';
import { useModels } from '@/hooks/useModels';
import { useManagedLoading } from '@/hooks/useManageLoading';
import { useLoading } from '@/hooks/loadingContext';
import { useProjectVariable } from '@/hooks/useProjectVariable';
import { useServiceData } from '@/hooks/useServiceData';
import ElchiIconButton from '../../common/ElchiIconButton';
import ListenerComponentChild from './ChildListener';


type GeneralProps = {
    veri: {
        version: string;
        queryResource: any;
        generalName: string;
        changeGeneralName: any;
        changeGeneralManaged: any;
        managed: boolean;
    }
};

interface State {
    freezedNames: string[];
}

const ListenerComponent: React.FC<GeneralProps> = ({ veri }) => {
    const GType = useGTypeFields(GTypes.Listener);
    const location = useLocation();
    const dispatch = useDispatch();
    const { loadingCount } = useLoading();
    const { project } = useProjectVariable();
    const { vModels, loading_m } = useModels(veri.version, modtag_listener);
    const { clientIPs } = useServiceData({
        project,
        version: veri.version,
        serviceName: veri.generalName,
        enabled: !!project && !!veri.version && !!veri.generalName
    });

    const memoConfigDiscoveryReduxStore = useSelector((state: RootState) => state.VersionedResources[veri.version]?.ConfigDiscovery);
    const configDiscoveryReduxStore: ConfDiscovery[] = useMemo(() => {
        return memoConfigDiscoveryReduxStore;
    }, [memoConfigDiscoveryReduxStore]);

    const memoReduxStore = useSelector((state: RootState) => state.VersionedResources[veri.version]?.Resource);
    const reduxStore: any[] = useMemo(() => {
        if (!vModels) return null;
        return memoReduxStore?.map((item: any) => vModels.l?.Listener.fromJSON(item));
    }, [memoReduxStore, vModels]);

    const [state, setState] = useState<State>({
        freezedNames: reduxStore?.map(value => value?.name as string) || []
    });

    useEffect(() => {
        if (reduxStore) {
            setState(prevState => ({
                ...prevState,
                freezedNames: reduxStore.map(value => value?.name as string)
            }));
        }
    }, [reduxStore]);

    useManagedLoading(loading_m);

    const handleDeleteRedux = ({ event, index }: { event?: React.MouseEvent<HTMLElement>, index?: number }) => {
        if (event) {
            event.stopPropagation();
        }
        const fullKey = `${index}`;
        handleChangeResources({ version: veri.version, type: ActionType.Delete, keys: fullKey, resourceType: ResourceType.Resource }, dispatch, ResourceAction);
        deleteMatchedConfigDiscovery(reduxStore[index].name as string, configDiscoveryReduxStore, veri.version, dispatch)
    };

    const updateFreezedNames = () =>
        setState(prevState => ({ ...prevState, freezedNames: reduxStore?.map(value => value.name as string) }))

    const addListener = () => {
        handleChangeResources({
            version: veri.version,
            type: ActionType.Append,
            keys: '',
            val: {
                name: `listener${generateUniqueId(6)}`,
                address: {
                    socket_address: {
                        address: '0.0.0.0'
                    }
                }
            }, resourceType: ResourceType.Resource
        }, dispatch, ResourceAction);
    }

    const columns: ColumnsType<any> = [
        {
            title: 'Name',
            width: '30%',
            key: 'value',
            render: (_, record) => { return insertDashBeforeUniqID(record?.name) }
        },
        {
            title: 'Protocol',
            width: '20%',
            key: 'gtype',
            render: (_, record) => { return navigateCases(record, 'address.address.socket_address.protocol') || 'TCP' }
        },
        {
            title: 'Address',
            width: '20%',
            key: 'gtype',
            render: (_, record) => { return veri.managed ? <Tag style={{ backgroundColor: '#00c6fb', color: '#fff' }} className='auto-width-tag'>Managed by Service</Tag> : navigateCases(record, 'address.address.socket_address.address') }
        },
        {
            title: 'Port',
            width: '20%',
            key: 'gtype',
            render: (_, record) => { return navigateCases(record, 'address.address.socket_address.port_specifier.port_value') }
        },
        {
            title: 'Delete',
            width: '10%',
            key: 'x',
            render: (_, __, index) =>
                <Button
                    icon={<DeleteTwoTone twoToneColor="#eb2f96" />}
                    size='small'
                    onClick={(e) => handleDeleteRedux({ event: e, index: index })}
                    style={{ marginRight: 8 }}
                    iconPosition={"end"}
                />,
        },
    ];

    if (loadingCount > 0) {
        return <RenderLoading checkPage={true} isLoadingQuery={true} error={""} />;
    }

    return (
        <>
            <HeadOfResource
                generalName={veri.generalName}
                version={veri.version}
                changeGeneralName={veri.changeGeneralName}
                locationCheck={location.pathname === GType.createPath}
                callBack={updateFreezedNames}
                managed={veri.managed}
                changeGeneralManaged={veri.changeGeneralManaged}
                createUpdate={{
                    location_path: location.pathname,
                    GType: GType,
                    offset: 0,
                    name: veri.generalName,
                    reduxStore: reduxStore,
                    voidToJSON: vModels.l?.Listener.toJSON,
                    queryResource: veri.queryResource,
                    envoyVersion: veri.version,
                    gtype: GTypes.Listener,
                    configDiscovery: configDiscoveryReduxStore,
                }}
            />
            <Divider type='horizontal' orientation='left' orientationMargin='0'>Listeners</Divider>

            <div style={{
                background: '#fff',
                padding: '12px 12px 24px 12px',
                borderRadius: 12,
                boxShadow: '0 2px 8px rgba(5,117,230,0.06)',
                margin: '4px 0'
            }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
                    <ElchiIconButton onClick={() => addListener()} />
                    {clientIPs && clientIPs.length > 0 && (
                        <div style={{ 
                            fontSize: '12px', 
                            color: '#666',
                            fontWeight: 500,
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px'
                        }}>
                            <span style={{ color: '#1890ff' }}>Service IPs:</span>
                            <span>{clientIPs.join(', ')}</span>
                        </div>
                    )}
                </div>
                <Table
                    size='small'
                    scroll={{ y: 950 }}
                    pagination={false}
                    rowClassName='cursor-row'
                    dataSource={Array.isArray(reduxStore) ? reduxStore?.map((data: any, index: number) => ({ ...data, tableIndex: index })) : []}
                    columns={columns}
                    rowKey={(record) => `item-${record.tableIndex}`}
                    locale={{
                        emptyText: (
                            <div>
                                <InboxOutlined style={{ fontSize: 48, marginBottom: 8 }} />
                                <div>No Listeners</div>
                            </div>
                        )
                    }}
                    expandable={{
                        expandRowByClick: true,
                        expandedRowRender: (data, index) => expandedRowRender(data, index, veri, state, GType, configDiscoveryReduxStore, vModels),
                    }}
                />
            </div>
        </>
    );
}

const expandedRowRender = (data: any, index: number, veri: any, state: any, GType: any, configDiscoveryReduxStore: any, vModels: any) => {
    return (
        <ListenerComponentChild veri={{
            version: veri.version,
            reduxStore: data,
            generalName: veri.generalName,
            keyPrefix: index.toString(),
            managed: veri.managed,
            configDiscovery: configDiscoveryReduxStore,
            UniqID: clearUniqID(data.name).removedID,
            freezedNames: state.freezedNames,
            GType: GType,
            vModels: vModels,
        }} />
    );
};

export default ListenerComponent;