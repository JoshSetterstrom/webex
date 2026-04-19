import getSettings from '../services/getSettings.js';
import getNestedValue from '../utils/getNestedValue.js';
import replacePlaceholders from '../utils/replacePlaceholders.js';

const auditCallParkGroup = async (client, config, location, callParkGroup, store) => {
    const exportData = true;
    const audit = [];

    const workspaces = await client.get(`/v1/workspaces?locationId=${location.id}`);

    const settings = await getSettings('callParkGroup', client, location.id, callParkGroup.id, exportData);

    const placeholders = { storenumber: store };

    for (const [ path, templateValue ] of Object.entries(config.global_settings)) {
        const expected = replacePlaceholders(templateValue, placeholders);
        const actual = getNestedValue(settings, path);

        audit.push({ path, expected, actual, match: actual === expected });
    };

    return [ audit, settings ];
};

export default auditCallParkGroup;