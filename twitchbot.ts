// tutorial from:
// https://javascript.plainenglish.io/typescript-cannot-find-name-require-8e327dde6363

const tmi = require("tmi.js");
require("dotenv").config();

const client = new tmi.Client({
    options: {
        debug: true
    },
    connection: {
        secure: true,
        reconnect: true
    },
    identity: {
        username: 'deppada_bot',
        password: `oauth:${process.env.TWITCH_OAUTH_TOKEN_BOT}`
    },
    channels: ['oiduh']
});

client.connect();

client.on('message', (channel, tags, message, self) => {
    if(self) return;

    if(message.toLowerCase() === '!hello') {
        client.say(channel, `@${tags.username}, hello!`);
    }
});
