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
let emote_record: Record<string, Record<string, string>> = {};

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
        emote_record[emote_container.constructor.name] = emote_container.emote_record;
        //emote_record = {...emote_record, ...emote_container.emote_record};
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
                let combine_bttv = {...emote_record['BTTV_GLOBAL_CONTAINER'], ...emote_record['BTTV_USER_CONTAINER']};
                emote_url = `https://cdn.betterttv.net/emote/${combine_bttv[first_emote[1]]}/3x`;
                break;
            case 'FFZ':
                emote_url = `https://cdn.frankerfacez.com/emote/${emote_record['FFZ_CONTAINER'][first_emote[1]]}/4`;
                break;
            case 'TWITCH':
                emote_url = `https://static-cdn.jtvnw.net/emoticons/v2/${first_emote[1]}/default/light/3.0`;
                break;
        }

        console.log(first_emote[1]);
        console.log(emote_url);

        emote_wall.send(emote_url);
    }
});

function getFirstEmote(message: string, twitch_emotes: Record<string, Array<string>>): [string, string] {
    type emote_info = {
        source: string,
        position: number,
        name: string,
    }
    let message_split = message.split(' ');

    // get first bttv emote
    let bttv_emote: emote_info = {
        source: 'BTTV',
        position: 500,
        name: ''

    }
    let bttv_emote_codes = Object.keys({...emote_record['BTTV_GLOBAL_CONTAINER'], ...emote_record['BTTV_USER_CONTAINER']});
    bttv_emote.name = message_split.filter(x => bttv_emote_codes.includes(x))[0];
    bttv_emote.position = message.indexOf(bttv_emote.name);
    if(bttv_emote.position < 0)
        bttv_emote.position = 500;

    // get first ffz emote
    let ffz_emote: emote_info = {
        source: 'FFZ',
        position: 500,
        name: ''

    }
    let ffz_emote_codes = Object.keys(emote_record['FFZ_CONTAINER']);
    ffz_emote.name = message_split.filter(x => ffz_emote_codes.includes(x))[0];
    ffz_emote.position = message.indexOf(ffz_emote.name);
    if(ffz_emote.position < 0)
        ffz_emote.position = 500;

    // get first twitch emote
    let twitch_emote: emote_info = {
        source: 'TWITCH',
        position: 500,
        name: ''
    }
    for(const emote in twitch_emotes) {
        let pos = twitch_emotes[emote][0].split('-')[0] as unknown as number;
        if(pos < twitch_emote.position) {
            twitch_emote.name = emote;
            twitch_emote.position = pos;
        }
    }

    let first_emote: emote_info = {
        source: '',
        position: 500,
        name: ''
    };
    for(const current_emote_info of [bttv_emote, ffz_emote, twitch_emote]) {
        if(current_emote_info.position < first_emote.position) {
            first_emote = current_emote_info
        }
    }

    return [first_emote.source, first_emote.name]
}