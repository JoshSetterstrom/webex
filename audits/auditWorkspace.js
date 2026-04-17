import getSettings from '../services/getSettings.js';
import getPSTN from '../services/getPSTN.js';

const getNestedValue = (obj, path) => {
    const tokens = path
        .replace(/\[(\d+)\]/g, '.$1')
        .split('.')
        .filter(Boolean)
        .map(x => /^\d+$/.test(x) ? Number(x) : x);

    return tokens.reduce((acc, key) => acc?.[key], obj);
};

const replacePlaceholders = (value, placeholders) => {
    if (typeof value !== 'string') return value;

    return value.replace(/\{([^}]+)\}/g, (_, key) => placeholders[key] ?? `{${key}}`);
};

const auditWorkspace = async (client, config, locationId, workspaceId) => {
    const exportData = true;

    const settings = await getSettings('workspace', client, locationId, workspaceId, exportData);
    const pstn = await getPSTN(client, locationId);

    const displayName = settings?.meta?.displayName || '';
    const storenumber = displayName.split(' ')[0]?.replace('LD', '');
    const extension = settings?.features?.numbers?.[0]?.extension;

    if (!extension) throw new Error('Missing workspace extension');

    const template = {
        ...(config.workspace_settings.global_settings || {}),
        ...(config.workspace_settings.extensions?.[extension] || {})
    };

    const placeholders = { storenumber, ...pstn };

    const audit = [];

    for (const [path, templateValue] of Object.entries(template)) {
        const expected = replacePlaceholders(templateValue, placeholders);
        const actual = getNestedValue(settings, path);

        audit.push({ path, expected, actual, match: actual === expected });
    }

    return [audit, settings];
};

export default auditWorkspace;