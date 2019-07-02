const httpClient = require('http');
const moment = require('moment');

const numOfTries = process.argv[2];
const host = process.argv[3] || 'localhost';
const port = process.argv[4] || 80;
console.log(numOfTries);
for (let index = 1; index <= numOfTries; index++) {
    const onTime = (moment().unix() + 5 + index);
    console.log(onTime);
    httpClient.get(`http://${host}:${port}/echoAtTime?time=${onTime}&message=test${index}`,
    (res)=>{
        console.log(res.statusCode);
    });
}