import yaml from 'js-yaml';
import fs from 'fs';

import getSettings from '../services/getSettings.js';

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

const auditHuntGroup = async (client, config, locationId, huntGroupId) => {
    const exportData = true;

    const settings = await getSettings('huntGroup', client, locationId, huntGroupId, exportData);

    console.log(settings)

    // const displayName = settings?.meta?.displayName || '';
    // const storenumber = displayName.split(' ')[0]?.replace('LD', '');
    // const extension = settings?.person?.phoneNumbers?.[0]?.value || settings?.workspace?.numbers?.[0]?.extension;

    // if (!extension) throw new Error('Missing device extension');

    // const template = {
    //     ...(config.device_settings.global_settings || {}),
    //     ...(config.device_settings.extensions?.[extension] || {})
    // };

    // const placeholders = { storenumber };

    // const audit = [];

    // for (const [path, templateValue] of Object.entries(template)) {
    //     const expected = replacePlaceholders(templateValue, placeholders);
    //     const actual = getNestedValue(settings, path);

    //     audit.push({ path, expected, actual, match: actual === expected });
    // }

    // return [ audit, settings ];
};

export default auditHuntGroup;