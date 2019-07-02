var http = require('http');
var express = require('express');
var app = express();
var moment = require('moment');
var redisClient = 
process.env.ENV === "PROD" ? require('redis').createClient(
    {
        auth_pass: process.env.REDIS_PASSWORD,
        url: process.env.REDIS_URL
    }
)
:
require("redis").createClient();

var os = require("os");

var PORT = process.env.PORT || '8080';

const REDIS_KEY_OF_SET = `messages-${os.hostname()}-${PORT}`;

function getDeltaTimeFromNow(time) {
    return (moment(time * 1000).local().unix() * 1000) - (moment().unix() * 1000);
}

function printAndRemoveFromRedis(fromTime, toTime) {
    redisClient.multi().zrangebyscore(
        REDIS_KEY_OF_SET, 
        fromTime, 
        toTime, 
        (err, valToPrint) => {
            var messages = valToPrint.values();

            for (const message of messages) {
                console.log(message);
            }
        }
    ).zremrangebyscore(
        REDIS_KEY_OF_SET, 
        fromTime, 
        toTime).exec();
}

redisClient.on('error', (err) => {
    console.log('error ' + err);
});

app.get('/echoAtTime', function(req, res) {
    const {time, message} = req.query;
    if((typeof time === 'undefined') || 
        typeof message === 'undefined') {
        res.status(400).send('please provide prameters time and message');
        return;
    }

    redisClient.zadd(REDIS_KEY_OF_SET, parseInt(time), message);

    setTimeout(() => {
        var timeOnPrint = time;
        console.log(moment(time * 1000).utc().format("DD/MM/YYYY hh:mm:ss"));
        console.log(moment(timeOnPrint * 1000).local().format("DD/MM/YYYY hh:mm:ss"));
        printAndRemoveFromRedis(timeOnPrint, timeOnPrint);
        
    }, getDeltaTimeFromNow(time));

    
    res.send();
});

var server = http.createServer(app);
server.on('listening', () => {
    console.log('listening on port: ' + PORT)
    console.log(`undelivered messages on ${REDIS_KEY_OF_SET}: `);
    printAndRemoveFromRedis("-inf", moment().unix());
});
server.listen(PORT);
