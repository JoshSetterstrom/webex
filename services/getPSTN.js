const name = x => `${x?.owner?.firstName} ${x?.owner?.lastName}`;

const getPSTN = async (client, locationId) => {
    const res = await client.get(`/v1/telephony/config/numbers?locationId=${locationId}`);
    const numbers = res.phoneNumbers.filter(x => x?.includedTelephonyTypes === 'PSTN_NUMBER');
    
    return {
        "IVR": numbers.find(x => name(x).includes('ATEB'))?.phoneNumber,
        "General Inquiries": numbers.find(x => name(x).includes('General'))?.phoneNumber,
        "TECH": numbers.find(x => (name(x).includes('Tech') || name(x).includes('TECH')))?.phoneNumber,
        "Doctors Line": numbers.find(x => name(x).includes('6290'))?.phoneNumber,
        "Photo Finishing": numbers.find(x => name(x).includes('Photo'))?.phoneNumber,
        "Insurance": numbers.find(x => name(x).includes('Insurance'))?.phoneNumber,
        "Canada Post": numbers.find(x => name(x).includes('Canada'))?.phoneNumber,
        "Curbside": numbers.find(x => name(x).includes('Curbside'))?.phoneNumber
    };
};

export default getPSTN;