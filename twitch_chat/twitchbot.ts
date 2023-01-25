const ChatServer = require("ws").Server;
const tmi = require("tmi.js");
require("dotenv").config();
import * as Emotes from "./utility/bttv_fetch";


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
let emote_record: Record<string, Emotes.EMOTES> = {};

server.on("connection", async (ws) => {
    console.log("new connection");
    emote_wall = await ws;
    emote_wall.on("message", (data) => console.log(data));
});

client.on("connected", async () => {
    console.log("connected to twitch chat!");

    let emote_containers: Array<Emotes.EMOTES> = await Emotes.fetchAllEmotes();
    for (const emote_container of emote_containers)
        emote_record[emote_container.constructor.name] = emote_container;
    console.log(emote_record);
})


client.connect();

client.on('message', async (channel, tags, message, self) => {
    if (self) return;

    let [command, ...args] = message.split(' ');
    console.log(command);
    console.log(args);

    switch (command) {
        case '!hello': {
            client.say(channel, `@${tags.username}, hello!`);
            break;
        }
        case '!showemote': {
            if (!emote_wall)
                return;

            let twitch_emotes = tags["emotes"];
            let [emote_source, emote_name] = getFirstEmote(args, twitch_emotes);

            let emote_url = getEmoteURL(emote_source, emote_name);

            console.log(`first emote is "${emote_name}" from ${emote_source}`);
            console.log(emote_url);

            // fails if emotewall is not connected
            try {
                emote_wall.send(emote_url);
            }
            catch (e) {
                console.log(e);
            }
            break;
        }
        case '!yt':
        case '!youtube': {
            console.log(`Youtube link requested: ${args.join(' ')}`)
            break;
        }
        default: {
            console.log('not a command!');
            break;
        }
    }
});

//////////////////////
//                  //
//  EMOTE COMMANDS  //
//                  //
//////////////////////
function getFirstEmote(args: Array<string>, twitch_emotes: Record<string, Array<string>>): [string, string] {
    type emote_info = {
        source: string,
        position: number,
        name: string,
    }

    // determine information about first non twitch emote
    let non_twitch_emote: emote_info = { source: '', position: 500, name: '' };
    for (const emote_source in emote_record) {
        let emote_codes = Object.keys(emote_record[emote_source].emote_record);
        let first_emote_name = args.filter(x => emote_codes.includes(x))[0];
        let first_emote_pos = args.indexOf(first_emote_name);
        if (first_emote_pos < 0) first_emote_pos = 500;
        if (first_emote_pos < non_twitch_emote.position) {
            non_twitch_emote.source = emote_source;
            non_twitch_emote.position = first_emote_pos;
            non_twitch_emote.name = first_emote_name;
        }
    }

    // get first twitch emote
    let twitch_emote: emote_info = { source: 'TWITCH', position: 500, name: '' };
    for (const emote in twitch_emotes) {
        let pos = twitch_emotes[emote][0].split('-')[0] as unknown as number;
        if (pos < twitch_emote.position) {
            twitch_emote.name = emote;
            twitch_emote.position = pos;
        }
    }

    if (non_twitch_emote.position === 500 && twitch_emote.position === 500)
        return ['', '']

    return non_twitch_emote.position < twitch_emote.position
        ? [non_twitch_emote.source, non_twitch_emote.name]
        : [twitch_emote.source, twitch_emote.name];
}

function getEmoteURL(emote_source: string, emote_name: string): string {
    let emote_url = '';
    switch(emote_source) {
        case 'BTTV_GLOBAL':
        case 'BTTV_USER':
            emote_url = `https://cdn.betterttv.net/emote/${emote_record[emote_source].emote_record[emote_name]}/3x`;
            break;
        case 'FFZ':
            emote_url = `https://cdn.frankerfacez.com/emote/${emote_record[emote_source].emote_record[emote_name]}/4`;
            break;
        case 'SEVENTV_GLOBAL':
        case 'SEVENTV_USER':
            emote_url = `https://cdn.7tv.app/emote/${emote_record[emote_source].emote_record[emote_name]}/4x`;
            break;
        case 'TWITCH':
            emote_url = `https://static-cdn.jtvnw.net/emoticons/v2/${emote_name}/default/light/3.0`;
            break;
    }

    return emote_url;
}