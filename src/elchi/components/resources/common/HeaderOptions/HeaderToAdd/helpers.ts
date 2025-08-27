export const makeHeaderValue = (values: any) => {
    return {
        header: {
            key: values.key,
            value: values.value,
        },
        append_action: values.append_action,
        keep_empty_value: values.keep_empty_value
    }
};

export const checkIfExists = (reduxStore: any, key: string) => {
    return reduxStore?.some((item: any) =>
        item.header?.key === key
    );
};