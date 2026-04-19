import getSettings from '../services/getSettings.js';
import getNestedValue from '../utils/getNestedValue.js';
import replacePlaceholders from '../utils/replacePlaceholders.js';

const auditDevice = async (client, config, locationId, deviceId) => {
    const exportData = true;

    const audit = [];

    const settings = await getSettings('device', client, locationId, deviceId, exportData);

    const storenumber = settings?.meta?.displayName.split(' ')[0]?.replace('LD', '');
    const extension = settings?.person?.phoneNumbers?.[0]?.value || settings?.workspace?.numbers?.[0]?.extension;

    if (!extension) throw new Error('Missing device extension');

    const template = {
        ...(config.global_settings || {}),
        ...(config.extensions?.[extension] || {})
    };

    const placeholders = { storenumber };

    for (const [path, templateValue] of Object.entries(template)) {
        const expected = replacePlaceholders(templateValue, placeholders);
        const actual = getNestedValue(settings, path);

        audit.push({ path, expected, actual, match: actual === expected });
    };

    return [ audit, settings ];
};

export default auditDevice;