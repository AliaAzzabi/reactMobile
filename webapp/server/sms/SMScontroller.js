const https = require('follow-redirects').https;
const fs = require('fs');
const dotenv = require('dotenv');


dotenv.config();

function sendSMS(phoneNumber, message) {
    return new Promise((resolve, reject) => {
        const postData = JSON.stringify({
            "messages": [
                {
                    "destinations": [{ "to": phoneNumber }],
                    "from": "ServiceSMS",
                    "text": message
                }
            ]
        });

        const options = {
            'method': 'POST',
            'hostname': '3gyekj.api.infobip.com',
            'path': '/sms/2/text/advanced',
            'headers': {
                'Authorization': `App ${process.env.INFOBIP_API_TOKEN}`, // Utiliser la variable d'environnement
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            'maxRedirects': 20
        };

        const req = https.request(options, function (res) {
            let chunks = [];

            res.on("data", function (chunk) {
                chunks.push(chunk);
            });

            res.on("end", function () {
                const body = Buffer.concat(chunks);
                resolve(body.toString());
            });

            res.on("error", function (error) {
                reject(error);
            });
        });

        req.on('error', function (error) {
            reject(error);
        });

        req.write(postData);
        req.end();
    });
}

module.exports = { sendSMS };
