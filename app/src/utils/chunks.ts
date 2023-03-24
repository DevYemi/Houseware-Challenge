// Create a debounce function
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


// Generate and return a random hex color
export function generateRandomColor(colors: string[]): string {
    const x = Math.round(0xffffff * Math.random()).toString(16);
    const y = (6 - x.length);
    const z = "000000";
    const z1 = z.substring(0, y);
    const color = `#${z1}${x}`

    if (colors.includes(color)) {
        return generateRandomColor(colors)
    } else {
        return color;
    }

}

export function getIsDuplicate(str: string): boolean { //checks and return a boolean if a string contains duplicates
    if (!str) return false
    const store: string[] = [];
    let value: boolean = false;
    for (let i = 0; i < str.length; i++) {
        const char = str[i];

        if (store.includes(char.toLowerCase())) {
            i = str.length + 1;
            value = true
        } else {
            if (char !== " ") store.push(char.toLowerCase())
        }
    }

    return value;
}