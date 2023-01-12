const ChatServer = require("ws").Server;
const tmi = require("tmi.js");
require("dotenv").config();
import * as Emotes from "../test_scripts/bttv_fetch";


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
        // TODO: implement frankerz and 7tv

        let twitch_emotes = tags["emotes"];
        let first_emote = getFirstEmote(message, twitch_emotes);
        console.log(`first emote is "${first_emote[1]}" from ${first_emote[0]}`);

        let emote_url = '';
        switch(first_emote[0]) {
            case 'BTTV':
                emote_url = `https://cdn.betterttv.net/emote/${emote_record[first_emote[1]]}/3x`;
                break;
            case 'TWITCH':
                emote_url = `https://static-cdn.jtvnw.net/emoticons/v2/${first_emote[1]}/default/light/3.0`;
                break;
        }

        emote_wall.send(emote_url);
    }
});

function getFirstEmote(message: string, twitch_emotes: Record<string, Array<string>>): [string, string] {
    let message_split = message.split(' ');

    let bttv_emote_codes = Object.keys(emote_record);

    let first_bttv_emote = message_split.filter(x => bttv_emote_codes.includes(x))[0];
    let bttv_emote_pos = message.indexOf(first_bttv_emote);
    if(bttv_emote_pos < 0)
        bttv_emote_pos = 500;

    let first_twitch_emote = '';
    let twitch_emote_pos = 500;  // max char limit twitch message

    for(const emote in twitch_emotes) {
        let pos = twitch_emotes[emote][0].split('-')[0] as unknown as number;
        if(pos < twitch_emote_pos) {
            first_twitch_emote = emote;
            twitch_emote_pos = pos;
        }
    }

    return bttv_emote_pos < twitch_emote_pos ? ['BTTV', first_bttv_emote] : ['TWITCH', first_twitch_emote]
}