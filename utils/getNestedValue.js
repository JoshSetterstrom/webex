const getNestedValue = (obj, path) => {
    const tokens = path
        .replace(/\[(\d+)\]/g, '.$1')
        .split('.')
        .filter(Boolean)
        .map(x => /^\d+$/.test(x) ? Number(x) : x);

    return tokens.reduce((acc, key) => acc?.[key], obj);
};

export default getNestedValue;