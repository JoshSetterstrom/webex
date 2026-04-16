import yaml from 'js-yaml';
import fs from 'fs';

import sleep from '../utils/sleep.js';
import auditHuntGroup from './auditHuntGroup.js';

const createHuntGroupAudits = async (client, excel, location, store) => {
    const huntGroups = await client.get(`/v1/telephony/config/huntGroups?locationId=${location.id}`);
    const config = yaml.load(fs.readFileSync('./config/huntGroup_settings.yaml', 'utf-8'));

    const keys = config?.device_settings?.extensions || {};
    const global = config?.device_settings?.global_settings || {};

    excel.createHeaders(['displayName'], global, keys);
    excel.createSheet('Hunt Groups');

    const huntGroup = huntGroups.huntGroups[0];

    await auditHuntGroup(client, config, location.id, huntGroup.id);
    
    // for ( const device of devices.items ) {
    //     console.log(device.displayName)

    //     try {
    //         const [ audit, settings ] = await auditDevice(client, config, location.id, device.id);
        
    //         excel.addRow({ displayName: device.displayName }, audit);
    //     } catch (error) {
    //         console.error(`Error auditing device ${device.id}:`, error.message);
    //     }

    //     await sleep(1000);
    // };

};

export default createHuntGroupAudits;