export function createDebounceFunc(cb: Function, delay: number) {
    let timeoutRef: null | NodeJS.Timeout = null;


    return function () {
        if (timeoutRef) {
            clearTimeout(timeoutRef);

            timeoutRef = setTimeout(() => {
                cb()
                clearTimeout(timeoutRef!);
                timeoutRef = null
            }, delay)

        } else {
            timeoutRef = setTimeout(() => cb(), delay)
        }



    }
}