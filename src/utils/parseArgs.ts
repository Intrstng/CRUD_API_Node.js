export type ProcessArgs = Record<string, string>;

export const parseArgs = (args: string[]): ProcessArgs => {
    return args.slice(2).reduce((acc, arg) => {
        const [key, value] = arg.split('=');
        return {
            ...acc,
            [key.slice(2)]: value,
        };
    }, {});
};