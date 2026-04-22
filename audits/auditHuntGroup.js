import getSettings from '../services/getSettings.js';

const auditHuntGroup = async (client, config, location, huntGroup, store) => {
    const exportData = true;

    const audit = [];

    const workspaces = await client.get(`/v1/workspaces?locationId=${location.id}`);

    const settings = await getSettings('huntGroup', client, location.id, huntGroup.id, exportData);

    const key = huntGroup.name.replace(`LD${store} `, '').replace(/\d+$/, '');
    const extensions = config.agents[key];

    audit.push({ path: "settings.meta.name", expected: `LD${store} ${key}`, actual: huntGroup.name, match: `LD${store} ${key}` === huntGroup.name});

    if (!extensions) return [ audit, settings ];

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