import React, { createContext, useContext, useState, ReactNode } from "react";

interface LoadingContextType {
    loadingCount: number;
    incrementLoading: () => void;
    decrementLoading: () => void;
}

const LoadingContext = createContext<LoadingContextType | undefined>(undefined);

export const LoadingProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [loadingCount, setLoadingCount] = useState(0);

    const incrementLoading = () => setLoadingCount((prev) => prev + 1);
    const decrementLoading = () => setLoadingCount((prev) => Math.max(0, prev - 1));

    return (
        <LoadingContext.Provider value={{ loadingCount, incrementLoading, decrementLoading }}>
            {children}
        </LoadingContext.Provider>
    );
};

export const useLoading = (): LoadingContextType => {
    const context = useContext(LoadingContext);
    if (!context) {
        throw new Error("useLoading must be used within a LoadingProvider");
    }
    return context;
};