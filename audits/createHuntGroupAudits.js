import yaml from 'js-yaml';
import fs from 'fs';

import sleep from '../utils/sleep.js';
import auditHuntGroup from './auditHuntGroup.js';

const createHuntGroupAudits = async (client, excel, location, store) => {
    const huntGroups = await client.get(`/v1/telephony/config/huntGroups?locationId=${location.id}`);

    const config = yaml.load(fs.readFileSync('./config/huntGroupSettings.yaml', 'utf-8'));

    excel.headers = ['name', 'type', 'settings.meta.name', 'agents'];
    excel.idColumns = ['name'];
    excel.createSheet('Hunt Groups');

    for ( const huntGroup of huntGroups.huntGroups ) {
        console.log(huntGroup.name);

        try {
            const [ audit, setting ] = await auditHuntGroup(client, config, location, huntGroup, store);
        
            excel.addRow({ name: huntGroup.name }, audit);
        } catch (error) {
            console.error(`Error auditing Hunt Group ${huntGroup.name}:`, error.message);
        };

        await sleep(process.env.SLEEP_INTERVAL);
    };
};

export default createHuntGroupAudits;