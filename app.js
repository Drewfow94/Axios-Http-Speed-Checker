require("babel-core/register");
require("babel-polyfill");
const axios = require('axios');

const BASE_URL = 'https://jsonplaceholder.typicode.com/todos/1';
let startTime = new Date().getTime();

axios.interceptors.request.use( x => {
    x.meta = x.meta || {}
    console.log(startTime);
    return x;
});

axios.interceptors.response.use( (x) => {
    console.log(`Execution time for:  ${x.config.url} - ${new Date().getTime() - startTime} ms`)
    return x;
},
// Handle 4xx & 5xx responses
x => {
        console.error(`Execution time for: ${x.config.url} - ${new Date().getTime() - startTime} ms`)
        throw x;
    }
)

const run = async () => {
    // SUCCESS call
    await axios.get(BASE_URL, { headers: { 'x-trace-id': '1234-1234'} })
        .then( x => x.data)
        .then( x => console.log(x))

    // FAILED call - 404
    await axios.get('https://jsonplaceholder.typicode.com/todos/', { headers: { 'x-trace-id': '1234-1234'} })
        .then( x => x.data)
        .then( x => console.log(x))
} 

run().then( x => console.log('Task complete'));
