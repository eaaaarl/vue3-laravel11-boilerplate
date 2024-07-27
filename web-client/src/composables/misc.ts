export function useMisc() {
    return {
        debounce({ fn, delay }: any) {
            let timeout: any;

            return (...args: any) => {
                if (timeout) {
                    clearTimeout(timeout);
                }

                timeout = setTimeout(() => {
                    fn(...args);
                }, delay);
            };
        },
    };
}