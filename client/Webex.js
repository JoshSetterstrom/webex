import axios from 'axios';
import 'dotenv/config';


class Webex {
    constructor() {
        this.headers = { "Authorization": `Bearer ${process.env.BEARER_TOKEN}`, "Accept": "application/json" };
        this.count = 0
    };

    get = async path => {
        const url = `https://webexapis.com${path}`;

        const response = await axios.get(url, { headers: this.headers, validateStatus: () => true });

        if (response.status === 405) return null;

        // Handle third party devices where settings and layout are not supported
        if (response.status === 400) {
            const errorCodes = [ 25271, 25417 ];

            if  (errorCodes.includes(response.data?.errorCode)) return {
                _skipped: true,
                reason: 'unsupported_device_settings',
                errorCode: 25417,
                message: response.data?.message
            };
        };

        if (response.status < 200 || response.status >= 300) {
            const err = new Error(`Webex API ${response.status}`);
            err.response = response;

            throw err;
        };

        this.count++;

        return response.data;
    };

    put = async (path, body) => {
        const url = `https://webexapis.com${path}`;

        const response = await axios.put(url, body, { headers: this.headers });

        if (response.status === 405) return null;

        if (response.status < 200 || response.status >= 300) {
            throw new Error(`Webex API ${response.status}: ${JSON.stringify(response.data)}`);
        };

        return response.data;
    };
};

export default Webex;