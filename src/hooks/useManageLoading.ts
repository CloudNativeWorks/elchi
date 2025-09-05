import { useEffect, useRef } from "react";
import { useLoading } from "./loadingContext";


export const useManagedLoading = (loading: boolean, loading_m?: boolean) => {
    const { incrementLoading, decrementLoading } = useLoading();
    const prevLoading = useRef({ loading: false, loading_m: false });

    useEffect(() => {
        const prev = prevLoading.current;

        if ((loading && !prev.loading) || (loading_m && !prev.loading_m)) {
            incrementLoading();
        } else if ((!loading && prev.loading) || (!loading_m && prev.loading_m)) {
            decrementLoading();
        }

        prevLoading.current = { loading, loading_m };

        return () => {
            if (prevLoading.current.loading || prevLoading.current.loading_m) {
                decrementLoading();
            }
        };
    }, [loading, loading_m, incrementLoading, decrementLoading]);
};