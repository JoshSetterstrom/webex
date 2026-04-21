import yaml from 'js-yaml';
import fs from 'fs';

import auditWorkspace from './auditWorkspace.js';
import sleep from '../utils/sleep.js';

const createWorkspaceAudits = async (client, excel, location, store) => {
    const workspaces = await client.get(`/v1/workspaces?locationId=${location.id}`);
    const devices = await client.get(`/v1/devices?locationId=${location.id}`)
    const config = yaml.load(fs.readFileSync('./config/workspaceSettings.yaml', 'utf-8'));

    const rxItems = [ "6010", "6020", "6030", "6040", "6050", "6051", "6061", "6062", "6063", "6064", "6290", "6360", "6370" ];

    // Get RX shared workspaces
    for ( const i in devices.items ) {
        const isRx = !!rxItems.find(x => devices.items[i].displayName.includes(x));

        if (isRx) {
            const res = await client.get(`/v1/telephony/config/devices/${devices.items[i].id}/members`);

            devices.items[i].members = res.members;
        } else {
            devices.items[i].members = [];
        };
    };

    const keys = config?.extensions || {};
    const global = config?.global_settings || {};

    excel.createHeaders(['extension'], global, keys);
    excel.createSheet('Workspaces');

    const workspace = workspaces.items.find(x => x.displayName.includes('6290'))
    
    // for ( const workspace of workspaces.items ) {
        console.log(workspace.displayName)

        // try {
            const [ audit, settings ] = await auditWorkspace(client, config, devices.items, location.id, workspace.id, store);

            excel.addRow({extension: settings?.features?.numbers?.[0]?.extension}, audit);
        // } catch (error) {
        //     console.error(`Error auditing workspace ${workspace.displayName}:`, error.message);
        // };

        // await sleep(process.env.SLEEP_INTERVAL);
    // };
};

export default createWorkspaceAudits;