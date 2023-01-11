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

let emote_wall;
// TODO: redefine record if emotes from other sources are added -> distinguish source, currently not the case
let emote_record: Record<string, string> = {};

server.on("connection", async (ws) => {
    console.log("new connection");
    emote_wall = await ws;
    emote_wall.on("message", (data) => console.log(data));
});

// initialize all important features
// 1) load bttv emotes
// ...
client.on("connected", async () => {
    console.log("connected to twitch chat!");

    let emote_containers: Array<Emotes.EmoteContainer> = await Emotes.fetAllEmotes();
    for(const emote_container of emote_containers) {
        //console.log(emote_container.constructor.name);
        //console.log(Object.keys(emote_container.emote_record));
        emote_record = {...emote_record, ...emote_container.emote_record};
    }
    console.log(emote_record);
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
        let twitch_emotes = tags["emotes"];
        console.log('emotes:');
        console.log(twitch_emotes);
        console.log('raw message:');
        console.log(message);
        let splitted = message.split(" ")
        console.log('raw message:');
        console.log(splitted);
        let emote_codes = Object.keys(emote_record);
        let intersection = splitted.filter(x => emote_codes.includes(x));
        console.log('intersection:');
        console.log(intersection);
        console.log('---');
    }
});