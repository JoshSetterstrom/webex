/* 
    Proof of Concept Backend Service for Webex Music on Hold
        - Upload custom MOH audio files
        - Set MOH to custom or system
        - Delete old audio files when updating MOH

    WAV file requirements:
        .WAV files with 8 or 16 kHz, 8-bit or 16-bit mono, µ-law, A-law, or PCM
        .WMA files with 8 or 16 kHz, 16-bit mono, µ-law, A-law, or PCM

    For testing purposes, uploading .wav files is done locally. You will need to add your own .wav file in the root directory.

    You can get your Webex Bearer Token from https://developer.webex.com/docs/getting-started
*/


import axios from 'axios';
import fs from 'fs';
import FormData from 'form-data';

const SECRET = "ENTER YOUR WEBEX BEARER TOKEN HERE";
const WAV_FILE_PATHNAME = './testwav.wav';
const DELETE_OLD_AUDIO_FILE_IF_NOT_USED = true;

const headers = { "Authorization": `Bearer ${SECRET}`, "Accept": "application/json" };

// API GET Functions
const getLocation = async locationId => {
    const locationUrl = `https://webexapis.com/v1/telephony/config/locations/${locationId}`;

    const locationResponse = await axios.get(locationUrl, { headers });

    if (locationResponse.status !== 200) throw new Error(`Error: ${locationResponse.status} ${JSON.stringify(locationResponse.data)}`);

    return locationResponse.data;
};

const getMOH = async locationId => {
    const mohUrl = `https://webexapis.com/v1/telephony/config/locations/${locationId}/musicOnHold`;

    const mohResponse = await axios.get(mohUrl, { headers });

    if (mohResponse.status !== 200) throw new Error(`Error: ${mohResponse.status} ${JSON.stringify(mohResponse.data)}`);
    
    return mohResponse.data;
};

const getAudio = async (locationId, audioId) => {
    const audioUrl = `https://webexapis.com/v1/telephony/config/locations/${locationId}/announcements/${audioId}`;

    const audioResponse = await axios.get(audioUrl, { headers });

    if (audioResponse.status !== 200) throw new Error(`Error: ${audioResponse.status} ${JSON.stringify(audioResponse.data)}`);

    return audioResponse.data;
};

const getCurrentMOH = async locationId => {
    const location = await getLocation(locationId);
    const moh = await getMOH(locationId);

    if (moh.greeting === 'SYSTEM') return { location, moh, audio: null };

    const audio = await getAudio(locationId, moh.audioFile?.id);

    return { location, moh, audio };
};



// API POST/PUT/DELETE Functions
const uploadAudioToLocation = async locationId => {
    // Upload local file for testing purposes
    const form = new FormData();

    const filename = `test_wav_${Math.random().toString(36).substring(2, 15)}`; // Generate a random filename

    form.append("name", filename);
    form.append("file", fs.createReadStream(WAV_FILE_PATHNAME), { filename: `${filename}.wav`, contentType: "audio/wav" });

    const url = `https://webexapis.com/v1/telephony/config/locations/${locationId}/announcements`;

    const response = await axios.post(url, form, { headers: { ...headers, ...form.getHeaders() }, maxBodyLength: Infinity });

    if (response.status !== 201) throw new Error(`Error: ${response.status} ${JSON.stringify(response.data)}`);

    return {status: response.status, data: response.data};
};

const deleteAudioFromLocation = async (locationId, audioId) => {
    const audio = await getAudio(locationId, audioId);

    if (audio.featureReferenceCount !== 0) return;

    const url = `https://webexapis.com/v1/telephony/config/locations/${locationId}/announcements/${audioId}`;

    const response = await axios.delete(url, { headers });

    if (response.status !== 204) throw new Error(`Error: ${response.status} ${JSON.stringify(response.data)}`);

    return {status: response.status, data: response.data};
};

const setMOHCustom = async (locationId, audioId) => {
    const refMOH = await getCurrentMOH(locationId);
    
    const url = `https://webexapis.com/v1/telephony/config/locations/${locationId}/musicOnHold`;
    
    const body = {
        callHoldEnabled: true,
        callParkEnabled: true,
        greeting: "CUSTOM",
        audioFile: { id: audioId }
    };

    const response = await axios.put(url, body, { headers });

    if (response.status !== 204) throw new Error(`Error: ${response.status} ${JSON.stringify(response.data)}`);

    if (DELETE_OLD_AUDIO_FILE_IF_NOT_USED && refMOH.audio) {
        await deleteAudioFromLocation(locationId, refMOH.audio.id);
    };  

    return {status: response.status, data: response.data};
};

const setMOHSystem = async locationId => {
    const refMOH = await getCurrentMOH(locationId);

    const url = `https://webexapis.com/v1/telephony/config/locations/${locationId}/musicOnHold`;

    const body = {
        callHoldEnabled: true,
        callParkEnabled: true,
        greeting: "SYSTEM",
        audioFile: null
    };

    const response = await axios.put(url, body, { headers });

    if (response.status !== 204) throw new Error(`Error: ${response.status} ${JSON.stringify(response.data)}`, 'Error setting MOH to system');

    if (DELETE_OLD_AUDIO_FILE_IF_NOT_USED && refMOH.audio) {
        await deleteAudioFromLocation(locationId, refMOH.audio.id);
    };

    return {status: response.status, data: response.data};
};



// Usage Examples
const updateMOHToCustom = async () => {
    try {
        const locationId = encodeURIComponent("Y2lzY29zcGFyazovL3VzL0xPQ0FUSU9OLzFkMDI1MjMzLWY0MTctNDE0OC04MTRjLTM5MDlhZDIxZmI5NQ"); // Store 200
    
        const uploadAudioResponse = await uploadAudioToLocation(locationId);
    
        const response = await setMOHCustom(locationId, encodeURIComponent(uploadAudioResponse.data.id));
    
        console.log(response);
    } catch (error) {
        console.error(error);
    };
};

const updateMOHToSystem = async () => {
    try {
        const locationId = encodeURIComponent("Y2lzY29zcGFyazovL3VzL0xPQ0FUSU9OLzFkMDI1MjMzLWY0MTctNDE0OC04MTRjLTM5MDlhZDIxZmI5NQ"); // Store 200
    
        const response = await setMOHSystem(locationId);
    
        console.log(response);
    } catch (error) {
        console.error(error);
    };
};


// await updateMOHToCustom();
// await updateMOHToSystem();