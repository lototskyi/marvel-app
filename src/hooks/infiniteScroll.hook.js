import { useState, useEffect } from "react";

export const useInfiniteScroll = (callback) => {

    const [isFetching, setIsFetching] = useState(false);

    useEffect(() => {
        window.addEventListener('scroll', handleScroll);
        return () => {
            window.removeEventListener('scroll', handleScroll)
        };
    // eslint-disable-next-line
    }, []);

    useEffect(() => {
        if (!isFetching) return;
        callback(() => {
            console.log('called back');
        });
    // eslint-disable-next-line
    }, [isFetching]);

    function handleScroll() {
        if (window.innerHeight + document.documentElement.scrollTop !== document.documentElement.offsetHeight || isFetching) return;
        setIsFetching(true);
    }
    
    return {isFetching, setIsFetching};

}