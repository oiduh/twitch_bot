"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
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
var Emotes = require("../test_scripts/bttv_fetch");
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
var emote_wall;
// TODO: redefine record if emotes from other sources are added -> distinguish source, currently not the case
var emote_record = {};
server.on("connection", function (ws) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                console.log("new connection");
                return [4 /*yield*/, ws];
            case 1:
                emote_wall = _a.sent();
                emote_wall.on("message", function (data) { return console.log(data); });
                return [2 /*return*/];
        }
    });
}); });
// initialize all important features
// 1) load bttv emotes
// ...
client.on("connected", function () { return __awaiter(void 0, void 0, void 0, function () {
    var emote_containers, _i, emote_containers_1, emote_container;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                console.log("connected to twitch chat!");
                return [4 /*yield*/, Emotes.fetAllEmotes()];
            case 1:
                emote_containers = _a.sent();
                for (_i = 0, emote_containers_1 = emote_containers; _i < emote_containers_1.length; _i++) {
                    emote_container = emote_containers_1[_i];
                    //console.log(emote_container.constructor.name);
                    //console.log(Object.keys(emote_container.emote_record));
                    emote_record = __assign(__assign({}, emote_record), emote_container.emote_record);
                }
                console.log(emote_record);
                return [2 /*return*/];
        }
    });
}); });
client.connect();
client.on('message', function (channel, tags, message, self) { return __awaiter(void 0, void 0, void 0, function () {
    var twitch_emotes, first_emote, emote_url;
    return __generator(this, function (_a) {
        if (self)
            return [2 /*return*/];
        if (message.toLowerCase() === '!hello') {
            client.say(channel, "@".concat(tags.username, ", hello!"));
        }
        else {
            twitch_emotes = tags["emotes"];
            first_emote = getFirstEmote(message, twitch_emotes);
            console.log("first emote is \"".concat(first_emote[1], "\" from ").concat(first_emote[0]));
            emote_url = '';
            switch (first_emote[0]) {
                case 'BTTV':
                    emote_url = "https://cdn.betterttv.net/emote/".concat(emote_record[first_emote[1]], "/3x");
                    break;
                case 'TWITCH':
                    emote_url = "https://static-cdn.jtvnw.net/emoticons/v2/".concat(first_emote[1], "/default/light/3.0");
                    break;
            }
            emote_wall.send(emote_url);
        }
        return [2 /*return*/];
    });
}); });
function getFirstEmote(message, twitch_emotes) {
    var message_split = message.split(' ');
    var bttv_emote_codes = Object.keys(emote_record);
    var first_bttv_emote = message_split.filter(function (x) { return bttv_emote_codes.includes(x); })[0];
    var bttv_emote_pos = message.indexOf(first_bttv_emote);
    if (bttv_emote_pos < 0)
        bttv_emote_pos = 500;
    var first_twitch_emote = '';
    var twitch_emote_pos = 500; // max char limit twitch message
    for (var emote in twitch_emotes) {
        var pos = twitch_emotes[emote][0].split('-')[0];
        if (pos < twitch_emote_pos) {
            first_twitch_emote = emote;
            twitch_emote_pos = pos;
        }
    }
    return bttv_emote_pos < twitch_emote_pos ? ['BTTV', first_bttv_emote] : ['TWITCH', first_twitch_emote];
}
