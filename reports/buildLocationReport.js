import getReport from '../services/getReport.js';

const buildLocationReport = async (client, locationId) => {
    const exportData = true;

    return getReport('location', client, locationId, exportData);
};

export default buildLocationReport;