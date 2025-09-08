import { useState, useEffect } from 'react';

interface ModelEntry {
    alias: string;
    relativePath: string;
    names: string[];
}

interface UseModelMapResult {
    vModels: { [alias: string]: any };
    loading_m: boolean;
    error_m: { [alias: string]: any } | null;
}

interface ModelMapType {
    [relativePath: string]: () => Promise<{ [modelName: string]: any }>;
}

interface ModelMapModule {
    modelMap: ModelMapType;
}

export function useModels(version: string, entries: ModelEntry[]): UseModelMapResult {
    const [vModels, setVModels] = useState<{ [alias: string]: any }>({});
    const [loading_m, setLoading_m] = useState<boolean>(true);
    const [error_m, setError_m] = useState<{ [alias: string]: any } | null>(null);

    useEffect(() => {
        let isMounted = true;

        async function fetchModels() {
            setLoading_m(true);
            setError_m(null);

            const modelMap = await getModelMap(version);

            if (!modelMap) {
                if (isMounted) {
                    setError_m({ general: `Model map not found: ${version}` });
                    setLoading_m(false);
                }
                return;
            }

            const data: { [alias: string]: any } = {};
            const errors: { [alias: string]: any } = {};

            await Promise.all(
                entries.map(async (entry) => {
                    const { alias, relativePath, names: modelNames } = entry;
                    const importFunc = modelMap[relativePath];

                    if (!importFunc) {
                        errors[alias] = `Module not found in modelMap: ${relativePath}`;
                        return;
                    }

                    try {
                        const modelModule = await importFunc();
                        data[alias] = data[alias] || {};

                        modelNames.forEach(modelName => {
                            if (!modelName.endsWith('_SingleFields')) {
                                if (modelModule[modelName]) {
                                    data[alias][modelName] = modelModule[modelName];
                                } else {
                                    errors[alias] = `ModelName not found in modelModule: ${modelName}`;
                                }
                            }
                        });
                    } catch (err) {
                        errors[alias] = `Error loading module: ${err}`;
                    }
                })
            );

            if (isMounted) {
                setVModels(data);
                setError_m(Object.keys(errors).length > 0 ? errors : null);
                setLoading_m(false);
            }
        }

        fetchModels();

        return () => {
            isMounted = false;
        };
    }, [version, entries]);

    return { vModels, loading_m, error_m };
}

async function getModelMap(version: string): Promise<ModelMapType | null> {
    try {
        const modelMapModules: Record<string, () => Promise<ModelMapModule>> = import.meta.glob<ModelMapModule>(
            `../elchi/versions/*/models/modelMap.ts`
        );

        const importPath = `../elchi/versions/${version}/models/modelMap.ts`;
        const importer = modelMapModules[importPath];

        if (importer) {
            const modelMapModule = await importer();
            return modelMapModule.modelMap;
        } else {
            console.error(`Model map not found: ${version}`);
            return null;
        }
    } catch (error) {
        console.error(`An error occurred while initialising model map: ${error}`);
        return null;
    }
}