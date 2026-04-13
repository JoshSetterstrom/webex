import flattenSingle from "./flattenSingle.js";

const isObject = value => value && typeof value === 'object' && !Array.isArray(value);

const getNestedValue = (obj, path) => {
    if (!path || typeof path !== 'string') return undefined;

    return path.split('.').reduce((acc, key) => acc?.[key], obj);
};

const resolveNode = async (client, collectedData, resolve) => {
    if (!resolve?.from || !resolve?.path) return { _error: true, message: 'Invalid resolve config' };

    const value = getNestedValue(collectedData, resolve.from);

    if (value == null) return { _error: true, message: `Missing resolve value from "${resolve.from}"` };

    const path = resolve.path.replace('{value}', encodeURIComponent(String(value)));

    const result = client.safeGet
        ? await client.safeGet(path)
        : await client.get(path);

    if (resolve.single) return flattenSingle(result, resolve.key || 'items');

    return result;
};

const resolveConfig = async (client, collectedData) => {
    const walk = async current => {
        if (!isObject(current)) return current;
        
        if (isObject(current._resolve)) return resolveNode(client, collectedData, current._resolve);

        const output = Array.isArray(current) ? [] : {};

        for (const [key, value] of Object.entries(current)) output[key] = await walk(value);

        return output;
    };

    return walk(collectedData);
};

export default resolveConfig;