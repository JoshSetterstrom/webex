import getSettings from '../services/getSettings.js';

const auditPickupGroup = async (client, config, location, pickupGroup, store) => {
    const exportData = true;
    const audit = [];

    const workspaces = await client.get(`/v1/workspaces?locationId=${location.id}`);

    const settings = await getSettings('pickupGroup', client, location.id, pickupGroup.id, exportData);

    const key = pickupGroup.name.replace(`8${store}`, '').trim();
    const extensions = config.agents[key];

    if (!extensions) {
        audit.push({ path: "settings.meta.name", expected: "", actual: pickupGroup.name, match: false});
    
        return [ audit, settings ];
    };

    if (extensions.includes('*')) {
        const agents = settings.meta.agents.map(x => x.numbers[0].extension);

        audit.push({ path: "agents", expected: agents.sort((a, b) => a - b).join(','), actual: agents.sort((a, b) => a - b).join(','), match: true});

        return [ audit, settings ];
    };

    const expected = extensions.map(e => {
        const workspace = workspaces.items.find(ws => ws.displayName.includes(e));

        if (workspace || (!workspace && ['6000', '6001'].includes(e))) return e;
    }).filter(x => x).sort((a, b) => a - b);;

    
    const actual = settings.meta.agents.map(x => x.numbers[0].extension).sort((a, b) => a - b);

    audit.push({ path: "agents", expected: expected.join(','), actual: actual.join(','), match: actual.toString() === expected.toString()});

    return [ audit, settings ];
};

export default auditPickupGroup;