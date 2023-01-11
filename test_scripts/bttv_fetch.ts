require("dotenv").config();

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// VARIABLES
//
// 1) source of emotes as type -> bttv, frankerz, 7tv, ...
// 2) record of source with its url to fetch from
//
// TODO: add more sources
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

let EMOTE_URLS: Record<string, string> = {
    'BTTV_GLOBAL': 'https://api.betterttv.net/3/cached/emotes/global',
    'BTTV_USER': `https://api.betterttv.net/3/cached/users/twitch/${process.env.TWITCH_BROADCASTER_ID}`
};



async function fetchEmoteUrl(url: string): Promise<any> {
    return fetch(url, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json; charset=utf-8',
            'User-agent': 'vscode-client'
        }
    });
}

async function downloadEmoteCodes(url) {
    const response = await fetchEmoteUrl(url);
    return await response.json();
}


export abstract class EmoteContainer {
    emote_url: string;
    emote_record: Record<string, string>;

    protected constructor(emote_url: string) {
        this.emote_url = emote_url;
    }

    abstract saveAsRecord(data: unknown): Record<string, string>;
}

class BTTV_GLOBAL_CONTAINER extends EmoteContainer {
    constructor(emote_url: string) {
        super(emote_url);
    }

    saveAsRecord(data: Array<Record<string, string>>): Record<string, string> {
        let record: Record<string, string> = {};
        for(const entry of data) {
            record[entry['code']] = entry['id'];
        }
        this.emote_record = record;
        return record;
    }
}

class BTTV_USER_CONTAINER extends EmoteContainer {
    constructor(emote_url: string) {
        super(emote_url);
    }

    saveAsRecord(data: Record<string, any>): Record<string, string> {
        let record: Record<string, string> = {};
        for(const entry of [...data['channelEmotes'], ...data['sharedEmotes']]) {
            record[entry['code']] = entry['id'];
        }
        this.emote_record = record;
        return record;
    }
}

function createEmoteContainer(emote_source: string, emote_url: string): EmoteContainer {
    let new_emote_container: EmoteContainer;

    switch (emote_source) {
        case 'BTTV_GLOBAL':
            new_emote_container = new BTTV_GLOBAL_CONTAINER(emote_url);
            break;
        case 'BTTV_USER':
            new_emote_container = new BTTV_USER_CONTAINER(emote_url);
            break;
    }

    return new_emote_container;
}

export async function fetAllEmotes(): Promise<any> {
    let emote_containers: Array<EmoteContainer> = [];

    for (const emote_source in EMOTE_URLS) {
        let new_emote_container = createEmoteContainer(emote_source, EMOTE_URLS[emote_source]);
        let emotes_json = await downloadEmoteCodes(new_emote_container.emote_url);
        new_emote_container.saveAsRecord(emotes_json);
        emote_containers.push(new_emote_container);
    }

    return emote_containers;
}

//let u = 'https://api.betterttv.net/3/cached/emotes/global';
//console.log(request_emotes(u));

// bttv emote url: https://cdn.betterttv.net/emote/{id}/3x
// oiduh bttv user id: 598f2a195aba4636b7359f44
