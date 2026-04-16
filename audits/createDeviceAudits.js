import yaml from 'js-yaml';
import fs from 'fs';

import auditDevice from './auditDevice.js';
import sleep from '../utils/sleep.js';

const createDeviceAudits = async (client, excel, location, store) => {
    const devices = await client.get(`/v1/devices?locationId=${location.id}`);
    const config = yaml.load(fs.readFileSync('./config/device_settings.yaml', 'utf-8'));

    const keys = config?.device_settings?.extensions || {};
    const global = config?.device_settings?.global_settings || {};

    excel.createHeaders(['displayName'], global, keys);
    excel.createSheet('Devices');
    
    for ( const device of devices.items ) {
        console.log(device.displayName)

        try {
            const [ audit, settings ] = await auditDevice(client, config, location.id, device.id);
        
            excel.addRow({ displayName: device.displayName }, audit);
        } catch (error) {
            console.error(`Error auditing device ${device.id}:`, error.message);
        }

        await sleep(1000);
    };

};

export default createDeviceAudits;