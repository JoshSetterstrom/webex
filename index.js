import Webex from './client/Webex.js';
import AuditExcelExporter from './audits/AuditExcelExporter.js';

import createWorkspaceAudits from './audits/createWorkspaceAudits.js';
import createDeviceAudits from './audits/createDeviceAudits.js';
import createHuntGroupAudits from './audits/createHuntGroupAudits.js';
import createPickupGroupAudits from './audits/createPickupGroupAudits.js';
import createCallParkAudits from './audits/createCallParkAudits.js';

import fs from 'fs';
import sleep from './utils/sleep.js';

const client = new Webex();

const stores = "066";

const locations = await client.get('/v1/telephony/config/locations');

for ( const store of stores.split(' ') ) {
    const start = performance.now();

    const excel = new AuditExcelExporter();

    const location = locations.locations.find(x => x.name.includes(store));
    
    await createWorkspaceAudits(client, excel, location, store);
    await createDeviceAudits(client, excel, location, store);
    await createHuntGroupAudits(client, excel, location, store);
    await createPickupGroupAudits(client, excel, location, store);
    await createCallParkAudits(client, excel, location, store);
    
    await excel.write(`${location.name} Audit.xlsx`);

    const end = performance.now();

    console.log(`${client.count} total calls in ${((end - start)/1000).toFixed(1)} seconds`);
};