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

        if (typeof value.path === 'string') {
            try {
                const resolvedPath = interpolatePath(value.path, vars);

                const res = await client.get(resolvedPath);

                output[key] = value.key ? res[value.key] : res;
            } catch (error) {
                output[key] = { _error: true, message: error.message };
            };

            continue;
        };

        if (typeof value.resolve === 'string' || isObject(value.resolve)) {
            output[key] = { _resolve: value.resolve };

            continue;
        };

        const childEntries = Object.entries(value).filter(([childKey, childVal]) => isObject(childVal) && childKey !== 'enabled');

        if (childEntries.length) output[key] = await walkConfig(client, value, vars, currentPath ? `${currentPath}.${key}` : key);
    }

    return output;
};

export default walkConfig;