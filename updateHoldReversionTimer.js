import Webex from './client/Webex.js';
import axios from 'axios';
import https from 'https';
import qs from 'qs';

const VALID_PRODUCTS = ["Cisco 7821", "Cisco 7841", "Cisco 7861"];

const client = new Webex();
const agent = new https.Agent({ rejectUnauthorized: false });

const locations = await client.get('/v1/telephony/config/locations');
const location = locations.locations.find(x => x.name.includes('200'));

const devices = await client.get(`/v1/devices?locationId=${location.id}`);

// const getDeviceWebAccessValue = async (deviceId) => {
//     try {
//         const response = await client.get(`/v1/telephony/config/devices/${deviceId}/settings`);
    
//         return response.customizations.mpp.mppUserWebAccessEnabled;
//     } catch (err) {
//         return err;
//     };
// };

// const updateDeviceWebAccess = async (deviceId, bool) => {
//     try {
//         await client.put(`/v1/telephony/config/devices/${deviceId}/settings`, { customEnabled: bool, customizations: { mpp: { mppUserWebAccessEnabled: bool } } });
//         const invoke = await client.post(`/v1/telephony/config/devices/${deviceId}/actions/applyChanges/invoke`);

//         return invoke.status === 204;
//     } catch (err) {
//         return err;
//     };
// };

// const checkDeviceWebAccessStatus = async (ip, tries=0) => {
//     if (tries > 6) return `Device unreachable`;

//     try {
//         const response = await axios.get(`https://${ip}/`, { timeout: 3000, httpsAgent: agent });

//         new Promise(r => setTimeout(r, 5000)); // 5 second buffer

//         return true;
//     } catch (err) {
//         await new Promise(r => setTimeout(r, 10000));

//         const response = await checkDeviceWebAccessStatus(ip, tries+1);

//         return response;
//     };
// };

// const updateHoldReversionTimer = async (ip, deviceId, retry=false) => {
//     if (retry) {
//         await client.post(`/v1/telephony/config/devices/${deviceId}/actions/applyChanges/invoke`);

//         const response = await checkDeviceWebAccessStatus(ip);

//         if (typeof response !== "boolean") {
//             return `Unable to check WebAccess Status "${response}"`;
//         };
//     }

//     try {
//         await axios.post(`https://${ip}/bcisco.csc`, qs.stringify({ 5356: 90 }), { timeout: 5000, httpsAgent: agent });
    
//         const settings = await axios.get(`https://${ip}/basic/User.json`, { httpsAgent: agent });
    
//         const holdTimer = settings.data.find(x => x.name === 'Hold Reminder Timer');

//         return holdTimer.value.toString() === "90";
//     } catch (err) {
//         if (!retry) return await updateHoldReversionTimer(ip, deviceId, true);

//         return err;
//     };
// };

// devices.items.forEach(async (device, i) => {
//     const line = i;

//     jetty.moveTo(i).text(`https://${device.ip}: Initializing...                       `);

//     if (!VALID_PRODUCTS.includes(device.product)) {
//         return jetty.moveTo(i).text(`https://${device.ip}: Failed | Invalid Device "${device.product}"             `);
//     };

//     jetty.moveTo(i).text(`https://${device.ip}: Checking WebAccess...                 `);
//     const webAccessEnabled = await getDeviceWebAccessValue(device.id);

//     if (typeof webAccessEnabled !== "boolean") {
//         return jetty.moveTo(i).text(`https://${device.ip}: Failed | Unable to retrieve WebAccess Status "${webAccessEnabled}"`);
//     }

//     if (!Boolean(webAccessEnabled)) {
//         jetty.moveTo(i).text(`https://${device.ip}: Enabling WebAccess...            `);
        
//         const res1 = await updateDeviceWebAccess(device.id, true);
        
//         if (typeof res1 !== "boolean") {
//             return jetty.moveTo(i).text(`https://${device.ip}: Failed | Unable to update WebAccess Status "${res1}"`);
//         };

//         const res2 = await checkDeviceWebAccessStatus(device.ip);

//         if (typeof res2 !== "boolean") {
//             return jetty.moveTo(i).text(`https://${device.ip}: Failed | Unable to check WebAccess Status "${res2}"`);
//         };
//     };

//     jetty.moveTo(i).text(`https://${device.ip}: Updating Device Settings...         `);
//     const results = await updateHoldReversionTimer(device.ip, device.id);

//     if (typeof results !== "boolean") {
//         return jetty.moveTo(i).text(`https://${device.ip}: Failed | Unable to update Device Settings "${results}"`);
//     };

//     await new Promise(r => setTimeout(r, 2000)); // 2 second buffer to ensure settings are applied

//     // jetty.moveTo(i).text(`https://${device.ip}: Removing WebAccess...               `);
//     // await updateDeviceWebAccess(device.id, false);

//     jetty.moveTo(i).text(`https://${device.ip}: Completed                           `);

//     jetty.moveTo(devices.length);
// });

// jetty.moveTo(devices.length+1);