import getSettings from '../services/getSettings.js';

const auditHuntGroup = async (client, config, location, huntGroup, store) => {
    const exportData = true;

    const audit = [];

    const workspaces = await client.get(`/v1/workspaces?locationId=${location.id}`);

    const settings = await getSettings('huntGroup', client, location.id, huntGroup.id, exportData);

    // Confirm name and get correct key
    const key = huntGroup.name.replace(/\d+$/, '');
    const extensions = config.agents[key];

    if (!extensions) {
        audit.push({ path: "settings.meta.name", expected: `${key}${Number(store).toString().padStart(3, '0')}`, actual: huntGroup.name, match: false});
    
        return [ audit, settings ];
    };

    if (extensions.includes('*')) {
        const agents = settings.meta.agents.map(x => x.extension)

        audit.push({ path: "agents", expected: agents.sort((a, b) => a - b).join(','), actual: agents.sort((a, b) => a - b).join(','), match: true});

        return [ audit, settings ];
    };

    const expected = extensions.map(e => {
        const workspace = workspaces.items.find(ws => ws.displayName.includes(e));

        return workspace?.displayName.split(' - ').at(-1);
    }).filter(x => x).sort((a, b) => a - b);;

    const actual = settings.meta.agents.map(x => x.extension).sort((a, b) => a - b);

    audit.push({ path: "agents", expected: expected.join(','), actual: actual.join(','), match: actual.toString() === expected.toString()});

    return [ audit, settings ];
};

export default auditHuntGroup;