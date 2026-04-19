import yaml from 'js-yaml';
import fs from 'fs';

import sleep from '../utils/sleep.js';
import auditCallParkGroup from './auditCallParkGroup.js';

const createCallParkAudits = async (client, excel, location, store) => {
    const callParkGroups = await client.get(`/v1/telephony/config/locations/${location.id}/callParks`);
    const config = yaml.load(fs.readFileSync('./config/callParkGroupSettings.yaml', 'utf-8'));

    const callParkGroup = callParkGroups.callParks[0];

    const global = config?.global_settings || {};

    excel.createHeaders(['name'], global);
    excel.createSheet('Call Park Groups');

    const [ audit, setting ] = await auditCallParkGroup(client, config, location, callParkGroup, store);

    excel.addRow({ name: callParkGroup.name }, audit);
};

export default createCallParkAudits;