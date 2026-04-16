import Webex from './client/Webex.js';
import createWorkspaceAudits from './audits/createWorkspaceAudits.js';
import AuditExcelExporter from './audits/AuditExcelExporter.js';
import createDeviceAudits from './audits/createDeviceAudits.js';
import createHuntGroupAudits from './audits/createHuntGroupAudits.js';

const client = new Webex();

const stores = "023";

const locations = await client.get('/v1/telephony/config/locations');

for ( const store of stores.split(' ') ) {
    const excel = new AuditExcelExporter();

    const location = locations.locations.find(x => x.name.includes(store));
    
    // await createWorkspaceAudits(client, excel, location, store);
    // await createDeviceAudits(client, excel, location, store);
    await createHuntGroupAudits(client, excel, location, store);
    
    // await excel.write(`${location.name} Audit.xlsx`);

    console.log(client.count)
};