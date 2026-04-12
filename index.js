import Webex from './client/Webex.js';
import buildLocationReport from './reports/buildLocationReport.js';

const webex = new Webex();

const report = await buildLocationReport(webex, 'Y2lzY29zcGFyazovL3VzL0xPQ0FUSU9OLzFkMDI1MjMzLWY0MTctNDE0OC04MTRjLTM5MDlhZDIxZmI5NQ');

console.log(report);