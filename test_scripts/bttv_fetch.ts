function saveToRecordGlobal(data: Array<Record<string, string>>): Record<string, string> {
    let bttv_global_emotes: Record<string, string> = {};
    for(const entry of data) {
        bttv_global_emotes[entry['code']] = entry['id'];
    }
    console.log(bttv_global_emotes);
    return bttv_global_emotes;
}
async function download_global_bttv_emote() {
    return fetch('https://api.betterttv.net/3/cached/emotes/global', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json; charset=utf-8',
            'User-agent': 'vscode-client'
        }
    });
}

function saveToRecordUser(data: Record<string, any>): Record<string, string> {
    let bttv_user_emotes: Record<string, string> = {};
    for(const entry of [...data['channelEmotes'], ...data['sharedEmotes']]) {
        bttv_user_emotes[entry['code']] = entry['id'];
    }
    console.log(bttv_user_emotes);
    return bttv_user_emotes;
}

async function download_user_bttv_emotes(user_id: string) {
    return fetch(`https://api.betterttv.net/3/cached/users/twitch/${user_id}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json; charset=utf-8',
            'User-agent': 'vscode-client'
        }
    });
}

// twitch broadcaster id -> NOT bttv user id
const USER_ID = '112465769';

const request_global = async () => {
    const response = await download_global_bttv_emote();
    const json = await response.json();
    console.log(json);
    return saveToRecordGlobal(json);
}

const request_user = async () => {
    const response = await download_user_bttv_emotes(USER_ID);
    const json = await response.json();
    console.log(json);
    return saveToRecordUser(json);
}

console.log(request_global());
console.log(request_user())

// bttv emote url: https://cdn.betterttv.net/emote/{id}/3x
// oiduh bttv user id: 598f2a195aba4636b7359f44

