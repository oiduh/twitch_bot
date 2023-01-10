const ChatServer = require("ws").Server;
const tmi = require("tmi.js");
require("dotenv").config();
import * as Emotes from "../test_scripts/bttv_fetch";


// TODO: emotes are sorted by id and not by position in message -> fix
// TODO: add command -> mod, broadcaster only -> to change emote mode

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

// initialize all important features
// 1) load bttv emotes
// ...
client.on("connected", async () => {
    console.log("connected to twitch chat!");

    // TODO: make it even easier -> 1 function to download all -> additionally command to refresh
    for(const url_it in Emotes.EMOTE_URLS) {
        console.log(`${url_it} - ${Emotes.EMOTE_URLS[url_it]}`);
        let new_emote_container = Emotes.createEmoteContainer(url_it as Emotes.EmoteSource, Emotes.EMOTE_URLS[url_it]);
        let emotes_json = await Emotes.downloadEmoteCodes(new_emote_container.emote_url);
        new_emote_container.saveAsRecord(emotes_json);
        console.log(new_emote_container.emote_record);
    }
})


client.connect();

client.on('message', async (channel, tags, message, self) => {
    if(self) return;

    if(message.toLowerCase() === '!hello') {
        client.say(channel, `@${tags.username}, hello!`);
    }
    else {
        // TODO: for now lets identify all global twitch emotes only

        //let emote_url = "https://static-cdn.jtvnw.net/emoticons/v2/"

        let emotes_record = tags["emotes"];
        console.log(emotes_record);

        /*for(const emote_id in emotes_record) {
            let full_emote_url = emote_url + emote_id + "/default/dark/3.0";
            console.log(full_emote_url);
            try {
                let total_emotes = emotes_record[emote_id].length;
                for(let i = 0; i < total_emotes; i++) {
                    emoteWall.send(full_emote_url);
                }
            }
            catch (e) {
                console.log(e);
            }

        }*/

        console.log('---');
        console.log(message);
        console.log('---');
    }
});