import yaml from 'js-yaml';
import fs from 'fs';

import auditWorkspace from './auditWorkspace.js';
import sleep from '../utils/sleep.js';

const createWorkspaceAudits = async (client, excel, location, store) => {
    const workspaces = await client.get(`/v1/workspaces?locationId=${location.id}`);
    const config = yaml.load(fs.readFileSync('./config/workspace_settings.yaml', 'utf-8'));

    const keys = config?.workspace_settings?.extensions || {};
    const global = config?.workspace_settings?.global_settings || {};

    excel.createHeaders(['extension'], global, keys);
    excel.createSheet('Workspaces');
    
    for ( const workspace of workspaces.items ) {
        console.log(workspace.id)

        try {
            const [ audit, settings ] = await auditWorkspace(client, config, location.id, workspace.id);

            excel.addRow({extension: settings?.features?.numbers?.[0]?.extension}, audit);
        } catch (error) {
            console.error(`Error auditing workspace ${device.id}:`, error.message);
        };

        await sleep(1000);
    };
};

export default createWorkspaceAudits;