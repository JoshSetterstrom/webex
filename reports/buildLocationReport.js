import locationSettings from '../services/locationSettings.js';

const buildLocationReport = async (client, locationId) => {
    return locationSettings(client, locationId)
};

export default buildLocationReport;