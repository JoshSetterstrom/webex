import axios from 'axios';
import 'dotenv/config';


class Webex {
    constructor() {
        this.headers = { "Authorization": `Bearer ${process.env.BEARER_TOKEN}`, "Accept": "application/json" };
    };

    get = async path => {
        const url = `https://webexapis.com${path}`;

        const response = await axios.get(url, { headers: this.headers });

        if (response.status < 200 || response.status >= 300) {
            throw new Error(`Webex API ${response.status}: ${JSON.stringify(response.data)}`);
        };

        return response.data;
    };
};

export default Webex;