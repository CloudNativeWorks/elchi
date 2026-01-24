import React, { useState, useEffect, Suspense } from "react";
import { flushSync } from "react-dom";
import { useLocation, useParams, useSearchParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useCustomGetQuery } from "@/common/api";
import { ActionType, ResourceType } from "@/redux/reducer-helpers/common";
import { ClearResources, ResourceAction } from "@/redux/reducers/slice";
import { getApiPathFromLocation } from "@/utils/tools";
import { getFieldsByKey } from "@/common/statics/gtypes";
import { useProjectVariable } from "@/hooks/useProjectVariable";
import { Version } from "@/conf";
import SelectVersion from "@/elchi/components/common/SelectVersion";
import RenderLoading from "@/elchi/components/common/Loading";
import UnsupportedVersion from "@/components/UnsupportedVersion";
import ComponentLoadErrorBoundary from "@/components/ComponentLoadErrorBoundary";
import { useComponentLoader } from "@/hooks/useComponentLoader";


type state = {
    version: Version | null;
    generalName: string;
    gtype: string;
    managed: boolean;
}

const Resource: React.FC = () => {
    const { resource } = useParams();
    const GType = getFieldsByKey(resource)
    const location = useLocation();
    const dispatch = useDispatch();
    const { project } = useProjectVariable();
    const [searchParams] = useSearchParams();

    // Check for duplicate parameters
    const isDuplicate = searchParams.get('duplicate') === 'true';
    const isUpgrade = searchParams.get('upgrade') === 'true';
    const duplicateResourceId = searchParams.get('resource_id');
    const urlVersion = searchParams.get('version');
    const sourceVersion = searchParams.get('source_version'); // For upgrade: source version to fetch data

    const [state, setState] = useState<state>({
        version: urlVersion as Version || null,
        generalName: 'resource',
        gtype: "",
        managed: false,
    });

    // Enhanced component loader with timeout and retry
    const {
        component: VersionedComponent,
        isLoading: isComponentLoading,
        error: componentError,
        retryCount,
        loadComponent,
        retryLoad,
        reset: resetComponentLoader,
        isComponentReady,
    } = useComponentLoader({
        maxRetries: 3,
        timeout: 10000,
        retryDelay: 1000,
        onError: (error, retryCount) => {
            console.error(`Component loading failed (attempt ${retryCount + 1}):`, error);
        }
    });

    const { data: dataQuery, isFetching: fechingQuery } = useCustomGetQuery({
        queryKey: `query_${GType.createPath}_${project}`,
        enabled: location.pathname !== GType.createPath,
        path: `${getApiPathFromLocation(GType.backendPath)}&project=${project}&version=${state.version}`,
    });

    // Fetch original resource data for duplication
    const duplicateResourceName = searchParams.get('resource_name');
    // For upgrade: use source_version to fetch the resource, otherwise use urlVersion
    const fetchVersion = isUpgrade && sourceVersion ? sourceVersion : (urlVersion || state.version);
    const { data: duplicateResourceData, isFetching: fetchingDuplicate } = useCustomGetQuery({
        queryKey: `duplicate_${duplicateResourceId}_${project}_${fetchVersion}`,
        enabled: isDuplicate && !!duplicateResourceId && !!duplicateResourceName && location.pathname === GType.createPath,
        path: `${GType.backendPath}/${duplicateResourceName}?resource_id=${duplicateResourceId}&project=${project}&version=${fetchVersion}`,
    });

    // Load component when version changes
    useEffect(() => {
        if (state.version && GType.module && !isComponentReady && !isComponentLoading) {
            loadComponent(GType.module);
        }
    }, [state.version, GType.module, isComponentReady, isComponentLoading, loadComponent]);

    // Reset component loader when resource type changes
    useEffect(() => {
        resetComponentLoader();
    }, [resource, resetComponentLoader]);

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

            // Update state with duplicate data
            // For upgrade: keep the name, for duplicate: clear the name
            setState(prevState => ({
                ...prevState,
                generalName: isUpgrade ? duplicateResourceData.general?.name || '' : '', // Keep name for upgrade, clear for duplicate
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

    // Handle version control without the componentsLoaded field
    useEffect(() => {
        setState(prevState => ({ 
            ...prevState, 
            version: null, 
            generalName: 'resource' 
        }));
        resetComponentLoader();
    }, [location.pathname, resetComponentLoader]);

    const shouldShowSelectVersion = !state.version && location.pathname === GType.createPath;
    const canRenderVersionedComponent = isComponentReady && VersionedComponent && state.version;
    const shouldShowLoading = !shouldShowSelectVersion && !canRenderVersionedComponent && !componentError;

    // Check if version is supported
    const isVersionSupported = state.version && window.APP_CONFIG?.AVAILABLE_VERSIONS?.includes(state.version);
    
    if (state.version && !isVersionSupported) {
        return <UnsupportedVersion version={state.version} />;
    }

    // Show loading when actually loading or when component should render but isn't ready yet
    if (shouldShowLoading || isComponentLoading) {
        return <RenderLoading checkPage={true} isLoadingQuery={true} error={""} />;
    }

    return (
        <ComponentLoadErrorBoundary
            componentName={GType.prettyName}
            onRetry={() => retryLoad(GType.module)}
            onGoBack={() => window.history.back()}
        >
            {shouldShowSelectVersion ? (
                <SelectVersion
                    setState={setState}
                    currentState={state}
                    GType={GType}
                />
            ) : componentError ? (
                <div style={{
                    padding: '40px 20px',
                    textAlign: 'center',
                    background: 'var(--card-bg)',
                    borderRadius: '8px',
                    margin: '20px',
                    boxShadow: 'var(--shadow-md)',
                    border: '1px solid var(--border-default)'
                }}>
                    <h3 style={{ color: 'var(--color-danger)', marginBottom: '16px' }}>Component Loading Failed</h3>
                    <p style={{ color: 'var(--text-secondary)', marginBottom: '20px' }}>{componentError}</p>
                    {retryCount > 0 && (
                        <p style={{ color: 'var(--color-warning)', fontSize: '14px', marginBottom: '20px' }}>
                            Retry attempts: {retryCount}/3
                        </p>
                    )}
                    <button 
                        onClick={() => retryLoad(GType.module)}
                        style={{
                            background: 'var(--color-primary)',
                            color: 'white',
                            border: 'none',
                            padding: '8px 16px',
                            borderRadius: '4px',
                            cursor: 'pointer'
                        }}
                    >
                        Retry Loading
                    </button>
                </div>
            ) : (
                <Suspense fallback={<RenderLoading checkPage={true} isLoadingQuery={true} error={""} />}>
                    <VersionedComponent
                        veri={{
                            ...state,
                            queryResource: dataQuery,
                            changeGeneralName: changeGeneralName,
                            changeGeneralManaged: changeGeneralManaged,
                        }}
                    />
                </Suspense>
            )}
        </ComponentLoadErrorBoundary>
    );
};

export default React.memo(Resource);
