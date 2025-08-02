import { useEffect, useRef } from "react";
import { useLoading } from "./loadingContext";

/**
 * useManagedLoading hook'u, loading durumları yalnızca değiştiğinde increment ve decrement işlemlerini tetikler.
 */
export const useManagedLoading = (loading: boolean, loading_m?: boolean) => {
    const { incrementLoading, decrementLoading } = useLoading();
    const prevLoading = useRef({ loading: false, loading_m: false }); // Önceki durumu saklamak için ref kullanıyoruz

    useEffect(() => {
        const prev = prevLoading.current;

        // Sadece loading durumları değiştiğinde increment/decrement tetiklenir
        if ((loading && !prev.loading) || (loading_m && !prev.loading_m)) {
            incrementLoading();
        } else if ((!loading && prev.loading) || (!loading_m && prev.loading_m)) {
            decrementLoading();
        }

        // Mevcut durumu kaydediyoruz
        prevLoading.current = { loading, loading_m };

        // Bileşen unmount olduğunda temizleme işlemi yapıyoruz
        return () => {
            if (prevLoading.current.loading || prevLoading.current.loading_m) {
                decrementLoading();
            }
        };
    }, [loading, loading_m, incrementLoading, decrementLoading]);
};