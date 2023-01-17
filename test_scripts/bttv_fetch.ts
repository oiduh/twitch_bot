require("dotenv").config();


let EMOTE_URLS: Record<string, string> = {
    'BTTV_GLOBAL': 'https://api.betterttv.net/3/cached/emotes/global',
    'BTTV_USER': `https://api.betterttv.net/3/cached/users/twitch/${process.env.TWITCH_BROADCASTER_ID}`,
    'FFZ': `https://api.frankerfacez.com/v1/room/id/${process.env.TWITCH_BROADCASTER_ID}`,
    '7TV_GLOBAL': 'https://api.7tv.app/v2/emotes/global',
    '7TV_USER': `https://api.7tv.app/v2/users/${process.env.TWITCH_BROADCASTER_ID}/emotes`
};

async function fetchEmoteCodes(url) {
    const response = await fetch(url, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json; charset=utf-8',
            'User-agent': 'vscode-client'
        }
    });
    return await response.json();
}

export abstract class EMOTES {
    emote_url: string;
    emote_record: Record<string, string>;

    constructor(emote_url: string) {
        this.emote_url = emote_url;
    }

    abstract saveAsRecord(data: unknown): Record<string, string>;
}

class BTTV_GLOBAL extends EMOTES {
    saveAsRecord(data: Array<Record<string, string>>): Record<string, string> {
        let record: Record<string, string> = {};
        for (const entry of data)
            record[entry['code']] = entry['id'];
        this.emote_record = record;
        return record;
    }
}

class BTTV_USER extends EMOTES {
    saveAsRecord(data: Record<string, any>): Record<string, string> {
        let record: Record<string, string> = {};
        for (const entry of [...data['channelEmotes'], ...data['sharedEmotes']])
            record[entry['code']] = entry['id'];
        this.emote_record = record;
        return record;
    }
}

class FFZ extends EMOTES {
    saveAsRecord(data: Record<string, any>): Record<string, string> {
        let record: Record<string, string> = {};
        let room_set = data['room']['set'];
        let emotes = data['sets'][room_set]['emoticons'];
        for (let emote of emotes)
            record[emote['name']] = emote['id'] as string;
        this.emote_record = record;
        return record;
    }
}

class SEVENTV_GLOBAL extends EMOTES {
    saveAsRecord(data: Array<Record<string, any>>): Record<string, string> {
        let record: Record<string, string> = {};
        for (let emote of data)
            record[emote['name']] = emote['id'] as string;
        this.emote_record = record;
        return record;
    }
}

class SEVENTV_USER extends EMOTES {
    saveAsRecord(data: Array<Record<string, any>>): Record<string, string> {
        let record: Record<string, string> = {};
        for (let emote of data)
            record[emote['name']] = emote['id'] as string;
        this.emote_record = record;
        return record;
    }
}

function createEmoteContainer(emote_source: string, emote_url: string): EMOTES {
    let new_emote_container: EMOTES;

    switch (emote_source) {
        case 'BTTV_GLOBAL':
            new_emote_container = new BTTV_GLOBAL(emote_url);
            break;
        case 'BTTV_USER':
            new_emote_container = new BTTV_USER(emote_url);
            break;
        case 'FFZ':
            new_emote_container = new FFZ(emote_url);
            break;
        case '7TV_GLOBAL':
            new_emote_container = new SEVENTV_GLOBAL(emote_url);
            break;
        case '7TV_USER':
            new_emote_container = new SEVENTV_USER(emote_url);
            break;
    }

    return new_emote_container;
}

export async function fetchAllEmotes(): Promise<any> {
    let emote_containers: Array<EMOTES> = [];

    for (const emote_source in EMOTE_URLS) {
        let new_emote_container = createEmoteContainer(emote_source, EMOTE_URLS[emote_source]);
        let emotes_json = await fetchEmoteCodes(new_emote_container.emote_url);
        new_emote_container.saveAsRecord(emotes_json);
        emote_containers.push(new_emote_container);
    }

    return emote_containers;
}