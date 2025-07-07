import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

type BaseState = {
    version: string | null;
    componentsLoaded: boolean;
    generalName?: string;
};

const useVersionControl = <T extends BaseState>(setState: React.Dispatch<React.SetStateAction<T>>) => {
    const location = useLocation();
    useEffect(() => {
        setState(prevState => ({ ...prevState, version: null, componentsLoaded: false, generalName: 'resource' }));
    }, [location.pathname, setState]);
};

export default useVersionControl;
