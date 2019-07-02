const httpClient = require('http');
const moment = require('moment');

const numOfTries = process.argv[2];
const url = process.argv[3] || 'http://localhost:80';
console.log(numOfTries);
for (let index = 1; index <= numOfTries; index++) {
    const onTime = (moment().unix() + 5 + index);
    console.log(onTime);
    httpClient.get(`${url}/echoAtTime?time=${onTime}&message=test${index}`,
    (res)=>{
        console.log(res.statusCode);
    });
}