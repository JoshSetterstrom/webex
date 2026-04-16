import getReport from '../services/getSettings.js';

const buildLocationReport = async (client, locationId) => {
    const exportData = true;

    return getReport('location', client, locationId, exportData);
};

export default buildLocationReport;