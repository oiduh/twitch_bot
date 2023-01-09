async function downloadEmotes(url: string): Promise<any> {
    return fetch(url, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json; charset=utf-8',
            'User-agent': 'vscode-client'
        }
    });
}

// twitch broadcaster id -> NOT bttv user id
const USER_ID = '112465769';

async function request_emotes(url) {
    const response = await downloadEmotes(url);
    return await response.json();
}

// bttv emote url: https://cdn.betterttv.net/emote/{id}/3x
// oiduh bttv user id: 598f2a195aba4636b7359f44

type EmoteSource = 'BTTV_GLOBAL' | 'BTTV_USER';

abstract class EmoteContainer {
    emote_source: EmoteSource;
    emote_url: string;
    emote_record: Record<string, string>;

    protected constructor(emote_source: EmoteSource, emote_url: string) {
        this.emote_source = emote_source;
        this.emote_url = emote_url;
    }

    abstract saveAsRecord(data: unknown): Record<string, string>;
}

class BTTV_GLOBAL_CONTAINER extends EmoteContainer {
    constructor(emote_source: EmoteSource, emote_url: string) {
        super(emote_source, emote_url);
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
    constructor(emote_source: EmoteSource, emote_url: string) {
        super(emote_source, emote_url);
    }

    saveAsRecord(data: Record<string, any>): Record<string, string> {
        //console.log([...data['channelEmotes'], ...data['sharedEmotes']]);
        let record: Record<string, string> = {};
        for(const entry of [...data['channelEmotes'], ...data['sharedEmotes']]) {
            record[entry['code']] = entry['id'];
        }
        this.emote_record = record;
        return record;
    }
}

function createEmoteContainer(emote_source: EmoteSource, emote_url: string): EmoteContainer {
    let new_emote_container:EmoteContainer;

    switch (emote_source) {
        case 'BTTV_GLOBAL':
            new_emote_container = new BTTV_GLOBAL_CONTAINER(emote_source, emote_url);
            break;
        case 'BTTV_USER':
            new_emote_container = new BTTV_USER_CONTAINER(emote_source, emote_url);
            break;
    }

    return new_emote_container;
}

let emote_urls: Record<EmoteSource, string> = {
    'BTTV_GLOBAL': 'https://api.betterttv.net/3/cached/emotes/global',
    'BTTV_USER': `https://api.betterttv.net/3/cached/users/twitch/${USER_ID}`
};

let emote_containers: Array<EmoteContainer> = [];

for(const emote_source in emote_urls) {
    console.log(`source: ${emote_source} - url: ${emote_urls[emote_source]}`);
    emote_containers.push(createEmoteContainer(emote_source as EmoteSource, emote_urls[emote_source]));
}
for(const container of emote_containers) {
    console.log(container.emote_url);
    request_emotes(container.emote_url)
        .then(json => {
            container.saveAsRecord(json);
            console.log(container.emote_record);
        })
}

for(const container of emote_containers) {
    console.log(container.emote_record);
}

//let u = 'https://api.betterttv.net/3/cached/emotes/global';
//console.log(request_emotes(u));

