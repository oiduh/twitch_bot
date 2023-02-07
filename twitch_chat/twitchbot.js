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
var Server = require("ws").Server;
var tmi = require("tmi.js");
require("dotenv").config();
var Emotes = require("./utility/bttv_fetch");
var ytdl = require('ytdl-core');
//import {Queue} from "../utility/queue";
//
// CLIENT FOR  TWITCH IRC
//
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
client.connect();
//
// SERVER PROCESSING EMOTE WALL
//
var EMOTE_WALL_PORT = 3000;
var emote_wall_server = new Server({ port: EMOTE_WALL_PORT });
var emote_wall;
var emote_record = {};
emote_wall_server.on("connection", function (ws) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                console.log("new emote wall connection");
                return [4 /*yield*/, ws];
            case 1:
                emote_wall = _a.sent();
                emote_wall.on("message", function (data) { return console.log(data); });
                return [2 /*return*/];
        }
    });
}); });
//
// SERVER PROCESSING MEDIA SHARE (YOUTUBE)
//
var MEDIA_SHARE_PORT = 3002;
var media_share_server = new Server({ port: MEDIA_SHARE_PORT });
var media_share;
media_share_server.on("connection", function (ws) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                console.log("new media share connection");
                return [4 /*yield*/, ws];
            case 1:
                media_share = _a.sent();
                media_share.on("message", function (data) { return console.log(data); });
                return [2 /*return*/];
        }
    });
}); });
//
// INITIALIZE CONNECTION
//   GATHER INFORMATION ABOUT EMOTES ENABLED IN CHANNEL
//   TODO: REFRESH COMMAND IF NEW EMOTES ARE ADDED
//
client.on("connected", function () { return __awaiter(void 0, void 0, void 0, function () {
    var emote_containers, _i, emote_containers_1, emote_container;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                console.log("connected to twitch chat!");
                return [4 /*yield*/, Emotes.fetchAllEmotes()];
            case 1:
                emote_containers = _a.sent();
                for (_i = 0, emote_containers_1 = emote_containers; _i < emote_containers_1.length; _i++) {
                    emote_container = emote_containers_1[_i];
                    emote_record[emote_container.constructor.name] = emote_container;
                }
                console.log(emote_record);
                return [2 /*return*/];
        }
    });
}); });
client.on('message', function (channel, tags, message, self) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, command, args, _b, twitch_emotes, _c, emote_source, emote_name, emote_url, link, videoId, event_1, e_1;
    return __generator(this, function (_d) {
        switch (_d.label) {
            case 0:
                if (self)
                    return [2 /*return*/];
                _a = message.split(' '), command = _a[0], args = _a.slice(1);
                console.log(command);
                console.log(args);
                _b = command;
                switch (_b) {
                    case '!hello': return [3 /*break*/, 1];
                    case '!showemote': return [3 /*break*/, 2];
                    case '!yt': return [3 /*break*/, 3];
                    case '!youtube': return [3 /*break*/, 3];
                }
                return [3 /*break*/, 8];
            case 1:
                {
                    client.say(channel, "@".concat(tags.username, ", hello!"));
                    return [3 /*break*/, 9];
                }
                _d.label = 2;
            case 2:
                {
                    if (!emote_wall)
                        return [2 /*return*/];
                    twitch_emotes = tags["emotes"];
                    _c = getFirstEmote(args, twitch_emotes), emote_source = _c[0], emote_name = _c[1];
                    emote_url = getEmoteURL(emote_source, emote_name);
                    console.log("first emote is \"".concat(emote_name, "\" from ").concat(emote_source));
                    console.log(emote_url);
                    // fails if emotewall is not connected
                    try {
                        emote_wall.send(emote_url);
                    }
                    catch (e) {
                        console.log(e);
                    }
                    return [3 /*break*/, 9];
                }
                _d.label = 3;
            case 3:
                if (args.length < 1) {
                    console.log('Youtube link not provided!');
                    return [2 /*return*/];
                }
                link = args[0];
                _d.label = 4;
            case 4:
                _d.trys.push([4, 6, , 7]);
                return [4 /*yield*/, ytdl.getURLVideoID(link)];
            case 5:
                videoId = _d.sent();
                event_1 = {
                    'type': 'video',
                    'id': videoId
                };
                media_share.send(JSON.stringify(event_1));
                return [3 /*break*/, 7];
            case 6:
                e_1 = _d.sent();
                console.log('video does not seem to exist');
                return [3 /*break*/, 7];
            case 7: return [3 /*break*/, 9];
            case 8:
                {
                    console.log('not a command!');
                    return [3 /*break*/, 9];
                }
                _d.label = 9;
            case 9: return [2 /*return*/];
        }
    });
}); });
//////////////////////
//                  //
//  EMOTE COMMANDS  //
//                  //
//////////////////////
function getFirstEmote(args, twitch_emotes) {
    // determine information about first non twitch emote
    var non_twitch_emote = { source: '', position: 500, name: '' };
    var _loop_1 = function (emote_source) {
        var emote_codes = Object.keys(emote_record[emote_source].emote_record);
        var first_emote_name = args.filter(function (x) { return emote_codes.includes(x); })[0];
        var first_emote_pos = args.indexOf(first_emote_name);
        if (first_emote_pos < 0)
            first_emote_pos = 500;
        if (first_emote_pos < non_twitch_emote.position) {
            non_twitch_emote.source = emote_source;
            non_twitch_emote.position = first_emote_pos;
            non_twitch_emote.name = first_emote_name;
        }
    };
    for (var emote_source in emote_record) {
        _loop_1(emote_source);
    }
    // get first twitch emote
    var twitch_emote = { source: 'TWITCH', position: 500, name: '' };
    for (var emote in twitch_emotes) {
        var pos = twitch_emotes[emote][0].split('-')[0];
        if (pos < twitch_emote.position) {
            twitch_emote.name = emote;
            twitch_emote.position = pos;
        }
    }
    if (non_twitch_emote.position === 500 && twitch_emote.position === 500)
        return ['', ''];
    return non_twitch_emote.position < twitch_emote.position
        ? [non_twitch_emote.source, non_twitch_emote.name]
        : [twitch_emote.source, twitch_emote.name];
}
function getEmoteURL(emote_source, emote_name) {
    var emote_url = '';
    switch (emote_source) {
        case 'BTTV_GLOBAL':
        case 'BTTV_USER':
            emote_url = "https://cdn.betterttv.net/emote/".concat(emote_record[emote_source].emote_record[emote_name], "/3x");
            break;
        case 'FFZ':
            emote_url = "https://cdn.frankerfacez.com/emote/".concat(emote_record[emote_source].emote_record[emote_name], "/4");
            break;
        case 'SEVENTV_GLOBAL':
        case 'SEVENTV_USER':
            emote_url = "https://cdn.7tv.app/emote/".concat(emote_record[emote_source].emote_record[emote_name], "/4x");
            break;
        case 'TWITCH':
            emote_url = "https://static-cdn.jtvnw.net/emoticons/v2/".concat(emote_name, "/default/light/3.0");
            break;
    }
    return emote_url;
}
