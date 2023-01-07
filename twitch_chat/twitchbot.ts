const ChatServer = require("ws").Server;
const tmi = require("tmi.js");
require("dotenv").config();

// TODO: emotes are sorted by id and not by position in message -> fix
// TODO: add command -> mod, broadcaster only -> to change emote mode
enum EmoteMode {
    FIRST,  ALL
}

let emote_mode = EmoteMode.FIRST;

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

        let emotes_record;
        if(emote_mode === EmoteMode.FIRST) {
            emotes_record = Object.fromEntries(Object.entries(tags["emotes"]).slice(0, 1));
        }
        else if(emote_mode === EmoteMode.ALL) {
            emotes_record = tags["emotes"];
        }

        for(const emote_id in emotes_record) {
            let full_emote_url = emote_url + emote_id + "/default/dark/3.0";
            console.log(full_emote_url);
            try {
                let total_emotes;
                if (emote_mode === EmoteMode.FIRST) {
                    total_emotes = 1;
                }
                else if(emote_mode === EmoteMode.ALL) {
                    total_emotes = emotes_record[emote_id].length;
                }
                for(let i = 0; i < total_emotes; i++) {
                    emoteWall.send(full_emote_url);
                }
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