var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var _this = this;
var ChatServer = require("ws").Server;
var tmi = require("tmi.js");
require("dotenv").config();
var EmoteMode;
(function (EmoteMode) {
    EmoteMode[EmoteMode["FIRST"] = 0] = "FIRST";
    EmoteMode[EmoteMode["ALL"] = 1] = "ALL";
})(EmoteMode || (EmoteMode = {}));
var emote_mode = EmoteMode.FIRST;
var server = new ChatServer({ port: 3000 });
var client = new tmi.Client({
    options: {
        debug: true
    },
    connection: {
        secure: true,
        reconnect: true
    },
    identity: {
        username: 'deppada_bot',
        password: "oauth:".concat(process.env.TWITCH_OAUTH_TOKEN_BOT)
    },
    channels: ['oiduh']
});
var emoteWall;
server.on("connection", function (ws) { return __awaiter(_this, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                console.log("new connection");
                return [4 /*yield*/, ws];
            case 1:
                emoteWall = _a.sent();
                emoteWall.on("message", function (data) { return console.log(data); });
                return [2 /*return*/];
        }
    });
}); });
client.connect();
client.on('message', function (channel, tags, message, self) { return __awaiter(_this, void 0, void 0, function () {
    var emote_url, emotes_record, emote_id, full_emote_url, total_emotes, i;
    return __generator(this, function (_a) {
        if (self)
            return [2 /*return*/];
        if (message.toLowerCase() === '!hello') {
            client.say(channel, "@".concat(tags.username, ", hello!"));
        }
        else {
            emote_url = "https://static-cdn.jtvnw.net/emoticons/v2/";
            emotes_record = void 0;
            if (emote_mode === EmoteMode.FIRST) {
                emotes_record = Object.fromEntries(Object.entries(tags["emotes"]).slice(0, 1));
            }
            else if (emote_mode === EmoteMode.ALL) {
                emotes_record = tags["emotes"];
            }
            for (emote_id in emotes_record) {
                full_emote_url = emote_url + emote_id + "/default/dark/3.0";
                console.log(full_emote_url);
                try {
                    total_emotes = void 0;
                    if (emote_mode === EmoteMode.FIRST) {
                        total_emotes = 1;
                    }
                    else if (emote_mode === EmoteMode.ALL) {
                        total_emotes = emotes_record[emote_id].length;
                    }
                    for (i = 0; i < total_emotes; i++) {
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
        return [2 /*return*/];
    });
}); });
