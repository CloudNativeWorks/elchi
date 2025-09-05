import { useState, useCallback } from 'react';
import { handleChangeResources } from "@/redux/dispatcher";
import { ActionType, ResourceType } from "@/redux/reducer-helpers/common";
import { useDispatch } from 'react-redux';


type TabState = {
    activeTab: string;
    updateCount: number;
};

type UseTabManagerProps = {
    initialActiveTab?: string;
    reduxStore?: any[];
    keyPrefix: string;
    version: string;
    reduxAction: any;
};

const useTabManager = ({ initialActiveTab = "0", reduxStore, keyPrefix, version, reduxAction }: UseTabManagerProps) => {
    const dispatch = useDispatch();
    const [state, setState] = useState<TabState>({
        activeTab: initialActiveTab,
        updateCount: 0
    });

    const onChangeTabs = useCallback((newActiveKey: string) => {
        setState((prevState) => ({
            ...prevState,
            activeTab: newActiveKey
        }));
    }, []);

    const incrementUpdateCount = useCallback(() => {
        setState((prevState) => ({
            ...prevState,
            updateCount: prevState.updateCount + 1
        }));
    }, []);

    const addTab = useCallback((
        targetKey: React.MouseEvent | React.KeyboardEvent | string,
        action: 'add' | 'remove') => {
        if (action === 'add') {
            handleChangeResources({ version, type: ActionType.Append, keys: keyPrefix, val: {}, resourceType: ResourceType.Resource }, dispatch, reduxAction);
            const objLength = (reduxStore?.length) ?? 0;
            onChangeTabs((objLength).toString());
        } else if (action === 'remove' && targetKey !== undefined) {
            const targetIndex = parseInt(targetKey as string, 10);
            const newActiveKey = (targetIndex - 1) < 0 ? "0" : (targetIndex - 1).toString();
            incrementUpdateCount();
            onChangeTabs(newActiveKey);
            handleChangeResources({
                version,
                type: ActionType.Delete,
                keys: `${keyPrefix}.${targetIndex}`,
                resourceType: ResourceType.Resource
            }, dispatch, reduxAction);
        }
    }, [reduxStore, keyPrefix, version, reduxAction, onChangeTabs, incrementUpdateCount]);

    return { state, onChangeTabs, incrementUpdateCount, addTab };
};

export default useTabManager;