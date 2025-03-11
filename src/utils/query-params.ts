const buildQueryParams = (data: { [key: string]: any }): string => {
    let queryParams = '?';
    const keys = Object.keys(data);
    for (let i = 0; i < keys.length; i++) {
        const key = keys[i];
        const value = data[keys[i]].toString();

        queryParams += `${key}=${value}`;

        if (i !== keys.length - 1) {
            queryParams += '&';
        }
    }

    return queryParams;
};

export { buildQueryParams };
