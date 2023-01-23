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
var fs = require('fs');
var path = require('path');
var ws = require("ws");
require("dotenv").config();
var queue_1 = require("../utility/queue");
// LIST OF EVENTS TO SUBSCRIBE TO
//
var events = [
    'channel.follow', 'channel.update'
];
// EVENT QUEUE
//
var event_queue = new queue_1.Queue();
// ALERT GIFS
//
var alert_gifs = [];
var image_path = path.join(__dirname, 'media/images');
console.log(image_path);
fs.readdir(image_path, function (error, files) {
    error ? console.log(error) : alert_gifs.push.apply(alert_gifs, files);
});
// SERVER COMMUNICATING WITH OVERLAY
//
var event_server = new ws.Server({ port: 3001 });
var event_client;
event_server.on("connection", function (ws) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                console.log("new connection");
                return [4 /*yield*/, ws];
            case 1:
                event_client = _a.sent();
                event_client.on("message", function (response) {
                    var message = JSON.parse(response)['content'];
                    switch (message) {
                        case 'BUSY':
                            console.log('client is busy, wait for READY message');
                            break;
                        case 'READY':
                            console.log('client is ready, processing next event, if available');
                            if (event_queue.size() > 0) {
                                var next_event = event_queue.dequeue();
                                event_client.send(JSON.stringify(next_event));
                            }
                            break;
                        default:
                            console.log("unknown message: ".concat(message));
                            break;
                    }
                });
                return [2 /*return*/];
        }
    });
}); });
// CLIENT LISTENING TO EVENTS
//
var event_handler = new ws.WebSocket("wss://eventsub-beta.wss.twitch.tv/ws");
event_handler.on('message', function message(data) {
    return __awaiter(this, void 0, void 0, function () {
        var parsed_data, metadata, message_type, _a, session_id, _i, events_1, event_type, event_sub_message, subscription_type, new_follower_name, new_event, status_request;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    parsed_data = JSON.parse(data);
                    console.log("---------START------------");
                    console.log(parsed_data);
                    console.log("----------END-------------");
                    if (!messageVerrifed(parsed_data)) return [3 /*break*/, 9];
                    metadata = parsed_data["metadata"];
                    message_type = metadata["message_type"];
                    console.log("A message with type \"".concat(message_type, "\" was received!"));
                    _a = message_type;
                    switch (_a) {
                        case 'session_welcome': return [3 /*break*/, 1];
                        case 'notification': return [3 /*break*/, 7];
                    }
                    return [3 /*break*/, 8];
                case 1:
                    session_id = parsed_data["payload"]["session"]["id"];
                    _i = 0, events_1 = events;
                    _b.label = 2;
                case 2:
                    if (!(_i < events_1.length)) return [3 /*break*/, 5];
                    event_type = events_1[_i];
                    event_sub_message = createEventSubscription(event_type, session_id);
                    return [4 /*yield*/, fetch("https://api.twitch.tv/helix/eventsub/subscriptions", {
                            method: "POST",
                            headers: getAuthHeaders(),
                            body: JSON.stringify(event_sub_message)
                        })
                            .then(function (response) { return response.json(); })
                            .then(function (data) { return console.log(data); })];
                case 3:
                    _b.sent();
                    _b.label = 4;
                case 4:
                    _i++;
                    return [3 /*break*/, 2];
                case 5: 
                // CHECK ALL EVENTS THE BOT IS SUBSCRIBED TO
                return [4 /*yield*/, fetch("https://api.twitch.tv/helix/eventsub/subscriptions", {
                        method: "GET",
                        headers: getAuthHeaders(false)
                    })
                        .then(function (response) { return response.json(); })
                        .then(function (data) { return console.log(data); })];
                case 6:
                    // CHECK ALL EVENTS THE BOT IS SUBSCRIBED TO
                    _b.sent();
                    return [3 /*break*/, 9];
                case 7:
                    {
                        subscription_type = metadata["subscription_type"];
                        console.log("The notification type is ".concat(subscription_type));
                        if (subscription_type === "channel.follow") {
                            new_follower_name = parsed_data["payload"]["event"]["user_name"];
                            console.log("".concat(new_follower_name, " just followed -> do something silly!"));
                            try {
                                //event_client.send(JSON.stringify(['Follow', new_follower_name]));
                                console.log("image path: ".concat(image_path, "\\").concat(getRandomElementFromArray(alert_gifs)));
                                new_event = {
                                    type: 'FOLLOWER',
                                    content: new_follower_name,
                                    image_path: "".concat(image_path, "\\").concat(getRandomElementFromArray(alert_gifs))
                                };
                                event_queue.enqueue(new_event);
                                status_request = {
                                    type: 'GET_STATUS',
                                    content: '',
                                    image_path: ''
                                };
                                event_client.send(JSON.stringify(status_request));
                            }
                            catch (e) {
                                console.log(e);
                            }
                        }
                        return [3 /*break*/, 9];
                    }
                    _b.label = 8;
                case 8:
                    {
                        console.log("unknown message type: ".concat(message_type));
                        return [3 /*break*/, 9];
                    }
                    _b.label = 9;
                case 9: return [2 /*return*/];
            }
        });
    });
});
function createEventSubscription(subscription_type, session_id) {
    return {
        "type": "".concat(subscription_type),
        "version": "1",
        "condition": {
            "broadcaster_user_id": process.env.TWITCH_BROADCASTER_ID
        },
        "transport": {
            "method": "websocket",
            "session_id": "".concat(session_id)
        }
    };
}
function messageVerrifed(data) {
    return "metadata" in data && "message_type" in data["metadata"];
}
function getAuthHeaders(content_type) {
    if (content_type === void 0) { content_type = true; }
    var headers = {
        "Authorization": "Bearer ".concat(process.env.TWITCH_OAUTH_TOKEN_CHANNEL),
        "Client-Id": "".concat(process.env.TWITCH_CLIENT_ID_CHANNEL)
    };
    if (content_type)
        headers["Content-Type"] = "application/json";
    return headers;
}
function getRandomElementFromArray(array) {
    var rnd_index = Math.floor(Math.random() * array.length);
    return array[rnd_index];
}
