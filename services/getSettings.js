import fs from 'fs';
import yaml from 'js-yaml';
import walkConfig from '../utils/walkConfig.js';
import resolveConfig from '../utils/resolveConfig.js';

const getSettings = async (namespace, client, locationId, id, exportData=false) => {
    const config = yaml.load(fs.readFileSync(`./config/${namespace}.yaml`, 'utf-8'));
    const schema = config[namespace];

    if (!schema) throw new Error(`Missing ${namespace} in config`);

    const p1 = await walkConfig(client, schema, { locationId, [`${namespace}Id`]: id });
    const p2 = await resolveConfig(client, p1);

    if (exportData) fs.writeFileSync(`./files/${namespace}.json`, JSON.stringify(p2, null, 2), 'utf-8');

    return p2;
};

export default getSettings;