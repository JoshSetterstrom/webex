import getReport from '../services/getReport.js';

const buildWorkspaceReport = async (client, locationId) => {
    const exportData = true;

    return getReport('workspace', client, locationId, exportData);
};

export default buildWorkspaceReport;