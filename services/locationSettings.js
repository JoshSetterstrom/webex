const locationSettings = async (client, locationId, exportData=false) => {
    const path = `/v1/telephony/config/locations/${encodeURIComponent(locationId)}`;

    const data = { id: locationId, pstn: {}, calling: { dialing: {}, callHandling: {}, callingFeatures: {} } };

    data.locationId = locationId;

    data.meta = await client.get(path);

    data.calling.callHandling.musicOnHold = await client.get(`${path}/musicOnHold`);
    data.calling.callHandling.outgoingPermission = await client.get(`${path}/outgoingPermission`);
    data.calling.callHandling.intercept = await client.get(`${path}/intercept`);

    data.calling.callHandling.callRecording = await client.get('/v1/telephony/config/callRecording');
    data.calling.callHandling.callRecording.announcements = await client.get(`${path}/callRecording/announcements`);
    data.calling.callHandling.callRecording.complianceAnnounement = await client.get(`${path}/callRecording/complianceAnnouncement`);
    data.calling.callHandling.callRecording.emergencyCalls = await client.get(`${path}/callRecording/emergencyCalls`);

    data.calling.schedules = (await client.get(`${path}/schedules`)).schedules;
    data.calling.callPark = await client.get(`${path}/callParks/settings`);
    data.calling.voicePortal = await client.get(`${path}/voicePortal`);
    data.calling.deviceSettings = await client.get(`${path}/devices/settings`);

    // Cannot find an endpoint for Routing Prefix.
    data.calling.dialing.internalDialing = await client.get(`${path}/internalDialing`);

    // Get associated PSTN item name for reference
    data.pstn.emergencyCallbackNumber = await client.get(`${path}/features/emergencyCallbackNumber`);
    data.pstn.emergencyCallNotification = await client.get(`${path}/emergencyCallNotification`);

    exportData && fs.writeFileSync('../files/location.json', JSON.stringify(this.data, null, 2), 'utf-8');

    return data;
};

export default locationSettings;