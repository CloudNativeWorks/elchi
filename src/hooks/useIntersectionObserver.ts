import { useEffect, useState, RefObject, useCallback } from 'react';

export function useIntersectionObserver(
    elementRef: RefObject<Element>,
    options: IntersectionObserverInit = { threshold: 0.1 }
): boolean {
    const [isVisible, setIsVisible] = useState(false);

    const callback = useCallback((entries: IntersectionObserverEntry[]) => {
        const [entry] = entries;
        if (entry) {
            setIsVisible(entry.isIntersecting);
        }
    }, []);

    useEffect(() => {
        const observer = new IntersectionObserver(callback, options);
        const currentElement = elementRef.current;

        if (currentElement) {
            observer.observe(currentElement);
        }

        return () => {
            if (currentElement) {
                observer.unobserve(currentElement);
            }
            observer.disconnect();
        };
    }, [elementRef, options, callback]);

    return isVisible;
} 