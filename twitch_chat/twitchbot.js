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
var Emotes = require("../test_scripts/bttv_fetch");
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
client.connect();
client.on('message', function (channel, tags, message, self) { return __awaiter(void 0, void 0, void 0, function () {
    var command, twitch_emotes, _a, emote_source, emote_name, emote_url;
    return __generator(this, function (_b) {
        if (self)
            return [2 /*return*/];
        command = message.split(' ', 1)[0].toLowerCase();
        if (command === '!hello') {
            client.say(channel, "@".concat(tags.username, ", hello!"));
        }
        else if (command === '!showemote') {
            twitch_emotes = tags["emotes"];
            _a = getFirstEmote(message, twitch_emotes), emote_source = _a[0], emote_name = _a[1];
            emote_url = '';
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
                default:
                    return [2 /*return*/];
            }
            console.log("first emote is \"".concat(emote_name, "\" from ").concat(emote_source));
            console.log(emote_url);
            // fails if emotewall is not connected
            try {
                emote_wall.send(emote_url);
            }
            catch (e) {
                console.log(e);
            }
        }
        return [2 /*return*/];
    });
}); });
function getFirstEmote(message, twitch_emotes) {
    var message_split = message.split(' ');
    // determine information about first non twitch emote
    var non_twitch_emote = { source: '', position: 500, name: '' };
    var _loop_1 = function (emote_source) {
        var emote_codes = Object.keys(emote_record[emote_source].emote_record);
        var first_emote_name = message_split.filter(function (x) { return emote_codes.includes(x); })[0];
        var first_emote_pos = message.indexOf(first_emote_name);
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
