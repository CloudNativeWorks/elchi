import React, { createContext, useContext, useState } from 'react';

interface BGPContextType {
    asNumber: number | null;
    setAsNumber: (as: number | null) => void; //eslint-disable-line
}

const BGPContext = createContext<BGPContextType>({
    asNumber: null,
    setAsNumber: () => {}
});

export const useBGPContext = () => useContext(BGPContext);

interface BGPProviderProps {
    children: React.ReactNode;
}

export const BGPProvider: React.FC<BGPProviderProps> = ({ children }) => {
    const [asNumber, setAsNumber] = useState<number | null>(null);

    return (
        <BGPContext.Provider value={{ asNumber, setAsNumber }}>
            {children}
        </BGPContext.Provider>
    );
}; 