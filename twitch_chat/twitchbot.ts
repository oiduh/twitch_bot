const ChatServer = require("ws").Server;
const tmi = require("tmi.js");
require("dotenv").config();

const server = new ChatServer({port: 3000});

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

let emoteWall;

server.on("connection", async (ws) => {
    console.log("new connection");
    emoteWall = await ws;
    emoteWall.on("message", (data) => console.log(data));
});

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
            try {
                emoteWall.send(full_emote_url);
            }
            catch (e) {
                console.log(e);
            }
        }

        console.log('---');
        console.log(tags);
        console.log('---');
    }
});