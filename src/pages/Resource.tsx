import React, { useState, useEffect, Suspense } from "react";
import { useLocation, useParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useCustomGetQuery } from "@/common/api";
import * as dynamicModules from "@/VersionedComponent";
import { ActionType, ResourceType } from "@/redux/reducer-helpers/common";
import { ClearResources, ResourceAction } from "@/redux/reducers/slice";
import { getApiPathFromLocation } from "@/utils/tools";
import { getFieldsByKey } from "@/common/statics/gtypes";
import { useProjectVariable } from "@/hooks/useProjectVariable";
import { Version } from "@/conf";
import useVersionControl from "@/hooks/useVersionControl";
import SelectVersion from "@/elchi/components/common/SelectVersion";
import { useLoading } from "@/hooks/loadingContext";
import RenderLoading from "@/elchi/components/common/Loading";


type state = {
    version: Version | null;
    componentsLoaded: boolean;
    generalName: string;
    gtype: string;
    managed: boolean;
}

type Components = Record<dynamicModules.ComponentName, React.ComponentType<any>>;

const Resource: React.FC = () => {
    const { resource } = useParams();
    const GType = getFieldsByKey(resource)
    const location = useLocation();
    const dispatch = useDispatch();
    const { project } = useProjectVariable();
    const { loadingCount, incrementLoading, decrementLoading } = useLoading();
    const [components, setComponents] = useState<Partial<Components>>({})

    const [state, setState] = useState<state>({
        version: null,
        componentsLoaded: false,
        generalName: 'resource',
        gtype: "",
        managed: false,
    });

    const { data: dataQuery, isFetching: fechingQuery, isLoading } = useCustomGetQuery({
        queryKey: `query_${GType.createPath}_${project}`,
        enabled: location.pathname !== GType.createPath,
        path: `${getApiPathFromLocation(GType.backendPath)}&project=${project}`,
    });

    const loadComponent = async (moduleName: string) => {
        try {
            const module = await dynamicModules.availableModule(moduleName);
            setComponents({ VersionedComponent: module.VersionedComponent });
            setState((prevState) => ({ ...prevState, componentsLoaded: true }));
        } catch (error) {
            console.error(`Failed to load component ${moduleName}:`, error);
        } finally {
            decrementLoading();
        }
    };

    useEffect(() => {
        if (state.version && !state.componentsLoaded && loadingCount === 0) {
            incrementLoading();
            loadComponent(GType.module);
        }
    }, [state.version, GType.module, state.componentsLoaded, incrementLoading, decrementLoading, loadingCount]);

    useEffect(() => {
        if (!dataQuery || fechingQuery || location.pathname === GType.createPath) return;
        const fillRedux = async () => {
            const newState = {
                version: dataQuery.general.version,
                generalName: dataQuery.general.name || state.generalName,
                managed: dataQuery.general?.managed || state.managed,
                name: dataQuery.general?.service?.name,
                enabled: dataQuery.general?.service?.enabled,
                gtype: dataQuery.general?.gtype
            };

            setState(prevState => ({ ...prevState, ...newState }));
            dispatch(ClearResources({ version: dataQuery.general.version, initialValue: GType.initialValue }));
            dispatch(
                ResourceAction({
                    version: dataQuery.general.version,
                    type: ActionType.Set,
                    val: dataQuery.resource.resource,
                    resourceType: ResourceType.Resource
                })
            );

            if (dataQuery.general?.config_discovery) {
                dispatch(
                    ResourceAction({
                        version: dataQuery.general.version,
                        type: ActionType.Set,
                        val: dataQuery.general?.config_discovery,
                        keys: [],
                        resourceType: ResourceType.ConfigDiscovery
                    })
                )
            }
        };
        fillRedux();
    }, [dataQuery, dispatch, fechingQuery, location.pathname, GType.createPath, GType.initialValue, state.generalName, state.managed]);

    const changeGeneralName = (name: string) => setState({ ...state, generalName: name });
    const changeGeneralManaged = (managed: boolean) => setState({ ...state, managed: managed });

    useVersionControl(setState);

    const shouldShowSelectVersion = !state.version && location.pathname === GType.createPath;
    const canRenderVersionedComponent = state.componentsLoaded && components.VersionedComponent && state.version;
    const isLoadingState = loadingCount > 0 || isLoading || fechingQuery;

    if (isLoadingState && !canRenderVersionedComponent) {
        return <RenderLoading checkPage={true} isLoadingQuery={true} error={""} />;
    }

    return (
        <>
            {shouldShowSelectVersion ? (
                <SelectVersion
                    setState={setState}
                    currentState={state}
                    GType={GType}
                />
            ) : (
                canRenderVersionedComponent && (
                    <Suspense fallback={<RenderLoading checkPage={true} isLoadingQuery={false} error={""} />}>
                        <components.VersionedComponent
                            veri={{
                                ...state,
                                queryResource: dataQuery,
                                changeGeneralName: changeGeneralName,
                                changeGeneralManaged: changeGeneralManaged,
                            }}
                        />
                    </Suspense>
                )
            )}
        </>
    );
};

export default React.memo(Resource);
