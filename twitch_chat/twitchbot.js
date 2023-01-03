// tutorial from:
// https://javascript.plainenglish.io/typescript-cannot-find-name-require-8e327dde6363
var tmi = require("tmi.js");
require("dotenv").config();
var client = new tmi.Client({
    options: {
        debug: true
    },
    connection: {
        secure: true,
        reconnect: true
    },
    identity: {
        username: 'deppada_bot',
        password: "oauth:".concat(process.env.TWITCH_OAUTH_TOKEN_BOT)
    },
    channels: ['oiduh']
});
console.log("oauth:".concat(process.env.TWITCH_OAUTH_TOKEN_BOT));
client.connect();
client.on('message', function (channel, tags, message, self) {
    if (self)
        return;
    if (message.toLowerCase() === '!hello') {
        client.say(channel, "@".concat(tags.username, ", hello!"));
    }
});