import { useEffect, useState } from "react";

const getSafeWidth = () =>
    typeof window !== "undefined" ? window.innerWidth : 1024;

const useViewport = () => {
    const [width, setWidth] = useState(getSafeWidth);

    useEffect(() => {
        if (typeof window === "undefined") return undefined;

        const handleResize = () => setWidth(window.innerWidth);
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    return {
        width,
        isMobile: width <= 640,
        isTablet: width > 640 && width <= 1024,
        isLaptop: width > 1024 && width <= 1440,
        isDesktop: width > 1440,
    };
};

export default useViewport;

