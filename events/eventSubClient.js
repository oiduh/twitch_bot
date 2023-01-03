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
var ws = require("ws");
require("dotenv").config();
var BROADCASTER_USER_ID = "112465769";
var events = [];
function addEvents(data) {
    events.push(data);
}
var event_handler = new ws.WebSocket("wss://eventsub-beta.wss.twitch.tv/ws");
event_handler.on('open', function open() {
    console.log("connection established");
});
event_handler.on('message', function message(data) {
    return __awaiter(this, void 0, void 0, function () {
        var parsed_data, metadata, message_type, session_id, channel_follows;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    parsed_data = JSON.parse(data);
                    console.log(parsed_data);
                    if (!messageVerrifed(parsed_data)) return [3 /*break*/, 3];
                    metadata = parsed_data["metadata"];
                    message_type = metadata["message_type"];
                    console.log("A message with type \"".concat(message_type, "\" was received!"));
                    if (!(message_type === "session_welcome")) return [3 /*break*/, 2];
                    session_id = parsed_data["payload"]["session"]["id"];
                    channel_follows = {
                        "type": "channel.follow",
                        "version": "1",
                        "condition": {
                            "broadcaster_user_id": BROADCASTER_USER_ID
                        },
                        "transport": {
                            "method": "websocket",
                            "session_id": "".concat(session_id)
                        }
                    };
                    addEvents(channel_follows);
                    /*let res = */ return [4 /*yield*/, fetch("https://api.twitch.tv/helix/eventsub/subscriptions", {
                            method: "POST",
                            headers: getAuthHeaders(),
                            body: JSON.stringify(events[0])
                        })
                            .then(function (response) { return response.json(); })
                            .then(function (data) { return console.log(data); })];
                case 1:
                    /*let res = */ _a.sent();
                    return [3 /*break*/, 3];
                case 2:
                    if (parsed_data["metadata"]["message_type"] === "notification") {
                        console.log("notification received!");
                    }
                    _a.label = 3;
                case 3: return [2 /*return*/];
            }
        });
    });
});
function messageVerrifed(data) {
    return "metadata" in data && "message_type" in data["metadata"];
}
function getAuthHeaders() {
    return {
        "Authorization": "Bearer ".concat(process.env.TWITCH_OAUTH_TOKEN_CHANNEL),
        "Client-Id": "".concat(process.env.TWITCH_CLIENT_ID_CHANNEL),
        "Content-Type": "application/json"
    };
}
