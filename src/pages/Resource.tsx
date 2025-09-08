import React, { useState, useEffect, Suspense } from "react";
import { flushSync } from "react-dom";
import { useLocation, useParams, useSearchParams } from "react-router-dom";
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
import RenderLoading from "@/elchi/components/common/Loading";
import UnsupportedVersion from "@/components/UnsupportedVersion";


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
    const [components, setComponents] = useState<Partial<Components>>({})
    const [searchParams] = useSearchParams();

    // Check for duplicate parameters
    const isDuplicate = searchParams.get('duplicate') === 'true';
    const duplicateResourceId = searchParams.get('resource_id');
    const urlVersion = searchParams.get('version');

    const [state, setState] = useState<state>({
        version: urlVersion as Version || null,
        componentsLoaded: false,
        generalName: 'resource',
        gtype: "",
        managed: false,
    });

    const { data: dataQuery, isFetching: fechingQuery } = useCustomGetQuery({
        queryKey: `query_${GType.createPath}_${project}`,
        enabled: location.pathname !== GType.createPath,
        path: `${getApiPathFromLocation(GType.backendPath)}&project=${project}&version=${state.version}`,
    });

    // Fetch original resource data for duplication
    const duplicateResourceName = searchParams.get('resource_name');
    const { data: duplicateResourceData, isFetching: fetchingDuplicate } = useCustomGetQuery({
        queryKey: `duplicate_${duplicateResourceId}_${project}`,
        enabled: isDuplicate && !!duplicateResourceId && !!duplicateResourceName && location.pathname === GType.createPath,
        path: `${GType.backendPath}/${duplicateResourceName}?resource_id=${duplicateResourceId}&project=${project}&version=${urlVersion || state.version}`,
    });

    const loadComponent = async (moduleName: string) => {
        try {
            const module = dynamicModules.availableModule(moduleName);
            setTimeout(() => {
                setComponents({ VersionedComponent: module.VersionedComponent });
                setState((prevState) => ({ ...prevState, componentsLoaded: true }));
            }, 300);
        } catch (error) {
            console.error(`Failed to load component ${moduleName}:`, error);
        }
    };

    useEffect(() => {
        if (state.version && !state.componentsLoaded) {
            loadComponent(GType.module);
        }
    }, [state.version, GType.module, state.componentsLoaded]);

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
                );
            }

            if (dataQuery.general?.elchi_discovery) {
                dispatch(
                    ResourceAction({
                        version: dataQuery.general.version,
                        type: ActionType.Set,
                        val: dataQuery.general?.elchi_discovery,
                        keys: [],
                        resourceType: ResourceType.ElchiDiscovery
                    })
                );
            }
        };
        fillRedux();
    }, [dataQuery, dispatch, fechingQuery, location.pathname, GType.createPath, GType.initialValue, state.generalName, state.managed]);

    // Handle duplicate resource data after version is selected
    useEffect(() => {
        if (!isDuplicate || !duplicateResourceData || !state.version || fetchingDuplicate) return;
        
        const fillDuplicateData = () => {
            // Safely access the duplicate resource data with proper null checks
            const resourceData = duplicateResourceData?.resource?.resource;
            if (!resourceData) {
                console.warn('Duplicate resource data is not available in expected format:', duplicateResourceData);
                return;
            }

            // For array resources, clear names in each array item
            const isArrayResource = Array.isArray(resourceData);
            let duplicatedResource: any;
            
            if (isArrayResource) {
                duplicatedResource = resourceData.map((item: any) => {
                    const newItem = { ...item };
                    // Keep the original names for duplication
                    return newItem;
                });
            } else {
                // For single resources, keep the original name
                duplicatedResource = { ...resourceData };
            }

            // Update state with duplicate data but clear the name
            setState(prevState => ({ 
                ...prevState, 
                generalName: '', // Clear name for duplicate
                managed: duplicateResourceData.general?.managed || false,
                gtype: duplicateResourceData.general?.gtype || ''
            }));

            // Clear and set redux with duplicate data
            dispatch(ClearResources({ version: state.version, initialValue: GType.initialValue }));
            dispatch(
                ResourceAction({
                    version: state.version,
                    type: ActionType.Set,
                    val: duplicatedResource,
                    resourceType: ResourceType.Resource
                })
            );

            if (duplicateResourceData.general?.config_discovery) {
                dispatch(
                    ResourceAction({
                        version: state.version,
                        type: ActionType.Set,
                        val: duplicateResourceData.general?.config_discovery,
                        keys: [],
                        resourceType: ResourceType.ConfigDiscovery
                    })
                );
            }

            if (duplicateResourceData.general?.elchi_discovery) {
                dispatch(
                    ResourceAction({
                        version: state.version,
                        type: ActionType.Set,
                        val: duplicateResourceData.general?.elchi_discovery,
                        keys: [],
                        resourceType: ResourceType.ElchiDiscovery
                    })
                );
            }
        };
        
        fillDuplicateData();
    }, [isDuplicate, duplicateResourceData, state.version, fetchingDuplicate, dispatch, GType.initialValue]);

    const changeGeneralName = (name: string) => setState(prev => ({ ...prev, generalName: name }));
    const changeGeneralManaged = (managed: boolean) => {
        flushSync(() => {
            setState(prev => ({ ...prev, managed: managed }));
        });
    };

    useVersionControl(setState);

    const shouldShowSelectVersion = !state.version && location.pathname === GType.createPath;
    const canRenderVersionedComponent = state.componentsLoaded && components.VersionedComponent && state.version;
    const shouldShowLoading = !shouldShowSelectVersion && !canRenderVersionedComponent;

    // Check if version is supported
    const isVersionSupported = state.version && window.APP_CONFIG?.AVAILABLE_VERSIONS?.includes(state.version);
    
    if (state.version && !isVersionSupported) {
        return <UnsupportedVersion version={state.version} />;
    }

    // Show loading when actually loading or when component should render but isn't ready yet
    if (shouldShowLoading) {
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
                <Suspense fallback={<RenderLoading checkPage={true} isLoadingQuery={true} error={""} />}>
                    <components.VersionedComponent
                        veri={{
                            ...state,
                            queryResource: dataQuery,
                            changeGeneralName: changeGeneralName,
                            changeGeneralManaged: changeGeneralManaged,
                        }}
                    />
                </Suspense>
            )}
        </>
    );
};

export default React.memo(Resource);
