const isObject = value => value && typeof value === 'object' && !Array.isArray(value);

const interpolatePath = (path, vars = {}) => {
    return path.replace(/\{([^}]+)\}/g, (_, key) => {
        const value = vars[key];

        if (value === undefined || value === null) throw new Error(`Missing path variable: ${key}`);

        return encodeURIComponent(String(value));
    });
};

const walkConfig = async (client, node, vars, currentPath = '') => {
    const output = {};

    for (const [key, value] of Object.entries(node)) {
        if (!isObject(value)) continue;
        if (value.enabled === false) continue;

        const nextPath = currentPath ? `${currentPath}.${key}` : key;
        const hasPath = typeof value.path === 'string';
        const hasResolve = typeof value.resolve === 'string' || isObject(value.resolve);

        if (hasPath) {
            try {
                const resolvedPath = interpolatePath(value.path, vars);

                output[key] = await client.safeGet 
                    ? await client.safeGet(resolvedPath) 
                    : await client.get(resolvedPath);
            } catch (error) {
                output[key] = { _error: true, message: error.message };
            };

            continue;
        };

        if (hasResolve) {
            output[key] = { _resolve: value.resolve };

            continue;
        };

        const childEntries = Object.entries(value).filter(([childKey, childVal]) => isObject(childVal) && childKey !== 'enabled');

        if (childEntries.length) output[key] = await walkConfig(client, value, vars, nextPath);
    }

    return output;
};

export default walkConfig;