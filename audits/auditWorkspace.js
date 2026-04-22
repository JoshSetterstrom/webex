import getSettings from '../services/getSettings.js';
import getPSTN from '../services/getPSTN.js';
import getNestedValue from '../utils/getNestedValue.js';
import replacePlaceholders from '../utils/replacePlaceholders.js';
import evaluate from '../utils/evaluate.js';

const auditWorkspace = async (client, config, devices, locationId, workspaceId, store) => {
    const exportData = true;
    const audit = [];

    const settings = await getSettings('workspace', client, locationId, workspaceId, exportData);
    const pstn = await getPSTN(client, locationId);

    const associatedDevices = devices.map(device => {
        const member = device.members.find(x => x.extension === settings.features.numbers[0].extension);

        return member ? device : null;
    }).filter(x => x);

    settings.members = associatedDevices;

    const displayName = settings?.meta?.displayName || '';
    const extension = settings?.features?.numbers?.[0]?.extension;

    if (!extension) throw new Error('Missing workspace extension');

    const template = {
        ...(config.global_settings || {}),
        ...(config.extensions?.[extension] || {})
    };

    const placeholders = { store, storenumber: Number(store).toString().padStart(2, '0'), ...pstn };

    for (const [ path, templateValue ] of Object.entries(template)) {
        const expected = replacePlaceholders(templateValue, placeholders);
        const actual = getNestedValue(settings, path);

        audit.push({ path, ...evaluate(templateValue, actual, expected) });
    }

    return [audit, settings];
};

export default auditWorkspace;