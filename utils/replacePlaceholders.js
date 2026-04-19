const replacePlaceholders = (value, placeholders={}) => {
    if (typeof value !== 'string') return value;

    return value.replace(/\{([^}]+)\}/g, (_, key) => placeholders[key] ?? `{${key}}`);
};

export  default replacePlaceholders;