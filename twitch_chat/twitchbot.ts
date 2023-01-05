const WebSocketServer = require("ws").Server;
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

const chat_server = new WebSocketServer({port: 8088});
client.connect();

client.on('message', async (channel, tags, message, self) => {
    if(self) return;

    if(message.toLowerCase() === '!hello') {
        client.say(channel, `@${tags.username}, hello!`);
    }
    else {
        // TODO: for now lets identify all global twitch emotes only

        let emote_url = "https://static-cdn.jtvnw.net/emoticons/v2/"
        let emotes_record = tags["emotes"];
        for(const emote_id in emotes_record) {
            let full_emote_url = emote_url + emote_id + "/default/dark/3.0";
            console.log(full_emote_url);
        }

        console.log('---');
        console.log(tags);
        console.log('---');
    }
});

chat_server.on("connection", (client, request) => {
    console.log("new connection");
    client.on("message", data => console.log(data));
})