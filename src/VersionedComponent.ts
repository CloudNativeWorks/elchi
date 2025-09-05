import React from "react";

export const componentNames = ['VersionedComponent'] as const;
export type ComponentName = typeof componentNames[number];
export const availableModule = (componentPath: string): Record<ComponentName, React.LazyExoticComponent<React.ComponentType<any>>> => {
    const components = import.meta.glob('./elchi/components/resources/**/*.tsx', { eager: false });
    const importPath = `./elchi/components/resources/${componentPath}.tsx`;

    const importFunction = components[importPath];
    if (!importFunction) {
        console.error("Component not found:", componentPath);
        return {
            VersionedComponent: React.lazy(() => Promise.reject(new Error("Component not found"))),
        };
    }

    return {
        VersionedComponent: React.lazy(() =>
            importFunction().then((module: { default: React.ComponentType<any> }) => ({ default: module.default }))
        ),
    };
};

