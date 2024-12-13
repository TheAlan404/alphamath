export const mergeProps = <T>(...args: (T | null | undefined)[]) => {
    let output = {};
    
    for(let props of args) {
        for(let [k, v] of Object.entries(props)) {
            if(k.startsWith("on")) {
                output[k] = mergeEvents([
                    output[k],
                    v,
                ]);
            } else {
                output[k] = v;
            }
        }
    }

    return output;
};

export const mergeEvents = <E>(
    handlers: (((e: E) => void) | undefined | null)[] = [],
) => {
    return (e: E) => {
        for(let handler of handlers)
            handler?.(e);
    };
};
