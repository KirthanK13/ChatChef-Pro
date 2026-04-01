const https = require('https');
https.get('https://tse1.mm.bing.net/th?q=chocolate+cake+food', (res) => {
    console.log("Status Code:", res.statusCode);
    if (res.headers.location) {
        console.log("Redirect:", res.headers.location);
    } else {
        console.log("Content-Type:", res.headers['content-type']);
        console.log("Content-Length:", res.headers['content-length']);
    }
}).on('error', (e) => console.error(e));
