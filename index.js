import Webex from './client/Webex.js';
import buildLocationReport from './reports/buildLocationReport.js';
import buildWorkspaceReport from './reports/buildWorkspaceReport.js';

const webex = new Webex();

const locationId = 'Y2lzY29zcGFyazovL3VzL0xPQ0FUSU9OLzFkMDI1MjMzLWY0MTctNDE0OC04MTRjLTM5MDlhZDIxZmI5NQ';
// const workspaceId = 'Y2lzY29zcGFyazovL3VybjpURUFNOnVzLXdlc3QtMl9yL1BMQUNFLzUxMTJmMjc1LTdkNDEtNDQ4Zi04OTVmLWJiOTQ2M2Q0ODg5MA==';
const workspaceId = 'Y2lzY29zcGFyazovL3VybjpURUFNOnVzLXdlc3QtMl9yL1BMQUNFL2ZiNTI3N2E5LTc4NmItNGY5Zi1iYmU2LWMxOTY0ODU0ZjVmMg==';

const workspace = await buildWorkspaceReport(webex, workspaceId); 
// const report = await buildLocationReport(webex, locationId);

// console.log(workspace);