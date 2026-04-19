import yaml from 'js-yaml';
import fs from 'fs';

import sleep from '../utils/sleep.js';
import auditPickupGroup from './auditPickupGroup.js';

const createPickupGroupAudits = async (client, excel, location, store) => {
    const pickupGroups = await client.get(`/v1/telephony/config/locations/${location.id}/callPickups`);

    const config = yaml.load(fs.readFileSync('./config/pickupGroupSettings.yaml', 'utf-8'));

    excel.headers = ['name', 'type', 'settings.meta.name', 'agents']
    excel.idColumns = ['name'];
    excel.createSheet('Pickup Groups');

    for ( const pickupGroup of pickupGroups.callPickups ) {
        console.log(pickupGroup.name);

        try {
            const [ audit, setting ] = await auditPickupGroup(client, config, location, pickupGroup, store);
        
            excel.addRow({ name: pickupGroup.name }, audit);
        } catch (error) {
            console.error(`Error auditing Pickup Group ${pickupGroup.name}:`, error.message);
        }

        await sleep(process.env.SLEEP_INTERVAL);
    };
};

export default createPickupGroupAudits;