import React, { useMemo } from "react";
import { useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@redux/store";
import { Col, Row, Divider, Table, Button } from "antd";
import { ActionType, ResourceType } from "@/redux/reducer-helpers/common";
import { handleChangeResources } from "@/redux/dispatcher";
import { HeadOfResource } from "@/elchi/components/common/HeadOfResources";
import { ResourceAction } from "@/redux/reducers/slice";
import { startsWithAny } from "@/utils/tools";
import { ColumnsType } from "antd/es/table";
import { DeleteTwoTone, InboxOutlined } from '@ant-design/icons';
import { GTypes } from "@/common/statics/gtypes";
import { useGTypeFields } from "@/hooks/useGtypes";
import useResourceForm from "@/hooks/useResourceForm";
import CustomAnchor from "@/elchi/components/common/CustomAnchor";
import CommonComponentDataSource from "../common/DataSource/DataSource";
import CommonComponentWatchedDirectory from "../common/WatchedDirectory/watched_directory";
import { useModels } from "@/hooks/useModels";
import { useTags } from "@/hooks/useTags";
import RenderLoading from "../../common/Loading";
import { modtag_tls_certificate, modtag_us_secret } from "./_modtag_";
import { useLoading } from "@/hooks/loadingContext";
import { useManagedLoading } from "@/hooks/useManageLoading";
import { ConditionalComponent } from "../../common/ConditionalComponent";
import ElchiIconButton from "../../common/ElchiIconButton";


type GeneralProps = {
    veri: {
        version: string;
        gtype: string;
        queryResource: any;
        generalName: string;
        changeGeneralName: any;
    }
};

type GeneralPropsChild = {
    veri: {
        version: string;
        gtype: string;
        reduxStore: any;
        index: number;
    }
};

const TlsCertificateComponent: React.FC<GeneralProps> = ({ veri }) => {
    const GType = useGTypeFields(GTypes.TlsCertificate);
    const location = useLocation();
    const dispatch = useDispatch();
    const { vModels, loading_m } = useModels(veri.version, modtag_tls_certificate);
    const { loadingCount } = useLoading();

    const memoReduxStore = useSelector((state: RootState) => state.VersionedResources[veri.version].Resource);
    const reduxStore: any[] = useMemo(() => {
        if (!vModels) return null;
        return memoReduxStore?.map((item: any) => vModels.tc?.TlsCertificate.fromJSON(item));
    }, [memoReduxStore, vModels]);

    const addCertificate = () => {
        handleChangeResources({ version: veri.version, type: ActionType.Append, keys: '', val: {}, resourceType: ResourceType.Resource }, dispatch, ResourceAction);
    }

    const handleDeleteRedux = ({ keys, index, event }: { keys?: string, index?: number, event?: React.MouseEvent<HTMLElement> }) => {
        if (event) { event.stopPropagation(); }
        const fullKey = keys ?
            `${index}.${keys}` :
            `${index}`;
        handleChangeResources({ version: veri.version, type: ActionType.Delete, keys: fullKey, resourceType: ResourceType.Resource }, dispatch, ResourceAction);
    };

    const columns: ColumnsType<any> = [
        {
            title: 'Name',
            width: "90%",
            key: 'name',
            render: () => { return "Certificate" }
        },
        {
            title: 'Delete',
            width: "10%",
            key: 'x',
            render: (_, __, index) =>
                <Button
                    icon={<DeleteTwoTone twoToneColor="#eb2f96" />}
                    size='small'
                    onClick={(e) => handleDeleteRedux({ event: e, index: index })}
                    iconPosition={"end"}
                    style={{ marginRight: 8 }}
                />,
        },
    ];

    useManagedLoading(loading_m);
    if (loadingCount > 0) {
        return <RenderLoading checkPage={true} isLoadingQuery={!vModels} error={""} />;
    }

    return (
        <>
            <HeadOfResource
                generalName={veri.generalName}
                changeGeneralName={veri.changeGeneralName}
                version={veri.version}
                locationCheck={GType.createPath === location.pathname}
                createUpdate={{
                    location_path: location.pathname,
                    GType: GType,
                    offset: 0,
                    name: veri.generalName,
                    reduxStore: reduxStore,
                    voidToJSON: vModels.tc?.TlsCertificate.toJSON,
                    queryResource: veri.queryResource,
                    envoyVersion: veri.version,
                    gtype: reduxStore?.[0]?.$type,
                }}
            />
            <Divider type="horizontal" orientation="left" orientationMargin="0">TLS Certificate</Divider>
            <div style={{
                background: '#fff',
                padding: '12px 12px 24px 12px',
                borderRadius: 12,
                boxShadow: '0 2px 8px rgba(5,117,230,0.06)',
                margin: '4px 0'
            }}>
                <div style={{ display: 'flex', alignItems: 'center', marginBottom: 12 }}>
                    <ElchiIconButton onClick={() => addCertificate()} />
                </div>
                <Table
                    size="small"
                    scroll={{ y: 950 }}
                    pagination={false}
                    rowClassName="cursor-row"
                    dataSource={Array.isArray(reduxStore) ? reduxStore?.map((data: any, index: number) => ({ ...data, tableIndex: index })) : []}
                    columns={columns}
                    rowKey={(record) => `item-${record.tableIndex}`}
                    locale={{
                        emptyText: (
                            <div>
                                <InboxOutlined style={{ fontSize: 48, marginBottom: 8 }} />
                                <div>No Certificates</div>
                            </div>
                        )
                    }}
                    expandable={{
                        expandRowByClick: true,
                        expandedRowRender: (data, index) => expandedRowRender(data, index, veri),
                    }}
                />
            </div>
        </>
    )
}

const TlsCertificateComponentChild: React.FC<GeneralPropsChild> = ({ veri }) => {
    const { vTags } = useTags(veri.version, modtag_tls_certificate);
    const { selectedTags, handleChangeTag } = useResourceForm({
        version: veri.version,
        reduxStore: veri.reduxStore,
    });

    return (
        <Row>
            <Col md={4}>
                <CustomAnchor
                    resourceConfKeys={vTags.tc?.TlsCertificate}
                    unsuportedTags={modtag_us_secret['tls_certificates']}
                    singleOptionKeys={[]}
                    selectedTags={selectedTags}
                    index={veri.index}
                    handleChangeTag={handleChangeTag}
                    keyPrefix={veri.index.toString()}
                />
            </Col>
            <Col md={20} style={{ display: "block", maxHeight: "83vh", overflowY: "auto" }}>
                <ConditionalComponent
                    shouldRender={startsWithAny("certificate_chain", selectedTags)}
                    Component={CommonComponentDataSource}
                    componentProps={{
                        version: veri.version,
                        parentName: 'Certificate Chain',
                        reduxStore: veri.reduxStore?.certificate_chain,
                        keyPrefix: `${veri.index}.certificate_chain`,
                        tagPrefix: ``,
                        fileName: 'Secret file',
                        id: `certificate_chain_0`,
                    }}
                />
                <ConditionalComponent
                    shouldRender={startsWithAny("private_key", selectedTags)}
                    Component={CommonComponentDataSource}
                    componentProps={{
                        version: veri.version,
                        parentName: 'Private Key',
                        reduxStore: veri.reduxStore?.private_key,
                        keyPrefix: `${veri.index}.private_key`,
                        tagPrefix: ``,
                        fileName: 'Key file',
                        id: `private_key_0`,
                    }}
                />
                <ConditionalComponent
                    shouldRender={startsWithAny("watched_directory", selectedTags)}
                    Component={CommonComponentWatchedDirectory}
                    componentProps={{
                        version: veri.version,
                        reduxStore: veri.reduxStore?.watched_directory,
                        keyPrefix: `${veri.index}.watched_directory`,
                        id: `watched_directory_0`,
                    }}
                />
                <ConditionalComponent
                    shouldRender={startsWithAny("password", selectedTags)}
                    Component={CommonComponentDataSource}
                    componentProps={{
                        version: veri.version,
                        parentName: 'Password',
                        reduxStore: veri.reduxStore?.password,
                        keyPrefix: `${veri.index}.password`,
                        tagPrefix: ``,
                        fileName: 'Password file',
                        id: `password_0`,
                    }}
                />
                <ConditionalComponent
                    shouldRender={startsWithAny("ocsp_staple", selectedTags)}
                    Component={CommonComponentDataSource}
                    componentProps={{
                        version: veri.version,
                        parentName: 'OCSP Staple',
                        reduxStore: veri.reduxStore?.ocsp_staple,
                        keyPrefix: `${veri.index}.ocsp_staple`,
                        tagPrefix: ``,
                        fileName: 'Secret file',
                        id: `ocsp_staple_0`,
                    }}
                />
            </Col>
        </Row>
    )
}


export default React.memo(TlsCertificateComponent);

const expandedRowRender = (data: any, index: number, veri: any) => {
    return (
        <TlsCertificateComponentChild veri={{
            version: veri.version,
            gtype: veri.gtype,
            reduxStore: data,
            index: index,
        }} />
    );
};