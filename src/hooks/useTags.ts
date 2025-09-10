import { useState, useEffect } from 'react';

interface TagEntry {
    alias: string;
    relativePath: string;
    names: string[];
}

interface UseTagsResult {
    vTags: { [alias: string]: any };
    loading: boolean;
    error: { [alias: string]: any } | null;
}

interface TagMapType {
    [relativePath: string]: () => Promise<{ [tagName: string]: any }>;
}

interface TagMapModule {
    tagMap: TagMapType;
}

export function useTags(version: string, entries: TagEntry[]): UseTagsResult {
    const [vTags, setVTags] = useState<{ [alias: string]: any }>({});
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<{ [alias: string]: any } | null>(null);
    
    useEffect(() => {
        let isMounted = true;

        async function fetchTags() {
            setLoading(true);
            setError(null);

            const tagMap = await getTagMap(version);
            
            if (!tagMap) {
                if (isMounted) {
                    
                    setError({ general: `Tag map not found: ${version}` });
                    setLoading(false);
                }
                return;
            }

            const data: { [alias: string]: any } = {};
            const errors: { [alias: string]: any } = {};

            await Promise.all(
                entries.map(async (entry) => {
                    const { alias, relativePath, names } = entry;
                    const importFunc = tagMap[relativePath];

                    if (!importFunc) {
                        errors[alias] = `Module not found in tagMap: ${relativePath}`;
                        return;
                    }

                    try {
                        const tagModule = await importFunc();
                        names.forEach(tagName => {
                            if (tagModule[tagName]) {
                                if (tagName.endsWith('_SingleFields')) {
                                    data[alias][tagName] = tagModule[tagName];
                                } else {
                                    if (!data[alias]) {
                                        data[alias] = {};
                                    }

                                    Object.assign(data[alias], tagModule[tagName]);
                                }
                            } else {
                                errors[alias] = `TagName not found in tagModule: ${tagName}`;
                            }
                        });
                    } catch (err) {
                        errors[alias] = `Error loading module: ${err}`;
                    }
                })
            );

            if (isMounted) {
                setVTags(data);
                setError(Object.keys(errors).length > 0 ? errors : null);
                setLoading(false);
            }
        }

        fetchTags();

        return () => {
            isMounted = false;
        };
    }, [version, entries]);


    return { vTags, loading, error };
}

async function getTagMap(version: string): Promise<TagMapType | null> {
    try {
        const tagMapModules: Record<string, () => Promise<TagMapModule>> = import.meta.glob<TagMapModule>(
            `../elchi/versions/*/tags/tagMap.ts`
        );

        const importPath = `../elchi/versions/${version}/tags/tagMap.ts`;
        const importer = tagMapModules[importPath];

        if (importer) {
            const tagMapModule = await importer();
            return tagMapModule.tagMap;
        } else {
            console.error(`Tag map not found: ${version}`);
            return null;
        }
    } catch (error) {
        console.error(`An error occurred while initialising tag map: ${error}`);
        return null;
    }
}
