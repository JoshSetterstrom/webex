import Webex from './client/Webex.js';

const client = new Webex();

// const stores = '003'

const stores = "002 003 004 005 006 007 008 009 010 011 012 014 015 016 017 018 019 020 021 022 023 024 025 026 029 030 031 032 033 034 035 036 037 038 039 040 041 042 044 045 046 047 048 050 051 052 053 054 055 056 057 060 061 062 063 064 065 066 067 068 070 071 072 073 074 075 076 077 080 081 082 084 086 088 090 091 092";

const locations = await client.get('/v1/telephony/config/locations');

const hg = {
    "1 Hour Lab": "Photo Finishing",
    "6921": "Tech Services",
    "Tech": "Tech", 
    "6922": "District Office",
    "6923": "Photo Finishing",
    "6924": "All Phones",
    "6925": "Cosmetics",
    "6926": "Nursing Home",
    "6927": "Canada Post",
    "6928": "Insurance",
    "6929": "Customer Service",
    "6930": "General Inquiries"
}

for ( const store of stores.split(' ') ) {
    const location = locations.locations.find(x => x.name.includes(store));

    if (!location) continue;

    const pickupGroups = await client.get(`/v1/telephony/config/locations/${location.id}/callPickups`);

    for ( const pickupGroup of pickupGroups.callPickups ) {
        let newName = '';
        
        if (pickupGroup.name.includes('Hour Lab')) newName = `LD${store} Photo Finishing`;
        if (pickupGroup.name.includes('Cosmetics')) newName = `LD${store} Cosmetics`;
        if (pickupGroup.name.includes('Insurance')) newName = `LD${store} Insurance`;
        if (pickupGroup.name.includes('Customer')) newName = `LD${store} Customer Service`;
        if (pickupGroup.name.includes('Loss')) newName = `LD${store} Loss Prevention`;
        if (pickupGroup.name.includes('Manager')) newName = `LD${store} Manager and Staff`;
        if (pickupGroup.name.includes('Pharmacy')) newName = `LD${store} Pharmacy`;
        if (pickupGroup.name.includes('Tech')) newName = `LD${store} Tech`;
        if (pickupGroup.name.includes('Verification')) newName = `LD${store} Receiving`;

        console.log(pickupGroup.name)
        
        if (!newName) {
            console.log(pickupGroup.name, 'does not exist')

            continue
        };
        
        try {
            await client.put(`/v1/telephony/config/locations/${location.id}/callPickups/${pickupGroup.id}`, { name: newName })
        } catch {
            console.log('failed', pickupGroup.name)

            break;
        }
    };
};