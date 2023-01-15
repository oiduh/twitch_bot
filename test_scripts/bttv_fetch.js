"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
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
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
exports.__esModule = true;
exports.fetAllEmotes = exports.EMOTE_CONTAINER = void 0;
require("dotenv").config();
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// VARIABLES
//
// 1) source of emotes as type -> bttv, frankerz, 7tv, ...
// 2) record of source with its url to fetch from
//
// TODO: add more sources
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
var EMOTE_URLS = {
    'BTTV_GLOBAL': 'https://api.betterttv.net/3/cached/emotes/global',
    'BTTV_USER': "https://api.betterttv.net/3/cached/users/twitch/".concat(process.env.TWITCH_BROADCASTER_ID),
    'FFZ': "https://api.frankerfacez.com/v1/room/id/".concat(process.env.TWITCH_BROADCASTER_ID),
    '7TV_GLOBAL': 'https://api.7tv.app/v2/emotes/global',
    '7TV_USER': "https://api.7tv.app/v2/users/".concat(process.env.TWITCH_BROADCASTER_ID, "/emotes")
};
function fetchEmoteUrl(url) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, fetch(url, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json; charset=utf-8',
                        'User-agent': 'vscode-client'
                    }
                })];
        });
    });
}
function downloadEmoteCodes(url) {
    return __awaiter(this, void 0, void 0, function () {
        var response;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, fetchEmoteUrl(url)];
                case 1:
                    response = _a.sent();
                    return [4 /*yield*/, response.json()];
                case 2: return [2 /*return*/, _a.sent()];
            }
        });
    });
}
var EMOTE_CONTAINER = /** @class */ (function () {
    function EMOTE_CONTAINER(emote_url) {
        this.emote_url = emote_url;
    }
    return EMOTE_CONTAINER;
}());
exports.EMOTE_CONTAINER = EMOTE_CONTAINER;
var BTTV_GLOBAL_CONTAINER = /** @class */ (function (_super) {
    __extends(BTTV_GLOBAL_CONTAINER, _super);
    function BTTV_GLOBAL_CONTAINER(emote_url) {
        return _super.call(this, emote_url) || this;
    }
    BTTV_GLOBAL_CONTAINER.prototype.saveAsRecord = function (data) {
        var record = {};
        for (var _i = 0, data_1 = data; _i < data_1.length; _i++) {
            var entry = data_1[_i];
            record[entry['code']] = entry['id'];
        }
        this.emote_record = record;
        return record;
    };
    return BTTV_GLOBAL_CONTAINER;
}(EMOTE_CONTAINER));
var BTTV_USER_CONTAINER = /** @class */ (function (_super) {
    __extends(BTTV_USER_CONTAINER, _super);
    function BTTV_USER_CONTAINER(emote_url) {
        return _super.call(this, emote_url) || this;
    }
    BTTV_USER_CONTAINER.prototype.saveAsRecord = function (data) {
        var record = {};
        for (var _i = 0, _a = __spreadArray(__spreadArray([], data['channelEmotes'], true), data['sharedEmotes'], true); _i < _a.length; _i++) {
            var entry = _a[_i];
            record[entry['code']] = entry['id'];
        }
        this.emote_record = record;
        return record;
    };
    return BTTV_USER_CONTAINER;
}(EMOTE_CONTAINER));
var FFZ_CONTAINER = /** @class */ (function (_super) {
    __extends(FFZ_CONTAINER, _super);
    function FFZ_CONTAINER(emote_url) {
        return _super.call(this, emote_url) || this;
    }
    FFZ_CONTAINER.prototype.saveAsRecord = function (data) {
        var record = {};
        var room_set = data['room']['set'];
        var emotes = data['sets'][room_set]['emoticons'];
        for (var _i = 0, emotes_1 = emotes; _i < emotes_1.length; _i++) {
            var emote = emotes_1[_i];
            record[emote['name']] = emote['id'];
        }
        this.emote_record = record;
        return record;
    };
    return FFZ_CONTAINER;
}(EMOTE_CONTAINER));
var SEVENTV_GLOBAL_CONTAINER = /** @class */ (function (_super) {
    __extends(SEVENTV_GLOBAL_CONTAINER, _super);
    function SEVENTV_GLOBAL_CONTAINER(emote_url) {
        return _super.call(this, emote_url) || this;
    }
    SEVENTV_GLOBAL_CONTAINER.prototype.saveAsRecord = function (data) {
        var record = {};
        for (var _i = 0, data_2 = data; _i < data_2.length; _i++) {
            var emote = data_2[_i];
            record[emote['name']] = emote['id'];
        }
        this.emote_record = record;
        return record;
    };
    return SEVENTV_GLOBAL_CONTAINER;
}(EMOTE_CONTAINER));
var SEVENTV_USER_CONTAINER = /** @class */ (function (_super) {
    __extends(SEVENTV_USER_CONTAINER, _super);
    function SEVENTV_USER_CONTAINER(emote_url) {
        return _super.call(this, emote_url) || this;
    }
    SEVENTV_USER_CONTAINER.prototype.saveAsRecord = function (data) {
        var record = {};
        for (var _i = 0, data_3 = data; _i < data_3.length; _i++) {
            var emote = data_3[_i];
            record[emote['name']] = emote['id'];
        }
        this.emote_record = record;
        return record;
    };
    return SEVENTV_USER_CONTAINER;
}(EMOTE_CONTAINER));
function createEmoteContainer(emote_source, emote_url) {
    var new_emote_container;
    switch (emote_source) {
        case 'BTTV_GLOBAL':
            new_emote_container = new BTTV_GLOBAL_CONTAINER(emote_url);
            break;
        case 'BTTV_USER':
            new_emote_container = new BTTV_USER_CONTAINER(emote_url);
            break;
        case 'FFZ':
            new_emote_container = new FFZ_CONTAINER(emote_url);
            break;
        case '7TV_GLOBAL':
            new_emote_container = new SEVENTV_GLOBAL_CONTAINER(emote_url);
            break;
        case '7TV_USER':
            new_emote_container = new SEVENTV_USER_CONTAINER(emote_url);
            break;
    }
    return new_emote_container;
}
function fetAllEmotes() {
    return __awaiter(this, void 0, void 0, function () {
        var emote_containers, _a, _b, _c, _i, emote_source, new_emote_container, emotes_json;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0:
                    emote_containers = [];
                    _a = EMOTE_URLS;
                    _b = [];
                    for (_c in _a)
                        _b.push(_c);
                    _i = 0;
                    _d.label = 1;
                case 1:
                    if (!(_i < _b.length)) return [3 /*break*/, 4];
                    _c = _b[_i];
                    if (!(_c in _a)) return [3 /*break*/, 3];
                    emote_source = _c;
                    new_emote_container = createEmoteContainer(emote_source, EMOTE_URLS[emote_source]);
                    return [4 /*yield*/, downloadEmoteCodes(new_emote_container.emote_url)];
                case 2:
                    emotes_json = _d.sent();
                    new_emote_container.saveAsRecord(emotes_json);
                    emote_containers.push(new_emote_container);
                    _d.label = 3;
                case 3:
                    _i++;
                    return [3 /*break*/, 1];
                case 4: return [2 /*return*/, emote_containers];
            }
        });
    });
}
exports.fetAllEmotes = fetAllEmotes;
//let u = 'https://api.betterttv.net/3/cached/emotes/global';
//console.log(request_emotes(u));
// bttv emote url: https://cdn.betterttv.net/emote/{id}/3x
// oiduh bttv user id: 598f2a195aba4636b7359f44
