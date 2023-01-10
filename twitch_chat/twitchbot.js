"use strict";
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
exports.__esModule = true;
var ChatServer = require("ws").Server;
var tmi = require("tmi.js");
require("dotenv").config();
var bttv_fetch_1 = require("../test_scripts/bttv_fetch");
// TODO: emotes are sorted by id and not by position in message -> fix
// TODO: add command -> mod, broadcaster only -> to change emote mode
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
server.on("connection", function (ws) { return __awaiter(void 0, void 0, void 0, function () {
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
// initialize all important features
// 1) load bttv emotes
// ...
client.on("connected", function () { return __awaiter(void 0, void 0, void 0, function () {
    var _a, _b, _c, _i, x, y, z;
    return __generator(this, function (_d) {
        switch (_d.label) {
            case 0:
                console.log("connected to twitch chat!");
                _a = bttv_fetch_1.emote_urls;
                _b = [];
                for (_c in _a)
                    _b.push(_c);
                _i = 0;
                _d.label = 1;
            case 1:
                if (!(_i < _b.length)) return [3 /*break*/, 4];
                _c = _b[_i];
                if (!(_c in _a)) return [3 /*break*/, 3];
                x = _c;
                console.log("".concat(x, " - ").concat(bttv_fetch_1.emote_urls[x]));
                y = (0, bttv_fetch_1.createEmoteContainer)(x, bttv_fetch_1.emote_urls[x]);
                return [4 /*yield*/, (0, bttv_fetch_1.downloadEmoteCodes)(y.emote_url)];
            case 2:
                z = _d.sent();
                y.saveAsRecord(z);
                console.log(y.emote_record);
                _d.label = 3;
            case 3:
                _i++;
                return [3 /*break*/, 1];
            case 4: return [2 /*return*/];
        }
    });
}); });
client.connect();
client.on('message', function (channel, tags, message, self) { return __awaiter(void 0, void 0, void 0, function () {
    var emotes_record;
    return __generator(this, function (_a) {
        if (self)
            return [2 /*return*/];
        if (message.toLowerCase() === '!hello') {
            client.say(channel, "@".concat(tags.username, ", hello!"));
        }
        else {
            emotes_record = tags["emotes"];
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
        return [2 /*return*/];
    });
}); });
